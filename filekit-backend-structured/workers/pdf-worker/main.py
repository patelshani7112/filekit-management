from fastapi import FastAPI

app = FastAPI(title="pdf-worker service")

@app.get("/health")
def health():
    return {"ok": True, "service": "pdf-worker"}
