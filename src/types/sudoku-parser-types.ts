import type { ReadableStruct } from "./sudoku-types";

type Trim<Text extends string, Char extends string> = 
    Text extends `${Char}${infer U}` ? 
    Trim<U, Char> : 
    Text extends `${infer U}${Char}` ? 
    Trim<U, Char> : 
    Text;

type Replace<Text extends string, SearchValue extends string, ReplaceValue extends string> = 
    Text extends `${infer Pre extends string}${SearchValue}${infer Post extends string}` ? 
    Replace<`${Pre}${ReplaceValue}${Post}`, SearchValue, ReplaceValue> : 
    Text;

type Split<Text extends string, SplitBy extends string> =
    string extends Text ? string[] :
    Text extends '' ? [] :
    Text extends `${infer T}${SplitBy}${infer U}` ? [T, ...Split<U, SplitBy>] : [Text];
    
type ReplaceMany<Text extends string, SearchValues extends string[], ReplaceValue extends string> = 
    SearchValues extends [infer T0 extends string, ...infer Ts extends string[]] ? 
    ReplaceMany<Replace<Text, T0, ReplaceValue>, Ts, ReplaceValue> : 
    Text;
    
type ParseInt<T> = T extends number ? T : T extends `${infer N extends number}` ? N : 'NaN';

type StringToTuple<S extends string> = S extends `${S[0]}${infer Rest}` ? [S, ...StringToTuple<Rest>] : [];

type LengthOfString<S extends string> = StringToTuple<S>['length'];


//CUSTOM HELPER TYPES
type MapToInt<Tuple extends any[]> = Tuple extends [infer T0, ...infer Ts] ? [ParseInt<T0>, ...MapToInt<Ts>] : Tuple;

type MapStringsToIntTuples<Tuple extends string[]> = 
    Tuple extends [infer T0 extends string, ...infer Ts extends string[]] ? 
    [MapToInt<Split<T0, ''>>, ...MapStringsToIntTuples<Ts>] : 
    Tuple;

type DeleteDuplicates<Text extends string, Char extends string> = 
    Text extends `${infer Pre}${Char}${Char}${infer Post}` ?
    DeleteDuplicates<`${Pre}${Char}${Post}`, Char> : Text;

type I1<T extends string> = Replace<T, ' ', ''>;
type I2<T extends string> = Replace<I1<T>, ' ', ''>;
type I3<T extends string> = Replace<I2<T>, '╔', ''>;
type I4<T extends string> = Replace<I3<T>, '═', ''>;
type I5<T extends string> = Replace<I4<T>, '╦', ''>;
type I6<T extends string> = Replace<I5<T>, '╗', ''>;
type I7<T extends string> = Replace<I6<T>, '╤', ''>;
type I8<T extends string> = Replace<I7<T>, '╟', ''>;
type I9<T extends string> = Replace<I8<T>, '┼', ''>;
type I10<T extends string> = Replace<I9<T>, '╫', ''>;
type I11<T extends string> = Replace<I10<T>, '╢', ''>;
type I12<T extends string> = Replace<I11<T>, '╠', ''>;
type I13<T extends string> = Replace<I12<T>, '╪', ''>;
type I14<T extends string> = Replace<I13<T>, '╬', ''>;
type I15<T extends string> = Replace<I14<T>, '╣', ''>;
type I16<T extends string> = Replace<I15<T>, '╚', ''>;
type I17<T extends string> = Replace<I16<T>, '╧', ''>;
type I18<T extends string> = Replace<I17<T>, '╩', ''>;
type I19<T extends string> = Replace<I18<T>, '╝', ''>;
type I20<T extends string> = Replace<I19<T>, '─', ''>;
type I21<T extends string> = Replace<I20<T>, '╧', ''>;
type I22<T extends string> = Trim<I21<T>, '\n'>;
type I23<T extends string> = Replace<Replace<I22<T>, '║', '│'>, '│', '|'>;
type I24<T extends string> = Replace<I23<T>, '||', '|0|'>;
type I25<T extends string> = Replace<I24<T>, '|', ''>;
type I26<T extends string> = DeleteDuplicates<I25<T>, '\n'>;
type I27<T extends string> = Split<I26<T>, '\n'>;
type I28<T extends string> = MapStringsToIntTuples<I27<T>>;
export type ParsedTemplate<Template extends string> = I28<Template> extends ReadableStruct ? I28<Template> : undefined;


type MapToParsedTemplate<Templates extends readonly string[]> = 
Templates extends readonly [infer First extends string, ...infer Rest extends readonly string[]] ? 
[ I28<First>, ...MapToParsedTemplate<Rest> ] : Templates;


export type ValidTemplates<Templates extends readonly string[]> = 
MapToParsedTemplate<Templates> extends ReadableStruct[] ? Templates : undefined;
