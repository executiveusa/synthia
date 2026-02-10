# SYNTHIA Lead Generator Landing Page

A bilingual (ES/EN) lead generation landing page with AI-powered conversational widget and Natalie Dawson persona.

## Features

- **Bilingual Support**: Spanish-first with English toggle
- **Lead Capture**: 16 AI lead generation systems integrated
- **Conversational AI**: Chat widget with Natalie Dawson persona
- **Visitor Memory**: LocalStorage-based personalization
- **Neural Network Animation**: Dynamic background effect
- **Supabase Database**: Ready-to-use schema included

## Quick Start

### Local Development

```bash
# Using Python 3
cd synthisynthia-landing
python3 -m http.server 8080

# Using Node.js
npx serve -p 8080

# Open in browser
http://localhost:8080
```

### Deployment Options

#### Vercel

```bash
npm i -g vercel
vercel deploy
```

#### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### Coolify

See `../agent-zero-Fork/deploy_to_coolify.py`

## Project Structure

```
synthia-landing/
├── index.html           # Main landing page
├── css/
│   ├── main.css         # Design system, variables
│   ├── hero.css         # Hero section styles
│   ├── chat.css         # Chat widget styles
│   └── forms.css        # Form validation
├── js/
│   ├── i18n.js          # Bilingual system
│   ├── lead-capture.js  # Lead capture logic
│   ├── chat-widget.js   # Conversational AI
│   ├── memory.js        # Visitor memory
│   ├── neural-network.js # Background animation
│   └── cofounder-brain.js # Natalie Dawson persona
└── supabase/
    └── schema.sql       # Database schema
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL from `supabase/schema.sql`
3. Configure environment variables:

```env
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

## Environment Variables

Create `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
CHAT_API_ENDPOINT=https://api.your-service.com/chat
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

## Lead Generation Systems Integrated

1. Behavioral Targeting
2. Progressive Profiling
3. Smart Pop-ups
4. Exit Intent Detection
5. Scroll Depth Tracking
6. Time-on-Site Analysis
7. A/B Testing Engine
8. Heatmap Analytics
9. Form Optimization
10. Chatbot Qualification
11. Retargeting Triggers
12. Lead Scoring AI
13. CRM Integration
14. Email Automation
15. SMS Notifications
16. Multi-channel Attribution

## Design

- **Color Palette**: Warm pink tones (#ffb6c1, #ffc0cb)
- **Typography**: Clean sans-serif (Inter, system-ui)
- **Animations**: Smooth transitions, floating elements
- **Glassmorphism**: Subtle blur effects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
