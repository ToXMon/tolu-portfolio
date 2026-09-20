# Demo video — script + shot list

> Built with the patterns from `replynodes/awesome-social-media-skills`:
> `short-form-video-hook-generator.md` + `video-script-writer.md`.
> Format: short-form, 60–75 s, 16:9 (desktop-first site). Voiceover + on-screen text over screen recording (OpenScreen). No talking head required.

---

## Hook candidates (pick one before recording)

Generated via the *Short-Form Video Hook Generator* skill, against:
**topic** = "a portfolio site that's a working desktop OS, built in vanilla JS"
**key point** = "full apps (8 projects, résumé, music player) live in draggable, resizable windows in the browser — no framework, 190 KB."

| # | Hook | Pattern | Visual-dependent |
|---|---|---|---|
| 1 | "I rebuilt my portfolio as a working desktop OS. 190 KB. Vanilla JavaScript." | specific claim + number | no |
| 2 | "What if your portfolio was an operating system instead of a scroll page?" | direct question | no |
| 3 | "Everyone builds portfolios as websites. I built mine as a desktop." | contradiction | no |
| 4 | "If your portfolio is just a long scroll page, you're wasting 190 KB of code." | stakes | no |
| 5 | "Your portfolio has a hero section. Mine has an OS." | contradiction | yes (cut to desktop) |
| 6 | "Open the link. Click any icon. You'll see why a portfolio shouldn't scroll." | stakes | yes (cut to desktop) |
| 7 | "I just shipped 11 draggable windows, an inline résumé, and a working music player — all in vanilla JS." | in-progress moment | no |
| 8 | "190 KB of JavaScript. No framework. No build step. Drag any window." | specific claim | yes (cut to drag) |

**Recommended for first take:** **#5** ("Your portfolio has a hero section. Mine has an OS.") — instant contrast, sets up the rest of the video.

---

## Script (~65 s)

### **[HOOK — 0:00–0:03]**

> "Your portfolio has a hero section. Mine has an OS."
>
> `[on-screen text: "toluOS — built in 190 KB of vanilla JS"]`
> `[visual: hard cut from a generic portfolio scroll to the live toluOS desktop — Welcome window mid-open animation]`

### **[SETUP — 0:03–0:12]**

> "Most portfolios are long scroll pages. This one boots into a desktop.
> Draggable, resizable windows. A menubar that follows the app you're
> focused on. A glass taskbar with running indicators. Keyboard shortcuts
> everywhere."
>
> `[on-screen text: "drag · resize · snap · ⌘1..9 · F4 Launchpad"]`
> `[visual: drag the Welcome window to the left; click the Projects icon;
> snap the window to the left half of the screen]`

### **[DEMO 1 — Projects folder — 0:12–0:22]**

> "Cmd+P opens the Projects folder. Inside: 8 portfolio builds with
> LIVE and REPO badges. Click one — that's Stripe Clone, my AdaL bootcamp
> submission."
>
> `[on-screen text: "8 builds · Stripe · Vouch · SignalForge · ..."]`
> `[visual: Cmd+P; click a project card; window opens with the live
> browser capture as the thumb]`

### **[DEMO 2 — Résumé — 0:22–0:32]**

> "This window — the Résumé — is rendered from a Word document. A
> vanilla Node script parses the .docx at build time, no headless browser,
> and the window renders it with native typography. Fraunces headlines,
> mono labels, gold accent borders."
>
> `[on-screen text: "Fraunces · DM Mono · Source Sans 3"]`
> `[visual: close other windows; open Résumé; scroll through it slowly to
> show the section styling]`

### **[DEMO 3 — Music player — 0:32–0:48]**

> "The Music player. Audius, free public REST — no API key. Trending,
> search, genre chips, prev, next. And that gold pulse under the progress
> bar — that's an AudioContext analyser reading the bass band in real time."
>
> `[on-screen text: "Audius REST · AudioContext · 0 SDK scripts"]`
> `[visual: open Music; click a track row; the gold progress pulse visible;
> scroll the artwork]`

### **[PAYOFF — 0:48–0:58]**

> "Eleven modules. 190 kilobytes of vanilla JavaScript. No build step.
> No framework. No CDN script tags. Just the browser, doing what the
> browser can do."
>
> `[on-screen text: "0 deps · 0 build · 0 frameworks"]`
> `[visual: press F4 — Launchpad overlay appears showing all apps + projects;
> press Escape to dismiss]`

### **[CLOSE — 0:58–1:05]**

> "If you're a recruiter, yes — the Résumé window has a Download link
> in the footer. Built with @AdaL. Link in bio."
>
> `[on-screen text: "link in bio · github.com/ToXMon/tolu-portfolio"]`
> `[visual: re-show the desktop; mouse drifts over the Music tile as the
> shot fades]`

---

## Shot list

OpenScreen records the live site at 1440 × 900 (16:9). All scenes are
single continuous takes unless noted — no fancy edits, just cuts.

