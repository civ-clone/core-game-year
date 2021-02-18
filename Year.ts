import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import { Year as YearRule, IYearRegistry } from './Rules/Year';
import DataObject, {
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';

export interface IYear extends IDataObject {
  value(turn: number): number;
}

export class Year extends DataObject implements IYear {
  #cache: Map<number, number> = new Map();
  #ruleRegistry: RuleRegistry;
  #turn: Turn;

  constructor(
    turn: Turn = turnInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this.#ruleRegistry = ruleRegistry;
    this.#turn = turn;

    this.addKey('value');
  }

  value(turn: number = this.#turn.value()): number {
    if (!this.#cache.has(turn)) {
      const [year] = (this.#ruleRegistry as IYearRegistry).process(
        YearRule,
        turn
      );

      this.#cache.set(turn, year);
    }

    const value = this.#cache.get(turn);

    if (typeof value !== 'number') {
      throw new TypeError('Invalid cache result.');
    }

    return value;
  }
}

export const instance: Year = new Year();

export default Year;
