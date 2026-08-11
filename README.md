# CSR Impact Tracking Dashboard

This repository contains the tracking and verification system for Corporate Social Responsibility (CSR) livelihood programs. It moves beyond standard reporting by using micro-data and statistical modeling to quantify the exact economic impact of interventions.

## Architecture

The project is split into two primary components:

*   **`dashboard/`**: The frontend React application (built with Vite). It acts as the analytical interface, rendering longitudinal ledger data, difference-in-differences (DiD) waterfalls, and paired t-test results.
*   **`scripts/`**: Contains the Python data generator (`generate_mock_data.py`). This script generates statistically viable, multi-wave synthetic beneficiary profiles used to populate the dashboard and test the econometric logic.
*   **`docs/`**: Project reference documents and architectural specifications.
*   **`.agents/`**: Standard IDE configurations and prompt instructions.

## Methodology

The tracking logic relies on a Treatment vs. Control (quasi-experimental) cohort design:
1.  **Wave 1 (Trained Sample):** Beneficiaries who complete the program modules.
2.  **Wave 2 (Control Group):** Demographically identical beneficiaries who have not yet received training.

By comparing the income trajectories of these two groups over a 6-month period, the system calculates a Net Attributable Delta, successfully isolating the program's effect from background macroeconomic inflation.

## Setup & Execution

### Running the Dashboard

The dashboard is a standard Node.js application built with Vite.

```bash
cd dashboard
npm install
npm run dev
```

The application will start on `http://localhost:5173`.

### Generating Data

To regenerate or modify the synthetic beneficiary dataset:

```bash
cd scripts
python generate_mock_data.py
```

This outputs a `mock_data.json` file which should be placed in `dashboard/src/data/` for the React application to consume.

## Documentation

Source documents (PDFs and requirement docs) are located in `docs/references/`. Note that large binary files are ignored in Git to maintain a lightweight repository footprint.
