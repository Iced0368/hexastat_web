import { findOptimalStrategy, getHexaTableWithStrategy } from "./calc"
import { hexaMarkov, hexaSundayMarkov, maxMainLevel, maxProgress } from "./hexaTable";

console.log(hexaMarkov.size);

const strategy = findOptimalStrategy(5, 0.1, false);
const hexaTableWithStrategy = getHexaTableWithStrategy(strategy, false);

console.log(hexaTableWithStrategy.size)
