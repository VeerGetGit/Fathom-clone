from typing import Literal, Optional

from pydantic import BaseModel, Field

Template = Literal["general", "sales", "action_items"]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class SummaryRequest(BaseModel):
    template: Template = "general"
    custom_prompt: Optional[str] = Field(default=None, max_length=1000)


class ActionItemCreate(BaseModel):
    description: str = Field(min_length=1, max_length=500)


class ActionItemUpdate(BaseModel):
    is_completed: bool
