/// <reference path="../ts/definitions.d.ts" />
/// <reference types="es6-promise" />
declare module Fabrique {
    module Plugins {
        interface ICognitoGame extends Phaser.Game {
            cognito: Fabrique.Plugins.Cognito;
        }
        class Cognito extends Phaser.Plugin {
            private userPool;
            private currentUser;
            constructor(game: ICognitoGame, pluginManager: Phaser.PluginManager, region: string, IdentityPoolId: string);
            setPoolInfo(userPoolId: string, clientId: string): void;
            register(username: string, password: string, email: string, attributes?: {
                name: string;
                value: string;
            }[]): Promise<any>;
            confirmRegistration(verificationCode: string): Promise<void>;
            resendConfirmation(): Promise<void>;
            login(username: string, password: string): Promise<any>;
            logout(): void;
            validateSession(): Promise<any>;
            setUser(username: string): void;
            loadStorageUser(): void;
        }
    }
}
