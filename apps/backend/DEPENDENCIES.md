# Backend Dependency Audit

## Priorities
- Upgrade packages with security vulnerabilities

## Security / Outdated

| Package | Installed | Current | Issue |
|---------|-----------|---------|-------|
| `multer-storage-cloudinary` | `4.0.0` | 4.0.0 | **Unmaintained** — last updated 6 years ago; conflicts with Cloudinary v2 |
| `cloudinary` | `^1.41.3` | v2.9.0 | Major version behind; v2 is recommended |

## Recommended Priorities

- [ ] Evaluate `multer-storage-cloudinary` replacement (unmaintained)
- [ ] Cloudinary upgrade
- [x] Rename `REACT_APP_XENFORO_CLIENT_ID` to a backend-appropriate name
- [x] Consolidate dotenv loading to a single entry point