| # | Time | Scene | Action | Audio |
|---|---|---|---|---|
| 1 | 0:00–0:03 | Cold open | Pre-record a generic portfolio scroll site (yourself or any popular one). Cut on frame 24 to the live toluOS URL just as the Welcome window opens. | VO: hook line |
| 2 | 0:03–0:08 | Desktop reveal | Mouse drifts over the 4 desktop icons. Hover the clock scene-widget to show it updates. | VO: "Most portfolios are long scroll pages…" |
| 3 | 0:08–0:12 | Window drag | Click and drag the Welcome window from its center, then **slow-drag** it to the left edge until the snap-to-half preview flashes. Release. | VO continues |
| 4 | 0:12–0:15 | Projects folder | Press **Cmd+P**. Window opens. Wait for the 8-card grid to be visible (it's already instant). | VO: "Cmd+P opens the Projects folder…" |
| 5 | 0:15–0:18 | Card → window | Click the **Stripe Clone** card. The Stripe window opens — real browser capture loads as the thumb. | VO: "…that's Stripe Clone, my AdaL bootcamp submission." |
| 6 | 0:18–0:22 | Scroll Stripe proof | Scroll inside the Stripe window to show the proof bullets + the bootcamp X-post link. Then close it (red X). | VO: silence |
| 7 | 0:22–0:25 | Open Résumé | Press **Cmd+R** then re-open Résumé from the desktop icon (or just click Résumé in the Projects folder). Window opens with the .docx→JSON pipeline visible. | VO: "This window — the Résumé — is rendered from a Word document." |
| 8 | 0:25–0:32 | Scroll résumé | Slowly scroll down the Résumé window through TECHNICAL SKILLS → EXPERIENCE → SELECTED PROJECTS. Pause on the gold left-border accent stripes. | VO continues |
| 9 | 0:32–0:35 | Open Music | Press **Cmd+M** (or click the Music desktop icon). | VO: "The Music player." |
| 10 | 0:35–0:38 | Click a track | Wait ~2 s for trending to load, then click the **first track row** (the highlighted playing row). The transport switches to ⏸; the now-playing widget top-right appears. | VO: "Audius, free public REST…" |
| 11 | 0:38–0:48 | Show the beat pulse | Hold the camera on the now-playing strip for several seconds so the gold glow under the progress bar is visibly breathing with the beat. Mouse hovers over the volume slider briefly. | VO continues |
| 12 | 0:48–0:52 | F4 Launchpad | Press **F4**. The fullscreen overlay appears. Move the mouse to one of the icons to show the hover scale. | VO: "Eleven modules. 190 kilobytes…" |
| 13 | 0:52–0:58 | Press Escape; outro | Press Escape to dismiss Launchpad. Camera drifts over the empty desktop (now with a tiny play indicator on the dock for the Music window). | VO continues |
| 14 | 0:58–1:05 | End card | Hard cut to a 3-second text card over the wallpaper: `link in bio · github.com/ToXMon/tolu-portfolio · @AdaL`. | VO closes |

**Total runtime:** ~65 s. Add 1–2 s of dead-air at the start (logo / title card) and 0.5 s after the end card for the typical "wait for the click" before upload.

---

## Production notes

- **Resolution:** record at 1440 × 900 (16:9). For vertical repurposing (Reels, Shorts, TikTok) crop the center 9:16 column in post.
- **Cursor:** keep the cursor visible at all times — every action in the script is a click or keystroke, and the cursor trails make the OS metaphor read instantly.
- **Keystroke labels:** for every shortcut, OpenScreen should render the keystroke on screen for 600 ms (set up via the recorder's "show keystrokes" toggle, or overlay in post). This is critical — `Cmd+P`, `Cmd+M`, `F4` only land if viewers see them being pressed.
- **Audio levels:** voiceover ~ −12 dB; music from Audius captured through the browser (mic-off, just the system audio) at ~ −18 dB; the ambient drone can be turned on briefly between scenes via the existing sound-btn to add atmosphere without overpowering VO.
- **Music rights:** Audius tracks are stream-licensed but may not be safe to redistribute in a derivative video. For the demo, pick the **first trending track** at recording time and either let it play quietly in the background (showing the player works), or replace with the existing `assets/audio/ambient-loop.mp3` ambient drone for the whole video. **Do not let the chosen Audius track drive the audio bed.**
- **Reduced motion:** the recorder's machine may default to `prefers-reduced-motion: reduce`, which collapses all animations to 0.01 ms and disables the constellation. **Force `prefers-reduced-motion: no-preference`** in the recorder settings so the desktop actually feels alive.
- **Aspect ratios for repurposing:** the same script works for both 16:9 (X, LinkedIn, YouTube) and 9:16 (Reels, Shorts, TikTok). For vertical, re-frame on the cursor + window center; the desktop is wide so the dock + 1 window fit comfortably.

---

## Captions + on-screen text (for burned-in subs)

Auto-generate from the script VO, but **manually verify the timing**: the
hook lands in under 3 s, the "Cmd+P" callout must appear exactly when
the keystroke does, and the "Download .docx ↗" beat needs to be on screen
for the full 1.5 s of the Résumé window closing shot.

Recommended SRT (English) is auto-generated; review for these specific
moments:

- `0:00–0:03` → "Your portfolio has a hero section. Mine has an OS."
- `0:08` → "drag · resize · snap · ⌘1..9"
- `0:13` → "⌘P — Projects folder"
- `0:25` → "Fraunces · DM Mono · Source Sans 3"
- `0:35` → "Audius REST · AudioContext"
- `0:48` → "11 modules · 190 KB · 0 frameworks"
- `0:58` → "link in bio · github.com/ToXMon/tolu-portfolio"

---

## Files referenced

- `assets/img/projects/*.png` — used in the Projects folder grid during shot 4–6
- `assets/docs/resume.json` — rendered in shot 7–8 (built from `Tolu_Shekoni_Resume.docx` via `node scripts/resume-extract.mjs`)
- `assets/audio/ambient-loop.mp3` — optional bed (toggle via the sound-btn)
- `scripts/check.sh` — validation that the site being recorded is in a shippable state

---

## Companion social post

Pair the video with the X thread already drafted in `SUBMISSION-PACKAGE.md`
("What if your portfolio opened as a desktop OS instead of a scroll page?
…"). Thread post 1 is the same hook as shot 1; post 4 mentions the
music player that the video demos. The thread and video should ship
in the same 24-hour window so the link in bio and the demo reinforce
each other in the algorithm.