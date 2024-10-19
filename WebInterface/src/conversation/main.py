from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates

from authentication import get_current_active_user

templates = Jinja2Templates(directory="templates")


conversation_router = APIRouter(
    prefix="/conversation",
    tags=["conversations"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}},
)


@conversation_router.get("/")
async def client_form(request: Request):
    return templates.TemplateResponse(
        request=request, name="client_form.html"
    )