declare module Fabrique {
    module Plugins {
        interface ICognitoGame extends Phaser.Game {
            cognito: Fabrique.Plugins.Cognito;
        }
        class Cognito extends Phaser.Plugin {
            constructor(game: ICognitoGame, pluginManager: Phaser.PluginManager, region: string, IdentityPoolId: string);
        }
    }
}
