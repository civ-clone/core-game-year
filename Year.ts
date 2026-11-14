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

export interface IYear extends IDataObject {
  value(turn: number): number;
}

export class Year extends DataObject implements IYear {
  static readonly transient = ['_cache', '_keyed', '_ruleRegistry', '_turn'];
  private _cache: Map<number | string, number> = new Map();
  // Whether any `YearKey` rule has been registered: until one is, a year is kept under its turn alone.
  private _keyed: boolean;
  private _ruleRegistry: RuleRegistry;
  private _turn: Turn;

  constructor(
    turn: Turn = turnInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this._ruleRegistry = ruleRegistry;
    this._turn = turn;
    this._keyed = ruleRegistry.get(YearKey).length > 0;

    ruleRegistry.onRegister((rule): void => {
      if (rule instanceof YearKey) {
        this._keyed = true;
      }
    });

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
  //  nothing; then the turn and every `YearKey` rule's answer, asked once per call.
  private key(turn: number): number | string {
    if (!this._keyed) {
      return turn;
    }

    return [turn, ...this._ruleRegistry.process(YearKey)].join(':');
  }
}

export const instance: Year = new Year();

export default Year;
