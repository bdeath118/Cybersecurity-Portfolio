-- Insert default site info if none exists
INSERT INTO site_info (
    name, 
    title, 
    description, 
    email, 
    github, 
    linkedin, 
    twitter,
    icon,
    background_image,
    background_opacity,
    theme,
    site_url,
    under_construction_mode
) 
SELECT 
    'John Doe',
    'Cybersecurity Professional',
    'Passionate about cybersecurity, ethical hacking, and protecting digital assets.',
    'john.doe@example.com',
    'https://github.com/johndoe',
    'https://linkedin.com/in/johndoe',
    'https://twitter.com/johndoe',
    '/images/avatar-photo.jpg',
    '/images/background.jpeg',
    80,
    '{"primaryColor": "#3b82f6", "secondaryColor": "#1e40af", "backgroundColor": "#ffffff", "textColor": "#1f2937"}',
    'https://cybersecurity-portfolio-bdeath118.vercel.app',
    '{"enabled": true, "message": "We are working hard to bring you something amazing. Stay tuned!", "estimatedCompletion": "Soon", "progressPercentage": 75, "allowAdminAccess": true}'
WHERE NOT EXISTS (SELECT 1 FROM site_info);

-- Insert sample projects if none exist
INSERT INTO projects (title, summary, description, technologies, date)
SELECT 
    'Network Security Assessment Tool',
    'A comprehensive tool for assessing network security vulnerabilities',
    'Developed a Python-based tool that performs automated network security assessments, including port scanning, vulnerability detection, and report generation.',
    ARRAY['Python', 'Nmap', 'Scapy', 'Flask'],
    '2024-01-15'
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO projects (title, summary, description, technologies, date)
SELECT 
    'Web Application Penetration Testing Framework',
    'Custom framework for automated web application security testing',
    'Built a comprehensive framework that automates common web application security tests including SQL injection, XSS, and CSRF detection.',
    ARRAY['Python', 'Selenium', 'BeautifulSoup', 'SQLMap'],
    '2023-11-20'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Web Application Penetration Testing Framework');

-- Insert sample skills if none exist
INSERT INTO skills (name, level, category)
SELECT 'Penetration Testing', 90, 'Security Testing'
WHERE NOT EXISTS (SELECT 1 FROM skills);

INSERT INTO skills (name, level, category)
SELECT 'Network Security', 85, 'Infrastructure Security'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Network Security');

INSERT INTO skills (name, level, category)
SELECT 'Python', 95, 'Programming'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Python');

INSERT INTO skills (name, level, category)
SELECT 'Linux Administration', 80, 'System Administration'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Linux Administration');

-- Insert sample certifications if none exist
INSERT INTO certifications (name, issuer, date, description)
SELECT 
    'Certified Ethical Hacker (CEH)',
    'EC-Council',
    '2023-06-15',
    'Comprehensive certification covering ethical hacking methodologies and tools'
WHERE NOT EXISTS (SELECT 1 FROM certifications);

INSERT INTO certifications (name, issuer, date, description)
SELECT 
    'CompTIA Security+',
    'CompTIA',
    '2022-12-10',
    'Foundation-level cybersecurity certification covering security concepts and practices'
WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = 'CompTIA Security+');

-- Insert sample CTF events if none exist
INSERT INTO ctf_events (name, date, difficulty, team, rank, total_teams, flags_captured, description)
SELECT 
    'CyberDefenders CTF 2024',
    '2024-02-15',
    'Hard',
    'CyberGuardians',
    15,
    200,
    12,
    'Participated in a challenging CTF focusing on digital forensics and incident response'
WHERE NOT EXISTS (SELECT 1 FROM ctf_events);

INSERT INTO ctf_events (name, date, difficulty, team, rank, total_teams, flags_captured, description)
SELECT 
    'PicoCTF 2023',
    '2023-10-20',
    'Medium',
    'Solo',
    45,
    1500,
    25,
    'Individual participation in educational CTF covering various cybersecurity domains'
WHERE NOT EXISTS (SELECT 1 FROM ctf_events WHERE name = 'PicoCTF 2023');
