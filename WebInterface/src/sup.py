from datetime import datetime, timedelta, timezone
from os import supports_fd

import jwt

from structure import UserInDB
from constants import JWT_SECRET, JWT_ALGORITHM, PWD_CONTEXT
from mongodb_parser.authentication import get_hashed_password, get_support_status

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_password(username, plain_password):
    return PWD_CONTEXT.verify(plain_password, get_hashed_password(username))

def get_password_hash(password):
    return PWD_CONTEXT.hash(password)

def authenticate_user(username: str, password: str):
    if not verify_password(username, password):
        return False
    return UserInDB(hashed_password=get_hashed_password(username), username=username, support=get_support_status(username))

