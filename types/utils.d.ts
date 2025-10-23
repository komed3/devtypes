import { Simplify } from './base';

/** Merge two object types. Right-hand fields override left-hand ones. */
export type Merge< Left, Right > = Simplify< Pick< Left, Exclude< keyof Left, keyof Right > > & Right >;

/** Intersection of unions -> prefer mapped merge strategy */
export type MergeMany< T extends any[] > = T extends [ infer H, ...infer R ] ? Merge< H, MergeMany< R > > : {};

/** Convert a union to an intersection */
export type UnionToIntersection< U > = ( U extends any ? ( k: U ) => void : never ) extends ( ( k: infer I ) => void ) ? I : never;

/** Extract keys of T whose values match V */
export type KeysByValue< T, V > = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

/** Pick by value type */
export type PickByValue< T, V > = Pick< T, KeysByValue< T, V > >;

/** Omit keys whose value matches V */
export type OmitByValue< T, V > = Omit< T, KeysByValue< T, V > >;

/** Make optional keys */
export type OptionalKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? K : never }[ keyof T ];

/** Make required keys */
export type RequiredKeys< T > = { [ K in keyof T ]-?: {} extends Pick< T, K > ? never : K }[ keyof T ];

/** Expand/flatten insertion points for nicer hover results */
export type Expand< T > = T extends object ? { [ K in keyof T ]: T[ K ] } & {} : T;
