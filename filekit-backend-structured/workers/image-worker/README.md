# image-worker

This is the image worker service.

Right now it only exposes a `/health` endpoint.
Later you will:

- Connect it to your queue system (Redis, SQS, etc.).
- Download input files from object storage.
- Run heavy operations (PDF/Image/Media).
- Upload results and update job status.
