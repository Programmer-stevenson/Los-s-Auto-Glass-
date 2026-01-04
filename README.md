# Los Auto & Glass - Full Stack Application

A complete auto glass service booking system with Next.js frontend and Express.js backend, featuring PayPal integration, calendar booking, and customer management.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **PayPal React SDK** - Payment integration
- **React Hot Toast** - Notifications
- **date-fns** - Date utilities

### Backend
- **Express.js** - Node.js framework
- **TypeScript** - Type safety
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Nodemailer** - Email notifications
- **PayPal REST API** - Payment processing
- **node-cron** - Scheduled tasks

## 📁 Project Structure

```
los-auto-glass/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   │   ├── booking/     # Booking flow
│   │   │   ├── services/    # Services page
│   │   │   ├── contact/     # Contact page
│   │   │   └── ...
│   │   ├── components/      # React components
│   │   ├── lib/             # API client
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
│
└── backend/                  # Express.js API
    └── src/
        ├── config/          # Configuration
        ├── models/          # Mongoose models
        ├── routes/          # API routes
        ├── middleware/      # Auth, validation
        ├── utils/           # PayPal, email, calendar
        └── types/           # TypeScript types
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas - free tier available)
- PayPal Developer Account (free - for payment integration)
- Gmail account (for email notifications)

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB (Free: MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/los-auto-glass

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# PayPal (Free: developer.paypal.com)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Email (Free: Gmail with App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
```

### 3. Set Up Free Services

#### MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Add to `MONGODB_URI`

#### PayPal Sandbox (Free)
1. Go to [PayPal Developer](https://developer.paypal.com)
2. Create a developer account
3. Create a sandbox app
4. Get Client ID and Secret
5. Add to both backend and frontend env files

#### Gmail SMTP (Free)
1. Enable 2-Factor Authentication on your Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Use this password in `EMAIL_PASS`

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `GET /api/services/:id/estimate` - Get price estimate

### Bookings
- `POST /api/bookings` - Create booking (guest or authenticated)
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/lookup` - Lookup booking by number
- `POST /api/bookings/:id/cancel` - Cancel booking

### Calendar
- `GET /api/calendar/slots/:date` - Get available time slots
- `GET /api/calendar/overview` - Get calendar overview
- `GET /api/calendar/check` - Check slot availability

### Payments
- `GET /api/payments/config` - Get PayPal client ID
- `POST /api/payments/create-order` - Create PayPal order
- `POST /api/payments/capture-order` - Capture payment
- `GET /api/payments/status/:bookingNumber` - Get payment status

### Contact
- `POST /api/contact` - Submit contact form

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `PATCH /api/admin/bookings/:id` - Update booking

## 🎨 Features

### Customer Features
- ✅ Browse services with pricing
- ✅ Multi-step booking wizard
- ✅ Calendar with available time slots
- ✅ Guest or registered booking
- ✅ PayPal payment integration
- ✅ Pay at service option
- ✅ Email confirmations
- ✅ Booking lookup by number
- ✅ Contact form

### Admin Features
- ✅ Dashboard with stats
- ✅ Manage bookings
- ✅ Update booking status
- ✅ View contact submissions
- ✅ Block calendar slots

### Automated Tasks
- ✅ Appointment reminders (24 hours before)
- ✅ No-show marking (2 hours after)
- ✅ Stale booking cleanup (24 hours old)

## 🚀 Deployment

### Backend (Render - Free)
1. Push to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your repo
4. Set environment variables
5. Deploy

### Frontend (Vercel - Free)
1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### MongoDB (Atlas - Free)
Already using free tier - no changes needed

## 📝 License

MIT License - Feel free to use for your projects!

## 🤝 Support

For questions or issues, contact:
- Email: info@losautoandglass.com
- Phone: (385) 443-1606

---

Built with ❤️ by [Plexura](https://plexura.com)
