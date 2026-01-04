# Los Auto & Glass - Backend Setup Guide

Complete step-by-step guide to set up the Express.js + TypeScript backend with MongoDB, PayPal, and email notifications.

---

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

---

## 🚀 Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (see below)
npm run dev
```

---

## 1️⃣ MongoDB Atlas Setup (Free Tier)

MongoDB Atlas offers a **free forever** tier with 512MB storage - plenty for this project.

### Step 1: Create Account
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Sign up with email or Google account

### Step 2: Create a Cluster
1. Choose **FREE** shared cluster (M0 Sandbox)
2. Select a cloud provider (AWS recommended)
3. Choose a region close to you
4. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 3: Create Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `losautoglass`)
5. Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - For production, add your server's specific IP
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add your database name before the `?`:
   ```
   mongodb+srv://losautoglass:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/los-auto-glass?retryWrites=true&w=majority
   ```

### Add to .env:
```env
MONGODB_URI=mongodb+srv://losautoglass:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/los-auto-glass?retryWrites=true&w=majority
```

---

## 2️⃣ PayPal Setup (Free Sandbox)

PayPal Sandbox lets you test payments without real money. It's completely free.

### Step 1: Create Developer Account
1. Go to [https://developer.paypal.com/](https://developer.paypal.com/)
2. Click **"Log in to Dashboard"**
3. Sign in with your PayPal account (or create one - it's free)

### Step 2: Create Sandbox App
1. In the dashboard, go to **"Apps & Credentials"**
2. Make sure you're in **"Sandbox"** mode (toggle at top)
3. Click **"Create App"**
4. Enter app name: `Los Auto Glass`
5. Select **"Merchant"** as the app type
6. Click **"Create App"**

### Step 3: Get Credentials
1. On the app details page, you'll see:
   - **Client ID** - Copy this
   - **Secret** - Click "Show" and copy this
2. These are your sandbox (test) credentials

### Step 4: Create Test Accounts (Optional)
1. Go to **"Sandbox"** → **"Accounts"**
2. You'll see two default accounts:
   - **Business** account (receives payments)
   - **Personal** account (makes payments)
3. Click the **Personal** account → **"View/Edit Account"**
4. Note the email and password for testing payments

### Add to .env:
```env
PAYPAL_CLIENT_ID=your-sandbox-client-id-here
PAYPAL_CLIENT_SECRET=your-sandbox-secret-here
PAYPAL_MODE=sandbox
```

### For Production:
When ready to accept real payments:
1. Toggle to **"Live"** mode in PayPal Dashboard
2. Create a new Live app
3. Complete PayPal's verification process
4. Update your .env:
```env
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your-live-client-id
PAYPAL_CLIENT_SECRET=your-live-secret
```

---

## 3️⃣ Email Setup (Gmail SMTP - Free)

Gmail allows 500 emails/day for free - perfect for booking confirmations.

### Step 1: Enable 2-Factor Authentication
1. Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **"2-Step Verification"**
3. Follow the steps to enable it (required for App Passwords)

### Step 2: Create App Password
1. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. You may need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other"** and enter `Los Auto Glass`
5. Click **"Generate"**
6. Copy the **16-character password** (e.g., `abcd efgh ijkl mnop`)
7. **IMPORTANT**: Save this password - you can't see it again!

### Add to .env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=Los Auto & Glass <your-email@gmail.com>
```

### Alternative: Skip Email (Development)
If you don't want to set up email yet, leave these blank:
```env
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```
Emails will be logged to the console instead of sent.

---

## 4️⃣ Complete .env Configuration

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Then edit `.env` with all your credentials:

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
NODE_ENV=development
PORT=5000

# ===========================================
# MONGODB (from Atlas - Step 1)
# ===========================================
MONGODB_URI=mongodb+srv://losautoglass:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/los-auto-glass?retryWrites=true&w=majority

# ===========================================
# JWT SECRET (generate a random string)
# ===========================================
# You can generate one at: https://generate-secret.vercel.app/32
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# ===========================================
# PAYPAL (from Developer Dashboard - Step 2)
# ===========================================
PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-paypal-sandbox-secret
PAYPAL_MODE=sandbox

# ===========================================
# EMAIL (from Gmail App Password - Step 3)
# ===========================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=Los Auto & Glass <your-email@gmail.com>

# ===========================================
# FRONTEND URL (for CORS)
# ===========================================
FRONTEND_URL=http://localhost:3000

