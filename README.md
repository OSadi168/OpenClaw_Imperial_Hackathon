# EcoClaw Nexus

Environmental Intelligence System for Carbon Markets - Hackathon MVP

## Overview

EcoClaw Nexus is an agent-orchestrated environmental intelligence system that generates EnvironmentalEvidenceBundles from local JSON data sources. This hackathon MVP demonstrates a complete workflow for environmental evidence collection, validation, and MRV (Monitoring, Reporting, and Verification) handoff.

## Architecture

### Backend (FastAPI + Python)
- **Orchestrator**: Coordinates agent execution
- **Satellite Agent**: Processes NDVI and change detection data
- **Weather Agent**: Handles drought risk and weather data  
- **Validator Agent**: Checks completeness and confidence
- **Evidence Builder**: Creates and manages evidence bundles
- **Storage**: Local JSON files only (no external APIs)

### Frontend (Next.js + TypeScript)
- **Run Page**: Select AOI and trigger analysis
- **Results Page**: View analysis results and bundles
- **Evidence Page**: Detailed evidence bundle inspection
- **Deal Room**: Mock MRV handoff and deal preparation

## Key Features

- ✅ Agent-orchestrated data processing
- ✅ Local JSON data sources (no external dependencies)
- ✅ Environmental evidence validation
- ✅ Confidence scoring system
- ✅ Clean, modular architecture
- ✅ Modern UI with Tailwind CSS
- ✅ Full-stack TypeScript integration

## Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will start on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage Flow

1. **Select AOI**: Choose from sample Areas of Interest
2. **Run Analysis**: Orchestrator executes satellite, weather, and validation agents
3. **View Results**: Check analysis status and confidence scores
4. **Inspect Evidence**: Review detailed EnvironmentalEvidenceBundle
5. **Deal Room**: Mock MRV handoff preparation

## API Endpoints

- `POST /run` - Execute orchestrator for AOI
- `GET /results/{request_id}` - Get analysis results
- `GET /bundles` - List all evidence bundles
- `GET /bundles/{bundle_id}` - Get specific bundle
- `GET /sample-aois` - Get sample AOIs

## Sample Data

The system uses mock JSON data in `backend/data/`:
- `ndvi_*.json` - Vegetation health indices
- `change_*.json` - Land cover change detection
- `drought_*.json` - Drought risk assessments
- `weather_*.json` - Weather and climate data

## Constraints (Hackathon MVP)

- ❌ No blockchain integration
- ❌ No tokenization or escrow
- ❌ No real registries or DAO
- ❌ No settlement mechanisms
- ✅ Local JSON storage only
- ✅ Mock data for demonstration
- ✅ Clean, testable architecture

## Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- uvicorn (ASGI server)

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
ecoclaw-nexus/
├── backend/
│   ├── agents/          # Agent implementations
│   ├── models/          # Pydantic schemas
│   ├── services/        # Business logic
│   ├── data/           # Sample JSON data
│   ├── outputs/        # Generated bundles
│   └── main.py         # FastAPI app
├── frontend/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript types
├── shared/            # Shared interfaces
└── docs/              # Documentation
```

## Development Notes

This is a hackathon MVP designed to demonstrate:
- Clean agent orchestration patterns
- Environmental data processing workflows
- Modern full-stack development
- MRV-ready evidence bundling

The codebase is intentionally modular and extensible for future production use.
