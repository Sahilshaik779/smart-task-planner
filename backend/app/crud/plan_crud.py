from sqlalchemy.orm import Session
from ..database import models
from ..schemas import plan_schemas

def create_plan_with_tasks(db: Session, plan_data: plan_schemas.Plan) -> models.Plan:
    db_plan = models.Plan(
        id=plan_data.id, goal=plan_data.goal, deadline=plan_data.deadline,
        total_tasks=plan_data.total_tasks, estimated_hours=plan_data.estimated_hours,
        insights=plan_data.insights,
    )
    db.add(db_plan)
    db.flush()

    task_map = {}
    for task_data in plan_data.tasks:
        db_task = models.Task(
            plan_id=db_plan.id, temp_id=task_data.temp_id, name=task_data.name,
            phase=task_data.phase, priority=task_data.priority, estimated_hours=task_data.estimated_hours,
            start_date=task_data.start_date, end_date=task_data.end_date, duration=task_data.duration
        )
        task_map[task_data.temp_id] = db_task
        db.add(db_task)
    
    db.flush()

    for task_data in plan_data.tasks:
        db_task = task_map[task_data.temp_id]
        for dep_temp_id in task_data.dependencies:
            dependency_task = task_map.get(dep_temp_id)
            if dependency_task:
                db_task.tasks_this_depends_on.append(dependency_task)

    db.commit()
    db.refresh(db_plan)
    return db_plan