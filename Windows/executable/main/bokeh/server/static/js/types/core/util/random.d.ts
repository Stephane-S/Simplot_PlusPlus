export declare class Random {
    private seed;
    constructor(seed: number);
    integer(): number;
    float(): number;
    floats(n: number): number[];
}
export declare const random: Random;
