/** Element type for arrays/tuples */
export type ElementOf< T > = T extends readonly ( infer E )[] ? E : never;

/** Flatten one level of array */
export type Flat< T extends readonly any[] > = T extends readonly ( infer E )[] ? ( E extends readonly any[] ? E[ number ] : E )[] : never;
