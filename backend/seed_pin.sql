-- First insert a test crew rank (if not exists)
INSERT INTO crew_ranks (name, daily_quota, max_logins)
VALUES ('TestRank', 1073741824, 2)  -- 1GB
ON CONFLICT (name) DO NOTHING;

-- Then insert a test crew member
INSERT INTO crew_members (id, rank_id, full_name, cabin_number, email, active)
VALUES (
  '12345678-1234-1234-1234-123456789012',
  (SELECT id FROM crew_ranks WHERE name = 'TestRank'),
  'Test User',
  'A101',
  'test@example.com',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Finally insert a test PIN code
INSERT INTO pin_codes (
  crew_member_id,
  pin_code,
  usage_bytes,
  remaining_quota,
  expires_at,
  is_active
)
VALUES (
  '12345678-1234-1234-1234-123456789012',
  '1234',
  0,
  1073741824,
  NOW() + INTERVAL '1 day',
  true
)
ON CONFLICT (pin_code) DO NOTHING; 