import Rule from '@civ-clone/core-rule/Rule';

/**
 * What else, besides the turn, a ruleset's `Year` rules read: the level, the map's size, a launch. `Year` keeps each
 * year it works out under the turn and these keys, so when one changes (a new game at another level in the same
 * process, a world that exists now and didn't before) the year is worked out again. A ruleset whose years depend on
 * the turn alone registers none.
 */
export class YearKey extends Rule<[], string | number> {}

export default YearKey;
