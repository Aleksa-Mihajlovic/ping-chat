import httpx
from fastapi import APIRouter, Request, Response, HTTPException
from app.config import settings

router = APIRouter()

async def get_http_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=30.0)


async def forward_request(
        request: Request,
        target_url: str
        ) -> Response:
    
    async with httpx.AsyncClient(timeout=30.0) as client:

        headers = {
            key: value
            for key, value in request.headers.items()
            if key.lower() != "host"
        }

        body = await request.body()

        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params
            )
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503,
                detail="Service unavailable could not connect to upstream"
            )
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="Service timeout upstream took too long to respond"
            )
        
        response_headers = {
            key: value
            for key, value in response.headers.items()
            if key.lower() != "transfer-encoding"
        }

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=response_headers,
            media_type=response.headers.get("content-type"),
        )


@router.api_route(
    "/auth/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
)
async def auth_proxy(path: str, request: Request):
    """
    /auth/login        → http://auth-service:8001/auth/login
    /auth/register     → http://auth-service:8001/auth/register
    /auth/me           → http://auth-service:8001/auth/me
    """
    target_url = f"{settings.AUTH_SERVICE_URL}/auth/{path}"
    return await forward_request(request, target_url)


@router.api_route(
    "/chat/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"]
)
async def chat_proxy(path: str, request: Request):
    """
    /chat/rooms           → http://chat-service:8002/chat/rooms
    /chat/rooms/42/messages → http://chat-service:8002/chat/rooms/42/messages
    """
    target_url = f"{settings.CHAT_SERVICE_URL}/chat/{path}"
    return await forward_request(request, target_url)