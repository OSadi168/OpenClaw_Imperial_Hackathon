# EcoClaw Nexus — Hackathon Demo Script

## Overview (30 seconds)

> "EcoClaw Nexus is an AI-powered environmental intelligence platform for carbon markets. It automates the MRV process — Measurement, Reporting, and Verification — which is currently the biggest bottleneck in carbon credit issuance. We built a multi-agent system that collects satellite data, weather risk data, and cross-validates everything into a tamper-proof evidence bundle that's ready for carbon registries like Verra."

---

## Tech Stack (15 seconds)

> "Our stack: a **FastAPI backend** orchestrating three AI agents — Satellite, Weather, and Validator — a **Next.js React frontend** for the dashboard, and we integrated a **real cleaned Verra carbon registry dataset** of 418 projects and 246 organizations, anchored with a **SHA256 blockchain hash** for immutability."

---

## STEP 1: Homepage (http://localhost:3000/)

**[SHOW: Homepage with 4 cards]**

> "This is EcoClaw Nexus. From here, users can run a new environmental analysis, view past results, inspect evidence bundles, or enter the Deal Room for MRV handoff. Let me walk through the full pipeline."

---

## STEP 2: Run Analysis (http://localhost:3000/run)

**[SHOW: /run page — select Amazon Ridge, click Start Analysis]**

> "We start by selecting an Area of Interest. Let's pick **Amazon Ridge Conservation Area** — a 5,000 hectare site. When I click 'Start Analysis', our orchestrator kicks off three agents simultaneously:"
>
> - "The **Satellite Agent** pulls NDVI vegetation data — normalized difference vegetation index — comparing two time periods to detect land cover changes."
> - "The **Weather Agent** calculates drought risk using precipitation, temperature, and soil moisture data."
> - "The **Validator Agent** cross-references both results to assign a confidence score."

**[CLICK: Start Analysis — wait for results]**

> "There we go — all three agents completed. We can see each agent's status and execution time. The orchestrator bundled everything into an **EnvironmentalEvidenceBundle** — our core data structure."

---

## STEP 3: View Results (http://localhost:3000/results)

**[SHOW: /results page with bundle cards]**

> "The Results page lists all saved evidence bundles. Each shows the AOI name, bundle ID, creation timestamp, and the **overall confidence score — 93.5%**. This is the aggregated trust score from our three agents. Let me click into the full evidence detail."

---

## STEP 4: Evidence Bundle (http://localhost:3000/evidence)

**[SHOW: /evidence page — auto-loads latest bundle]**

> "This is the complete Environmental Evidence Bundle. Let me walk through what our agents found:"

### Area of Interest & Validation
> "Top left: the AOI metadata and bundle ID. Top right: **validation results** — the Validator Agent confirmed the bundle is complete with a **93.5% confidence score**."

### Satellite Analysis
> "Here's the satellite data. We analyzed two Landsat 8 scenes:"
> - "**Earlier scene** (March 2023): NDVI mean of 0.682"
> - "**Later scene** (October 2023): NDVI mean of 0.742"
> - "That's a **+0.060 mean NDVI increase, or +8.8% vegetation growth** — strong positive signal for carbon sequestration."
> - "The **change signals** show the primary change is vegetation growth, with 72% of the area showing vegetation increase and only 8% decrease."
> - "Quality score: **85%** — high confidence in the satellite data."

### Weather Risk
> "The Weather Agent assessed drought vulnerability:"
> - "**Drought score: 0.32** — rated as **MODERATE** risk."
> - "Key drivers: 45mm precipitation deficit, +1.2°C temperature anomaly, 15% soil moisture deficit."
> - "The temporal trend shows drought conditions are **improving** — previous month was 0.38, now 0.32."
> - "This means the site is resilient enough for long-term carbon credit viability."

---

## STEP 5: Deal Room (http://localhost:3000/deal-room)

**[SHOW: /deal-room page — auto-loads bundle + Verra data]**

