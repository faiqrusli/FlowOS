export class ReflectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReflectionsError";
  }
}
