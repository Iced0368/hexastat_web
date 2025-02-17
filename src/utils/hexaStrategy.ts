import { 
    hexaProbs, hexaProbsSunday, 
    fragCost, fragCostMultiplier, resetMeso, 
    maxMainLevel, maxProgress, resetEnableProgress, 
} from "./hexaTable";

import { MarkovTransitions } from "./markov";
import type { MarkovComplexState } from "./markov";


export type Action = "progress" | "reset" | "finish" | "unreachable";

function solveDP(x: number, goal: number, fragPrice: number, isSunday?: boolean) {
    const dp: number[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill(0));
    const cost = fragCost.map(c => c * fragCostMultiplier * fragPrice)
    const xcostAfterReset = resetMeso + x;

    // base case: 최대 강화 완료
    for (let l = 0; l <= maxMainLevel; l++)
        dp[l][maxProgress] = l >= goal ? 0 : xcostAfterReset;

    // base case: 최대 레벨 도달
    for (let n = maxProgress - 1; n >= 0; n--)
        dp[maxMainLevel][n] = cost[maxMainLevel] + dp[maxMainLevel][n+1];


    for(let l = maxMainLevel - 1; l >= 0; l--)
        for(let n = maxProgress - 1; n >= 0; n--) {
            const p = (isSunday ?? false) ? hexaProbsSunday[l] : hexaProbs[l];
            const xcostAfterProgress = cost[l] + (1-p) * dp[l][n+1] + p * dp[l+1][n+1];

            if (n >= resetEnableProgress)
                dp[l][n] = Math.min(xcostAfterReset, xcostAfterProgress);
            else
                dp[l][n] = xcostAfterProgress;
        }

    return dp;
}

function getStrategy(x: number, goal: number, fragPrice: number, isSunday?: boolean) {
    const dp: number[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill(0));
    const action: Action[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill("progress"));
    const cost = fragCost.map(c => c * fragCostMultiplier * fragPrice)
    const xcostAfterReset = resetMeso + x;

    // base case: 최대 강화 완료
    for (let l = 0; l <= maxMainLevel; l++) {
        dp[l][maxProgress] = l >= goal ? 0 : xcostAfterReset;
        action[l][maxProgress] = l >= goal ? "finish" : "reset";
    }

    // base case: 최대 레벨 도달
    for (let n = maxProgress - 1; n >= 0; n--) {
        dp[maxMainLevel][n] = cost[maxMainLevel] + dp[maxMainLevel][n+1];
        action[maxMainLevel][n] = "progress";
    }


    for(let l = maxMainLevel - 1; l >= 0; l--)
        for(let n = maxProgress - 1; n >= 0; n--) {
            const p = (isSunday ?? false) ? hexaProbsSunday[l] : hexaProbs[l];
            const xcostAfterProgress = cost[l] + (1-p) * dp[l][n+1] + p * dp[l+1][n+1];

            if (n >= resetEnableProgress) {
                if (xcostAfterReset < xcostAfterProgress) {
                    dp[l][n] = xcostAfterReset;
                    action[l][n] = "reset";
                }
                else {
                    dp[l][n] = xcostAfterProgress;
                    action[l][n] = "progress";
                }
            }
            else {
                dp[l][n] = xcostAfterProgress;
                action[l][n] = "progress";
            }
        }

    for(let l = 0; l <= maxMainLevel; l++)
        for(let n = 0; n < l; n++)
            action[l][n] = "unreachable";

    return action;
}


export function findOptimalStrategy(goal: number, fragPrice: number, isSunday?: boolean) {
    const ITERATION = 128;
    let [s, e] = [0, Math.pow(2, ITERATION / 2)];

    for(let _ = 0; _ < ITERATION; _++) {
        const m = (s + e) / 2;
        const r = solveDP(m, goal, fragPrice, isSunday)[0][0];

        if (r > m) s = m;
        else e = m;
    }

    return getStrategy(s, goal, fragPrice, isSunday);
}

export function hexaTransitions(strategy: Action[][], isSunday?: boolean) {
    const markovTransitions = new MarkovTransitions();

    isSunday = isSunday ?? false;
    const probs = isSunday ? hexaProbsSunday : hexaProbs;

    for (let n = 0; n <= maxProgress; n++)
        for(let l = 0; l <= Math.min(n, maxMainLevel); l++) {
            const from = {main: l, progress: n};
            switch(strategy[l][n]) {
                case "progress":
                    if (l + 1 <= maxMainLevel)
                        markovTransitions.setTransition(from, {main: l+1, progress: n+1}, probs[l]);
                    markovTransitions.setTransition(from, {main: l, progress: n+1}, 1-probs[l]);
                    break;
                case "reset":
                    markovTransitions.setTransition(from, {main: 0, progress: 0}, 1);
                    break;
                case "finish":
                    markovTransitions.setTransition(from, from, 1);
                    break;
            }
        }
    return markovTransitions;
}

export function hexaFragTransitions(strategy: Action[][], isSunday?: boolean) {
    const markovTransitions = new MarkovTransitions();

    isSunday = isSunday ?? false;
    const probs = isSunday ? hexaProbsSunday : hexaProbs;

    const transitionsAfterReset: [MarkovComplexState, number][] = [];
    
    if (fragCost[0] > 1)
        transitionsAfterReset.push([{main: 0, progress: 0, frag: 1}, 1]);
    else {
        transitionsAfterReset.push([{main: 1, progress: 1, frag: 0}, probs[0]]);
        transitionsAfterReset.push([{main: 0, progress: 1, frag: 0}, 1-probs[0]]);
    }

    for (let n = 0; n <= maxProgress; n++)
        for(let l = 0; l <= Math.min(n, maxMainLevel); l++) {
            switch(strategy[l][n]) {
                case "progress":
                    for(let i = 0; i < fragCost[l] - 1; i++)
                        markovTransitions.setTransition({main: l, progress: n, frag: i}, {main: l, progress: n, frag: i+1}, 1);

                    if (l + 1 <= maxMainLevel)
                        markovTransitions.setTransition({main: l, progress: n, frag: fragCost[l]-1}, {main: l+1, progress: n+1, frag: 0}, probs[l]);
                    markovTransitions.setTransition({main: l, progress: n, frag: fragCost[l]-1}, {main: l, progress: n+1, frag: 0}, 1-probs[l]);
                    break;
                case "reset":
                    for (let transitionAfterReset of transitionsAfterReset)
                        markovTransitions.setTransition({main: l, progress: n, frag: 0}, ...transitionAfterReset);
                    break;
                case "finish":
                    markovTransitions.setTransition({main: l, progress: n, frag: 0}, {main: l, progress: n, frag: 0}, 1);
                    break;
            }
        }
    return markovTransitions;
}