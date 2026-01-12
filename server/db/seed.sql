-- Reset sequences and seed teams
TRUNCATE teams, members, events, proposed_times, time_votes RESTART IDENTITY CASCADE;

INSERT INTO teams (name) VALUES
  ('Engineering'),
  ('Design');

-- Seed members (3 per team)
-- Password: TestPassword1! (bcrypt hashed)
INSERT INTO members (name, team_id, email, password) VALUES
  ('Alice Smith', 1, 'alice@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m'),
  ('Bob Johnson', 1, 'bob@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m'),
  ('Carol Williams', 1, 'carol@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m'),
  ('Dan Brown', 2, 'dan@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m'),
  ('Eve Davis', 2, 'eve@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m'),
  ('Frank Miller', 2, 'frank@example.com', '$2b$10$SxBHa6Bkt/Q6yynmj8lK0u3qF.0UdjKJmg/jhEaLc1OHkQxyiD49m');

-- Seed events for Engineering team (team_id = 1)
INSERT INTO events (name, description, state, team_id, creator_id, finalized_time_id, created_at) VALUES
  ('Sprint Planning', 'Weekly sprint planning meeting', 'voting', 1, 1, NULL, NOW() - INTERVAL '2 days'),
  ('Code Review Session', 'Review recent PRs together', 'voting', 1, 2, NULL, NOW() - INTERVAL '1 day'),
  ('Team Lunch', 'Monthly team lunch outing', 'finalized', 1, 1, 5, NOW() - INTERVAL '5 days');

-- Seed events for Design team (team_id = 2)
INSERT INTO events (name, description, state, team_id, creator_id, finalized_time_id, created_at) VALUES
  ('Design Critique', 'Review latest mockups', 'voting', 2, 4, NULL, NOW() - INTERVAL '3 days');

-- Seed proposed times
INSERT INTO proposed_times (event_id, proposer_id, proposed_at, created_at) VALUES
  -- Sprint Planning (event 1) - 2 proposed times
  (1, 1, NOW() + INTERVAL '2 days' + TIME '10:00', NOW() - INTERVAL '2 days'),
  (1, 2, NOW() + INTERVAL '2 days' + TIME '14:00', NOW() - INTERVAL '1 day'),
  -- Code Review Session (event 2) - 2 proposed times
  (2, 2, NOW() + INTERVAL '3 days' + TIME '11:00', NOW() - INTERVAL '1 day'),
  (2, 3, NOW() + INTERVAL '3 days' + TIME '15:00', NOW() - INTERVAL '12 hours'),
  -- Team Lunch (event 3) - finalized time
  (3, 1, NOW() + INTERVAL '7 days' + TIME '12:00', NOW() - INTERVAL '5 days'),
  -- Design Critique (event 4) - 2 proposed times
  (4, 4, NOW() + INTERVAL '4 days' + TIME '09:00', NOW() - INTERVAL '3 days'),
  (4, 5, NOW() + INTERVAL '4 days' + TIME '16:00', NOW() - INTERVAL '2 days');

-- Seed votes
INSERT INTO time_votes (proposed_time_id, voter_id, vote, created_at) VALUES
  -- Votes for Sprint Planning time 1 (10am)
  (1, 1, 1, NOW() - INTERVAL '2 days'),
  (1, 2, 1, NOW() - INTERVAL '1 day'),
  (1, 3, -1, NOW() - INTERVAL '1 day'),
  -- Votes for Sprint Planning time 2 (2pm)
  (2, 1, -1, NOW() - INTERVAL '1 day'),
  (2, 2, 1, NOW() - INTERVAL '1 day'),
  (2, 3, 1, NOW() - INTERVAL '12 hours'),
  -- Votes for Code Review time 1
  (3, 1, 1, NOW() - INTERVAL '1 day'),
  (3, 2, 1, NOW() - INTERVAL '1 day'),
  -- Votes for Design Critique time 1
  (6, 4, 1, NOW() - INTERVAL '3 days'),
  (6, 5, 1, NOW() - INTERVAL '2 days');
