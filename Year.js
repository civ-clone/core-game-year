"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Year_cache, _Year_ruleRegistry, _Year_turn;
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Year = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("./Rules/Year");
class Year extends DataObject_1.DataObject {
    constructor(turn = Turn_1.instance, ruleRegistry = RuleRegistry_1.instance) {
        super();
        _Year_cache.set(this, new Map());
        _Year_ruleRegistry.set(this, void 0);
        _Year_turn.set(this, void 0);
        __classPrivateFieldSet(this, _Year_ruleRegistry, ruleRegistry, "f");
        __classPrivateFieldSet(this, _Year_turn, turn, "f");
        this.addKey('value');
    }
    value(turn = __classPrivateFieldGet(this, _Year_turn, "f").value()) {
        if (!__classPrivateFieldGet(this, _Year_cache, "f").has(turn)) {
            const [year] = __classPrivateFieldGet(this, _Year_ruleRegistry, "f").process(Year_1.default, turn);
            __classPrivateFieldGet(this, _Year_cache, "f").set(turn, year);
        }
        const value = __classPrivateFieldGet(this, _Year_cache, "f").get(turn);
        if (typeof value !== 'number') {
            throw new TypeError('Invalid cache result.');
        }
        return value;
    }
}
exports.Year = Year;
_Year_cache = new WeakMap(), _Year_ruleRegistry = new WeakMap(), _Year_turn = new WeakMap();
exports.instance = new Year();
exports.default = Year;
//# sourceMappingURL=Year.js.map