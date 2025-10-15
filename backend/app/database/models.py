from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import uuid
import enum

Base = declarative_base()

task_dependencies = Table('task_dependencies', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id'), primary_key=True),
    Column('depends_on_id', Integer, ForeignKey('tasks.id'), primary_key=True)
)

class PriorityEnum(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Plan(Base):
    __tablename__ = "plans"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    goal = Column(String, nullable=False)
    deadline = Column(DateTime, nullable=False)
    total_tasks = Column(Integer)
    estimated_hours = Column(Integer)
    insights = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    tasks = relationship("Task", back_populates="plan", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    temp_id = Column(String, nullable=False, index=True)
    plan_id = Column(String, ForeignKey("plans.id"))
    name = Column(String, nullable=False)
    phase = Column(String)
    priority = Column(Enum(PriorityEnum))
    estimated_hours = Column(Integer)
    duration = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    
    tasks_this_depends_on = relationship(
        "Task", secondary=task_dependencies,
        primaryjoin=id == task_dependencies.c.task_id,
        secondaryjoin=id == task_dependencies.c.depends_on_id,
        back_populates="dependent_tasks"
    )
    dependent_tasks = relationship(
        "Task", secondary=task_dependencies,
        primaryjoin=id == task_dependencies.c.depends_on_id,
        secondaryjoin=id == task_dependencies.c.task_id,
        back_populates="tasks_this_depends_on"
    )
    plan = relationship("Plan", back_populates="tasks")