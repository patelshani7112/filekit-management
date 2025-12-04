# FileKit / WorkflowPro Backend – Structured Skeleton

This repo is a **structured backend skeleton** for your 170+ file tools platform.

It uses:

- `node-api/` – TypeScript API gateway (Express).
- `workers/` – Python microservices for heavy work:
  - `pdf-worker/`
  - `image-worker/`
  - `media-worker/`

Right now this is **only structure + basic wiring**:
- In-memory job store (for development only).
- Placeholder storage + queue services.
- A couple of example routes under `/pdf`.

You can grow this into your full system without having to re-organize the folders later.
