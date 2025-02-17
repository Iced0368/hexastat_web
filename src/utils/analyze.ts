import * as mathjs from 'mathjs';
import { hexaFragTransitions, type Action } from "./hexaStrategy";
import { MarkovTransitions } from './markov';
import { fragCostMultiplier, maxMainLevel } from './hexaTable';

export const analyzeData = (strategy: Action[][], goalProb: number, data: {goal: number, fragPrice: number, isSunday: boolean, batch: number | undefined, goalProb: number}) => {
    goalProb = data.goalProb;
  
    const transitions = hexaFragTransitions(strategy, data.isSunday);
    const init = new Map([[{main: 0, progress: 0, frag: 0}, 1]]);

    const transitionWithoutSteady = new MarkovTransitions();
  
    for (let [[from_s, to_s], prob] of transitions.transitions) {
        const from = JSON.parse(from_s);
        const to = JSON.parse(to_s);
  
        if (strategy[from.main][from.progress] !== "finish" && strategy[to.main][to.progress] !== "finish")
            transitionWithoutSteady.setTransition(from, to, prob);
    }
  
    const size = transitionWithoutSteady.states.length;
  
    const N_inv = mathjs.subtract(mathjs.identity(size), transitionWithoutSteady.getMatrix());
    const N = mathjs.inv(N_inv);
  
    const costWithoutSteady = transitionWithoutSteady.states.map(state_s => {
        const state = JSON.parse(state_s);
        switch (strategy[state.main][state.progress]) {
            case "progress":
                return mathjs.complex(1, 0);
            case "reset":
                return mathjs.complex(1, 1);
            default:
                return mathjs.complex(0, 0);
        }
    });
  
    const initVector = transitionWithoutSteady.encode(init);
    const costVector = mathjs.transpose(mathjs.matrix(costWithoutSteady));

    const fragCostMean = mathjs.multiply(initVector, N, costVector) as mathjs.Complex;
  
    const batch = data.batch === undefined ?  Math.ceil(fragCostMean.re / 20) : data.batch / fragCostMultiplier;
  
    let vector = mathjs.matrix(transitions.encode(init));
    const M = mathjs.pow(transitions.getMatrix("sparse"), batch);
  
    const newData: number[][] = Array.from({length: maxMainLevel + 1}, () => []);
  
    while(true) {
        vector = mathjs.multiply(vector, M);
        const result = transitions.decode(vector);
    
        const mergedResult: number[] = Object.entries(result).reduce(
            (acc, [state_s, value]) => {
                const state = JSON.parse(state_s);
                return [...acc.slice(0, state.main), acc[state.main] + value, ...acc.slice(state.main + 1)]
            }, 
            Array(11).fill(0)
        );
    
        let sum = 0;
        mergedResult.forEach((x, j) => {
            if (j >= data.goal) {
                newData[j].push(x);
                sum += x;
            }
        });
    
        if (sum > data.goalProb / 100)
            break;
    }

    const accData = newData.filter((_, i) => i >= data.goal);

    //const accDistMerged = accData[0].map((_, colIndex) => accData.reduce((sum, row) => sum + row[colIndex], 0));
    //const dist = accDistMerged.map((acc, i) => (acc - (i > 0 ? accDistMerged[i-1] : 0)));
  
    return {
        //distData: dist,
        accData: accData,
        mean: {
            frag: fragCostMean.re * fragCostMultiplier,
            reset: fragCostMean.im,
        },
        batch: batch * fragCostMultiplier,
    };
}