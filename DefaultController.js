"use strict";
/**
 * Default Controller for default commands which the user doesn't have to implement
 * himself. Commands like 'back'.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
var DefaultController = /** @class */ (function (_super) {
    __extends(DefaultController, _super);
    function DefaultController(hornet) {
        var _this = _super.call(this, hornet) || this;
        /**
         * Name of controller (could take name of class, but if code is minified that doesn't work)
         */
        _this.name = 'DEFAULT';
        return _this;
    }
    DefaultController.prototype.back = function () {
        return 'back';
    };
    return DefaultController;
}(controller_1.controller));
exports.DefaultController = DefaultController;
