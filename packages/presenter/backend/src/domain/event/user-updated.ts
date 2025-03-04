export class UserUpdated extends Event {
    type = UserUpdated.name;
    aggregateName: string = "user";
    
    constructor(
        public guid: string,
        public email: string,
        public password: string,
        public updated_at: Date,
    ) {
        super(guid);
    }
}