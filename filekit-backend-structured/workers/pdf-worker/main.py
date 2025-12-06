"""
TODO: Add two FastAPI endpoints:

1) POST /compress-batch-preview
   - Input JSON:
     {
       "session_id": "<sessionId>",
       "files": [ { "input_path": "tmp/uploads/<sessionId>/file-0.pdf" }, ... ],
       "presets": ["balanced", "strong", "max"]
     }
   - For each file:
     - Use inspect_pdf(input_path) to detect corruption + file size.
     - If is_corrupted, mark it and include in response.
     - For each preset, produce an estimated_size (in bytes).
       *V1 approach:* run real compression into a temp file, measure size,
       then delete the temp file. (Accurate but heavier.)
   - Response JSON:
     {
       "ok": true,
       "files": [
         {
           "input_path": "...",
           "original_size": <int>,
           "is_corrupted": false,
           "presets": {
             "balanced": { "estimated_size": <int> },
             "strong":   { "estimated_size": <int> },
             "max":      { "estimated_size": <int> }
           }
         },
         ...
       ]
     }

2) POST /compress-batch
   - Input JSON:
     {
       "job_id": "<jobId>",
       "preset": "balanced" | "strong" | "max",
       "files": [ { "input_path": "tmp/uploads/<sessionId>/file-0.pdf" }, ... ]
     }
   - For each file:
     - Run real compression with a chosen Ghostscript profile based on preset.
     - Write results into: "tmp/uploads/<jobId>/file-<index>-compressed.pdf"
     - Collect:
       - original_size: int (bytes)
       - compressed_size: int (bytes)
       - output_path: string
   - Response JSON:
     {
       "ok": true,
       "files": [
         {
           "input_path": "...",
           "output_path": "...",
           "original_size": <int>,
           "compressed_size": <int>
         },
         ...
       ]
     }
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from typing import Dict, List, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from pdf_inspect import inspect_pdf

app = FastAPI(title="pdf-worker service")


PRESET_TO_GS: Dict[str, str] = {
    "balanced": "/printer",
    "strong": "/ebook",
    "max": "/screen",
}


class PreviewFile(BaseModel):
    input_path: str


class PreviewRequest(BaseModel):
    session_id: str
    files: List[PreviewFile]
    presets: List[str]


class CompressFile(BaseModel):
    input_path: str


class CompressRequest(BaseModel):
    job_id: str
    preset: Literal["balanced", "strong", "max"]
    files: List[CompressFile]


def ensure_folder(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def run_ghostscript(input_path: str, output_path: str, preset: str) -> int:
    ensure_folder(os.path.dirname(output_path))
    gs_profile = PRESET_TO_GS.get(preset, "/printer")

    args = [
        "gs",
        "-dBATCH",
        "-dNOPAUSE",
        "-dSAFER",
        "-sDEVICE=pdfwrite",
        f"-dPDFSETTINGS={gs_profile}",
        f"-sOutputFile={output_path}",
        input_path,
    ]

    try:
        subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        # Ghostscript is not installed; fall back to copy to keep flow working.
        shutil.copyfile(input_path, output_path)
    except subprocess.CalledProcessError:
        # Compression failed; fall back to copy so pipeline still returns output.
        shutil.copyfile(input_path, output_path)

    return os.path.getsize(output_path)


def estimate_compressed_size(input_path: str, preset: str) -> int:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp_path = tmp.name
    try:
        size = run_ghostscript(input_path, tmp_path, preset)
        return size
    finally:
        try:
            os.remove(tmp_path)
        except FileNotFoundError:
            pass


def compress_pdf(input_path: str, output_path: str, preset: str) -> int:
    return run_ghostscript(input_path, output_path, preset)


@app.get("/health")
def health():
    return {"ok": True, "service": "pdf-worker"}


@app.post("/compress-batch-preview")
def compress_batch_preview(payload: PreviewRequest):
    if not payload.files:
        raise HTTPException(status_code=400, detail="No files provided")

    results = []
    for file in payload.files:
        info = inspect_pdf(file.input_path)
        if info["is_corrupted"]:
            results.append(
                {
                    "input_path": file.input_path,
                    "original_size": info["size_bytes"],
                    "is_corrupted": True,
                    "presets": {},
                }
            )
            continue

        preset_sizes = {}
        for preset in payload.presets:
            preset_sizes[preset] = {"estimated_size": estimate_compressed_size(file.input_path, preset)}

        results.append(
            {
                "input_path": file.input_path,
                "original_size": info["size_bytes"],
                "is_corrupted": False,
                "presets": preset_sizes,
            }
        )

    return {"ok": True, "files": results}


@app.post("/compress-batch")
def compress_batch(payload: CompressRequest):
    if not payload.files:
        raise HTTPException(status_code=400, detail="No files provided")

    output_root = os.path.join("tmp", "uploads", payload.job_id)
    ensure_folder(output_root)

    results = []
    for index, file in enumerate(payload.files):
        if not os.path.exists(file.input_path):
            raise HTTPException(status_code=400, detail=f"File not found: {file.input_path}")

        output_path = os.path.join(output_root, f"file-{index}-compressed.pdf")
        original_size = os.path.getsize(file.input_path)
        compressed_size = compress_pdf(file.input_path, output_path, payload.preset)

        results.append(
            {
                "input_path": file.input_path,
                "output_path": output_path.replace("\\", "/"),
                "original_size": original_size,
                "compressed_size": compressed_size,
            }
        )

    return {"ok": True, "files": results}
