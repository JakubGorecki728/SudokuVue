import _ from "lodash"

export type Row = { 
  id: number, 
  name: string, 
  value: string, 
  secondSub: { 
    a: string, 
    b: number 
  },
  subItem: { 
    id: number, 
    name: string, 
    subSubItem: { 
      name: 'hej' 
      subSubSubItem: {
        idx: number
      }
    } 
  }
}


//ORIGINAL IMPLEMENTATION
type ObjPath<T extends object> = 
{[K in keyof T  & (string | number)]: T[K] extends object 
? `${K}` | `${K}.${ObjPath<T[K]>}` : `${K}`
}[keyof T & (string | number)];


type DisplayableTypes = number | string | boolean
//Implementation for primitives only
type Path<T extends object> = 
{[K in keyof T  & (string | number)]: T[K] extends object 
? `${K}.${Path<T[K]>}` : (T[K] extends DisplayableTypes ? `${K}` : never)
}[keyof T & (string | number)];


type PathKeys<T extends string> = T extends `${string}{${infer First}}${infer Rest}` ? First | PathKeys<Rest> : never;
type PathAllowedTypes = string | number | boolean | null;
type SearchParams = Record<string, PathAllowedTypes | undefined>
type UrlPathParams<T extends string> = PathKeys<T> extends never ? undefined : Record<PathKeys<T>, PathAllowedTypes>;
type HttpConfig<Path extends string> = Omit<{
  path: UrlPathParams<Path>,
  body?: any,
  queries?: SearchParams 
}, UrlPathParams<Path> extends undefined ? 'path' : never>


export const GET = <T extends string, E extends HttpConfig<T>>(path: T, config: E) => {
  // eslint-disable-next-line prefer-const
  return () => {
    let reducedUrl: string = path;
    const paths = (config as any).path;
    const queries = (config as any).queries;
  
    if (paths) {
      Object.keys(paths).forEach(key => {
        reducedUrl = reducedUrl.replace(`{${key}}`, paths[key])
      })
    }

    if(queries) {
      const noUndefQueries = Object.entries(queries).filter(el => el[1] !== undefined);
      const params = new URLSearchParams(Object.fromEntries(noUndefQueries) as any).toString();
      reducedUrl = `${reducedUrl}${params ? '?' : ''}${params}`;
    }
  
    console.log(reducedUrl);
  }

}



