from logging import disable
from typing import Annotated

import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, status, Cookie

from constants import JWT_ALGORITHM, JWT_SECRET
from structure import User
from mongodb_parser.authentication import  get_hashed_password, get_support_status

async def get_current_user(token: Annotated[str | None, Cookie()] = None) -> User:
    """
    Returns the information about current user
    :param token: JWT token
    :return:
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    return User(username=username, support=get_support_status(username))

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

