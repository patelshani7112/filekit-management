from fastapi import FastAPI

app = FastAPI(title="media-worker service")

@app.get("/health")
def health():
    return {"ok": True, "service": "media-worker"}
