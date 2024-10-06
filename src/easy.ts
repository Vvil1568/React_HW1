export type MyPick<T, K extends keyof T> = {
    [Key in K] : T[Key]
}

export type NOfArray<ArrayObj extends Array<any>, N extends number> = {
    test : ArrayObj[N]
}

export type Unshift<ArrayType extends Array<any>, Element> = {
    test: [Element, ...ArrayType];
}

export type MyExclude<T, U> = T extends U? never : T;
