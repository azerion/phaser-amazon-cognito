/*!
 * phaser-amazon-cognito - version 0.0.6 
 * A Phaser plugin that adds User Login/Sync support trough Amazon Cognito Identity/Syn
 *
 * OrangeGames
 * Build at 03-01-2017
 * Released under MIT License 
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fabrique;
(function (Fabrique) {
    var Plugins;
    (function (Plugins) {
        var Cognito = (function (_super) {
            __extends(Cognito, _super);
            function Cognito(game, pluginManager, region, IdentityPoolId) {
                _super.call(this, game, pluginManager);
                Object.defineProperty(game, 'cognito', {
                    value: this
                });
            }
            /**
             * Setting userPool configuration.
             */
            Cognito.prototype.setPoolInfo = function (userPoolId, clientId) {
                this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
                    UserPoolId: userPoolId,
                    ClientId: clientId
                });
            };
            /**
             * Register a new user to the userPool.
             * @param attributes Optional attributes, saved with the user.
             * @returns {Promise<T>|Promise} The user or an error in a promise
             */
            Cognito.prototype.register = function (username, password, email, attributes) {
                var _this = this;
                if (attributes === void 0) { attributes = null; }
                var attr = [];
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
                if (attributes !== null && attributes.length > 0) {
                    for (var i = 0; i < attributes.length; i++) {
                        attr.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                            Name: attributes[i].name,
                            Value: attributes[i].value
                        }));
                    }
                }
                return new Promise(function (resolve, reject) {
                    _this.userPool.signUp(username, password, attr, null, function (error, res) {
                        if (error !== null) {
                            reject(error);
                        }
                        else {
                            _this.currentUser = res.user;
                            resolve(res.user);
                        }
                    });
                });
            };
            /**
             * Confirm the user, allowing him to login.
             * @param confirmationCode Code sent to users email.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            Cognito.prototype.confirmRegistration = function (confirmationCode) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.confirmRegistration(confirmationCode, true, function (error, res) {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                resolve(null);
                            }
                        });
                    }
                });
            };
            /**
             * Resends the confirmation email to the user.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            Cognito.prototype.resendConfirmation = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.resendConfirmationCode(function (error, result) {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                resolve(null);
                            }
                        });
                    }
                });
            };
            /**
             * Logs in a user with given credentials.
             * @returns {Promise<T>|Promise} An object with the user and sessionToken or an error in a promise
             */
            Cognito.prototype.login = function (username, password) {
                var _this = this;
                var authentication = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
                    Username: username,
                    Password: password
                });
                this.setUser(username);
                return new Promise(function (resolve, reject) {
                    _this.currentUser.authenticateUser(authentication, {
                        onSuccess: function (res) {
                            resolve({
                                user: _this.currentUser,
                                sessionToken: res.getAccessToken().getJwtToken()
                            });
                        },
                        onFailure: function (error) {
                            reject(error);
                        }
                    });
                });
            };
            /**
             * Logs the user out.
             */
            Cognito.prototype.logout = function () {
                this.currentUser.signOut();
            };
            /**
             * Sends a reset password code to the user's email.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            Cognito.prototype.resetPassword = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.forgotPassword({
                            onSuccess: function (res) {
                                resolve();
                            },
                            onFailure: function (error) {
                                reject(error);
                            }
                        });
                    }
                });
            };
            /**
             * Changes the users password after reset.
             * @param code The code given in the reset email.
             * @param newPassword The new password to be used.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            Cognito.prototype.confirmResetPassword = function (code, newPassword) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.confirmPassword(code, newPassword, {
                            onSuccess: function (res) {
                                resolve();
                            },
                            onFailure: function (error) {
                                reject(error);
                            }
                        });
                    }
                });
            };
            /**
             * Changes the password for the current user. The user has to be logged in.
             * @param oldPassword The current password for the user.
             * @param newPassword The new password for the user.
             * @returns {Promise<T>|Promise} Returns null or an error in a promise
             */
            Cognito.prototype.changePassword = function (oldPassword, newPassword) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.changePassword(oldPassword, newPassword, function (error, result) {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                resolve(null);
                            }
                        });
                    }
                });
            };
            /**
             * Checks if the current user has a valid session with the server.
             * @returns {Promise<T>|Promise} The session of the user or an error in a promise
             */
            Cognito.prototype.validateSession = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.getSession(function (error, session) {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                if (session.isValid()) {
                                    resolve(session);
                                }
                                else {
                                    reject(null);
                                }
                            }
                        });
                    }
                });
            };
            /**
             * Sets the current user to use for all commands except login and register.
             */
            Cognito.prototype.setUser = function (username) {
                this.currentUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
                    Username: username,
                    Pool: this.userPool
                });
            };
            /**
             * Loads the user and session from localStorage, saved on the device.
             */
            Cognito.prototype.loadStorageUser = function () {
                this.currentUser = this.userPool.getCurrentUser();
            };
            return Cognito;
        }(Phaser.Plugin));
        Plugins.Cognito = Cognito;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-amazon-cognito.js.map