# SYNTHIA™ - AI WhatsApp Assistant Platform

**SYNTHIA™** is a premium multi-tenant SaaS platform that provides AI-powered WhatsApp assistants for Mexican women entrepreneurs. Built for Kupuri Media, it wraps the Clawdbot WhatsApp agent with a beautiful web management layer.

---

## 🎯 Product Overview

SYNTHIA™ empowers Mexican women entrepreneurs with an intelligent WhatsApp assistant that:
- **Speaks Mexican Spanish** with natural voice (ElevenLabs integration)
- **Understands business context** with culturally-aware prompts
- **Provides design assistance** for branding, logos, and marketing materials
- **Automates business tasks** like scheduling, client management, and follow-ups
- **Integrates seamlessly** via WhatsApp - the platform they already use daily

---

## ✨ Key Features

### 🌟 **Landing Page**
- Awwwards-level design with Mexico City night skyline
- Kupuri Media branding (teal/purple/coral color scheme)
- Motion Primitives animations throughout
- Mexican Spanish content optimized for target audience
- Responsive design with geometric hexagon patterns

### 👥 **Multi-Tenant Architecture**
- Each client gets their own isolated Clawdbot instance
- Separate WhatsApp sessions and configurations
- Customizable assistant personality and branding
- Usage tracking and analytics per client

### 🎨 **Admin Dashboard**
- Beautiful stats overview (clients, revenue, subscriptions)
- Client management with status tracking
- Subscription and payment management
- Clawdbot instance control (start/stop/health check)
- Usage analytics and reporting

### 📱 **Client Onboarding**
- Multi-step signup form with tier selection
- Automated Clawdbot instance provisioning
- QR code WhatsApp pairing with instructions
- Success page with quick start guide

### 🔔 **Owner Notifications**
- Real-time email alerts to Yvette for:
  - New client signups
  - Subscription activations
  - Payment failures (planned)
  - Cancellations (planned)

### 🤖 **Clawdbot Integration**
- Configuration generator with Mexican Spanish prompts
- Process manager for instance lifecycle
- WhatsApp session management
- Health monitoring and error handling
- ElevenLabs voice configuration for es-MX

---

## 💰 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Básico** | $599 MXN/mes | 1,000 mensajes/mes, Respuestas de voz, Soporte por email |
| **Profesional** | $1,299 MXN/mes | 5,000 mensajes/mes, Voz + diseño, Soporte prioritario, Análisis avanzado |
| **Empresarial** | $2,999 MXN/mes | Mensajes ilimitados, Todas las funciones, Gerente dedicado, Personalización completa |

---

## 🏗️ Technical Architecture

### **Stack**
- **Frontend:** React 19 + Tailwind 4 + Motion Primitives
- **Backend:** Node.js + Express + tRPC 11
- **Database:** MySQL/TiDB (via Drizzle ORM)
- **Auth:** Manus OAuth
- **Storage:** S3 (via Manus)
- **WhatsApp:** Clawdbot (Baileys library)
- **Voice:** ElevenLabs (es-MX)
- **Payments:** Lemon Squeezy (planned)

### **Database Schema**
```
users              → Manus OAuth users (admin/client roles)
clients            → Business information and contact details
subscriptions      → Subscription tiers and billing cycles
clawdbot_instances → WhatsApp bot instances per client
payments           → Payment transactions and history
client_assets      → Logos, brand colors, customization
usage_analytics    → Message counts, voice minutes, API calls
notification_log   → Owner notification history
```

### **Key Files**
```
client/src/pages/
  Home.tsx                  → Landing page with hero and pricing
  Onboarding.tsx            → Client signup flow
  OnboardingPairing.tsx     → QR code WhatsApp pairing
  OnboardingSuccess.tsx     → Success page with quick start
  AdminDashboard.tsx        → Admin overview and stats

server/
  routers.ts                → tRPC API endpoints
  db.ts                     → Database helper functions
  clawdbot-config.ts        → Config generator for instances
  clawdbot-manager.ts       → Process manager for Clawdbot

drizzle/
  schema.ts                 → Database schema definitions
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 22+
- MySQL/TiDB database
- Manus account (for OAuth and S3)
- Clawdbot installed (for production)

### **Installation**
```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### **Environment Variables**
All environment variables are automatically injected by Manus:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - Manus OAuth app ID
- `OWNER_OPEN_ID` - Owner's Manus ID (auto-admin)
- `BUILT_IN_FORGE_API_KEY` - Manus services API key

---

## 📋 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing |
| `/admin` | Admin dashboard (requires admin role) |
| `/onboarding` | Client signup flow |
| `/onboarding/pairing/:clientId` | QR code WhatsApp pairing |
| `/onboarding/success` | Onboarding success page |

---

## 🔐 Authentication & Authorization

### **Roles**
- **Admin:** Full access to dashboard and client management (owner auto-assigned)
- **User:** Regular user role (not currently used in client flow)

### **Admin Access**
The owner (Yvette) is automatically assigned the `admin` role based on `OWNER_OPEN_ID` environment variable.

