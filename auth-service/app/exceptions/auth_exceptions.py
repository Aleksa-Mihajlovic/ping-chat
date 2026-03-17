class AlreadyExistsError(Exception):
    def __init__(self, message: str):
        self.message = message

class InvalidCredentialsError(Exception):
    def __init__(self, message: str):
        self.message = message