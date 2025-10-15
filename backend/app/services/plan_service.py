import uuid
from datetime import datetime, timedelta
from typing import Dict
from .llm_service import LLMService
from ..schemas import plan_schemas
import logging

class PlanService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    async def generate_full_plan(self, goal: str, deadline_str: str) -> plan_schemas.Plan:
        llm_tasks = await self.llm_service.generate_tasks(goal, deadline_str)
        if not llm_tasks:
            raise ValueError("Failed to generate tasks from LLM.")

        validated_tasks = [plan_schemas.TaskCreate(**task) for task in llm_tasks]

        logging.info("--- Standardizing Task IDs Post-Validation ---")
        for task in validated_tasks:
            id_as_string = str(task.temp_id)
            if not id_as_string.startswith('T'):
                logging.info(f"Found non-standard ID: '{task.temp_id}'. Correcting it.")
                task.temp_id = f"T{id_as_string}"
        logging.info("--- Standardization Complete ---")

        processed_tasks = self._calculate_task_timelines(validated_tasks)
        total_hours = sum(t.estimated_hours for t in processed_tasks)
        
        plan = plan_schemas.Plan(
            id=str(uuid.uuid4()),
            goal=goal,
            deadline=datetime.fromisoformat(deadline_str.split('T')[0]),
            total_tasks=len(processed_tasks),
            estimated_hours=total_hours,
            insights={"summary": "Plan generated successfully.", "recommendations": [], "risks": []},
            tasks=processed_tasks
        )
        return plan

    def _calculate_task_timelines(self, tasks: list[plan_schemas.TaskCreate]) -> list[plan_schemas.Task]:
        task_map = {task.temp_id: task for task in tasks}
        end_dates: Dict[str, datetime] = {}
        processed_tasks = []
        
        start_date = datetime.now()

        for task in tasks:
            fixed_dependencies = []
            for dep in task.dependencies:
                dep_as_string = str(dep)
                if not dep_as_string.startswith('T'):
                    fixed_dependencies.append(f"T{dep_as_string}")
                else:
                    fixed_dependencies.append(dep_as_string)
            
            dep_end_dates = [end_dates.get(dep_id, start_date) for dep_id in fixed_dependencies]
            task_start = max(dep_end_dates) if dep_end_dates else start_date
            
            work_days_needed = (task.estimated_hours / 8.0)
            task_end = task_start
            added_days = 0
            while added_days < work_days_needed:
                task_end += timedelta(days=1)
                if task_end.weekday() < 5:
                    added_days += 1

            end_dates[task.temp_id] = task_end
            duration_days = (task_end - task_start).days
            
            task_dict = task.model_dump(by_alias=True)
            task_dict['id'] = 0 
            
            processed_tasks.append(plan_schemas.Task(
                **task_dict, 
                start_date=task_start, 
                end_date=task_end,
                duration=f"{duration_days + 1} days"
            ))
            
        return processed_tasks

def get_plan_service() -> PlanService:
    return PlanService(llm_service=LLMService())