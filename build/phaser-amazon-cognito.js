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
            return Cognito;
        }(Phaser.Plugin));
        Plugins.Cognito = Cognito;
    })(Plugins = Fabrique.Plugins || (Fabrique.Plugins = {}));
})(Fabrique || (Fabrique = {}));
//# sourceMappingURL=phaser-amazon-cognito.js.map