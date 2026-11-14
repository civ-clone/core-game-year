"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearKey = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
/**
 * What else, besides the turn, a ruleset's `Year` rules read: the level, the map's size, a launch. `Year` keeps each
 * year it works out under the turn and these keys, so when one changes (a new game at another level in the same
 * process, a world that exists now and didn't before) the year is worked out again. A ruleset whose years depend on
 * the turn alone registers none.
 */
class YearKey extends Rule_1.default {
}
exports.YearKey = YearKey;
exports.default = YearKey;
//# sourceMappingURL=YearKey.js.map