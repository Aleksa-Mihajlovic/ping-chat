from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError
from app.config import settings

PUBLIC_ROUTES = [
    "/health",
    "/auth/health",
    "/chat/health",
    "/auth/login",
    "/auth/refresh",
    "/docs",
    "/openapi.json",
]


class AuthMiddleware(BaseHTTPMiddleware):


    async def dispatch(self, request: Request, call_next):

        is_public = any(request.url.path.startswith(route)
                        for route in PUBLIC_ROUTES)
        
        if is_public:
            return await call_next(request)
        
        token = request.cookies.get("access_token")

        if not token:
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})
        

        # Check redis blacklist
        redis = request.app.state.redis

        if redis:
            try:
                unverified = jwt.decode(
                    token,
                    settings.JWT_SECRET,
                    algorithms=[settings.JWT_ALGORITHM],
                    options={"verify_exp":False}
                )

                jti = unverified.get("jti")

                if jti:
                    is_blacklisted = await redis.get(f"blacklist:{jti}")
                    if is_blacklisted:
                        return JSONResponse(status_code=401, content={"detail": "Token has been revoked please login again"})
                    
            except JWTError:
                pass
        
        #validate Jwt token
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
        except JWTError as e:
            return JSONResponse(status_code=401, content={"detail": f"Invalid or expired token: {str(e)}"})
        
        
        request.state.user_id = payload.get("sub")
        request.state.email = payload.get("email")

        request.headers.__dict__["_list"].extend([
            (b"x-user-id", payload.get("sub", "").encode()),
            (b"x-user-email", payload.get("email", "").encode()),
        ])

        return await call_next(request)