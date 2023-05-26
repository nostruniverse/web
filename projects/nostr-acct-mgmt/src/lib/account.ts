
export interface Account {
    pubk: string;
    prvk?: string;
    

    // NIP05
    id?: string;
    name?: string;
    avatar?: string;
    createdAt: number;
}
