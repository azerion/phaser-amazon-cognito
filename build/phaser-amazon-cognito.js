/*!
 * phaser-amazon-cognito - version 0.0.1 
 * A Phaser plugin that adds User Login/Sync support trough Amazon Cognito Identity/Syn
 *
 * OrangeGames
 * Build at 02-12-2016
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
            function Cognito(game, pluginManager) {
                _super.call(this, game, pluginManager);
                Object.defineProperty(game, 'ads', {
                    value: this
                });
            }
            return Cognito;
        }(Phaser.Plugin));
        Plugins.Cognito = Cognito;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-amazon-cognito.js.map