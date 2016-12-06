var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='./definitions.d.ts'/>
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
            Cognito.prototype.setPoolInfo = function (userPoolId, clientId) {
                this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool({
                    UserPoolId: userPoolId,
                    ClientId: clientId
                });
            };
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
                for (var i = 0; i < attributes.length; i++) {
                    attr.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                        Name: attributes[i].name,
                        Value: attributes[i].value
                    }));
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
            Cognito.prototype.confirmRegistration = function (verificationCode) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (!_this.currentUser) {
                        reject('User was not set!');
                    }
                    else {
                        _this.currentUser.confirmRegistration(verificationCode, true, function (error, res) {
                            if (error !== null) {
                                reject(error);
                            }
                            else {
                                resolve(res);
                            }
                        });
                    }
                });
            };
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
                                resolve(result);
                            }
                        });
                    }
                });
            };
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
            Cognito.prototype.logout = function () {
                this.currentUser.signOut();
            };
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
            Cognito.prototype.setUser = function (username) {
                this.currentUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
                    Username: username,
                    Pool: this.userPool
                });
            };
            Cognito.prototype.loadStorageUser = function () {
                this.currentUser = this.userPool.getCurrentUser();
            };
            return Cognito;
        }(Phaser.Plugin));
        Plugins.Cognito = Cognito;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-amazon-cognito.js.map