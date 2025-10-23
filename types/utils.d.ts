import { Simplify } from './base';

/** Merge two object types. Right-hand fields override left-hand ones. */
export type Merge< Left, Right > = Simplify< Pick< Left, Exclude< keyof Left, keyof Right > > & Right >;

/** Intersection of unions -> prefer mapped merge strategy */
export type MergeMany< T extends any[] > = T extends [ infer H, ...infer R ] ? Merge< H, MergeMany< R > > : {};

/** Convert a union to an intersection */
export type UnionToIntersection< U > = ( U extends any ? ( k: U ) => void : never ) extends ( ( k: infer I ) => void ) ? I : never;
