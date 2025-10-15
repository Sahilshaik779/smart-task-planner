from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ...database.database import get_db
from ...schemas import plan_schemas
from ...services.plan_service import PlanService, get_plan_service
from ...crud import plan_crud

router = APIRouter(prefix="/plans", tags=["Plans"])

class PlanGenerationRequest(BaseModel):
    goal: str
    deadline: str

@router.post("/generate", response_model=plan_schemas.Plan)
async def generate_plan_endpoint(
    request: PlanGenerationRequest,
    plan_service: PlanService = Depends(get_plan_service)
):
    try:
        return await plan_service.generate_full_plan(request.goal, request.deadline)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.post("/", response_model=plan_schemas.Plan)
def save_plan_endpoint(plan: plan_schemas.Plan, db: Session = Depends(get_db)):
    try:
        return plan_crud.create_plan_with_tasks(db=db, plan_data=plan)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save plan: {e}")