> "This is the MRV Deal Room — where evidence meets carbon markets."

### Deal Summary & MRV Readiness
> "The deal summary shows our project details and evidence status. The **MRV Ready Status** confirms: evidence collection complete, validation passed, confidence score acceptable, ready for carbon market handoff."

### Market Readiness Indicators
> "All green lights: environmental data verified, MRV standards met, evidence bundle complete. Yellow for registry submission — that's the next step."

### Validation Results
> - "Completeness: **Complete**"
> - "Confidence: **93.5%**"
> - "NDVI Change: **+0.060**"
> - "Drought Score: **0.32 (MODERATE)**"

### Deal Economics
> "Based on the vegetation health data, we estimate **4,000 carbon credits per year** with a market value of approximately **$60,000** at $15 per credit."

### Blockchain Anchoring
> "Now here's where our teammate's data work comes in. We generated a **SHA256 hash** of the entire cleaned company dataset:"
>
> `d83202d46effad2d463038c4b79dffcddc727506a27ce8f5f3bdda9f3b16b68f`
>
> "This hash anchors 418 Verra projects and 246 verified companies to an immutable blockchain record. Any tampering with the dataset would change the hash — guaranteeing data integrity for auditors and registries."

### Verra Carbon Registry Projects
> "We integrated **real data from the Verra carbon registry** — the world's largest voluntary carbon credit standard. Here are actual registered projects:"
> - "**Project Akwaaba** — Forest Ecosystem Restoration, Renewable Energy"
> - "**Tond Tenga** — Tree Aid, 92,592 estimated annual emission reductions"
> - "**OYU Reforesting Uganda** — 379,891 annual emission reductions"
>
> "418 total projects, all cleaned and standardized to UK/Europe scope."

### Verified Counterparties
> "We extracted **246 unique organizations** from the Verra proponent data — these are the verified counterparties for potential carbon credit transactions. Companies like Rainforest Builder Ltd., Tree Aid, OYU Green Private Limited."

---

## Data Pipeline Summary (15 seconds)

> "To summarize the data pipeline:"
> 1. "**Downloaded** the Verra project dataset"
> 2. "**Cleaned** by removing missing values"
> 3. "**Standardized** geography: Region = Europe, Country = UK"
> 4. "**Redistributed** project types across multiple categories (not just AFOLU)"
> 5. "**Extracted** 246 unique organizations from proponent data"
> 6. "**Generated SHA256 hash** for blockchain anchoring"
> 7. "**Integrated** into the Deal Room for real-time counterparty matching"

---

## Closing (20 seconds)

> "EcoClaw Nexus solves a real problem: carbon credit verification today takes months and costs thousands of dollars. Our multi-agent system automates satellite analysis, weather risk assessment, and cross-validation — producing a **93.5% confidence evidence bundle** in seconds, not months."
>
> "Combined with real Verra registry data and blockchain anchoring, we're building the trust infrastructure that carbon markets need to scale. Thank you."

---

## Quick Reference — Key Numbers for Q&A

| Metric | Value |
|--------|-------|
| AOI Size | 5,000 hectares |
| NDVI Change | +0.060 (+8.8%) |
| Drought Score | 0.32 (Moderate) |
| Overall Confidence | 93.5% |
| Estimated Credits | 4,000/year |
| Market Value | ~$60,000/year |
| Verra Projects | 418 |
| Companies | 246 |
| Blockchain Hash | d83202d46eff...b68f |
| Tech Stack | FastAPI + Next.js + Multi-Agent AI |
| Agents | Satellite, Weather, Validator |

---

## URLs for Live Demo

| Page | URL |
|------|-----|
| Homepage | http://localhost:3000/ |
| Run Analysis | http://localhost:3000/run |
| Results | http://localhost:3000/results |
| Evidence Bundle | http://localhost:3000/evidence |
| Deal Room | http://localhost:3000/deal-room |
| Backend API | http://localhost:8000/ |
| API Docs | http://localhost:8000/docs |
