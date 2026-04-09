import type { AccountRole } from "./enum/account-role";

export interface Account {
    id: string;
    status: boolean;
    role: AccountRole;
    username: string;
    createdDate: string;
    updatedDate: string;
}
