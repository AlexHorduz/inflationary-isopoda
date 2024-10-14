from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str

class IntentResponse(BaseModel):
    intent: str
    score: float