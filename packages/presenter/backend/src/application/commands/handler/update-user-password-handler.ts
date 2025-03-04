import type { ICommandHandler } from "@ai-ctx/core";
import  { UpdateUserPasswordCommand } from "../definition/update-user-password";
import { TYPES } from "../../../types";
import { inject } from "inversify";
import type { UserRepository } from "../../../infrastructure/repository/user-repository";

export class UpdateUserPasswordCommandHandler implements ICommandHandler<UpdateUserPasswordCommand> {
    cmdToHandler = UpdateUserPasswordCommand.name;

    constructor(
        @inject(TYPES.UserRepository) private readonly _repo: UserRepository
    ) {}

    async handle(cmd: UpdateUserPasswordCommand): Promise<void> {
        const user = await this._repo.findUserByEmail(cmd.email);
        // if (!user) {
        //     throw new Error(`User with email ${cmd.email} not found`);
        // }
        user.updatePassword(cmd.password);
        await this._repo.save(user, cmd.originalVersion);
    }
}