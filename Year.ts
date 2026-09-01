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
import YearRule from './Rules/Year';

export interface IYear extends IDataObject {
  value(turn: number): number;
}

export class Year extends DataObject implements IYear {
  private _cache: Map<number, number> = new Map();
  private _ruleRegistry: RuleRegistry;
  private _turn: Turn;

  constructor(
    turn: Turn = turnInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this._ruleRegistry = ruleRegistry;
    this._turn = turn;

    this.addKey('value');
  }

  value(turn: number = this._turn.value()): number {
    if (!this._cache.has(turn)) {
      const [year] = this._ruleRegistry.process(YearRule, turn);

      this._cache.set(turn, year);
    }

    const value = this._cache.get(turn);

    if (typeof value !== 'number') {
      throw new TypeError('Invalid cache result.');
    }

    return value;
  }
}

export const instance: Year = new Year();

export default Year;
