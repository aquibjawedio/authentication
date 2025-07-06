class ApiResponse {
  constructor(statusCode, message = "SUCCESS", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}

export { ApiResponse };
