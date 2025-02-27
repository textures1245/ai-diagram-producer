import { Event } from '@ai-ctx/core';

export class UserPasswordUpdated extends Event {
    type = UserPasswordUpdated.name;
    aggregateName: string = "user";
    
    constructor(
        public guid: string,
        public password: string,
        public updated_at: Date,
    ) {
        super(guid);
    }
}