### **Protected Routes**
All admin dashboard routes require authentication and admin role:
```typescript
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

---

## 🤖 Clawdbot Integration

### **Configuration**
Each client gets a unique Clawdbot configuration with:
- **Workspace:** `/home/ubuntu/clawdbot-instances/client-{id}`
- **Identity:** Customizable assistant name
- **System Prompt:** Mexican Spanish business assistant
- **Voice:** ElevenLabs es-MX
- **WhatsApp:** Restricted to client's number (optional)

### **Process Management**
```typescript
// Initialize instance
await clawdbotManager.initializeInstanceWorkspace(clientId);
await clawdbotManager.writeInstanceConfig({
  clientId,
  businessName,
  whatsappNumber,
  assistantName,
  assistantPersonality,
});

// Start/stop instance
await clawdbotManager.startInstance(clientId);
await clawdbotManager.stopInstance(clientId);

// Generate QR code for pairing
const { qrCode } = await clawdbotManager.generatePairingQRCode(clientId);
```

### **Mexican Spanish Optimization**
System prompts include:
- Tú vs usted business etiquette
- Mexican business hours (9am-6pm hora de México)
- Mexican holidays awareness
- Culturally appropriate tone and language

---

## 📊 Admin Dashboard

### **Stats Cards**
- **Total Clients:** All registered clients
- **Active Clients:** Clients with active subscriptions
- **Total Revenue:** Sum of completed payments (MXN)
- **Active Subscriptions:** Current active subscriptions

### **Client Management**
- View all clients with status badges
- Filter by status (active, pending, paused, cancelled)
- Update client status
- View subscription and payment history
- Manage Clawdbot instances

### **Clawdbot Control**
- Initialize new instances
- Start/stop instances
- Generate QR codes for pairing
- Health check monitoring
- View instance configuration

---

## 🔔 Owner Notifications

Yvette receives email notifications for:

### **New Client Signup**
```
🎉 Nuevo Cliente Registrado - SYNTHIA™

Negocio: [Business Name]
Propietario: [Owner Name]
Email: [Email]
Teléfono: [Phone]
WhatsApp: [WhatsApp Number]
Descripción: [Business Description]

ID Cliente: [Client ID]
Fecha: [Date/Time]
```

### **New Subscription**
```
💳 Nueva Suscripción - SYNTHIA™

Cliente: [Business Name]
Plan: [Tier]
Precio: $[Amount] MXN/mes
Periodo: [Start Date] - [End Date]

ID Suscripción: [Subscription ID]
Fecha: [Date/Time]
```

---

## 🧪 Testing

### **Run Tests**
```bash
pnpm test
```

### **Test Coverage**
- ✅ Client management (create, list, update status)
- ✅ Admin authorization
- ✅ Auth logout
- ✅ Input validation
- ✅ Duplicate email prevention

### **Manual Testing Checklist**
- [ ] Landing page loads with correct branding
- [ ] Onboarding flow creates client
- [ ] QR code generation works
- [ ] Admin dashboard shows stats
- [ ] Client table displays correctly
- [ ] Owner notifications sent
- [ ] Responsive design on mobile

---

## 📦 Deployment

### **Checkpoint & Publish**
1. Review `todo.md` to ensure all features are complete
2. Run `pnpm test` to verify all tests pass
3. Create checkpoint via Manus UI
4. Click "Publish" button in Management UI

### **Production Considerations**
- **Clawdbot Installation:** Install Clawdbot globally on production server
- **Process Management:** Use PM2 or systemd for Clawdbot instances
- **WhatsApp Sessions:** Persist sessions across restarts
- **Payment Integration:** Complete Lemon Squeezy integration
- **Domain:** Configure custom domain (e.g., synthia.kupurimedia.com)
- **SSL:** Automatic via Manus hosting
- **Backups:** Regular database backups

---

## 🔮 Future Enhancements

### **Phase 8: Subscription Billing** (Planned)
- [ ] Lemon Squeezy integration for MXN payments
- [ ] Automatic billing cycle processing
- [ ] Payment method management
- [ ] Subscription upgrade/downgrade
- [ ] Invoice generation
- [ ] Payment failure handling

### **Phase 10: Client Branding** (Planned)
- [ ] Logo upload with S3 integration
- [ ] Brand color picker
- [ ] Custom assistant personality
- [ ] Branded responses in WhatsApp

### **Additional Features** (Future)
- [ ] Client self-service portal
- [ ] Usage analytics dashboard for clients
- [ ] WhatsApp message templates
- [ ] Integration with Mexican payment gateways
- [ ] Multi-language support (beyond es-MX)
- [ ] Mobile app for client management

---

## 📝 Notes

### **Trademark Protection**
SYNTHIA™ is a trademark of Kupuri Media. All branding elements, including:
- SYNTHIA™ name and logo
- Kupuri Media hexagon pattern
- Teal/purple/coral color scheme
- Mexican Spanish voice personality

...are proprietary intellectual property.

### **Cultural Considerations**
- All content is in Mexican Spanish (es-MX)
- Pricing in Mexican Pesos (MXN)
- Business hours aligned with Mexico City timezone
- Culturally appropriate tone (professional but warm)
- Tú vs usted etiquette in assistant responses

### **Target Audience**
- Mexican women entrepreneurs
- Small business owners in Mexico City
- Service-based businesses (boutiques, salons, consultants)
- E-commerce sellers
- Solopreneurs and micro-businesses

---

## 🆘 Support

For technical support or questions:
- **Email:** soporte@kupurimedia.com
- **Owner:** Yvette (Kupuri Media founder)

---

## 📄 License

Proprietary - © 2026 Kupuri Media. All rights reserved.

---

**Built with ❤️ by Manus AI for Kupuri Media**
