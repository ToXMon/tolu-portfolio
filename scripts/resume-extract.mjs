#!/usr/bin/env node
/*
 * resume-extract.mjs — Extract structured JSON from Tolu_Shekoni_Resume.docx
 *
 * Pure Node (no deps). Parses the .docx zip by hand using node:fs + node:zlib,
 * inflates word/document.xml, walks paragraphs/runs with regex, classifies
 * each paragraph into a structured shape that the Résumé window can render
 * with native typography.
 *
 * Usage:  node scripts/resume-extract.mjs
 * Input:  assets/docs/Tolu_Shekoni_Resume.docx
 * Output: assets/docs/resume.json (overwritten)
 *
 * Idempotent. Re-run after editing the .docx in Word.
 *
 * Source format: the .docx from this repo has paragraphs that match one of
 *   - Top header line  : <w:p><w:b/><w:t>NAME</w:t></w:p>           (sz=50)
 *   - Contact line     : <w:p>...<w:t>... · ... · ...</w:t></w:p>   (sz=25)
 *   - Role line        : <w:p><w:b/><w:t>ROLE</w:t></w:p>           (sz=29)
 *   - Summary          : <w:p><w:t>...</w:t></w:p>                 (sz=28)
 *   - Section heading  : <w:p><w:b/><w:t>SECTION</w:t></w:p>       (sz=29)
 *   - Skill row        : <w:p><w:b/><w:t>Label:</w:t><w:t> value</w:t></w:p>
 *   - Job header       : <w:p><w:b/><w:t>Title</w:t><w:t> · meta</w:t></w:p>
 *   - Bullet           : <w:p>...<w:t>•</w:t>...<w:t>body</w:t></w:p>
 *   - Section break    : an empty <w:p> between entries
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync, inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DOCX = resolve(ROOT, 'assets/docs/Tolu_Shekoni_Resume.docx');
const OUT = resolve(ROOT, 'assets/docs/resume.json');

// ---------- zip reader (no deps) -----------------------------------------
function readZip(bytes) {
  // Walk End-of-Central-Directory record (can appear in last 64K + 22 bytes)
  const eocdSig = 0x06054b50;
  let eocdOffset = -1;
  const searchStart = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= searchStart; i--) {
    if (bytes.readUInt32LE(i) === eocdSig) { eocdOffset = i; break; }
  }
  if (eocdOffset < 0) throw new Error('zip: EOCD not found');
  const totalEntries = bytes.readUInt16LE(eocdOffset + 10);
  const cdSize = bytes.readUInt32LE(eocdOffset + 12);
  const cdOffset = bytes.readUInt32LE(eocdOffset + 16);
  const entries = [];
  let p = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (bytes.readUInt32LE(p) !== 0x02014b50) throw new Error('zip: bad CD entry sig');
    const compMethod = bytes.readUInt16LE(p + 10);
    const compSize = bytes.readUInt32LE(p + 20);
    const uncompSize = bytes.readUInt32LE(p + 24);
    const nameLen = bytes.readUInt16LE(p + 28);
    const extraLen = bytes.readUInt16LE(p + 30);
    const commentLen = bytes.readUInt16LE(p + 32);
    const localHeaderOffset = bytes.readUInt32LE(p + 42);
    const name = bytes.slice(p + 46, p + 46 + nameLen).toString('utf8');
    entries.push({ name, compMethod, compSize, uncompSize, localHeaderOffset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  if (cdSize !== p - cdOffset) { /* tolerate drift on some writers */ }

  const out = new Map();
  for (const e of entries) {
    // Local header
    const lh = e.localHeaderOffset;
    if (bytes.readUInt32LE(lh) !== 0x04034b50) throw new Error(`zip: bad LH sig for ${e.name}`);
    const lhNameLen = bytes.readUInt16LE(lh + 26);
    const lhExtraLen = bytes.readUInt16LE(lh + 28);
    const dataStart = lh + 30 + lhNameLen + lhExtraLen;
    const data = bytes.slice(dataStart, dataStart + e.compSize);
    if (e.compMethod === 0) {
      out.set(e.name, Buffer.from(data));
    } else if (e.compMethod === 8) {
      // Try raw inflate first (matches Word's stored deflate), fall back to zlib.
      let inflated;
      try { inflated = inflateRawSync(data, { maxOutputLength: e.uncompSize || 1 << 20 }); }
      catch { inflated = inflateSync(data, { maxOutputLength: e.uncompSize || 1 << 20 }); }
      out.set(e.name, inflated);
    } else {
      throw new Error(`zip: unsupported compression ${e.compMethod}`);
    }
  }
  return out;
}

