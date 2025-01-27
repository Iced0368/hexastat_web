import { MarkovTransitions } from "./markov";
import type { MarkovTable } from "./markov";

export const hexaProbs = [0.35, 0.35, 0.35, 0.2, 0.2, 0.2, 0.2, 0.15, 0.1, 0.05, 0];
export const hexaProbsSunday = hexaProbs.map((p, i) => i >= 5 ? 1.2*p : p);

export const hexaFragCost = [10, 10, 10, 20, 20, 20, 20, 30, 30, 50, 50];
export const resetMeso = 0.1;

export const maxMainLevel = 10;
export const maxProgress = 20;
export const resetEnableProgress = 10;

const _hexaMap: MarkovTable  = [];
const _hexaSundayMap: MarkovTable  = [];

for (let progress = 0; progress < maxProgress; progress++)
    for (let mainLevel = 0; mainLevel <= Math.min(maxMainLevel, progress); mainLevel++) {
        if (mainLevel + 1 <= maxMainLevel) {
            _hexaMap.push([
                [
                    {main: mainLevel, progress: progress}, 
                    {main: mainLevel + 1, progress: progress + 1}
                ], 
                hexaProbs[mainLevel]
            ]);

            _hexaSundayMap.push([
                [
                    {main: mainLevel, progress: progress}, 
                    {main: mainLevel + 1, progress: progress + 1}
                ], 
                hexaProbsSunday[mainLevel]
            ]);
        }
        
        _hexaMap.push([
            [
                {main: mainLevel, progress: progress}, 
                {main: mainLevel, progress: progress + 1}
            ], 
            1 - hexaProbs[mainLevel]
        ]);

        _hexaSundayMap.push([
            [
                {main: mainLevel, progress: progress}, 
                {main: mainLevel, progress: progress + 1}
            ], 
            1 - hexaProbsSunday[mainLevel]
        ]);
    }


export const hexaMarkov = new MarkovTransitions(_hexaMap);
export const hexaSundayMarkov = new MarkovTransitions(_hexaSundayMap);
