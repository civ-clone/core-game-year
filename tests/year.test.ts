import Effect from '@civ-clone/core-rule/Effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '../Year';
import YearRule from '../Rules/Year';
import { expect } from 'chai';

const setUp = () => {
  const ruleRegistry = new RuleRegistry(),
    turn = new Turn(),
    year = new Year(turn, ruleRegistry),
    asked: number[] = [];

  ruleRegistry.register(
    new YearRule(
      new Effect((value: number): number => {
        asked.push(value);

        return value * 20 - 4020;
      })
    )
  );

  return { asked, ruleRegistry, turn, year };
};

describe('Year', (): void => {
  it('gives the year of a turn from the Year rules, and of the current turn when none is given', (): void => {
    const { turn, year } = setUp();

    expect(year.value(1)).equal(-4000);
    expect(year.value(3)).equal(-3960);

    turn.set(2);

    expect(year.value()).equal(-3980);
  });

  it('asks the rules once per turn, and keeps the answer', (): void => {
    const { asked, year } = setUp();

    year.value(5);
    year.value(5);
    year.value(6);
    year.value(5);

    expect(asked).eql([5, 6]);
  });

  it('throws when no rule gives a year', (): void => {
    const year = new Year(new Turn(), new RuleRegistry());

    expect(() => year.value(1)).throw(TypeError);
  });
});