# ===========================================
# BUSINESS INFO
# ===========================================
BUSINESS_NAME=Los Auto & Glass
BUSINESS_PHONE=(385) 443-1606
BUSINESS_EMAIL=info@losautoandglass.com
BUSINESS_ADDRESS=Utah, USA
```

---

## 5️⃣ Run the Backend

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

### Expected Output:
```
🚀 Starting cron jobs...
📅 Reminder job scheduled (daily at 10 AM)
📅 No-show check scheduled (hourly)
📅 Pending cleanup scheduled (daily at midnight)
✅ All cron jobs started

✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
📍 Environment: development
```

---

## 6️⃣ Test the API

### Health Check:
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"OK","timestamp":"2026-01-02T21:00:00.000Z","service":"Los Auto & Glass API"}
```

### Get Services:
```bash
curl http://localhost:5000/api/services
```

### Get Available Time Slots:
```bash
curl http://localhost:5000/api/calendar/slots/2026-01-03
```

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe","phone":"555-1234"}'
```

---

## 7️⃣ API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (auth required) |
| PUT | `/api/auth/me` | Update profile (auth required) |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| GET | `/api/services/:id` | Get single service |
| GET | `/api/services/:id/estimate` | Get price estimate |

### Calendar
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calendar/slots/:date` | Get available slots for date |
| GET | `/api/calendar/overview` | Get calendar overview |
| GET | `/api/calendar/check` | Check slot availability |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user's bookings (auth required) |
| GET | `/api/bookings/lookup` | Lookup by booking number |
| POST | `/api/bookings/:id/cancel` | Cancel booking |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/config` | Get PayPal client ID |
| POST | `/api/payments/create-order` | Create PayPal order |
| POST | `/api/payments/capture-order` | Capture payment |
| GET | `/api/payments/status/:bookingNumber` | Get payment status |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |

---

## 8️⃣ Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: querySrv ECONNREFUSED
```
**Solution**: 
- Check your connection string in `.env`
- Verify IP whitelist in MongoDB Atlas Network Access
- Make sure password doesn't have special characters that need encoding

### PayPal Error
```
PayPal Auth Error: invalid_client
```
**Solution**:
- Verify you're using Sandbox credentials with `PAYPAL_MODE=sandbox`
- Check Client ID and Secret are correct (no extra spaces)

### Email Not Sending
```
Email sending failed: Invalid login
```
**Solution**:
- Make sure 2FA is enabled on your Google account
- Use an App Password, not your regular password
- Check EMAIL_USER matches the account that generated the App Password

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>

# Or use a different port
PORT=5001 npm run dev
```

---

## 9️⃣ Deployment (Render - Free)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/los-auto-glass.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [https://render.com](https://render.com)
2. Sign up/login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `los-auto-glass-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (same as your .env)
7. Click **"Create Web Service"**

Your API will be live at: `https://los-auto-glass-api.onrender.com`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── services.ts      # Service definitions & pricing
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   └── validation.ts    # Request validation
│   ├── models/
│   │   ├── User.ts          # User model
│   │   ├── Booking.ts       # Booking model
│   │   ├── Contact.ts       # Contact form model
│   │   └── BlockedSlot.ts   # Calendar blocking
│   ├── routes/
│   │   ├── auth.ts          # Auth routes
│   │   ├── services.ts      # Services routes
│   │   ├── bookings.ts      # Booking routes
│   │   ├── calendar.ts      # Calendar routes
│   │   ├── payments.ts      # PayPal routes
│   │   ├── contact.ts       # Contact routes
│   │   └── admin.ts         # Admin routes
│   ├── utils/
│   │   ├── paypal.ts        # PayPal integration
│   │   ├── email.ts         # Email service
│   │   ├── calendar.ts      # Calendar logic
│   │   └── cronJobs.ts      # Scheduled tasks
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── server.ts            # Express app entry
├── package.json
├── tsconfig.json
└── .env.example
```

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] `npm install` completed
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (free tier)
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string added to .env
- [ ] PayPal developer account created
- [ ] Sandbox app created
- [ ] PayPal credentials added to .env
- [ ] Gmail 2FA enabled
- [ ] App Password generated
- [ ] Email credentials added to .env
- [ ] JWT_SECRET set
- [ ] `npm run dev` runs successfully
- [ ] API endpoints responding

---

Need help? Contact: info@losautoandglass.com
