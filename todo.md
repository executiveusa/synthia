# SYNTHIA™ - Project TODO

## Phase 1: Design System & Branding
- [x] Install Motion Primitives and Tweakcn component libraries
- [x] Implement custom typography (no generic fonts - use premium Google Fonts)
- [x] Create Kupuri Media color palette (Teal #00BCD4, Purple #9C27B0, Coral/Pink accents)
- [x] Design geometric flower/hexagon pattern system
- [x] Configure Tailwind with custom design tokens
- [x] Set up dark theme with teal/purple gradients

## Phase 2: Hero Landing Page
- [x] Add Mexico City night skyline background image
- [x] Integrate Kupuri Media logo in top left corner
- [x] Design "SYNTHIA™" custom typography hero text
- [x] Create animated geometric patterns overlay
- [x] Build responsive hero section with Motion Primitives animations
- [x] Add compelling CTA buttons with hover effects
- [x] Implement smooth scroll animations

## Phase 3: Features & Pricing Sections
- [x] Design features showcase section (WhatsApp-native, Voice-first, Design assistance, Business tools)
- [x] Create pricing cards for 3 tiers ($599, $1,299, $2,999 MXN/month)
- [x] Add feature comparison table
- [x] Implement animated feature cards with Motion Primitives
- [x] Add testimonials section (placeholder for Mexican women entrepreneurs)
- [x] Create FAQ section with Mexican Spanish content
- [x] Build footer with Kupuri Media branding

## Phase 4: Database Schema - Multi-Tenant Architecture
- [x] Create `clients` table (business info, contact, subscription tier, status)
- [x] Create `subscriptions` table (tier, price, billing cycle, status, start/end dates)
- [x] Create `clawdbot_instances` table (client_id, config_path, whatsapp_number, status, qr_code)
- [x] Create `payments` table (client_id, amount, currency, status, payment_method, transaction_id)
- [x] Create `client_assets` table (client_id, logo_url, brand_colors, business_name)
- [x] Create `usage_analytics` table (client_id, messages_sent, voice_minutes, date)
- [x] Add foreign key relationships and indexes
- [x] Run database migrations

## Phase 5: Admin Dashboard
- [x] Create admin layout with sidebar navigation
- [x] Build clients overview page with data table
- [x] Add client details page with subscription info
- [x] Create subscription management interface
- [x] Build analytics dashboard with charts (messages, revenue, active clients)
- [x] Add client search and filtering
- [x] Implement client status management (active, paused, cancelled)
- [x] Create admin-only role protection

## Phase 6: Clawdbot Integration Layer
- [x] Copy Clawdbot repository into server/clawdbot directory
- [x] Create Node.js process manager for Clawdbot instances
- [x] Build YAML config generator for client instances
- [x] Implement Clawdbot startup/shutdown API
- [x] Create WhatsApp session management
- [x] Add Clawdbot health monitoring
- [x] Build Mexican Spanish prompt templates
- [x] Configure ElevenLabs voice settings for es-MX

## Phase 7: Client Onboarding Flow
- [x] Create client signup form (business info, contact, tier selection)
- [x] Build payment integration for initial subscription
- [x] Generate unique Clawdbot instance for new client
- [x] Create QR code generation for WhatsApp pairing
- [x] Build QR code display page with pairing instructions (Mexican Spanish)
- [x] Add WhatsApp connection status monitoring
- [x] Create onboarding success page
- [x] Send welcome email to client (via notifyOwner)

## Phase 8: Subscription Billing System
- [ ] Integrate Lemon Squeezy payment processor for MXN support
- [ ] Create subscription tier management UI
- [ ] Build automatic billing cycle processing
- [ ] Add payment method management for clients
- [ ] Implement subscription upgrade/downgrade flow
- [ ] Create invoice generation
- [ ] Add payment failure handling and retry logic
- [ ] Build billing history page

## Phase 9: Owner Notifications
- [x] Implement email notification system using notifyOwner helper
- [x] Create "New Client Signup" notification to Yvette
- [x] Create "Subscription Upgrade" notification to Yvette
- [ ] Add "Payment Failed" notification to Yvette
- [ ] Create "Client Cancelled" notification to Yvette
- [x] Test all notification triggers

## Phase 10: Client Logo & Brand Asset Upload
- [ ] Create logo upload form with S3 integration
- [ ] Add image validation and resizing
- [ ] Build brand color picker interface
- [ ] Create business name customization
- [ ] Store asset metadata in database
- [ ] Display client branding in their Clawdbot instance
- [ ] Add asset preview in admin dashboard

## Phase 11: Mexican Spanish Content & Cultural Optimization
- [x] Translate all UI text to Mexican Spanish (es-MX)
- [x] Create culturally appropriate messaging and tone
- [ ] Add Mexican business hours and holidays to system
- [x] Optimize Clawdbot prompts for Mexican Spanish
- [x] Configure ElevenLabs voice with Mexican accent
- [x] Add tú vs usted business etiquette rules
- [ ] Test with native Mexican Spanish speakers

## Phase 12: Testing & Quality Assurance
- [x] Write vitest tests for client management procedures
- [ ] Test client signup and onboarding flow end-to-end
- [ ] Test Clawdbot instance creation and pairing
- [ ] Test subscription billing and payment processing
- [ ] Test admin dashboard functionality
- [x] Test owner notifications
- [ ] Test logo upload and brand asset management
- [ ] Verify Mexican Spanish content accuracy
- [ ] Test responsive design on mobile devices
- [ ] Performance testing and optimization

## Phase 13: Documentation & Deployment
- [ ] Create admin user guide
- [ ] Write client onboarding documentation
- [ ] Document Clawdbot integration architecture
- [ ] Create API documentation for future extensions
- [ ] Set up production environment variables
- [ ] Configure domain and SSL
- [ ] Create initial checkpoint
- [ ] Deploy to production
