import { FieldsErrors } from "../validators";

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? "Entity not be loaded");
    this.name = "LoadEntityError";
  }
}
