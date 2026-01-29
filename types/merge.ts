/**
 * Merging Types
 * 
 * Utility types for deep merging and manipulating object types.
 * 
 * @module devtypes/merge
 * @author komed3
 * @license MIT
 */

import { Simplify } from './util';


/**
 * Merge two object types shallowly.
 * 
 * @remarks
 * Properties from the right-hand type override properties from the left-hand
 * type on key conflicts.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: number; b: string };
 * type B = { b: number; c: boolean };
 * type Merged = Merge< A, B >;
 * // { a: number; b: number; c: boolean }
 */
export type Merge< Left, Right > = Simplify<
    Pick< Left, Exclude< keyof Left, keyof Right > > & Right
>;

/**
 * Strict merge of two object types.
 * 
 * @remarks
 * Similar to {@link Merge} but preserves properties from the left-hand type
 * by only adding non-conflicting properties from the right-hand type.
 * 
 * @template Left - Base object type
 * @template Right - Non-Overriding object type
 * 
 * @example
 * type A = { a: number; b: string };
 * type B = { b: number; c: boolean };
 * type Merged = MergeStrict< A, B >;
 * // { a: number; b: string; c: boolean }
 */
export type MergeStrict< Left, Right > = Simplify<
    Left & Pick< Right, Exclude< keyof Right, keyof Left > >
>;

/**
 * Deeply merge two object types.
 * 
 * @remarks
 * Recursively merges nested objects. On conflicts, the right-hand type
 * always takes precedence.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: { x: number; y: string }; b: string };
 * type B = { a: { y: number; z: boolean }; c: boolean };
 * type Merged = DeepMerge< A, B >;
 * // { a: { x: number; y: number; z: boolean }; b: string; c: boolean }
 */
export type DeepMerge< Left, Right > = Simplify< {
    [ K in keyof Left | keyof Right ]:
        K extends keyof Right
            ? K extends keyof Left
                ? Left[ K ] extends ReadonlyArray< any >
                    ? Right[ K ]
                    : Left[ K ] extends object
                        ? Right[ K ] extends object
                            ? DeepMerge< Left[ K ], Right[ K ] >
                            : Right[ K ]
                        : Right[ K ]
                : Right[ K ]
            : K extends keyof Left
                ? Left[ K ]
                : never;
} & {} >;

/**
 * Strict deep merge of two object types.
 * 
 * @remarks
 * Similar to {@link DeepMerge} but preserves array types from the left-hand
 * side by injecting right-hand properties into array element types.
 * 
 * @template Left - Base object type
 * @template Right - Overriding object type
 * 
 * @example
 * type A = { a: { x: { foo: true } } };
 * type B = { a: { x: { foo: number, bar: string } } };
 * type Merged = DeepMergeStrict< A, B >;
 * // { a: { x: { foo: true, bar: string } } }
 */
export type DeepMergeStrict< Left, Right > = Simplify<
    Left extends Array< infer U >
        ? DeepMergeStrict< U, Right >[]
        : Left extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepMergeStrict< U, Right > >
            : Left extends object
                ? Right extends object
                    ? { [ K in keyof Left ]: K extends keyof Right
                            ? DeepMergeStrict< Left[ K ], Right[ K ] >
                            : DeepMergeStrict< Left[ K ], Right > } & {
                        [ K in Exclude< keyof Right, keyof Left > ]: Right[ K ] }
                    : Left
                : Left
>;

/**
 * Merge multiple object types sequentially.
 * 
 * @remarks
 * Applies shallow merges from left to right over a tuple of object types.
 * 
 * @template T - Tuple of object types
 * 
 * @example
 * type A = { a: number };
 * type B = { b: string };
 * type C = { b: number };
 * type D = { c: boolean };
 * type Merged = MergeMany< [ A, B, C, D ] >;
 * // { a: number, b: number, c: boolean }
 */
export type MergeMany< T extends unknown[] > = Simplify<
    T extends [ infer H, ...infer R ]
        ? Merge< H, MergeMany< R > >
        : {}
>;

/**
 * Strictly merge multiple object types sequentially.
 * 
 * @remarks
 * Applies strict merges from left to right over a tuple of object types.
 * 
 * @template T - Tuple of object types
 * 
 * @example
 * type A = { a: number };
 * type B = { b: string };
 * type C = { b: number };
 * type D = { c: boolean };
 * type Merged = MergeManyStrict< [ A, B, C, D ] >;
 * // { a: number, b: string, c: boolean }
 */
export type MergeManyStrict< T extends unknown[] > = Simplify<
    T extends [ infer H, ...infer R ]
        ? MergeStrict< H, MergeManyStrict< R > >
        : {}
>;

/**
 * Deeply merge multiple object types sequentially.
 * 
 * @remarks
 * Applies deep merges from left to right over a tuple of object types.
 * 
 * @template T - Tuple of object types
 * 
 * @example
 * type A = { a: { x: number } };
 * type B = { a: { y: string } };
 * type C = { a: { x: string } };
 * type Merged = DeepMergeMany< [ A, B, C ] >;
 * // { a: { x: string; y: string } }
 */
export type DeepMergeMany< T extends unknown[] > = Simplify<
    T extends [ infer H, ...infer R ]
        ? DeepMerge< H, DeepMergeMany< R > >
        : {}
>;

/**
 * Strictly deep merge multiple object types sequentially.
 * 
 * @remarks
 * Applies strict deep merges from left to right over a tuple of object types.
 * 
 * @template T - Tuple of object types
 * 
 * @example
 * type A = { a: { x: { foo: true } } };
 * type B = { a: { x: { bar: string } } };
 * type C = { a: { x: { foo: number } } };
 * type Merged = DeepMergeManyStrict< [ A, B, C ] >;
 * // { a: { x: { foo: true; bar: string } } }
 */
export type DeepMergeManyStrict< T extends unknown[] > = Simplify<
    T extends [ infer H, ...infer R ]
        ? DeepMergeStrict< H, DeepMergeManyStrict< R > >
        : {}
>;

/**
 * Deeply inject properties into an object tree.
 * 
 * @remarks
 * Injects properties from type D into every nested object within T.
 * Handles arrays and readonly arrays by injecting into their element types.
 * 
 * Properties in T are never overwritten by properties from D.
 * 
 * @template T - Target object type
 * @template D - Injected type
 * 
 * @example
 * type Nested = { level_1: { level_2: { } } };
 * type Metadata = { metadata?: string };
 * type DeepInjected = DeepInject< Nested, Metadata >;
 * // { level_1: { level_2: { metadata?: string }, metadata?: string }, metadata?: string }
 */
export type DeepInject< T, D > = Simplify<
    T extends Array< infer U >
        ? DeepInject< U, D >[]
        : T extends ReadonlyArray< infer U >
            ? ReadonlyArray< DeepInject< U, D > >
            : T extends object
                ? { [ K in keyof T ]: T[ K ] extends object
                        ? DeepInject< T[ K ], D >
                        : T[ K ] } & {
                    [ K in Exclude< {
                        [ K in keyof D ]-?: {} extends Pick< D, K > ? K : never
                    }[ keyof D ], keyof T > ]?: D[ K ] } & {
                    [ K in Exclude< {
                        [ K in keyof D ]-?: {} extends Pick< D, K > ? never : K
                    }[ keyof D ], keyof T > ]-?: D[ K ] }
                : T
>;
