export class ApiError extends Error {
  constructor(message: string, public status?: number | any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
