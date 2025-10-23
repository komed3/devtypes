/** Element type for arrays/tuples */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/** Flatten one level of array */
export type Flat< T extends readonly any[] > = T extends readonly ( infer E )[]
    ? ( E extends readonly any[] ? E[ number ] : E )[]
    : never;

/** Deep partial (recursive) */
export type DeepPartial< T > = T extends Function ? T
    : T extends Array< infer U > ? Array< DeepPartial< U > >
    : T extends object ? { [ K in keyof T ]?: DeepPartial< T[ K ] > }
    : T;

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
