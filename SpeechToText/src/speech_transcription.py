import os
from typing import BinaryIO

from faster_whisper import WhisperModel


class TransctiptionModel:
    def __init__(self):
        os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
        self.model = WhisperModel("tiny.en", device="cpu", compute_type="int8")

    def transcribe(self, audio: BinaryIO) -> str:
        segments, info = self.model.transcribe(audio=audio, temperature=0)
        segments = list(segments)
        transcription = " ".join([segment.text for segment in segments]).strip()
        return transcription