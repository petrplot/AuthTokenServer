export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static unAuthorize() {
    return new ApiError(401, 'Ошибка авторизации');
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}
