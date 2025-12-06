"""
TODO: Implement pdf_inspect.inspect_pdf(path: str) helper.

Purpose:
- Central PDF inspection utility for all worker endpoints.

Function:
- inspect_pdf(path: str) -> dict
  - Try opening the PDF using PyMuPDF or pikepdf.
  - If opening fails, return:
      { "is_corrupted": True, "page_count": 0, "size_bytes": <os.path.getsize(path)> }
  - If success, return:
      {
        "is_corrupted": False,
        "page_count": <int>,
        "size_bytes": <os.path.getsize(path)>,
        # any other metadata we may want later (title, author, etc.)
      }

Usage:
- Called by /compress-batch-preview (and later: repair preview, etc.)
"""

from __future__ import annotations

import os
from typing import Any, Dict

try:
    import pikepdf
except Exception:  # pragma: no cover - best effort fallback when library missing
    pikepdf = None


def inspect_pdf(path: str) -> Dict[str, Any]:
    size_bytes = os.path.getsize(path)

    if pikepdf is None:
        return {"is_corrupted": False, "page_count": 0, "size_bytes": size_bytes}

    try:
        with pikepdf.open(path) as pdf:
            page_count = len(pdf.pages)
        return {
            "is_corrupted": False,
            "page_count": page_count,
            "size_bytes": size_bytes,
        }
    except Exception:
        return {
            "is_corrupted": True,
            "page_count": 0,
            "size_bytes": size_bytes,
        }
