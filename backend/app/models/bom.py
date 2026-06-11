from pydantic import BaseModel
from typing import Optional


class BomItem(BaseModel):
    id: str
    category: str       # 분야 (IT 장비, 기반시설)
    subcategory: str    # 항목 (Server, Storage, Network, ...)
    equipment: str      # Equipment 이름
    quantity: int
    description: Optional[str] = ""
    unit_power_w: Optional[float] = None   # W
    unit_height_u: Optional[int] = None    # U


class BomImportResult(BaseModel):
    items: list[BomItem]
    source: str  # "pptx" | "excel" | "csv"
    warnings: list[str] = []
