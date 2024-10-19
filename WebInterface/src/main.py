from encodings.rot_13 import rot13
from typing import Annotated, List

from fastapi import FastAPI, Response, Request, HTTPException, status, Depends, APIRouter, Form, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

import constants
from sup import authenticate_user, create_access_token, timedelta
from structure import Token, User
from authentication import get_current_active_user
from conversation.main import conversation_router

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.include_router(conversation_router)

@app.middleware("http")
async def add_csp_header(request: Request, call_next) -> Response:
    """
    Adds Content Security Policy header to every response.
    :param request: Request to the server
    :type request: Request
    :param call_next: The function that processes the request
    :return: Response with CSP header

    """
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = constants.CSP
    return response


@app.get("/")
def root(request: Request) -> templates.TemplateResponse:
    return templates.TemplateResponse(
        request=request, name="client_form.html"
    )

@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse(
        request=request, name="login.html"
    )


@app.post("/login")
async def login_post(request: Request, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token_expires = timedelta(minutes=constants.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    response = RedirectResponse("/conversation/", status_code=303)
    response.set_cookie(key="token", value=access_token)
    return response

@app.post("/send_message")
async def get_message(request: Request, message: Annotated[str, Form()], thread_id: Annotated[int, Form()]):
    pass


clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for client in clients:
                if client != websocket:
                    await client.send_text(data)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        clients.remove(websocket)