from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

load_dotenv()

CSP = "base-uri 'self'; default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self'; media-src 'self'; font-src 'self' https://fonts.googleapis.com; connect-src 'self'; worker-src 'self'; frame-src 'none'; form-action 'self';"

JWT_Secret = os.getenv("JWT_SECRET")
JWT_Algorithm = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "support": False,
    },
    "alicedoe": {
        "username": "johndoe",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "support": True,
    }
}

