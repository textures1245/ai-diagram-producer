export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password?: string,
  ) {}
}
