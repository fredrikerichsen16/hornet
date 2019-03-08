"use strict";
/**
 * Basically import the classes user will need in user defined controllers so they can just do:
 * import {controller, hornet, types} from 'hornet/controller';
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
exports.controller = controller_1.controller;
const hornet_1 = require("../main/hornet");
exports.hornet = hornet_1.hornet;
const types = __importStar(require("../main/types"));
exports.types = types;
