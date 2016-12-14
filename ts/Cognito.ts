module Fabrique {
    export module Plugins {
        export interface ICognitoGame extends Phaser.Game {
            cognito: Fabrique.Plugins.Cognito;
        }

        export class Cognito extends Phaser.Plugin {

            private userPool: AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool;
            private currentUser: AWSCognito.CognitoIdentityServiceProvider.CognitoUser;

            constructor(game: ICognitoGame, pluginManager: Phaser.PluginManager, region: string, IdentityPoolId: string) {
                super(game, pluginManager);

                Object.defineProperty(game, 'cognito', {
                    value: this
                });
            }

            /**
             * Setting userPool configuration.
             */
            public setPoolInfo(userPoolId: string, clientId: string): void {
                this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
                    UserPoolId : userPoolId,
                    ClientId : clientId
                });
            }

            /**
             * Register a new user to the userPool.
             * @param attributes Optional attributes, saved with the user.
             * @returns {Promise<T>|Promise} The user or an error in a promise
             */
            public register(username: string, password: string, email: string, attributes: {name: string, value: string}[] = null): Promise<any> {
                let attr: AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute[] = [];

                // Add required fields first
                attr.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                    Name: 'preferred_username',
                    Value: username
                }));
                attr.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                    Name: 'email',
                    Value: email
                }));

                // Add all others
                for (let i: number = 0; i < attributes.length; i++) {
                    attr.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                        Name: attributes[i].name,
                        Value: attributes[i].value
                    }));
                }

                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    this.userPool.signUp(username, password, attr, null, (error: any, res: any) => {
                        if (error !== null) {
                            reject(error);
                        } else {
                            this.currentUser = res.user;
                            resolve(res.user);
                        }
                    });
                });
            }

            /**
             * Confirm the user, allowing him to login.
             * @param confirmationCode Code sent to users email.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            public confirmRegistration(confirmationCode: string): Promise<void> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    if (!this.currentUser) {
                        reject('User was not set!');
                    } else {
                        this.currentUser.confirmRegistration(confirmationCode, true, (error: any, res: any) => {
                            if (error !== null) {
                                reject(error);
                            } else {
                                resolve(null);
                            }
                        });
                    }
                });
            }

            /**
             * Resends the confirmation email to the user.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            public resendConfirmation(): Promise<void> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    if (!this.currentUser) {
                        reject('User was not set!');
                    } else {
                        this.currentUser.resendConfirmationCode((error: any, result: any) => {
                            if (error !== null) {
                                reject(error);
                            } else {
                                resolve(null);
                            }
                        });
                    }
                });
            }

            /**
             * Logs in a user with given credentials.
             * @returns {Promise<T>|Promise} An object with the user and sessionToken or an error in a promise
             */
            public login(username: string, password: string): Promise<any> {
                let authentication: AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
                    Username: username,
                    Password: password
                });

                this.setUser(username);

                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    this.currentUser.authenticateUser(authentication, {
                        onSuccess: (res: any) => {
                            resolve({
                                user: this.currentUser,
                                sessionToken: res.getAccessToken().getJwtToken()
                            });
                        },
                        onFailure: (error: any) => {
                            reject(error);
                        }
                    });
                });
            }

            /**
             * Logs the user out.
             */
            public logout(): void {
                this.currentUser.signOut();
            }

            /**
             * Checks if the current user has a valid session with the server.
             * @returns {Promise<T>|Promise} The session of the user or an error in a promise
             */
            public validateSession(): Promise<any> {
                return new Promise((resolve: (value?: any | Thenable<any>) => void, reject: (error?: any) => void) => {
                    if (!this.currentUser) {
                        reject('User was not set!');
                    } else {
                        this.currentUser.getSession((error: any, session: any) => {
                            if (error !== null) {
                                reject(error);
                            } else {
                                if (session.isValid()) {
                                    resolve(session);
                                } else {
                                    reject(null);
                                }
                            }
                        });
                    }
                });
            }

            /**
             * Sets the current user to use for all commands except login and register.
             */
            public setUser(username: string): void {
                this.currentUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
                    Username: username,
                    Pool: this.userPool
                });
            }

            /**
             * Loads the user and session from localStorage, saved on the device.
             */
            public loadStorageUser(): void {
                this.currentUser = this.userPool.getCurrentUser();
            }
        }
    }
}
