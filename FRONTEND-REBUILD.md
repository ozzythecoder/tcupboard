# Frontend Rebuild

## Goals
- [ ] Migrate frontend styles
    - [ ] MUI -> CSS / CSS-first component library
- [ ] Upgrade React Router
- [ ] Move API logic to Tanstack Query
- [ ] Move rich-text editor to TipTap or Lexical
- [ ] Clean up folder hierarchy
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
