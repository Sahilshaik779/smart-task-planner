from pydantic import BaseModel, Field
from typing import List, Optional, Any  
from datetime import datetime          

class TaskBase(BaseModel):
    temp_id: Any = Field(..., alias="id")
    name: str
    phase: str
    priority: str
    estimated_hours: int = Field(..., alias="estimatedHours")
    dependencies: List[Any] 

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    duration: Optional[str]
    
    class Config:
        from_attributes = True
        populate_by_name = True

class PlanBase(BaseModel):
    goal: str
    deadline: datetime

class PlanCreate(PlanBase):
    tasks: List[TaskCreate]

class Plan(PlanBase):
    id: str
    total_tasks: int
    estimated_hours: int
    insights: dict
    tasks: List[Task] = []

    class Config:
        from_attributes = True