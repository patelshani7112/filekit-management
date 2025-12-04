from fastapi import FastAPI

app = FastAPI(title="image-worker service")

@app.get("/health")
def health():
    return {"ok": True, "service": "image-worker"}
