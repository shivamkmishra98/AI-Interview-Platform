# AI Interview Platform - Deployment Guide

This document outlines the complete DevOps and CI/CD architecture for the AI Interview Platform. The infrastructure is heavily containerized using Docker, reverse proxied by Nginx, and orchestrated via `docker-compose`.

## 🏗 Architecture Overview

1. **Frontend**: React + Vite built natively into a highly optimized, statically served Nginx container (`frontend/Dockerfile`). 
2. **Backend**: Node.js + Express API containerized in an optimized multi-stage build using `node:18-alpine` (`backend/Dockerfile`). 
3. **Database**: MongoDB running in a persistent container, natively attached to the backend over a bridged Docker network.
4. **Online Code Compiler Sandbox**: The backend spins up ephemeral sidecar Docker containers (`docker run --network none --rm`) to execute user code in complete isolation, preventing malicious script injection.
5. **Reverse Proxy & Networking**: The Frontend Nginx container not only serves static files but operates as an internal API Gateway (Reverse Proxy) routing `/api/*` traffic directly to the backend over the `ai_network`.

## 🚀 Local Deployment (Docker Compose)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Port 80, 5000, and 27017 must be free on your local machine.

### 2. Environment Setup
Create the required environment files:
```bash
cp backend/.env.example backend/.env
```
Ensure your `.env` contains secure values (e.g., `JWT_SECRET`).

### 3. Build & Run
From the root of the project:
```bash
docker-compose up --build -d
```
- **Frontend** is available at: `http://localhost`
- **Backend API** is available via proxy at `http://localhost/api` (or directly via `http://localhost:5000/api`)
- Check health: `http://localhost/health` (Nginx) and `http://localhost:5000/health` (Node)

### 4. Teardown
```bash
docker-compose down -v
```

---

## 🔄 CI/CD Pipelines

### GitHub Actions (`.github/workflows/main.yml`)
The GitHub Actions workflow triggers automatically on commits to the `main` branch.
**Stages:**
1. Checkout source code.
2. Setup Node.js and cache dependencies.
3. Install dependencies and run tests.
4. Log into Docker Hub (requires GitHub Secrets `DOCKER_USERNAME`, `DOCKER_PASSWORD`).
5. Build and push production-ready, multi-stage Docker images tagged with the commit SHA and `latest`.
6. Connects to the production server via SSH and triggers a `docker-compose pull` & `up -d` (requires `PROD_HOST`, `PROD_USERNAME`, `PROD_SSH_KEY`).

### Jenkins Pipeline (`Jenkinsfile`)
A declarative Jenkins pipeline mirroring the architecture of GitHub Actions.
**Stages:**
1. `Checkout`: Pull source from SCM.
2. `Install Dependencies`: Runs `npm ci`.
3. `Run Tests`: Test suites executed.
4. `Docker Build & Push`: Builds images via Docker Engine using Jenkins Credentials.
5. `Deploy Application`: Connects via SSH agent to seamlessly restart the orchestration on the target VPS.

---

## 🛡 Security & Performance Optimizations implemented:
1. **Multi-Stage Dockerfiles**: Reduced image sizes by stripping out `devDependencies` entirely from the runtime container.
2. **Non-Root Execution**: The backend runs explicitly under the restricted `USER node` mapping inside Docker for elevated security.
3. **Nginx Reverse Proxy**: Backend is no longer exposed directly to the outside world; frontend passes API requests natively to the backend via Docker Bridge networking (`ai_network`).
4. **Healthchecks**: Embedded deeply within `docker-compose.yml`, causing automatic restarts (`restart: unless-stopped`) if the MongoDB or Node.js server hangs.
5. **HTTP Logging**: The backend uses `morgan` for structured console logging (`dev` in development, `combined` for production tracking).
