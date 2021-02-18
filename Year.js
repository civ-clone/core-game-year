"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _cache, _ruleRegistry, _turn;
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Year = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("./Rules/Year");
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class Year extends DataObject_1.default {
    constructor(turn = Turn_1.instance, ruleRegistry = RuleRegistry_1.instance) {
        super();
        _cache.set(this, new Map());
        _ruleRegistry.set(this, void 0);
        _turn.set(this, void 0);
        __classPrivateFieldSet(this, _ruleRegistry, ruleRegistry);
        __classPrivateFieldSet(this, _turn, turn);
        this.addKey('value');
    }
    value(turn = __classPrivateFieldGet(this, _turn).value()) {
        if (!__classPrivateFieldGet(this, _cache).has(turn)) {
            const [year] = __classPrivateFieldGet(this, _ruleRegistry).process(Year_1.Year, turn);
            __classPrivateFieldGet(this, _cache).set(turn, year);
        }
        const value = __classPrivateFieldGet(this, _cache).get(turn);
        if (typeof value !== 'number') {
            throw new TypeError('Invalid cache result.');
        }
        return value;
    }
}
exports.Year = Year;
_cache = new WeakMap(), _ruleRegistry = new WeakMap(), _turn = new WeakMap();
exports.instance = new Year();
exports.default = Year;
//# sourceMappingURL=Year.js.map