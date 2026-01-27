# TypeScript Advanced Type Utilities

A comprehensive collection of **more than 140 high-performance TypeScript type utilities** focused on type safety and developer experience.

## Features

- **Zero Runtime Overhead** - Pure type definitions
- **Type Safety** - Advanced constraint utilities
- **Modular Design** - Import only what you need
- **Rich Toolset** - From basic to advanced type operations
- **IntelliSense Optimized** - Great IDE support

## Installation

```bash
npm install devtypes
```

## Documentation

Read the full **[devtypes Documentation](https://komed3.github.io/devtypes/index.html)** for detailed usage instructions, examples, and API references.

## Quick Examples

### Object Type Manipulation

```ts
import type { Merge } from 'devtypes/merge';
import type { RequireExactlyOne } from 'devtypes/constraint';

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
import type { DeepPartial, DeepRequired } from 'devtypes/transform';

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

## Core Modules

| Module | Purpose |
|--------|---------|
| **assert** | Assertion utilities for compile-time checks |
| **class** | Class-specific utilities: methods, properties, constructors |
| **condition** | Conditional type utilities (If and Equals) |
| **constraint** | Property requirement constraints and validation |
| **function** | Function type utilities: curry, compose, promisify |
| **guard** | Type guard utilities for runtime type checking |
| **list** | List-like structures (arrays, sets, maps, records, iterables) |
| **merge** | (Deep) merging and intersection of types |
| **object** | Object type manipulation and property utilities |
| **primitive** | Primitive type utilities and literal handling |
| **transform** | (Deep) transformations for objects, arrays, and nested structures |
| **tuple** | Tuple-specific utilities and manipulations |
| **union** | Union type utilities: exclusion, extraction, conversion |
| **util** | Generic utility types: branding, boxing, casting, simplification |

## Performance Tips

Import from specific modules for best IDE performance:

```ts
// Good - direct import
import type { Brand } from 'devtypes/util';
import type { MethodNames } from 'devtypes/class';

// Avoid - star imports slow down IntelliSense
import * as Types from 'devtypes';
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

**Copyright 2025–2026 Paul Köhler (komed3).**  
Distributed under the MIT license.
