# Frontend Rebuild

## Goals
- [ ] Move rich-text editor to TipTap or Lexical
- [x] Migrate frontend styles
    - [x] MUI -> CSS / CSS-first component library
- [x] Move to Tanstack Router
- [x] Move API logic to Tanstack Query
- [x] Clean up folder hierarchy

    ```
    components  - feature-agnostic UI
    config      - application configuration
    hooks       - hooks, I guess
    lib         - aka "utils" (unify utils here)
    pages       - pseudo-file-based routing (organize based on url pathing)
    services    - aka features, aka resources... per-domain view and business logic
    styles      - global styles!
    types       - type definitions
    ```
