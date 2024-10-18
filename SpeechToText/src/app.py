from io import BytesIO

from fastapi import FastAPI, UploadFile, File
from fastapi import FastAPI

from data_models import TranscriptionResponse
from speech_transcription import TransctiptionModel

app = FastAPI()
model = TransctiptionModel()

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(audio: UploadFile = File(...)):
    content = await audio.read()
    audio_stream = BytesIO(content) 
    transcription = model.transcribe(audio_stream)
    return TranscriptionResponse(transcription=transcription)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
