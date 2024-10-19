from fastapi import FastAPI

from data_models import QuestionRequest, IntentResponse
from intent_classifier import IntentClassifier


app = FastAPI()
model = IntentClassifier()

@app.post("/getIntent", response_model=IntentResponse)
async def get_intent(request: QuestionRequest):
    prediction = model.get_intent(request.question)[0]
    intent, score = (prediction["label"], prediction["score"])
    return IntentResponse(intent=intent, score=score)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
