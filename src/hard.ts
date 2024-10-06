//Тип Camelize написан с использованием двух вспомогательных типов: Reform и CamelizeString

//Как было выяснено при решении задачи ParseURLParams, для того, чтобы изменить все элементы кроме первого, нужно иметь два символа-разделителя подряд.
//Поэтому данный тип проверяет, подходит ли StringElem под паттерн `${infer X}_${infer Y}`, и если да,
//С помощью ключевого слова infer помещает часть до _ в X, а часть после - в Y. После чего ставит между ними /: вместо _.
//А оставшуюся часть строки, которая лежит в Y обрабатывает рекурсивно аналогичным образом.
//Таким образом строка вида a_b_c_..._n превращается в строку a/:b/:c/:.../:n
export type Reform<StringElem extends string> = StringElem extends `${infer X}_${infer Y}`
    ? `${X}/:${Reform<Y>}`
    : StringElem;

//По аналогии с задачей ParseURLParams, данный тип рекурсивно разделяет строку по знаку /, 
//И ко всем строкам, перед которыми стоит : применяет Capitalize. 
//Таким образом, данный тип приводит строку формата test1/:test2/:.../:testn в строку формата test1Test2...Testn
export type CamelizeString<StringElem extends string> = StringElem extends `${infer X}/${infer Y}`
    ? `${(X extends `:${infer Z}`?Capitalize<Z>:X)}${CamelizeString<Y>}`
    : (StringElem extends `:${infer Z}`?Capitalize<Z>:StringElem);

//Соберем тип следующим образом:
//Для каждого ключа из множества ключей типа ObjType, изменим его название на CamelizeString<Reform<Key>>,
//то есть преобразуем ключ вида test1_test2_..._testn в строку вида test1/:test2/:.../:testn, а после в строку формата test1Test2...Testn
//После чего по этому ключу добавим поле типа Camelize<ObjType[Key]>
//Если тип не был типом с полями - он так и останется этим типом. Если это был тип с полями, то
//На него применится Camelize и его поля тоже будут обработаны и их названия изменятся. И так рекурсивно.
export type Camelize<ObjType> = {
    [Key in keyof ObjType as CamelizeString<Reform<string&Key>>] : Camelize<ObjType[Key]>
}

//Соберем тип следующим образом:
//Для каждого ключа Key из множества ключей Т, проверим, подходит ли какой-нибудь ключ из Paths под паттерн `${string&Key}.${infer Rest}` или `${string&Key}`,
//То есть найдется ли среди Paths такой ключ, началом которого являлся бы Key, или же который полностью совпадал с Key. 
//Если найдется - ключ будет Key, иначе ключ будет never (удаляем данный ключ)
//Для совпадающих с Key ключей из Path, тип будет T[Key]. 
//Для тех, началом которых является Key, типом будет DeepPick<T[Key], Rest>, то есть DeepPick от T[Key] по ключу без начала в виде Key.
export type DeepPick<T, Paths extends string> = {
    [Key in keyof T as Paths extends `${string&Key}.${infer Rest}`? Key : Paths extends `${string&Key}`? Key : never] : Paths extends `${string&Key}.${infer Rest}`? DeepPick<T[Key], Rest> :
    Paths extends `${string&Key}`? T[Key] : never
}
