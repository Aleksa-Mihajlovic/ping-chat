from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.exceptions.auth_exceptions import AlreadyExistsError, InvalidCredentialsError, EntityNotFoundError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        errors = {}
        for error in exc.errors():
            field = error["loc"][-1]
            errors[field] = error["msg"]
        return JSONResponse(status_code=422, content={"errors": errors})

    @app.exception_handler(AlreadyExistsError)
    async def already_exists_handler(request, exc):
        return JSONResponse(status_code=400, content={"message": exc.message})

    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(request, exc):
        return JSONResponse(status_code=401, content={"message": exc.message})

    @app.exception_handler(EntityNotFoundError)
    async def entity_not_found_handler(request, exc):
        return JSONResponse(status_code=404, content={"message": exc.message})
