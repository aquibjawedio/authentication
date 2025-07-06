class ApiError extends Error {
  constructor(
    statusCode,
    message = "Internal Server Error",
    data = null,
    error = null,
    stack = ""
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      error: this.error,
    };
  }
}

export { ApiError };
