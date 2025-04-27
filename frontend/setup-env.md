# Supabase Setup

To use Supabase with this project, follow these steps:

1. Install the Supabase dependency:
```bash
npm install @supabase/supabase-js
```

2. Create a `.env.local` file in the frontend directory with the following content:
```
NEXT_PUBLIC_SUPABASE_URL=https://wrsbmatgafwbtyxomqhk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyc2JtYXRnYWZ3YnR5eG9tcWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMjdXBhYmFzZSI6InJvbGUiLCJ
```

3. Restart your Next.js development server to pick up the new environment variables.

The Supabase client is now configured in `lib/supabase.ts` and can be imported into any component that needs to interact with the database. 