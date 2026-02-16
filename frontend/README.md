# Los's Auto Glass - Frontend Deployment Guide

## Overview

This is a **serverless** Next.js frontend for Los's Auto Glass. It uses:
- **Formspree** for form handling (no backend required)
- **Static export** for deployment on Render (or any static host)
- **Optimized images** for fast mobile performance

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example env file and configure it:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Formspree endpoint:
```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

This creates a static export in the `out/` folder.

---

## Formspree Setup (Required)

### Step 1: Create a Formspree Account
1. Go to [https://formspree.io](https://formspree.io)
2. Sign up for a free account (50 submissions/month free)

### Step 2: Create a Form
1. Click "New Form"
2. Name it "Los's Auto Glass - Contact Form"
3. Copy the form endpoint (looks like `https://formspree.io/f/xyzabcde`)

### Step 3: Configure the Form
In your Formspree dashboard:

1. **Email Notifications**
   - Add the business email: `info@lossautoglass.com`
   - Subject template: `New Service Request from {{name}}`

2. **Autoresponder (Customer Confirmation)**
   - Enable "Autoresponder" in form settings
   - Use this template:

   **Subject:** We received your auto glass request

   **Body:**
   ```
   Hi {{name}},

   Thanks for contacting Los's Auto Glass! We've received your service request and will reach out shortly to confirm details and provide pricing.

   Here's what you submitted:
   - Service: {{service}}
   - Phone: {{phone}}

   If this is urgent, please call us directly at (385) 424-6781.

   We look forward to helping you!

   — Los's Auto Glass
   Utah's trusted auto glass professionals
   Phone: (385) 424-6781
   ```

3. **Spam Protection**
   - The form already includes a honeypot field (`_gotcha`)
   - Enable reCAPTCHA in Formspree if you get spam

### Step 4: Add Environment Variable
Add to your `.env.local`:
```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

---

## Deploying to Render

### Step 1: Push to GitHub
Make sure your code is in a GitHub repository.

### Step 2: Create Render Static Site
1. Go to [https://render.com](https://render.com)
2. Click "New" → "Static Site"
3. Connect your GitHub repo
4. Configure:
   - **Name:** `los-auto-glass`
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `out`

### Step 3: Add Environment Variables
In Render dashboard, add:
```
NEXT_PUBLIC_FORMSPREE_ENDPOINT = https://formspree.io/f/YOUR_FORM_ID
```

### Step 4: Deploy
Click "Create Static Site" - Render will build and deploy automatically.

### Step 5: Custom Domain (Optional)
1. In Render, go to Settings → Custom Domain
2. Add your domain (e.g., `lossautoglass.com`)
3. Configure DNS at your registrar

---

## Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Render | Free tier | $0 |
| Formspree | Free (50/mo) or Pro ($10/mo) | $0-10 |
| **Total** | | **$0-10/month** |

For higher volume (>50 forms/month), upgrade Formspree to Pro ($10/month).

---

## File Structure

```
frontend/
├── public/
│   ├── *_optimized.webp    # Optimized images
│   ├── *_mobile.webp       # Mobile-optimized images
│   └── ...
├── src/
│   ├── app/
│   │   ├── page.tsx        # Home page
│   │   ├── contact/        # Contact form (Formspree)
│   │   ├── thank-you/      # Thank you page
│   │   ├── booking/        # Coming Soon
│   │   ├── finance/        # Coming Soon
│   │   ├── services/       # Services page
│   │   ├── gallery/        # Gallery page
│   │   └── about/          # About page
│   ├── components/
│   │   ├── Navbar.tsx      # Navigation
│   │   └── Footer.tsx      # Footer
│   └── lib/
│       └── api.ts          # (Legacy - not used with Formspree)
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
└── package.json
```

---

## Mobile Performance Optimizations

The following optimizations were made to reduce mobile lag:

1. **Image Optimization**
   - Converted all images to WebP format
   - Created mobile-specific versions (~50-100KB)
   - Hero image: 2.4MB → 290KB (88% reduction)
   - Background: 5.9MB → 200KB (97% reduction)

2. **Animation Optimization**
   - Disabled continuous animations on mobile
   - Used CSS transitions instead of JS animations where possible
   - Added `will-change` hints for GPU acceleration
   - Debounced scroll handlers

3. **Static Export**
   - Pre-rendered all pages for instant loading
   - No client-side hydration delays

---

## Pages Status

| Page | Status | Notes |
|------|--------|-------|
| Home | ✅ Live | Optimized for mobile |
| Services | ✅ Live | Full service listing |
| Gallery | ✅ Live | Placeholder images |
| Contact | ✅ Live | Formspree integration |
| Thank You | ✅ Live | Post-submission confirmation |
| Booking | ⏳ Coming Soon | Redirects to contact |
| Finance | ⏳ Coming Soon | Redirects to contact |
| About | ✅ Live | Company info |

---

## Troubleshooting

### Form submissions not working?
1. Check the Formspree endpoint in `.env.local`
2. Verify the form ID is correct
3. Check Formspree dashboard for submissions

### Images not loading?
1. Make sure optimized `.webp` files exist in `public/`
2. Check browser console for 404 errors
3. Verify image paths match filenames

### Build fails?
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check for TypeScript errors: `npm run lint`

---

## Support

For technical issues with the website, contact your developer.

For Formspree support: [https://formspree.io/help](https://formspree.io/help)

For Render support: [https://render.com/docs](https://render.com/docs)
