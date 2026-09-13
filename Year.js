"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.Year = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Year_1 = require("./Rules/Year");
class Year extends DataObject_1.DataObject {
    constructor(turn = Turn_1.instance, ruleRegistry = RuleRegistry_1.instance) {
        super();
        this._cache = new Map();
        this._ruleRegistry = ruleRegistry;
        this._turn = turn;
        this.addKey('value');
    }
    value(turn = this._turn.value()) {
        if (!this._cache.has(turn)) {
            const [year] = this._ruleRegistry.process(Year_1.default, turn);
            this._cache.set(turn, year);
        }
        const value = this._cache.get(turn);
        if (typeof value !== 'number') {
            throw new TypeError('Invalid cache result.');
        }
        return value;
    }
}
exports.Year = Year;
Year.transient = ['_cache', '_ruleRegistry', '_turn'];
exports.instance = new Year();
exports.default = Year;
//# sourceMappingURL=Year.js.map