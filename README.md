# core-game-year

Core class associated to the current `Year`. The `Rule`s control how the year advances and can start

`Year` keeps each year it works out. A ruleset whose years depend on more than the turn (the level, the map, a
launch) registers `YearKey` rules returning those inputs: years are then kept under the turn and every `YearKey`
answer, so a change in any of them works the year out again. With no `YearKey` rules a year is kept under its turn
alone, as before.