// ---------- document.xml parser -----------------------------------------
function extractParagraphs(xml) {
  // Split on </w:p> so each chunk is one paragraph.
  const chunks = xml.split(/<\/w:p>/);
  const paragraphs = [];
  for (const raw of chunks) {
    if (!raw) continue;
    // text runs
    const runs = [];
    const runRe = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
    let m;
    while ((m = runRe.exec(raw))) {
      const run = m[1];
      const bold = /<w:b\/>|<w:b\s/.test(run);
      const sz = (run.match(/<w:sz w:val="(\d+)"/) || [])[1];
      const szCs = (run.match(/<w:sz-cs w:val="(\d+)"/) || [])[1];
      const text = (run.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/) || ['', ''])[1];
      const decoded = decodeEntities(text);
      if (decoded) runs.push({ bold: !!bold, sz: sz ? parseInt(sz, 10) : null, szCs: szCs ? parseInt(szCs, 10) : null, text: decoded });
    }
    if (runs.length === 0) continue;
    paragraphs.push({ runs });
  }
  return paragraphs;
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'");
}

function isAllCapsBold(p) {
  if (!p.runs.length) return false;
  const text = p.runs.map(r => r.text).join('').trim();
  if (!text) return false;
  // Allow A-Z, 0-9, common URL/path chars (/ : ? = .), spacing, punctuation,
  // middle-dot (·), and dashes (hyphen-minus + em-dash).
  return p.runs.every(r => r.bold) && /^[A-Z0-9 .·\-—&,/]+$/.test(text) && text.length < 80 && /[A-Z]/.test(text);
}

function paraText(p) { return p.runs.map(r => r.text).join('').replace(/\s+/g, ' ').trim(); }
function hasBulletDot(p) { return p.runs.some(r => /^•\s*$/.test(r.text)); }

