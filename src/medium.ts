export type DeepPartial<T> = {
    [Key in keyof T]? : DeepPartial<T[Key]>
};

export type MyCapitalize<T> = T extends `${infer X}${infer Y}`
    ? `${Uppercase<X>}${Y}`
    : T;

export type DeepMutable<T> = {
    -readonly [Key in keyof T] : DeepMutable<T[Key]>
};

export type ParseURLParams<StringElem> = StringElem extends `${infer X}/${infer Y}`
    ? (X extends `:${infer Z}`?Z:never) | ParseURLParams<Y>
    : (StringElem extends `:${infer Z}`?Z:never);
