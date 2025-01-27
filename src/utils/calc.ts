import { 
    hexaProbs, hexaProbsSunday, 
    hexaFragCost, resetMeso, 
    maxMainLevel, maxProgress, resetEnableProgress, 
    hexaMarkov, hexaSundayMarkov
} from "./hexaTable";

import { MarkovTransitions } from "./markov";

type Cost = {
    meso: number,
    frag: number
}

type Action = "progress" | "reset" | "finished";

function solveDP(x: number, goal: number, fragPrice: number, isSunday?: boolean) {
    const dp: number[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill(0));

    for(let n = maxProgress; n >= 0; n--)
        dp[maxMainLevel][n] = 0;

    for(let l = maxMainLevel - 1; l >= 0; l--) {
        const xcostAfterReset = resetMeso + x;
        dp[l][maxProgress] = l >= goal ? 0 : xcostAfterReset;

        for(let n = maxProgress - 1; n >= 0; n--) {
            const p = (isSunday ?? false) ? hexaProbsSunday[l] : hexaProbs[l];
            const xcostAfterProgress = hexaFragCost[l] * fragPrice + (1-p) * dp[l][n+1] + p * dp[l+1][n+1];

            if (n >= resetEnableProgress)
                dp[l][n] = Math.min(xcostAfterReset, xcostAfterProgress);
            else
                dp[l][n] = xcostAfterProgress;
        }
    }

    return dp;
}

function getStrategy(x: number, goal: number, fragPrice: number, isSunday?: boolean) {
    const dp: number[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill(0));
    const action: Action[][] = Array.from({ length: maxMainLevel + 1 }, () => Array(maxProgress + 1).fill("progress"));

    for(let n = maxProgress; n >= 0; n--) {
        dp[maxMainLevel][n] = 0;
        action[maxMainLevel][n] = "finished";
    }

    for(let l = maxMainLevel - 1; l >= 0; l--) {
        const xcostAfterReset = resetMeso + x;
        dp[l][maxProgress] = l >= goal ? 0 : xcostAfterReset;
        action[l][maxProgress] = l >= goal ? "finished" : "reset";

        for(let n = maxProgress - 1; n >= 0; n--) {
            const p = isSunday ? hexaProbsSunday[l] : hexaProbs[l];
            const xcostAfterProgress = hexaFragCost[l] * fragPrice + (1-p) * dp[l][n+1] + p * dp[l+1][n+1];

            if (n >= resetEnableProgress) {
                if (xcostAfterReset < xcostAfterProgress) {
                    dp[l][n] = xcostAfterReset;
                    action[l][n] = "reset";
                }
                else
                    dp[l][n] = xcostAfterProgress;
            }
            else
                dp[l][n] = xcostAfterProgress;
        }
    }

    return action;
}

export function findOptimalStrategy(goal: number, fragPrice: number, isSunday?: boolean) {
    const INTERATION = 64;
    let [s, e] = [0, Math.pow(2, INTERATION / 2)];

    for(let _ = 0; _ < INTERATION; _++) {
        const m = (s + e) / 2;
        const r = solveDP(m, goal, fragPrice, isSunday)[0][0];

        if (r > m) s = m;
        else e = m;
    }

    return getStrategy(s, goal, fragPrice, isSunday);
}

export function getHexaTableWithStrategy(strategy: Action[][], isSunday?: boolean) {
    const markovTransitions = new MarkovTransitions();

    isSunday = isSunday ?? false;
    const probs = isSunday ? hexaProbsSunday : hexaProbs;

    for (let n = 0; n <= maxProgress; n++)
        for(let l = 0; l <= Math.min(n, maxMainLevel); l++) {
            const from = {main: l, progress: n};
            switch(strategy[l][n]) {
                case "progress":
                    markovTransitions.setTransition(from, {main: l+1, progress: n+1}, probs[l]);
                    markovTransitions.setTransition(from, {main: l, progress: n+1}, 1-probs[l]);
                    break;
                case "reset":
                    markovTransitions.setTransition(from, {main: 0, progress: 0}, 1);
                    break;
                case "finished":
                    markovTransitions.setTransition(from, "goal-achieved", 1);
                    break;
            }
        }
    
    return markovTransitions;
}