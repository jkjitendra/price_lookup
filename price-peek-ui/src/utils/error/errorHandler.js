import { ERROR_CODES, ERROR_MESSAGES } from './errorMessage.const';

export const getErrorMessage = (error) => {
    
    if (!error.message) {
        console.warn("No response received from server:", error);
        return ERROR_MESSAGES[ERROR_CODES.NO_SERVER_RESPONSE];
    }

    const { status, data } = error.response || {};
    const emailErrors = data?.errors?.email || [];
    const passwordErrors = data?.errors?.password || [];

    switch (status) {
        case 400:
            return ERROR_MESSAGES[ERROR_CODES.BAD_REQUEST];
        case 401:
            if (data?.message === 'Invalid email or password') {
                return ERROR_MESSAGES[ERROR_CODES.INVALID_EMAIL_PASSWORD];
            }
            return ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED];
        case 403:
            if (data?.message === 'Email is not verified') {
                return ERROR_MESSAGES[ERROR_CODES.EMAIL_NOT_VERIFIED];
            }
            return ERROR_MESSAGES[ERROR_CODES.FORBIDDEN];
        case 404:
            return ERROR_MESSAGES[ERROR_CODES.NOT_FOUND];
        case 409:
            return ERROR_MESSAGES[ERROR_CODES.EMAIL_ALREADY_IN_USE];
        case 422:
            if (emailErrors.includes('The email has already been taken.')) {
                return ERROR_MESSAGES[ERROR_CODES.EMAIL_ALREADY_IN_USE];
            } 
            if (passwordErrors.includes('The password must be at least 6 characters.')) {
                return ERROR_MESSAGES[ERROR_CODES.INVALID_EMAIL_PASSWORD];
            }            
            return ERROR_MESSAGES[ERROR_CODES.UNPROCESSABLE_ENTITY];
        case 500:
            return ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR];
        default:
            console.warn("Unhandled status code:", status, "Response data:", data);
            return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    }
};