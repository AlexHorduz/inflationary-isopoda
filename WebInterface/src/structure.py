from datetime import datetime

from pydantic import BaseModel, Field, AliasChoices
from typing import List



class User(BaseModel):
    username: str
    support: bool
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

class Messages(BaseModel):
    from_: int
    date: str | datetime
    is_transcribed_from_audio: bool
    text: str


class Conversation(BaseModel):
    id: str
    client_id: str
    detected_topics: str | None = None
    is_detected_correctly: bool
    possible_list_of_topics: str | None = None
    support_id: str | None = None
    messages: List[Messages]

class Client(BaseModel):
    id: str
    client_since: str | datetime
    name: str

