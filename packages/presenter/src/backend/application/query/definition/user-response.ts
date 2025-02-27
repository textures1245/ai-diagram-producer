export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly password: string,
    public readonly email: string
  ) {}
}
