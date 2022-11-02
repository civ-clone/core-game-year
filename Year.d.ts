import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
export interface IYear extends IDataObject {
  value(turn: number): number;
}
export declare class Year extends DataObject implements IYear {
  #private;
  constructor(turn?: Turn, ruleRegistry?: RuleRegistry);
  value(turn?: number): number;
}
export declare const instance: Year;
export default Year;
