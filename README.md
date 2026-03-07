# EcoClaw Nexus

Environmental Intelligence System for Carbon Markets - Hackathon MVP

## Overview

EcoClaw Nexus is an agent-orchestrated environmental intelligence system that generates Environmental Evidence Bundles from local environmental data sources. This hackathon MVP demonstrates a complete workflow for environmental evidence collection, validation, and MRV (Monitoring, Reporting, and Verification) handoff for carbon market readiness.

The system automates the analysis of:
- Satellite vegetation change signals
- Drought and climate risk indicators
- Validation and confidence scoring
It then compiles these outputs into a structured EnvironmentalEvidenceBundle that can be reviewed in a mock MRV Deal Room.

## Architecture

### Backend (FastAPI + Python)
- **Orchestrator Agent**: Coordinates all agent execution
- **Satellite Agent**: Processes NDVI and vegetation change data
- **Weather Agent**: Processes drought risk and climate signals  
- **Validator Agent**: checks completeness and confidence
- **Evidence Builder**: creates and stores EnvironmentalEvidenceBundles
- **Storage**: Local JSON files only

### Frontend (Next.js + TypeScript)
- **Home Page**: Project overview and workflow entry point
- **Run Page**: Select AOI and trigger analysis
- **Results Page**: View generated bundles and confidence scores
- **Evidence Page**: Inspect full EnvironmentalEvidenceBundle details
- **Deal Room**: Mock MRV handoff and market-readiness workflow

## Key Features

- ✅ Agent-orchestrated environmental analysis
- ✅ Local JSON data sources with fallback mock safety
- ✅ Environmental evidence validation
- ✅ Confidence scoring system
- ✅ Evidence bundling for MRV handoff
- ✅ Clean modular full-stack architecture
- ✅ Modern dashboard UI with Tailwind CSS

## Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`

## Usage Flow

1. **Select AOI**: Choose an Area of Interest
2. **Run Analysis**: The Orchestrator executes: satellite, weather and validator agents
3. **View Results**:  Inspect bundle summaries and confidence
4. **Inspect Evidence**: Review the EnvironmentalEvidenceBundle
5. **Deal Room**: Prepare MRV handoff and market-readiness review

## Data Sources

The MVP primarily uses fixed local JSON files in `backend/data/`:
- `ndvi_result.json` - satellite NDVI and vegetation change analysis
- `drought_result.json` - drought risk and climate analysis

The system may also include fallback/sample files for demo safety, but the primary MVP flow uses these fixed results files.

## API Endpoints
Important: these should match the live routes in backend/main.py.

Based on the latest build, expected routes are likely:
- `GET /` 
- `GET /api/status` 
- `POST /api/analyze` 
- `GET /api/bundles`
- `GET /api/bundles/{id}`

## Constraints (Hackathon MVP)

- ❌ No on-chain tokenization or escrow logic
- ❌ No DAO governance
- ❌ No real carbon registry submission flow
- ❌ No production settlement mechanism
- ✅ Local JSON storage only
- ✅ Designed for hackathon demonstration and MRV workflow simulation

## Tech Stack

**Backend:**
- FastAPI 
- Pydantic 
- Uvicorn

**Frontend:**
- Next.js 14 
- TypeScript
- Tailwind CSS
- Lucide React 

## Project Structure

```
ecoclaw-nexus/
├── backend/
│   ├── agents/          
│   ├── models/          
│   ├── services/        
│   ├── data/           
│   ├── outputs/        
│   └── main.py         
├── frontend/
│   ├── app/            
│   ├── components/     
│   ├── lib/           
│   └── types/         
├── shared/            
└── docs/              
```

## Development Notes

This MVP demonstrates:
- Multi-agent orchestration
- Environmental data processing
- MRV-ready evidence bundling
- Carbon market handoff through a Deal Room interface

The codebase is intentionally modular so it can evolve into a larger environmental verification and carbon market infrastructure platform.

## Applied Bounties ##

### OpenClaw Core Challenge – Build Platforms for Agents 
- EcoClaw Nexus functions as an agent orchestration platform where multiple AI agents collaborate to analyze environmental data and produce verifiable insights. Using OpenClaw, the system coordinates Satellite, Weather Risk, Optimization, and Validator agents to transform raw environmental signals into structured evidence bundles, demonstrating a practical platform for orchestrating real-world AI agent workflows.

### OpenClaw Core Challenge – Build Apps for Humans 
- EcoClaw also qualifies as an AI-powered application for real users, providing actionable environmental intelligence for climate analysts, water utilities, carbon project developers, and infrastructure operators. The system converts complex satellite and climate data into clear insights that support operational decisions and environmental monitoring.

### FLock Track – AI Agents for UN Sustainable Development Goals (SDGs)
- EcoClaw contributes directly to SDG 13 (Climate Action) through drought detection and climate risk monitoring, SDG 6 (Clean Water and Sanitation) by enabling watershed monitoring and optimizing water treatment chemical usage, and SDG 15 (Life on Land) through satellite-based vegetation health and land-use monitoring. The platform produces measurable environmental intelligence that supports sustainable resource management and climate resilience.

### The Compression Company (TCC) – Satellite Intelligence
EcoClaw’s Satellite Agent retrieves and processes Earth observation imagery to calculate NDVI vegetation indices, detect environmental stress signals, and monitor land-cover changes. By combining satellite analysis with climate data, the system generates actionable insights such as drought risk detection and vegetation health monitoring, directly aligning with the TCC challenge of turning satellite data into commercially valuable intelligence.

### Z.AI Track – Production-Ready AI Agents
EcoClaw demonstrates a reasoning-based Validator Agent that evaluates environmental signals, validates results, and generates structured EnvironmentalEvidenceBundles with confidence scores and explainable outputs. This reasoning-driven validation layer showcases production-ready AI agents capable of structured decision-making and reliable output generation.

### Animoca Minds – Best Multi-Agent System
EcoClaw uses a coordinated multi-agent architecture where specialized agents collaborate to produce a shared environmental evidence artifact. With the addition of agent memory for storing previous runs and environmental observations, the system demonstrates persistent agent knowledge and collaborative reasoning across multiple analytical tasks.

### Anyway Track – Agent Observability & Commercialization
EcoClaw supports agent observability through execution traces, decision logs, and telemetry, enabling developers to track how each agent contributes to the final evidence bundle. This transparency improves reliability and provides a foundation for commercial environmental intelligence services that organizations can use for climate monitoring and compliance.

