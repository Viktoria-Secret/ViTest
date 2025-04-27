-- Initialize Vik.tor database

-- Create crew_members table
CREATE TABLE IF NOT EXISTS crew_members (
    id SERIAL PRIMARY KEY,
    role_code VARCHAR(10) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    allowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    pin VARCHAR(20) NOT NULL UNIQUE,
    rank VARCHAR(10) NOT NULL,
    mac_address VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    data_used BIGINT NOT NULL DEFAULT 0,
    data_limit BIGINT NOT NULL DEFAULT 10000000000,  -- 10GB in bytes
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vouchers_pin ON vouchers(pin);
CREATE INDEX IF NOT EXISTS idx_vouchers_rank ON vouchers(rank);
CREATE INDEX IF NOT EXISTS idx_crew_members_code ON crew_members(role_code);

-- Add role data from the Google Sheet
INSERT INTO crew_members (role_code, role_name, allowed) VALUES
('CPT', 'Captain', TRUE),
('CO', 'Chief Officer', TRUE),
('2O(N)', '2nd Officer(S)', TRUE),
('2O(S)', '2nd Officer(n)', TRUE),
('3O', '3d Officer', FALSE),
('JO', 'Junior Officer', FALSE),
('CE', 'Chief Engineer', TRUE),
('2E', '2nd Engineer', TRUE),
('3E', '3d Engineer', TRUE),
('4E', '4th Engineer', TRUE),
('5E', '5d Engineer', FALSE),
('FTR', 'Fitter', FALSE),
('WLD', 'Welder', TRUE),
('FTRD', 'Fitter(Deck)', TRUE),
('DCDT', 'Deck cadet', TRUE),
('ECDT', 'Engine cadet', TRUE)
ON CONFLICT (role_code) DO UPDATE SET
    role_name = EXCLUDED.role_name,
    allowed = EXCLUDED.allowed,
    updated_at = CURRENT_TIMESTAMP;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_crew_members_updated_at
BEFORE UPDATE ON crew_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();