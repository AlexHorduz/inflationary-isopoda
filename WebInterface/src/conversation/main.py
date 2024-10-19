from lib2to3.fixes.fix_input import context
from pyexpat.errors import messages

from fastapi import APIRouter, Depends, HTTPException, Request, Cookie
from fastapi.templating import Jinja2Templates
from typing import Annotated

from authentication import get_current_active_user
from mongodb_parser.conversations import Conversations
from structure import User

templates = Jinja2Templates(directory="templates")


conversation_router = APIRouter(
    prefix="/conversation",
    tags=["conversations"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}},
)


@conversation_router.get("/")
async def client_form(request: Request, current_user: Annotated[User, Depends(get_current_active_user)]):
    conv = Conversations(current_user)
    print(conv.conversations)
    return templates.TemplateResponse(
        request=request, name="client_form.html", context={
            "conversations": conv.conversations
        }
    )