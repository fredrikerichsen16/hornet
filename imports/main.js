"use strict";
/**
 * Basically import the classes user will need in app.ts so they can just do:
 * import {hornet, command} from 'hornet/main';
 */
Object.defineProperty(exports, "__esModule", { value: true });
const hornet_1 = require("../main/hornet");
exports.hornet = hornet_1.hornet;
const Command_1 = require("../command/Command");
exports.command = Command_1.Command;
