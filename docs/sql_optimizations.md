# Database / SQL Optimization Suggestions

1. Add indexes on frequently filtered/sorted columns:
   - `reports.created_at` (for ordering queries)
   - any `user_id` or `tenant_id` columns used in WHERE clauses.

2. Avoid `select('*')` in production endpoints. Only request necessary columns:
   - e.g., `.select('id,title,amount,created_at,user_id')`

3. For heavy aggregation queries (sales totals), create materialized views or pre-aggregated tables updated via triggers or a nightly job.

4. Use Supabase Row-Level Security (RLS) with policies that enforce `user_id = auth.uid()` to avoid excessive server-side filtering.

5. Consider inserting cache headers or using an in-memory cache (Redis) for dashboards that hit the same aggregates frequently.
