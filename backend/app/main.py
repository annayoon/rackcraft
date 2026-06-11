from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import bom, rack, power, diagram

app = FastAPI(title="RackCraft API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bom.router, prefix="/api/bom", tags=["BOM"])
app.include_router(rack.router, prefix="/api/rack", tags=["Rack"])
app.include_router(power.router, prefix="/api/power", tags=["Power"])
app.include_router(diagram.router, prefix="/api/diagram", tags=["Diagram"])

@app.get("/health")
def health():
    return {"status": "ok"}
