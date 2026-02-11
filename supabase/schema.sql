-- SYNTHIA Lead Generator - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    position VARCHAR(255),
    source VARCHAR(100) DEFAULT 'website',
    lead_score INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- VISITORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    language VARCHAR(10) DEFAULT 'es',
    country VARCHAR(10),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_visits INTEGER DEFAULT 1,
    total_time_spent INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 0,
    events JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    response TEXT,
    is_from_ai BOOLEAN DEFAULT FALSE,
    intent VARCHAR(100),
    entities JSONB DEFAULT '{}'::jsonb,
    sentiment VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at);

-- ============================================
-- LEAD_SCORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    factors JSONB DEFAULT '{}'::jsonb,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_scores_lead ON lead_scores(lead_id);

-- ============================================
-- LEAD_ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created ON lead_activities(created_at);

-- ============================================
-- LEAD_GEN_SYSTEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_gen_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    config JSONB DEFAULT '{}'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default lead generation systems
INSERT INTO lead_gen_systems (name, type, status) VALUES
    ('Behavioral Targeting', 'tracking', 'active'),
    ('Progressive Profiling', 'data_collection', 'active'),
    ('Smart Pop-ups', 'engagement', 'active'),
    ('Exit Intent Detection', 'engagement', 'active'),
    ('Scroll Depth Tracking', 'analytics', 'active'),
    ('Time-on-Site Analysis', 'analytics', 'active'),
    ('A/B Testing Engine', 'optimization', 'active'),
    ('Heatmap Analytics', 'analytics', 'active'),
    ('Form Optimization', 'conversion', 'active'),
    ('Chatbot Qualification', 'qualification', 'active'),
    ('Retargeting Triggers', 'marketing', 'active'),
    ('Lead Scoring AI', 'qualification', 'active'),
    ('CRM Integration', 'integration', 'active'),
    ('Email Automation', 'marketing', 'active'),
    ('SMS Notifications', 'marketing', 'active'),
    ('Multi-channel Attribution', 'analytics', 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- EMAIL_TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'marketing',
    language VARCHAR(10) DEFAULT 'es',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_lead ON analytics_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_leads_timestamp BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lead_gen_timestamp BEFORE UPDATE ON lead_gen_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_email_template_timestamp BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- POLICIES (Row Level Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_gen_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your needs)
CREATE POLICY "Enable all access for authenticated users" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON visitors
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON conversations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON lead_scores
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON lead_activities
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON lead_gen_systems
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON email_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for anon users" ON analytics_events
    FOR SELECT USING (auth.role() = 'anon');

CREATE POLICY "Enable insert access for anon users" ON analytics_events
    FOR INSERT WITH CHECK (auth.role() = 'anon');

-- ============================================
-- VIEWS
-- ============================================

-- Lead overview view
CREATE OR REPLACE VIEW lead_overview AS
SELECT
    l.id,
    l.email,
    l.name,
    l.company,
    l.position,
    l.source,
    l.lead_score,
    l.status,
    l.created_at,
    l.converted_at,
    COUNT(DISTINCT c.id) as conversation_count,
    COUNT(DISTINCT a.id) as activity_count
FROM leads l
LEFT JOIN conversations c ON c.lead_id = l.id
LEFT JOIN lead_activities a ON a.lead_id = l.id
GROUP BY l.id;

-- ============================================
-- COMPLETED
-- ============================================
