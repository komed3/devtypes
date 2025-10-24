/**
 * Collection Types
 * Collection and deep helpers (arrays, tuples, records).
 * 
 * @module types/collection
 */

/** Element type for arrays/tuples */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/** Flatten one level of array */
export type Flat< T extends readonly any[] > = T extends readonly ( infer E )[]
    ? ( E extends readonly any[] ? E[ number ] : E )[]
    : never;

/** Deep partial (recursive) */
export type DeepPartial< T > = {
    [ P in keyof T ]?: T[ P ] extends Array< infer U >
        ? DeepPartial< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
        ? ReadonlyArray< DeepPartial< U > >
        : T[ P ] extends object
            ? DeepPartial< T[ P ] >
            : T[ P ];
};

/** Deep required (recursive) */
export type DeepRequired< T > = {
    [ P in keyof T ]-?: T[ P ] extends Array< infer U >
        ? DeepRequired< U >[]
        : T[ P ] extends ReadonlyArray< infer U >
        ? ReadonlyArray< DeepRequired< U > >
        : T[ P ] extends object
            ? DeepRequired< T[ P ] >
            : T[ P ];
};

/** Deep readonly (recursive) */
export type DeepReadonly< T > = T extends Function ? T
    : T extends Array< infer U > ? ReadonlyArray< DeepReadonly< U > >
    : T extends object ? { readonly [ K in keyof T ]: DeepReadonly< T[ K ] > }
    : T;

/** Deep mutable (remove readonly and optional recursively) */
export type DeepMutable< T > = T extends Function ? T
    : T extends Array< infer U > ? Array< DeepMutable< U > >
    : T extends object ? { -readonly [ K in keyof T ]-?: DeepMutable< T[ K ] > }
    : T;

/** Path helpers: nested property path as dot-separated keys (string literal union) */
export type Join< K, P > = K extends string | number ? P extends string | number
    ? `${ K & ( string | number ) }.${ P & ( string | number ) }`
    : never : never;

type Prev = [ never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

/** Build all nested paths for an object up to a reasonable recursion depth */
export type Paths< T, D extends number = 5 > = [ D ] extends [ never ] ? never : T extends object ? {
    [ K in keyof T ]-?: K extends string | number ? T[ K ] extends object
        ? K | Join< K, Paths< T[ K ], Prev[ D ] > >
        : K : never
}[ keyof T ] : '';

/** Get a nested value by path (dot notation) */
export type PathValue< T, P extends string > = P extends `${ infer K }.${ infer Rest }`
    ? K extends keyof T ? PathValue< T[ K ], Rest > : never
    : P extends keyof T ? T[ P ] : never;
