diff --git a/migration/README.md b/migration/README.md
index 08ce7aa9812c17bd01847a4cecb950c7a8d694fd..582e279d8a4ce061ff541a6e72cc6e1d69432f99 100644
--- a/migration/README.md
+++ b/migration/README.md
@@ -56,50 +56,63 @@ supabase link --project-ref tlwqkglfyjydwsgjrclx
 
 You'll be prompted for your database password.
 
 ### 4. Push the Schema to Production
 
 ```bash
 supabase db push
 ```
 
 This will run all migrations in `supabase/migrations/` against your production database.
 
 ### 5. Run the Data Migration Script
 
 After the schema is in place, populate the data:
 
 ```bash
 cd migration
 npm install
 export SUPABASE_URL="https://tlwqkglfyjydwsgjrclx.supabase.co"
 export SUPABASE_SERVICE_KEY="your-service-role-key"
 npm run migrate
 ```
 
 ---
 
+## Optional: Run Insert Scripts via GitHub Actions
+
+If you prefer to run `insert-deals.js` from GitHub, use the workflow at
+`.github/workflows/supabase-insert-deals.yml`. Set repository secrets:
+
+- `SUPABASE_URL` (project URL, e.g. `https://tlwqkglfyjydwsgjrclx.supabase.co`)
+- `SUPABASE_SERVICE_KEY` (service role key)
+
+Then trigger **Actions → Supabase insert deals** and provide the script name
+relative to `migration/` (default: `insert-deals.js`).
+
+---
+
 ## Alternative: Manual SQL Setup
 
 If you prefer not to use the CLI, see the manual setup instructions below.
 
 ---
 
 ## Database Schema
 
 The schema creates the following tables:
 
 ### Core Entities
 | Table | Purpose |
 |-------|---------|
 | `companies` | Startup/company profiles |
 | `people` | Founders, executives, inventors |
 | `investors` | VCs, angels, corporate investors |
 | `sectors` | Industry categories |
 | `cities` | Geographic locations |
 
 ### Funding Data
 | Table | Purpose |
 |-------|---------|
 | `funding_rounds` | Individual funding events |
 
 ### Relationships