// ---------- classification ------------------------------------------------
function classify(paragraphs) {
  const result = {
    name: '',
    contact: [],
    role: '',
    summary: '',
    sections: []
  };

  let i = 0;

  // name (first bold paragraph)
  if (paragraphs[i] && isAllCapsBold(paragraphs[i]) && paragraphs[i].runs[0].sz >= 40) {
    result.name = paraText(paragraphs[i]); i++;
  }

  // contact line (single small paragraph with · separators)
  if (paragraphs[i] && paragraphs[i].runs[0].sz && paragraphs[i].runs[0].sz <= 26) {
    const t = paraText(paragraphs[i]);
    if (t.includes('·') && (t.includes('@') || /github\.com|x\.com|twitter\.com/.test(t))) {
      result.contact = t.split('·').map(s => s.trim()).filter(Boolean);
      i++;
    }
  }

  // role (next all-caps bold, sz 28-30)
  while (i < paragraphs.length) {
    const p = paragraphs[i];
    if (isAllCapsBold(p) && p.runs[0].sz && p.runs[0].sz >= 27 && p.runs[0].sz <= 32) {
      result.role = paraText(p); i++; break;
    }
    i++;
  }

  // summary (next plain paragraph before any all-caps heading)
  while (i < paragraphs.length) {
    const p = paragraphs[i];
    if (isAllCapsBold(p)) break;
    const t = paraText(p);
    if (t.length > 30) { result.summary = t; i++; break; }
    i++;
  }

  // walk sections until EOF
  while (i < paragraphs.length) {
    const p = paragraphs[i];
    if (!isAllCapsBold(p)) { i++; continue; }
    const heading = paraText(p); i++;

    // skill section heuristic: bold "Label:" followed by plain text on same paragraph
    if (paragraphs[i] && /skills|technical/i.test(heading)) {
      const rows = [];
      while (i < paragraphs.length && !isAllCapsBold(paragraphs[i])) {
        const pp = paragraphs[i];
        const runs = pp.runs;
        // bold run followed by plain run = label + value
        const labelRun = runs.find(r => r.bold && /^[A-Za-z &/]+:?$/.test(r.text.trim()));
        if (labelRun) {
          const label = labelRun.text.replace(/:?\s*$/, '').trim();
          const value = runs.filter(r => r !== labelRun).map(r => r.text).join('').trim();
          if (label && value) rows.push({ label, items: splitList(value) });
        }
        i++;
      }
      result.sections.push({ title: heading, type: 'skills', rows });
      continue;
    }

    // experience / similar: jobs with bullet lists
    if (/experience|employment|work/i.test(heading)) {
      const entries = [];
      while (i < paragraphs.length && !isAllCapsBold(paragraphs[i])) {
        const pp = paragraphs[i];
        // job header: bold title followed by plain meta (often " · Location · Dates")
        const boldRun = pp.runs.find(r => r.bold && r.text.trim().length > 4);
        if (boldRun && !hasBulletDot(pp) && !isAllCapsBold(pp)) {
          const title = boldRun.text.trim();
          const meta = pp.runs.filter(r => r !== boldRun).map(r => r.text).join('').replace(/\s+/g, ' ').trim();
          // Heuristic: a real job header's meta contains a 4-digit year (2024, 2025, ...).
          // Project entries have a description meta ("— Anchor programs, ...") — skip them.
          const looksLikeJob = /\b(19|20)\d{2}\b/.test(meta) || /\bPresent\b/i.test(meta);
          if (!looksLikeJob) { i++; continue; }
          i++;
          const bullets = [];
          while (i < paragraphs.length) {
            // Outer-level stop: next all-caps heading
            if (isAllCapsBold(paragraphs[i])) break;
            const bp = paragraphs[i];
            // Inner-level stop: next job header (bold mixed-case run, not all-caps, no bullet)
            const nextBold = bp.runs.find(r => r.bold && r.text.trim().length > 4);
            if (nextBold && !hasBulletDot(bp) && !isAllCapsBold(bp)) {
              const nextMeta = bp.runs.filter(r => r !== nextBold).map(r => r.text).join('').replace(/\s+/g, ' ').trim();
              if (/\b(19|20)\d{2}\b/.test(nextMeta) || /\bPresent\b/i.test(nextMeta)) break;
            }
            const bText = paraText(bp);
            if (hasBulletDot(bp) || bText.length > 20) {
              bullets.push(hasBulletDot(bp) ? bText.replace(/^•\s*/, '').trim() : bText);
            }
            i++;
          }
          entries.push({ title, meta, bullets: bullets.filter(Boolean) });
        } else {
          i++;
        }
      }
      result.sections.push({ title: heading, type: 'experience', entries });
      continue;
    }

    // generic section (education, certifications, projects, etc.)
    const items = [];
    while (i < paragraphs.length && !isAllCapsBold(paragraphs[i])) {
      const t = paraText(paragraphs[i]);
      if (t) items.push(t);
      i++;
    }
    // Detect "SELECTED PROJECTS — GITHUB.COM/TOXMON" and split into name/desc pairs
    let sectionTitle = heading, sectionType = 'list';
    if (/SELECTED PROJECTS/i.test(heading)) {
      sectionTitle = 'SELECTED PROJECTS';
      sectionType = 'projects';
      const projects = [];
      for (const item of items) {
        const m = item.match(/^([^—]+?)\s+—\s+(.+)$/);
        if (m) projects.push({ name: m[1].trim(), description: m[2].trim() });
        else projects.push({ name: item, description: '' });
      }
      result.sections.push({ title: sectionTitle, type: sectionType, items: projects });
      continue;
    }
    result.sections.push({ title: sectionTitle, type: sectionType, items });
  }

  return result;
}

function splitList(s) {
  // Split a comma-separated list, preserving parenthetical groups
  const out = [];
  let depth = 0, buf = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { out.push(buf.trim()); buf = ''; }
    else buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

// ---------- main ---------------------------------------------------------
function main() {
  const bytes = readFileSync(DOCX);
  const files = readZip(bytes);
  const docXml = files.get('word/document.xml');
  if (!docXml) throw new Error('docx: word/document.xml not found');
  const xml = docXml.toString('utf8');
  const paragraphs = extractParagraphs(xml);
  const structured = classify(paragraphs);
  structured.generatedAt = new Date().toISOString().slice(0, 10);
  structured.paragraphCount = paragraphs.length;

  writeFileSync(OUT, JSON.stringify(structured, null, 2));
  const stat = readFileSync(OUT);
  console.log(`resume-extract: wrote ${OUT} (${stat.length} bytes, ${paragraphs.length} paragraphs)`);
  console.log(`  name:    ${structured.name}`);
  console.log(`  role:    ${structured.role}`);
  console.log(`  sections: ${structured.sections.map(s => s.title).join(' · ')}`);
}

main();