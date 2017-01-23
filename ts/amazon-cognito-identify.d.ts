declare module 'AWSCognito.CognitoIdentityServiceProvider' {
    export = AWSCognito.CognitoIdentityServiceProvider;
}

declare module AWSCognito.CognitoIdentityServiceProvider {

    export interface IAuthenticationDetailsData {
        Username: string;
        Password: string;
    }

    export class AuthenticationDetails {
        constructor(data: IAuthenticationDetailsData);

        public getUsername(): string;
        public getPassword(): string;
        public getValidationData(): any[];
    }

    export interface ICognitoUserData {
        Username: string;
        Pool: CognitoUserPool;
    }

    export class CognitoUser {
        constructor(data: ICognitoUserData);

        public getSignInUserSession(): CognitoUserSession;
        public getUsername(): string;

        public getAuthenticationFlowType(): string;
        public setAuthenticationFlowType(authenticationFlowType: string): string;

        public getSession(callback: Function): void;
        public authenticateUser(params: any, callbacks: any): void;
        public confirmRegistration(code: string, somethingWhichIsTrue: boolean, callback: (err: any, result: any) => void): void;
        public resendConfirmationCode(callback: Function): void;
        public forgotPassword(callback: any): void;
        public confirmPassword(code: string, newPassword: string, callback: any): void;
        public changePassword(oldPassword: string, newPassword: string, callback: Function): void;
        public signOut(): void;
    }

    export interface ICognitoUserAttributeData {
        Name: string;
        Value: string;
    }

    export class CognitoUserAttribute {
        constructor(data: ICognitoUserAttributeData);

        public getValue(): string;
        public setValue(value: string): CognitoUserAttribute;
        public getName(): string;
        public setName(name: string): CognitoUserAttribute;
        public toString(): string;
        public toJSON(): Object;
    }

    export interface ICognitoUserPoolData {
        UserPoolId: string;
        ClientId: string;
        Paranoia?: number;
    }

    export class CognitoUserPool {
        constructor(data: ICognitoUserPoolData);

        public getUserPoolId(): string;
        public getClientId(): string;
        public getParanoia(): number

        public setParanoia(paranoia: number): void;

        public signUp(username: string, password: string, userAttributes: any[], validationData: any[], callback: (err: any, result: any) => void): void;

        public getCurrentUser(): CognitoUser;
    }

    export interface ICognitoUserSessionData {
        IdToken: string;
        AccessToken: string;
        RefreshToken?: string;
    }

    export class CognitoUserSession {
        constructor(data: ICognitoUserSessionData);

        public getIdToken(): CognitoIdToken;
        public getRefreshToken(): CognitoRefreshToken;
        public getAccessToken(): CognitoAccessToken;
        public isValid(): boolean;
    }

    export class CognitoAccessToken {
        constructor(accessToken: string);

        public getJwtToken(): string;
        public getExpiration(): number;
    }

    export class CognitoIdToken {
        constructor(idToken: string);

        public getJwtToken(): string;
        public getExpiration(): number;
    }

    export class CognitoRefreshToken {
        constructor(refreshToken: string);

        public getJwtToken(): string;
        public getExpiration(): number;
    }
}
