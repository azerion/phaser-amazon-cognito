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
            /**
             * Setting userPool configuration.
             */
            setPoolInfo(userPoolId: string, clientId: string): void;
            /**
             * Register a new user to the userPool.
             * @param attributes Optional attributes, saved with the user.
             * @returns {Promise<T>|Promise} The user or an error in a promise
             */
            register(username: string, password: string, email: string, attributes?: {
                name: string;
                value: string;
            }[]): Promise<any>;
            /**
             * Confirm the user, allowing him to login.
             * @param confirmationCode Code sent to users email.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            confirmRegistration(confirmationCode: string): Promise<void>;
            /**
             * Resends the confirmation email to the user.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            resendConfirmation(): Promise<void>;
            /**
             * Logs in a user with given credentials.
             * @returns {Promise<T>|Promise} An object with the user and sessionToken or an error in a promise
             */
            login(username: string, password: string): Promise<any>;
            /**
             * Logs the user out.
             */
            logout(): void;
            /**
             * Checks if the current user has a valid session with the server.
             * @returns {Promise<T>|Promise} The session of the user or an error in a promise
             */
            validateSession(): Promise<any>;
            /**
             * Sets the current user to use for all commands except login and register.
             */
            setUser(username: string): void;
            /**
             * Loads the user and session from localStorage, saved on the device.
             */
            loadStorageUser(): void;
        }
    }
}
