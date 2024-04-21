
export interface IUserResponse {
    userName?: string;
    eMail?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISanitizedUser {
    userName?: string;
    eMail?: string;
    password?: string;
    userPhoto?: string;
}