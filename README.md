# FILEKIT - Advanced File Management Platform

FILEKIT is a full-stack file processing platform designed to handle 170+ tools such as:
- PDF editing, merging, splitting, compressing
- Image conversion and optimization
- Video/Audio processing
- Document conversion
- Cloud plus local processing workflows

This repo follows a monorepo structure with separate frontend and backend folders under one Git repository for easier development and deployment.

---

## Project Overview

FILEKIT provides:
- A modern React + Vite frontend
- A scalable Node.js backend for PDF/Doc tools
- Support for additional services (e.g., workers, Python microservices)
- Clean architecture
- Developer-friendly workflow

This README explains how to run, develop, and contribute to the project.

---

## Folder Structure

```
FILEKIT/
|-- File Management Design/      # React/Vite frontend for the platform
|   |-- src/
|   |-- index.html
|   |-- package.json
|   `-- vite.config.ts
|
|-- filekit-backend-structured/  # Backend + workers
|   |-- node-api/                 # Node.js API (PDF tools, DOC tools, processing)
|   |-- workers/                  # Additional workers / background processes
|   |-- package.json
|   `-- tsconfig.json
|
|-- .gitignore                   # Ignored files (node_modules, env, build, logs)
`-- README.md                    # This file
```

---

## Running the Frontend

Move into the frontend folder (note the space in the name):

```bash
cd "File Management Design"
```

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## Running the Backend (Node API)

Move into backend folder:

```bash
cd filekit-backend-structured/node-api
```

Install dependencies:

```bash
pnpm install
```

Start API server:

```bash
pnpm dev
```

Backend will run at:

```
http://localhost:3000
```

---

## Optional: Python Worker

If your project includes a Python worker (OCR, compression, etc.):

```bash
cd backend/python-worker
pip install -r requirements.txt
python main.py
```

---

## Scripts (Root)

Common scripts you may add later:

```json
{
  "scripts": {
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend/node-api dev",
    "dev": "concurrently \"pnpm dev:frontend\" \"pnpm dev:backend\""
  }
}
```

Optional with Turborepo or PNPM workspaces.

---

## Commit Message Guidelines

We use Conventional Commits so the history stays clean.

### Types:
| Type       | Use Case |
|------------|----------|
| feat       | New features |
| fix        | Bug fixes |
| refactor   | Code cleanup, reorganizing |
| docs       | Documentation updates |
| chore      | Dependencies, config, misc |
| style      | UI or formatting changes |

### Examples:
```
feat(frontend): add merge pdf UI
fix(backend): handle corrupt pdf error
chore: update .gitignore
refactor(node-api): extract pdf utils
```

---

## Deployments

You can deploy using:

### Frontend
- Vercel
- Netlify
- Cloudflare Pages

### Backend
- Render
- Railway
- Cloudflare Workers
- Docker containers

---

## Contributing (Future)

Guidelines to follow:
- Keep PRs small and focused
- Use consistent commit messages
- Respect project folder structure
- Test new tools before merging

---

## About FILEKIT

FILEKIT aims to be a powerful online file management platform, handling:
- Complex PDFs
- Images
- Videos
- Audio
- Documents
All with high performance and privacy in mind.

---

## Contact

For development help or questions:

Developer: Shani
Tech Stack: React, Node.js, Python, Vite, PNPM
