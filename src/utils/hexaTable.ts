export const hexaProbs = [0.35, 0.35, 0.35, 0.2, 0.2, 0.2, 0.2, 0.15, 0.1, 0.05, 0];
export const hexaProbsSunday = hexaProbs.map((p, i) => i >= 5 ? 1.2*p : p);

export const fragCost = [1, 1, 1, 2, 2, 2, 2, 3, 3, 5, 5];
export const fragCostMultiplier = 10;

export const resetMeso = 0.1;

export const maxMainLevel = 10;
export const maxProgress = 20;
export const resetEnableProgress = 10;