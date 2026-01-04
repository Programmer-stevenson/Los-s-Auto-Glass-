# Los's Auto Glass - Complete Setup Guide

A full-stack MERN booking system with PayPal payments, Twilio SMS, and admin dashboard.

---

## 📁 Project Structure

```
auto/
├── backend/          # Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Database & services config
│   │   ├── middleware/   # Auth & validation
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API endpoints
│   │   ├── utils/        # Email, SMS, PayPal, Calendar
│   │   └── server.ts     # Entry point
│   └── .env.example      # Environment template
│
├── frontend/         # Next.js 14 + TypeScript
│   ├── src/
│   │   ├── app/          # Pages (Next.js App Router)
│   │   ├── components/   # Navbar, Footer
│   │   └── lib/          # API client
│   └── public/           # Images
│
└── package.json      # Root scripts
```

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd auto

# Install both frontend and backend
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set Up MongoDB (Required)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account → Create Cluster (M0 Free Tier)
3. Database Access → Add user with password
4. Network Access → Add IP `0.0.0.0/0` (allow all)
5. Connect → Drivers → Copy connection string

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MongoDB URI:

```env
# REQUIRED
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/los-auto-glass
JWT_SECRET=any-random-string-here-make-it-long

# OPTIONAL (leave blank to disable)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd auto/backend
npm run dev
```
→ Runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd auto/frontend
npm run dev
```
→ Runs on http://localhost:3000

### 5. Test It!

- **Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **API Health:** http://localhost:5000/api/health

---

## 📱 Pages & Features

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Hero, services overview, CTA |
| `/services` | Services | All 6 services with details |
| `/booking` | Book Now | 4-step booking wizard |
| `/finance` | Finance | Lookup booking & pay with PayPal |
| `/about` | About | Company info, stats |
| `/contact` | Contact | Contact form |
| `/admin` | Dashboard | Stats, recent bookings, quick actions |
| `/admin/bookings` | Bookings | View/manage all bookings |
| `/admin/calendar` | Calendar | Weekly calendar view |
| `/admin/contacts` | Contacts | View/respond to inquiries |
| `/admin/settings` | Settings | Business hours, notifications |

---

## 🔧 Full Configuration

### MongoDB (Required)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/los-auto-glass
```

### PayPal (Optional - for payments)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create Sandbox App → Get Client ID & Secret

```env
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-secret
PAYPAL_MODE=sandbox    # Change to 'live' for production
```

### Twilio SMS (Optional - for notifications)

1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Get Account SID, Auth Token, and Phone Number

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
BUSINESS_NOTIFY_PHONE=+1234567890   # Your phone for alerts
```

**SMS Features:**
- Booking confirmations sent to customers
- 24-hour appointment reminders (cron job)
- Contact form alerts to business
- Customers can reply: `C` to cancel, `R` to reschedule, `Y` to confirm

**Twilio Webhook Setup (for receiving replies):**
1. In Twilio Console → Phone Numbers → Your Number
2. Set Messaging Webhook: `https://yourdomain.com/api/sms/webhook`
3. Method: POST

### Email (Optional - for notifications)

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App Passwords

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Los's Auto Glass <noreply@lossautoglass.com>
```

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/services` | List all services |
| GET | `/api/calendar/slots/:date` | Get available time slots |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/lookup` | Lookup booking by number + email |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/payments/create-order` | Create PayPal order |
| POST | `/api/payments/capture-order` | Capture PayPal payment |
| POST | `/api/sms/webhook` | Twilio incoming SMS |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/bookings` | List all bookings |
| PATCH | `/api/admin/bookings/:id/status` | Update booking status |
| GET | `/api/admin/contacts` | List all contacts |

---

## 🚢 Deployment

### Option 1: Render (Free)

**Backend:**
1. Create Web Service → Connect GitHub repo
2. Root Directory: `auto/backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variables

**Frontend:**
1. Create Static Site → Connect GitHub repo
2. Root Directory: `auto/frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `out` (or use Vercel instead)

### Option 2: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
```bash
cd auto/frontend
npx vercel
```

**Backend on Render:**
- Same as above

### Environment Variables for Production

```env
# Backend
NODE_ENV=production
MONGODB_URI=your-production-mongodb
JWT_SECRET=long-random-production-secret
FRONTEND_URL=https://your-frontend-domain.com
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=live-client-id
PAYPAL_CLIENT_SECRET=live-secret

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## 🔒 Security Notes

1. **Admin pages are unprotected** - Add authentication before production
2. **Change JWT_SECRET** - Use a long random string
3. **Update CORS** - Set `FRONTEND_URL` to your actual domain
4. **PayPal sandbox** - Switch to live mode for real payments
5. **Rate limiting** - Already configured (100 requests/15 min)

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI format
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify username/password (no special characters)

### "Calendar shows no time slots"
- Backend must be running
- Check date format: `YYYY-MM-DD`
- Sundays are marked as closed

### "PayPal button not working"
- Check PAYPAL_CLIENT_ID is set
- Ensure PAYPAL_MODE matches your credentials (sandbox/live)

### "SMS not sending"
- Verify Twilio credentials
- Check phone number format (+1XXXXXXXXXX)
- Trial accounts can only send to verified numbers

### "CORS error"
- Set `FRONTEND_URL` in backend `.env`
- Restart backend after changes

---

## 📞 Business Configuration

Edit these in `backend/src/config/services.ts`:

```typescript
// Services offered
export const services = [
  { id: 'windshield', name: 'Windshield Replacement', basePrice: 199.99, ... },
  // Add/edit services here
];

// Business hours
export const businessHours = {
  monday: { open: '08:00', close: '18:00', isOpen: true },
  // Edit hours here
  sunday: { open: '00:00', close: '00:00', isOpen: false }
};
```

---

## ✅ Checklist Before Launch

- [ ] MongoDB connected and working
- [ ] PayPal in live mode with real credentials
- [ ] Twilio configured with webhook URL
- [ ] Email sending working
- [ ] Admin dashboard protected (add login)
- [ ] FRONTEND_URL set to production domain
- [ ] SSL certificate active (HTTPS)
- [ ] Test booking flow end-to-end
- [ ] Test payment flow with real card
- [ ] Test SMS notifications
- [ ] Logo and branding updated

---

## 📁 Key Files to Customize

| File | What to Change |
|------|----------------|
| `frontend/src/components/Navbar.tsx` | Logo, company name |
| `frontend/src/components/Footer.tsx` | Contact info, links |
| `frontend/src/app/page.tsx` | Home page content |
| `backend/src/config/services.ts` | Services, prices, hours |
| `backend/.env` | All credentials |
| `frontend/public/` | Logo, favicon, images |

---

## 🆘 Support

Built by Plexura Digital Agency
- Website: plexura.com
- Email: info@plexura.com

---

**Version:** 1.0.0  
**Last Updated:** January 2026
