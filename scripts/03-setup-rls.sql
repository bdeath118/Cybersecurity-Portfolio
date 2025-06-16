-- Enable Row Level Security (RLS) for all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctf_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_bounty_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE osint_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (portfolio is public)
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ctf_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON digital_badges FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bug_bounty_findings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON security_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON osint_capabilities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_info FOR SELECT USING (true);

-- Admin users table should only be accessible by service role
CREATE POLICY "Service role only" ON admin_users FOR ALL USING (auth.role() = 'service_role');

-- Create policies for admin write access (using service role)
CREATE POLICY "Service role write access" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON skills FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON certifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON ctf_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON digital_badges FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON bug_bounty_findings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON security_articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON osint_capabilities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write access" ON site_info FOR ALL USING (auth.role() = 'service_role');
