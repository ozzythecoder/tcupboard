# Backend Dependency Audit

## Priorities
- Upgrade packages with security vulnerabilities

## Security / Outdated

| Package | Installed | Current | Issue |
|---------|-----------|---------|-------|
| `multer-storage-cloudinary` | `4.0.0` | 4.0.0 | **Unmaintained** — last updated 6 years ago; conflicts with Cloudinary v2 |
| `cloudinary` | `^1.41.3` | v2.9.0 | Major version behind; v2 is recommended |
| `express` | `^4.21.1` | v5.2.1 | Express 5 is now stable (March 2025) |

## Other Issues

- **Redundant dotenv loading** — `dotenv.config()` is called in 8+ files; should load once in `loadEnv.js` and remove from all other files

## Recommended Priorities

- [ ] Evaluate `multer-storage-cloudinary` replacement (unmaintained)
- [x] Rename `REACT_APP_XENFORO_CLIENT_ID` to a backend-appropriate name
- [ ] Consolidate dotenv loading to a single entry point