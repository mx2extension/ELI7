-- Seed Site Settings
insert into public.site_settings (key, value) values
('site_info', '{"name": "ELI7 Foundation", "tagline": "Women-led. Youth-centred. Unapologetic.", "location": "Bauchi State, Nigeria"}');

-- Seed Impact Stats
insert into public.impact_stats (value, label, description, display_order) values
('10K+', 'Lives Impacted', 'Direct beneficiaries across educational and community initiatives.', 1),
('25+', 'Communities Reached', 'Rural and urban clusters engaged through outreach programs.', 2),
('6,000', 'Girls Targeted', 'Target reach for our flagship menstrual health & hygiene initiative.', 3);

-- Seed Programs
insert into public.programs (title, slug, category, short_description, description, location, status, featured, hero_image, impact_summary, people_reached, start_date) values
(
  'Menstrual Health Education & Hygiene Programme',
  'menstrual-health-education-hygiene',
  'Education',
  'Reaching up to 6,000 girls in underserved schools across Bauchi State with hygiene kits and confidence.',
  'Our flagship initiative addressing period poverty through comprehensive education, sanitary pads, hygiene kits, and long-term digital tracking via the Amara platform.',
  'Bauchi State, Nigeria',
  'active',
  true,
  '/images/programs/menstrual-health.jpg',
  'Targeting 6,000 girls with educational workshops and sustainable hygiene supplies.',
  4200,
  '2026-01-15'
);

-- Seed Projects
insert into public.projects (title, slug, category, short_description, description, location, status, featured, hero_image, impact_summary, start_date) values
(
  'Community Digital Hub & Resource Center',
  'community-digital-hub',
  'Empowerment',
  'Equipping youth and young women with foundational digital literacy and vocational tools.',
  'A community-driven physical and digital space providing open internet access, mentorship, and technical training modules.',
  'Bauchi, Nigeria',
  'active',
  true,
  '/images/projects/digital-hub.jpg',
  'Over 350 youth trained in foundational digital tools.',
  '2026-03-01'
);

-- Seed Stories
insert into public.stories (title, slug, excerpt, content, author, category, cover_image, published, published_at) values
(
  'Restoring Confidence in the Classroom',
  'restoring-confidence-in-the-classroom',
  'How community engagement changed the conversation around menstrual health in rural Bauchi schools.',
  'When we first engaged with teachers and students, the gap was stark. Girls whispered about missed school days due to a lack of basic sanitary provisions. Through our workshops and kit distributions, we are rewriting the narrative so no girl misses a lesson because of nature.',
  'Amina Bello',
  'Education',
  '/images/stories/story-1.jpg',
  true,
  now()
);

-- Seed News
insert into public.news (title, slug, excerpt, content, author, category, cover_image, published, published_at) values
(
  'Field Engagement Report: Listening to Our Schools',
  'field-engagement-report-listening-to-our-schools',
  'Insights from our latest round of questionnaires distributed across 15 underserved schools.',
  'Our team completed an extensive field survey with educators and students. The findings confirm that while awareness is growing, material support remains critical. ELI7 is scaling its distribution pipeline to meet these exact needs.',
  'ELI7 Communications',
  'Field Updates',
  '/images/news/news-1.jpg',
  true,
  now()
);