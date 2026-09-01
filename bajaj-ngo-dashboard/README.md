# Bajaj Finserv — NGO Impact Intelligence Dashboard

An enterprise-grade, high-density data dashboard designed for monitoring NGO program cohorts, evaluating beneficiary outcomes, and turning impact data into actionable insights. 

Built with an uncompromising commitment to **Swiss International Style** information design—featuring rigorous grid systems, zero rounded corners, high-contrast typography, and maximum data density without clutter.

## 📐 Design Ethos & Architecture
This is not generic SaaS. The visual language was built to feel **serious, intelligent, precise, calm, and premium**.
- **Typography:** Cabinet Grotesk (architectural, strong hierarchy)
- **Palette:** High-contrast Monochrome (Slate/Ice Blue accents)
- **Structure:** Hairline borders (`1px solid #dde4ef`), crisp edges (0px border-radius), generous whitespace
- **Responsiveness:** Fluid grid engine that elegantly collapses from 4-column 4K desktop views down to single-column iPhone viewports with native mobile app-like interactions (bottom nav rails, off-canvas drawers).

## 📊 Modules & Features (Phase 1–3)

The dashboard is structured into 12 core Jobs-to-be-Done spanning the lifecycle of a beneficiary cohort:

### Phase 1: Who Is In The Program?
- **F-01: Program Overview** — Aggregate KPIs, active partner statuses, geographic spread.
- **F-02: Baseline Profile** — M0 demographics, prior income, and baseline financial access.

### Phase 2: What Happened During Skilling?
- **F-03: Training & Early Signals** — M3 completion rates and early behavioral indicators (business starts, new digital accounts).

### Phase 3: What Changed? (M6 Outcomes)
- **F-04: Income Change** — Median income trajectory, percentage change distribution, and occupation breakdowns.
- **F-05: Entrepreneurship** — Business entry/survival funnel and wage-to-self-employment transitions.
- **F-06: Business Sustainability** — The "honest" metric: 6-month survival rate of businesses started at M3.
- **F-07: Digital Adoption** — M0 vs M6 penetration of UPI, WhatsApp Business, and bookkeeping tools.
- **F-08: Financial Access** — Shifts in formal credit access and banking behavior.
- **F-09: Pre / Post Summary** — Board-level summary table of all critical impact metrics.
- **F-10: Geographic Comparison** — Interactive cross-district comparison matrix.
- **F-11: NGO Partner Performance** — Deep-dive expandable report cards per implementing partner.
- **F-12: Training vs Outcome** — Strategic correlation between training speed and long-term business survival.

## 🛠️ Technical Stack
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Vanilla CSS (Bespoke Swiss design system, CSS Grid/Flexbox)
- **Visualizations:** Recharts
- **Icons:** Phosphor Icons
- **Data:** Simulated local dataset mimicking complex M0/M3/M6 relational surveys.

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/rameshtavishwakarma97-design/csr-tracker.git
cd csr-tracker/bajaj-ngo-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will launch at `http://localhost:5173`.

---
*Developed for Bajaj Finserv Impact Intelligence.*
