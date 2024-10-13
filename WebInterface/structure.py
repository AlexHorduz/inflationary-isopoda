from pydantic import BaseModel


class User(BaseModel):
    username: str
    support: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str

