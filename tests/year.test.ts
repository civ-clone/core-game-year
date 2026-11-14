import Effect from '@civ-clone/core-rule/Effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Year from '../Year';
import YearKey from '../Rules/YearKey';
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

  it('works a year out again when what a YearKey rule reads changes, and keeps it per key', (): void => {
    const { asked, ruleRegistry, year } = setUp();
    let level = 'King';

    year.value(5);

    ruleRegistry.register(new YearKey(new Effect(() => level)));

    year.value(5);
    year.value(5);

    level = 'Deity';

    year.value(5);

    level = 'King';

    year.value(5);

    // Once before any key, then once each for King and Deity.
    expect(asked).eql([5, 5, 5]);
  });

  it('keys by every YearKey rule', (): void => {
    const { asked, ruleRegistry, year } = setUp();
    let size = 'normal',
      launch: string | number = 'none';

    ruleRegistry.register(
      new YearKey(new Effect(() => size)),
      new YearKey(new Effect(() => launch))
    );

    year.value(7);
    size = 'large';
    year.value(7);
    launch = 3;
    year.value(7);
    year.value(7);

    expect(asked).eql([7, 7, 7]);
  });

  it('keys by the YearKey rules registered before it was made, too', (): void => {
    const ruleRegistry = new RuleRegistry(),
      asked: number[] = [];
    let level = 1;

    ruleRegistry.register(
      new YearKey(new Effect(() => level)),
      new YearRule(
        new Effect((value: number): number => {
          asked.push(value);

          return value;
        })
      )
    );

    const year = new Year(new Turn(), ruleRegistry);

    year.value(2);
    level = 2;
    year.value(2);

    expect(asked).eql([2, 2]);
  });

  it('keeps lists of answers apart however they would join', (): void => {
    const { asked, ruleRegistry, year } = setUp();
    let first = 'x:y',
      second = 'z';

    ruleRegistry.register(
      new YearKey(new Effect(() => first)),
      new YearKey(new Effect(() => second))
    );

    year.value(4);
    first = 'x';
    second = 'y:z';
    year.value(4);

    expect(asked).eql([4, 4]);
  });

  it('tells an undefined answer from an empty one', (): void => {
    const { asked, ruleRegistry, year } = setUp();
    let answer: string | undefined = undefined;

    ruleRegistry.register(new YearKey(new Effect(() => answer as any)));

    year.value(4);
    answer = '';
    year.value(4);

    expect(asked).eql([4, 4]);
  });

  it('stays keyed after a YearKey rule is unregistered, and still gives the right year', (): void => {
    const { asked, ruleRegistry, year } = setUp(),
      keyRule = new YearKey(new Effect(() => 'a'));

    ruleRegistry.register(keyRule);
    year.value(4);
    ruleRegistry.unregister(keyRule);

    expect(year.value(4)).equal(4 * 20 - 4020);
    expect(asked).eql([4, 4]);
  });

  it('shares one listener between every Year on a registry', (): void => {
    const ruleRegistry = new RuleRegistry(),
      listeners: unknown[] = [],
      onRegister = ruleRegistry.onRegister.bind(ruleRegistry);

    ruleRegistry.onRegister = (listener) => {
      listeners.push(listener);

      return onRegister(listener);
    };

    new Year(new Turn(), ruleRegistry);
    new Year(new Turn(), ruleRegistry);
    new Year(new Turn(), ruleRegistry);

    expect(listeners).length(1);
  });
});
