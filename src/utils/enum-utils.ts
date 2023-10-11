type Enum = { [s: number]: string };

type UnionToIntersection<U> = (
    U extends never ? never : (arg: U) => never
  ) extends (arg: infer I) => void
    ? I
    : never;
  
type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

// export function getEnumKeys<E extends Enum, T extends UnionToTuple<keyof E>>(enumSrc: E): T { 
//     return Object.keys(enumSrc).filter(el => isNaN(parseInt(el))) as T;
// }

export function getEnumKeys<E extends Enum>(enumSrc: E): string[] { 
    return Object.keys(enumSrc).filter(el => isNaN(parseInt(el))) as string[];
}


  
  
    // type test = UnionToTuple<"1" | 10 | {name: "shanon"}>
    // // ["1", 10, {name: "shanon"}]

    // const a: test = ['1', '']