import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
export interface IYear {
  value(turn: number): number;
}
export declare class Year implements IYear {
  #private;
  constructor(turn?: Turn, ruleRegistry?: RuleRegistry);
  value(turn?: number): number;
}
export declare const instance: Year;
export default Year;
