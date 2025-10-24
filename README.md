# TypeScript Advanced Type Utilities

A comprehensive collection of high-performance TypeScript type utilities focused on type safety and developer experience.

## Features

- **Zero Runtime Overhead** - Pure type definitions
- **Type Safety** - Advanced constraint utilities
- **Modular Design** - Import only what you need
- **Rich Toolset** - From basic to advanced type operations
- **IntelliSense Optimized** - Great IDE support

## Installation

```bash
npm install <...>
```

## Quick Examples

### Object Type Manipulation

```ts
import { Merge, RequireExactlyOne } from '<...>';

type UserBase = { id: number; name: string; email?: string };
type UserAuth = { email: string; password: string };

// Merge types (smart conflict resolution)
type User = Merge< UserBase, UserAuth >;
// { id: number; name: string; email: string; password: string }

// Require exactly one field
type LoginCredentials = RequireExactlyOne<
    { email?: string; phone?: string; username?: string; },
    'email' | 'phone' | 'username'
>;
```

### Deep Utilities

```ts
import { DeepPartial, DeepRequired } from '<...>';

interface Config {
    server: {
        port: number;
        host: string;
        ssl?: {
            cert: string;
            key: string;
        };
    };
    database: {
        url: string;
        timeout?: number;
    };
}

// Make everything optional
type PartialConfig = DeepPartial< Config >;

// Make everything required
type FullConfig = DeepRequired< Config >;
```

## Documentation

### Core Modules

- **base** - Core type utilities
- **collections** - Array and object operations
- **combinators** - Union and tuple operations
- **constraints** - Property requirement utilities
- **functionals** - Function type utilities
- **primitives** - Primitive type helpers
- **utils** - General type transformations

## Performance Tips

Import from specific modules:

```ts
// Good
import { Merge } from '<...>/types/utils';

// Avoid
import { Merge } from '<...>';
```

## License

**Copyright 2025 Paul Köhler (komed3).**  
Distributed under the MIT license.
