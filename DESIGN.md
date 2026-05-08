# Design

## Design System: DuoLe TikTok Growth Studio

### Design Intent

DuoLe TikTok Growth Studio should look like a polished internal growth operating system, not a generic dashboard and not an AI-themed demo. The interface must earn trust from company operators who use it repeatedly for video analysis, factor management, SKU production, and result feedback.

The home page is the only surface allowed to carry a strong branded product impression. Business pages should be calmer, denser, and more task-focused.

### Visual References

- Primary reference: the provided DuoLe dashboard screenshot, especially its shell structure, visual polish, sidebar hierarchy, and hero-to-module rhythm.
- Product quality anchors: Linear for density and navigation discipline, Stripe Dashboard for polished operational trust, Feishu Bitable for table-heavy Chinese workflow familiarity.

### Color Strategy

Use a TikTok-commerce palette with a black navigation rail, a light long-use workbench, and cyan-to-hot-pink neon accents. The system should feel like a polished creator-commerce workbench, not a deep-blue AI control room.

- Background: Apple-white / clean white workbench surface with only a very subtle cool tint. Avoid gray-heavy surfaces.
- Sidebar: black/deep neutral navigation surface with restrained cyan/pink active states.
- Hero: poster-like TikTok creator commerce artwork. The poster must display fully and avoid cropping important subject details.
- Primary action: cyan-to-hot-pink gradient.
- Success/effective: green.
- Warning/pending: amber.
- Error/sync failed: pink/rose.
- Text: light tinted neutral, never pure white.

Use the cyan/pink gradient as the shared brand accent across primary buttons, active nav, progress, and key chips. Cyan should be controlled, not dominant across every card. Keep dense operational surfaces readable: light cards, clear borders, restrained glow, and pink/dark-neutral balance.

After the 2026-05-08 homepage pass, pink should not be used as normal UI text. Keep pink mostly in the hero poster artwork, tiny active indicators, primary gradient endpoints, and error/attention states. Default labels, buttons, pills, and card copy should use neutral ink with cyan as the quieter operational accent.

### Typography

Use a system UI / Inter-like sans stack. The interface is Chinese-first with English reserved for brand and product naming.

- Brand: DuoLe.
- Product subtitle: TikTok Growth Studio.
- Main hero headline: 让爆款打法变成可复用资产.
- Body and labels must stay readable; avoid tiny decorative Chinese text.
- Product UI uses fixed rem-based sizes, not fluid viewport scaling.
- Data uses tabular numbers.

### Layout

The desktop app shell uses a left sidebar and top utility bar.

Home page rhythm:

1. Left sidebar: compact, stable, with clear module grouping.
2. Top bar: breadcrumb, notifications, team switcher.
3. Hero: one strong, poster-like product moment. It may use abstract TikTok-inspired commerce, short-video, sound, interaction, and growth visuals, but it should not become a dense business dashboard. Do not compress the hero / hook stage so much that it stops feeling like the main poster.
4. Module area: three separate, independent workflow cards aligned to the v2 workflow: `爆款分析`, `TOP 组合 / 因子库`, and `SKU 生产 / 回流裂变`. Do not merge them into one unified panel. The earlier independent-card composition is closer to the desired direction.
5. Status strip: local database authority, Feishu sync queue, result feedback, and A1-A5 tag calculation.

The homepage must fit one normal desktop screen without vertical scrolling. Achieve this by reducing module content and allocating space carefully, not through global transform scaling, content cropping, hidden overflow, or a status strip that covers the modules. If the home screen feels cramped, remove detail and move it to module pages instead of shrinking text.

Business pages:

- Use tables, filters, step indicators, detail drawers, and split work areas.
- Avoid nested cards.
- For the homepage specifically, avoid a single merged module panel. Use independent module boards with distinct internal layouts and much lighter summary content.
- Avoid repeating the same card structure on every module.
- Each module should match its job: evidence review, factor library, SKU production chain, image asset board, variant generator, result feedback.

### Components

- Sidebar nav with icons and text labels.
- Primary and secondary buttons with visible focus and loading states.
- Status chips that include text, not color-only meaning.
- Data cards only when the content is actionable or comparable.
- Tables with sticky headers, filters, sort indicators, and detail drawers.
- Stepper for viral analysis flow.
- Sync status row with retry affordance.
- Empty states that suggest the next action.

### Motion

Motion is restrained and functional only. Use it for hover/press feedback, drawer open/close, step changes, sync progress, and loading skeletons. No decorative page-load choreography.

### Avoid

- Low-fidelity wireframe blocks.
- AI-generated-looking abstract dashboards.
- Dense unreadable tiny labels.
- Random gradients and decorative glow.
- Generic repeated icon-card grids.
- Deep-blue AI dashboard styling.
- Fake metrics that overpower the workflow.
