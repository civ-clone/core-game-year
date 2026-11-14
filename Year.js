"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Year = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const YearKey_1 = require("./Rules/YearKey");
const Year_1 = require("./Rules/Year");
const keyStates = new WeakMap();
const keyStateOf = (ruleRegistry) => {
    const existing = keyStates.get(ruleRegistry);
    if (existing) {
        return existing;
    }
    const state = {
        keyed: ruleRegistry.get(YearKey_1.default).length > 0,
    };
    ruleRegistry.onRegister((rule) => {
        if (rule instanceof YearKey_1.default) {
            state.keyed = true;
        }
    });
    keyStates.set(ruleRegistry, state);
    return state;
};
class Year extends DataObject_1.DataObject {
    constructor(turn = Turn_1.instance, ruleRegistry = RuleRegistry_1.instance) {
        super();
        this._cache = new Map();
        this._ruleRegistry = ruleRegistry;
        this._turn = turn;
        // The registry's one listener, made with its first `Year` as before.
        keyStateOf(ruleRegistry);
        this.addKey('value');
    }
    value(turn = this._turn.value()) {
        const key = this.key(turn);
        if (!this._cache.has(key)) {
            const [year] = this._ruleRegistry.process(Year_1.default, turn);
            this._cache.set(key, year);
        }
        const value = this._cache.get(key);
        if (typeof value !== 'number') {
            throw new TypeError('Invalid cache result.');
        }
        return value;
    }
    // The turn alone until a `YearKey` rule is registered, as before there were any, so a ruleset without them pays
    //  nothing; then the turn and every `YearKey` rule's answer, asked once per call, as JSON so that no two lists of
    //  answers give the same key (an answer may contain any separator, and `undefined` becomes `null`). Whether there
    //  are any is the registry's, looked up each time rather than kept on the `Year`, so a `Year` rebuilt from a save
    //  without its constructor (core-game's `Game.inject`) needs nothing beyond its rule registry.
    key(turn) {
        if (!keyStateOf(this._ruleRegistry).keyed) {
            return turn;
        }
        return JSON.stringify([turn, ...this._ruleRegistry.process(YearKey_1.default)]);
    }
}
exports.Year = Year;
Year.transient = ['_cache', '_ruleRegistry', '_turn'];
exports.instance = new Year();
exports.default = Year;
//# sourceMappingURL=Year.js.map