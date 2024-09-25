class APIException(Exception):
    def __init__(self, status_code, message=None):
        super().__init__(message)
        self.status_code = status_code