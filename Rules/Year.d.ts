import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
export declare class Year extends Rule<[number], number> {}
export default Year;
export interface IYearRegistry extends IRuleRegistry<Year, [number], number> {}
