# TODO

## Backend
- [ ] Migrate db to supabase
    - [x] migrate users table to supabase
    - [ ] move all pg calls into supabase calls (*in progress*)
- [ ] Integrate auth0 into supabase
- [ ] Convert to typescript (*in progress*)

## Frontend
- [x] Migrate to Typescript
- [x] Find alternative to ProfileSync.js (Auth0 post-login/register action)
- [ ] Move to Tanstack Query
- [ ] Upgrade to React Router v7
- [ ] Rebuild pages
- [ ] Consolidate dependencies (see DEPENDENCIES.md)
- [ ] Migrate richtext to TipTap
    - [ ] Document richtext formatting differences?

## Architecture
- [ ] Uptime strategy
    - pm2 vs systemd?
- [ ] Telemetry
