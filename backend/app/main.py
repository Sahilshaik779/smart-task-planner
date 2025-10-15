from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import plan_router
from .database.database import init_db

app = FastAPI(title="Smart Task Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(plan_router.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "API is running"}