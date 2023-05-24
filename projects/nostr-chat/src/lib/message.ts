export interface Message {
    id: string;
    content: string;
    fromPk: string;
    toPk: string;
    createdAt: number;
}