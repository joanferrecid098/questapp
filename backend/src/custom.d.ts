import { User } from "./interfaces/models";

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}
