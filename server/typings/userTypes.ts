
export interface IUserResponse {
    userName?: string;
    eMail?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;    
}
export interface ISanitizedUser {
    userName?: string;
    eMail?: string;
    password?: string;
    userPhoto?: string;
}