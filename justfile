set dotenv-load
set dotenv-required
set dotenv-filename := '.env'

prod_supabase_url := env('SUPABASE_PROD_URL')

gen_types:
    pnpm dlx supabase gen types --project-id {{ prod_supabase_url }} > shared/models.ts

copy_shared_types:
    cp shared/* apps/frontend/src/types/
    cp shared/* apps/backend/src/types/