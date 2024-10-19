from fastapi import HTTPException

from . import authentication_collection

def get_hashed_password(username: str) -> str:
    passwords = list(authentication_collection.find({"username": username}))
    if passwords:
        return passwords[0]['hashed_password']
    raise HTTPException(status_code=400, detail="Wrong Username or Password")


def get_support_status(username: str) -> bool:
    passwords = list(authentication_collection.find({"username": username}))
    if passwords:
        return passwords[0]['support']
    raise HTTPException(status_code=400, detail="Wrong Username or Password")