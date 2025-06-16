-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    demo_url TEXT,
    github_url TEXT,
    date DATE NOT NULL,
    linkedin_imported BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    category VARCHAR(100) NOT NULL,
    linkedin_imported BOOLEAN DEFAULT FALSE,
    endorsements INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    expiry_date DATE,
    description TEXT NOT NULL,
    logo TEXT,
    credential_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'expired')),
    auto_imported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CTF events table
CREATE TABLE IF NOT EXISTS ctf_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    team VARCHAR(255) NOT NULL,
    rank INTEGER NOT NULL,
    total_teams INTEGER NOT NULL,
    flags_captured INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    platform VARCHAR(100),
    points INTEGER,
    writeup_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create digital badges table
CREATE TABLE IF NOT EXISTS digital_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    badge_url TEXT NOT NULL,
    verification_url TEXT,
    platform VARCHAR(100) NOT NULL CHECK (platform IN ('linkedin', 'canvas', 'credly', 'other')),
    skills TEXT[],
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bug bounty findings table
CREATE TABLE IF NOT EXISTS bug_bounty_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL CHECK (platform IN ('hackerone', 'bugcrowd', 'intigriti', 'other')),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('resolved', 'triaged', 'duplicate', 'not-applicable')),
    bounty DECIMAL(10,2),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    cve VARCHAR(50),
    report_url TEXT,
    company VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security articles table
CREATE TABLE IF NOT EXISTS security_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    published_date DATE NOT NULL,
    summary TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    read_time INTEGER,
    views INTEGER,
    claps INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OSINT capabilities table
CREATE TABLE IF NOT EXISTS osint_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    tools TEXT[] NOT NULL DEFAULT '{}',
    examples TEXT[],
    proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site info table
CREATE TABLE IF NOT EXISTS site_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    resume TEXT,
    icon TEXT,
    background_image TEXT,
    background_opacity DECIMAL(3,2) DEFAULT 0.80,
    theme JSONB DEFAULT '{}',
    site_url TEXT,
    linkedin_profile_url TEXT,
    auto_import_settings JSONB DEFAULT '{}',
    under_construction_mode JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_certifications_date ON certifications(date DESC);
CREATE INDEX IF NOT EXISTS idx_ctf_events_date ON ctf_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_digital_badges_date ON digital_badges(date DESC);
CREATE INDEX IF NOT EXISTS idx_bug_bounty_findings_date ON bug_bounty_findings(date DESC);
CREATE INDEX IF NOT EXISTS idx_security_articles_date ON security_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_osint_capabilities_category ON osint_capabilities(category);
