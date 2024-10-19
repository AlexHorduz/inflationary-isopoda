import os

from dotenv import load_dotenv
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

load_dotenv()

CSP = "base-uri 'self'; default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self'; media-src 'self'; font-src 'self' https://fonts.googleapis.com; connect-src 'self'; worker-src 'self'; frame-src 'none'; form-action 'self';"

JWT_SECRET = os.getenv("JWT_SECRET")
MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
IP_SERVER = os.getenv("IP_SERVER")

JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/token")
