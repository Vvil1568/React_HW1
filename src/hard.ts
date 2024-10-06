export type Reform<StringElem> = StringElem extends `${infer X}_${infer Y}`
    ? `${X}/:${Reform<Y>}`
    : StringElem;

export type CamelizeString<StringElem> = StringElem extends `${infer X}/${infer Y}`
    ? `${(X extends `:${infer Z}`?Capitalize<Z>:X)}${CamelizeString<Y>}`
    : (StringElem extends `:${infer Z}`?Capitalize<Z>:StringElem);

export type Camelize<ObjType> = {
    [Key in keyof ObjType as CamelizeString<Reform<Key>>] : Camelize<ObjType[Key]>
}

export type DeepPick<T, Paths> = {
    [Key in keyof T as Paths extends `${string&Key}.${infer Rest}`? Key : Paths extends `${string&Key}`? Key : never] : Paths extends `${string&Key}.${infer Rest}`? DeepPick<T[Key], Rest> :
    Paths extends `${string&Key}`? T[Key] : never
}
