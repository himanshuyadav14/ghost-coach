export class ChatError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = "ChatError";
  }
}
