import { Command } from "@ai-ctx/core";

export class CreateUserCommand extends Command {
    public email: string;
    public password: string;
    
    constructor(email: string, password: string, guid?: string) {
        super(guid);
        this.email = email;
        this.password = password;
    }
}