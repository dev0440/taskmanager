export class Exception extends Error {
  constructor(
    public reason: string,
    public message: string,
  ) {
    super();
  }
}
