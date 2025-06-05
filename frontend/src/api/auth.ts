import { customInstance } from '../utils/customAxios';

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    fullName: string;
    password: string;
};

export type TokenResponse = {
    accessToken: string;
    tokenType: string; // bearer
};

export type UserResponse = {
    id: string;
    email: string;
    fullName: string;
};


export const login = (data: LoginRequest): Promise<TokenResponse> => {
    return customInstance<TokenResponse>({
        method: 'POST',
        url: '/api/auth/login',
        data,
    });
};

export const register = (data: RegisterRequest): Promise<UserResponse> => {
    return customInstance<UserResponse>({
        method: 'POST',
        url: '/api/auth/register',
        data,
    });
};


export const getUser = async (): Promise<UserResponse> => {
    return customInstance<UserResponse>({
        method: 'GET',
        url: `/api/user`,
    });
};
