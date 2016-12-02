module Fabrique {
    export module Plugins {
        export interface ICognitoGame extends Phaser.Game {
            cognito: Fabrique.Plugins.Cognito;
        }

        export class Cognito extends Phaser.Plugin {
            constructor(game: ICognitoGame, pluginManager: Phaser.PluginManager) {
                super(game, pluginManager);

                Object.defineProperty(game, 'ads', {
                    value: this
                });
            }
        }
    }
}
