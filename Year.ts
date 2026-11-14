import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import YearKey from './Rules/YearKey';
import YearRule from './Rules/Year';

// Whether a rule registry has ever had a `YearKey` rule. One per registry, shared by every `Year` on it: the registry's
//  listener holds this object, never a `Year`, so a `Year` (and its cache) goes once nothing else holds it, and a
//  registry gets one listener however many `Year`s are made on it. A registry nothing holds any more takes its entry
//  with it.
type KeyState = { keyed: boolean };

const keyStates: WeakMap<RuleRegistry, KeyState> = new WeakMap();

const keyStateOf = (ruleRegistry: RuleRegistry): KeyState => {
  const existing = keyStates.get(ruleRegistry);

  if (existing) {
    return existing;
  }

  const state: KeyState = {
    keyed: ruleRegistry.get(YearKey).length > 0,
  };

  ruleRegistry.onRegister((rule): void => {
    if (rule instanceof YearKey) {
      state.keyed = true;
    }
  });

  keyStates.set(ruleRegistry, state);

  return state;
};

export interface IYear extends IDataObject {
  value(turn: number): number;
}

export class Year extends DataObject implements IYear {
  static readonly transient = ['_cache', '_ruleRegistry', '_turn'];
  private _cache: Map<number | string, number> = new Map();
  private _ruleRegistry: RuleRegistry;
  private _turn: Turn;

  constructor(
    turn: Turn = turnInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this._ruleRegistry = ruleRegistry;
    this._turn = turn;

    // The registry's one listener, made with its first `Year` as before.
    keyStateOf(ruleRegistry);

    this.addKey('value');
  }

  value(turn: number = this._turn.value()): number {
    const key = this.key(turn);

    if (!this._cache.has(key)) {
      const [year] = this._ruleRegistry.process(YearRule, turn);

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
  private key(turn: number): number | string {
    if (!keyStateOf(this._ruleRegistry).keyed) {
      return turn;
    }

    return JSON.stringify([turn, ...this._ruleRegistry.process(YearKey)]);
  }
}

export const instance: Year = new Year();

export default Year;
