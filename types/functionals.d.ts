/** Function-related higher-order type utilities */

/** Curry a function type (simple 1-arg recursion) */
export type Curry< F > = F extends ( ...args: infer Args ) =>
    infer R ? Args extends [ infer A, ...infer Rest ]
        ? ( a: A ) => Curry< ( ...args: Rest ) => R >
        : R : never;

/** Build a tuple of the parameter types for a curried function */
export type CurriedParams< F > = F extends ( a: infer A ) =>
    infer R ? [ A, ...CurriedParams< R > ] : [];

/** Compose two functions (R1 -> R2) */
export type Compose< F extends Function, G extends Function > = F extends ( arg: any ) =>
    infer R1 ? G extends ( arg: infer A ) => any ? ( arg: A extends R1 ? A : R1 ) => any : never : never;

/** Promisify a function type */
export type Promisify< F > = F extends ( ...args: infer A ) =>
    infer R ? ( ...args: A ) => Promise< R > : never;

/** Unwrap a Promise type (built-in Awaited exists in newer TS) */
export type UnwrapPromise< T > = T extends Promise< infer U > ? U : T;
