from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.bom import BomImportResult, BomItem
from app.services import bom_parser
import io
import uuid

router = APIRouter()


@router.post("/import", response_model=BomImportResult)
async def import_bom(file: UploadFile = File(...)):
    content = await file.read()
    name = (file.filename or "").lower()

    if name.endswith(".pptx"):
        result = bom_parser.parse_pptx(io.BytesIO(content))
    elif name.endswith((".xlsx", ".xls")):
        result = bom_parser.parse_excel(io.BytesIO(content))
    elif name.endswith(".csv"):
        result = bom_parser.parse_csv(io.BytesIO(content))
    elif name.endswith(".pdf"):
        result = bom_parser.parse_pdf(io.BytesIO(content))
    else:
        raise HTTPException(status_code=400, detail="지원 형식: .pptx, .xlsx, .csv, .pdf")

    return result


@router.get("/sample", response_model=BomImportResult)
def get_sample_bom():
    items = [
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Server",
                equipment="HGX B300 server", quantity=4,
                description="NVIDIA B300 GPU * 8 per server",
                unit_power_w=10000, unit_height_u=10),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Server",
                equipment="RTX server", quantity=8,
                description="NVIDIA RTX Pro 6000 BSE GPU * 8 per server",
                unit_power_w=3000, unit_height_u=4),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Server",
                equipment="Mgmt server", quantity=3, description="Mgmt portal",
                unit_power_w=400, unit_height_u=2),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Storage",
                equipment="NAS Storage", quantity=2, description="",
                unit_power_w=500, unit_height_u=2),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Network",
                equipment="Firewall", quantity=2, description="10G UTM",
                unit_power_w=200, unit_height_u=1),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Network",
                equipment="AI Switch", quantity=2, description="800G*64 switch",
                unit_power_w=1500, unit_height_u=2),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Network",
                equipment="Leaf Switch", quantity=2, description="100G*32 switch",
                unit_power_w=500, unit_height_u=1),
        BomItem(id=str(uuid.uuid4()), category="IT 장비", subcategory="Network",
                equipment="Mgmt. Switch", quantity=1, description="1G/10G*48 switch for BMC",
                unit_power_w=200, unit_height_u=1),
        BomItem(id=str(uuid.uuid4()), category="기반시설", subcategory="Rack",
                equipment="42U Rack", quantity=7, description="1,200(W)*600(D)*2,100(H)",
                unit_height_u=42),
        BomItem(id=str(uuid.uuid4()), category="기반시설", subcategory="냉각",
                equipment="In-row Cooling", quantity=8,
                description="30kW, 실제 장비소비전력 약 7kW"),
        BomItem(id=str(uuid.uuid4()), category="기반시설", subcategory="냉각",
                equipment="CDU", quantity=2,
                description="60kW, B300 랙 하부 설치, 실제 장비소비전력 약 14kW"),
        BomItem(id=str(uuid.uuid4()), category="기반시설", subcategory="전원설비",
                equipment="IT UPS", quantity=3, description="300kW (2N+1)"),
        BomItem(id=str(uuid.uuid4()), category="기반시설", subcategory="전원설비",
                equipment="공조 UPS", quantity=1, description="150kW (N)"),
    ]
    return BomImportResult(items=items, source="sample")
