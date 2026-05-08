# Handoff

Status as of 2026-05-08.

## Completed

- Created a React + Vite + TypeScript local front-end prototype.
- Installed project dependencies and React type declarations.
- Implemented desktop app shell with left sidebar, top utility bar, team controls, and status strip.
- Replaced the two experimental home variants with one default polished desktop homepage.
- Reworked the hero into a TikTok-inspired short-video growth stage with vertical content, sound-wave, interaction signals, and growth tags.
- Revised the hero again after user feedback: moved away from the heavy deep-blue look into a lighter product-stage color system with restrained cyan, rose, green, and blue-violet signal accents.
- Earlier iteration simplified the first viewport to hero, workflow entry cards, and a compact status strip. The later closed-loop rail was removed after user feedback.
- Removed the forced `100vh` squeeze from the main content so the lower modules can breathe instead of being cramped into the first viewport.
- Replaced the disliked black-square lettermark direction with a node-and-rail brand mark.
- Standardized icons on `lucide-react`.
- Reworked the homepage hero into a poster-style TikTok creator commerce composition with a black base, cyan/pink neon, shopping cues, and no square card collage in the hero artwork.
- Fixed the poster hero display so the selected artwork is shown without cropping the subject's head, then unified the rest of the homepage UI around the same black, cyan, and hot-pink color system.
- Reduced visual fatigue by finalizing a black left navigation rail with a light right-side workbench, dialing back cyan-heavy accents across cards, and removing the horizontal "今日闭环正在推进" workflow rail from the homepage.
- Reworked the homepage again against `26.6/5.7-v2`: the three first-screen modules now map to `爆款分析`, `TOP 组合 / 因子库`, and `SKU 生产 / 回流裂变`, including分段锁定, TOP1/2/3, 回流, 母脚本, and裂变 signals.
- Removed the odd pink UI text treatment from cards, pills, and secondary actions. Pink is now limited to the poster, tiny active indicators, gradient endpoints, and attention states; normal workbench text uses neutral ink with restrained cyan.
- Experimented with a one-screen homepage fit using adaptive rows and compact card content, while avoiding whole-page transform scaling.
- Verified `npm run build` successfully on 2026-05-08 after the homepage redesign.
- Installed additional local skills from `KKKKhazix/khazix-skills`: `neat-freak`, `khazix-writer`, `aihot`, and `hv-analysis`.
- 2026-05-08 follow-up in `C:\Users\Administrator\Desktop\MAC\TKDUOLE`: corrected the desktop homepage per "Latest UI Corrections Required" by restoring three independent workflow boards, enlarging the hero budget, reducing module content to summary signals, and shifting the right workbench surface toward clean Apple-white.
- Verified the follow-up with `npm.cmd run build` and a real Chrome 1440x900 screenshot at `desktop-1440x900-check.png`.

## User Decisions Captured

- Database direction: local database primary, Feishu sync secondary.
- First version has no login.
- Mac is used for development, later Windows LAN deployment is expected.
- Mobile polish is not part of the active review scope.
- The user wants `ui-ux-pro-max` and `impeccable` applied to real UI quality, not just mentioned.
- The user dislikes generic dashboards, ugly icons, low-quality hero design, messy text, and screenshots that hide layout problems by cropping.
- The hero does not need to literally show video analysis, SKU signals, trend charts, or task flow. It may use stronger TikTok-related creative elements if that produces a better first impression.
- The hero direction now settled on a poster-like TikTok creator commerce treatment, not a component collage.
- User approved the black, cyan, and hot-pink TikTok-style color system for the whole UI. Do not reintroduce the old light/blue dashboard palette or a deep-blue AI control-room look.
- Keep cyan as a controlled accent rather than the dominant color across every card. Pink and dark neutral surfaces should balance it.
- The user disliked pink text specifically. Do not use hot pink as default text for buttons, pills, card titles, or normal labels.
- User explicitly disliked the cramped bottom layout. Do not force all content into one 720px viewport.
- The user now requires the homepage to fit one normal desktop screen without vertical scrolling. Do not meet this by cropping content, hiding overflow, or allowing the status strip to cover modules.
- The hero / hook stage must remain large enough to feel like the main poster moment.
- The three homepage modules should be separate independent boards, not one unified merged panel.
- Homepage module content can be reduced aggressively. Do not stuff detail-page lists into the home screen.
- The right-side workbench should feel Apple-white / clean white, not gray.
- The earlier separate-card module composition was closer to the desired direction than the unified-panel experiment.
- The reference screenshot is a useful quality baseline, not a layout that must be copied.
- SKU 档案, 因子库, AI 内容生产, 爆款裂变, and 视频结果回流 are strongly connected and should not feel like unrelated modules.

## Active Design Direction

The default homepage is now a single product-led workbench direction using a black left navigation rail, light workbench, and TikTok cyan/pink accent palette.

- Local URL: `http://localhost:57260/` during this handoff session.
- Active Windows project directory: `C:\Users\Administrator\Desktop\MAC\TKDUOLE`.
- The old `?variant=launch` switch was removed from the UI and should not be treated as an active direction.
- Latest screenshot reference: `/private/tmp/duole-v2-home-1440x900.png`. This screenshot is not final-approved; it records the problem state after the unified-panel experiment.
- Current home screen is still static prototype UI. It reflects the v2 workflow but does not implement upload, FFmpeg, AI calls, local DB, Feishu sync, or feedback calculations yet.

Next UI work should correct the homepage visual direction before expanding business pages.

## Latest UI Corrections Required

Before more product pages are built, fix the desktop homepage against the 2026-05-08 feedback:

1. Restore three independent module boards instead of the unified module panel.
2. Keep the full homepage in one desktop screen with no vertical scrolling.
3. Do not crop content or use hidden overflow to fake the one-screen layout.
4. Increase the hero / hook stage from the over-compressed version.
5. Reduce module content to summary-level signals only.
6. Shift the right workbench from gray to Apple-white.

## Not Implemented

- Separate module routes.
- Upload flow.
- FFmpeg segmentation.
- Manual segment editing UI.
- AI prompt execution.
- Local database.
- Feishu mapping and sync queue.
- SKU CRUD.
- Factor library CRUD and scoring logic.
- Production task persistence.
- Result feedback calculations.

## Recommended Next Steps

1. Correct the homepage visual direction using the latest UI constraints above.
2. Add real routes for sidebar modules.
3. Build the `爆款分析` flow first because it produces segment evidence, factor evidence, and suspected new factor candidates.
4. Add the `结构路径 + 因子组合 TOP 排行榜` view before serious content-production work, because v2 uses TOP1/TOP2/TOP3 as the script-generation input.
5. Define the local database schema before wiring forms.
6. Add backend services for upload, storage configuration, and FFmpeg segmentation.
7. Add Feishu sync only after local persistence is stable.
