export default interface AuthUser {
    authenticated: boolean;
    id: number | null;
    username: string | null;
}