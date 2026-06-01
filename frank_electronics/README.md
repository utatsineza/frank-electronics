# 🦅 Frank Electronics — Complete Website

> **"Your plug for smart electronics"** · Kigali, Rwanda

---

## 📁 Project Structure (24 files)

```
frank-electronics/
├── index.html          ← Homepage
├── products.html       ← Product listing + filters
├── product.html        ← Product detail page
├── deals.html          ← Deals + countdown
├── about.html          ← About page
├── contact.html        ← Contact form
├── checkout.html       ← Checkout + order confirm
├── wishlist.html       ← Saved items
├── login.html          ← Unified login (user + admin)
├── register.html       ← Registration
├── otp.html            ← OTP verification (EmailJS)
├── forgot.html         ← Forgot password
├── reset-password.html ← Reset password
├── profile.html        ← User profile
├── admin.html          ← Admin panel (products/orders)
├── admin-login.html    ← Legacy (now uses login.html)
├── style.css           ← Shared shop styles
├── auth.css            ← Auth page styles
├── app.js              ← Cart, products, wishlist logic
├── components.js       ← Shared nav, footer, cart drawer
├── assets/logo.png     ← Frank Electronics logo
├── netlify.toml        ← Netlify deploy config
├── _redirects          ← Netlify routing
└── README.md
```

---

## 🚀 Run Locally

1. Unzip the folder
2. Double-click `index.html` — opens in any browser immediately
3. No server, no install needed

**Better (with live reload):**
- Install VS Code + Live Server extension
- Right-click `index.html` → Open with Live Server

---

## 🌐 Deploy to Netlify (FREE, 2 minutes)

### Option A — Drag & Drop (easiest)
1. Go to **https://app.netlify.com/drop**
2. Drag the entire `frank-electronics` folder onto the page
3. Your site is live! You'll get a URL like `https://amazing-name-123.netlify.app`
4. Optionally connect a custom domain in Netlify settings

### Option B — GitHub + Auto-deploy
1. Push the folder to a GitHub repo
2. Go to **https://app.netlify.com** → New site from Git
3. Select your repo → Deploy
4. Every push auto-deploys

---

## 📧 Enable Real OTP Emails (EmailJS)

Currently OTP runs in **demo mode** (code: `123456`). To send real emails:

### Step 1 — Create EmailJS account
- Go to **https://www.emailjs.com** (free plan = 200 emails/month)
- Sign up with your Gmail

### Step 2 — Add an Email Service
- Dashboard → Email Services → Add Service
- Choose Gmail → Connect your Gmail account
- Note the **Service ID** (e.g. `service_abc123`)

### Step 3 — Create Email Template
- Dashboard → Email Templates → Create Template
- Subject: `Your Frank Electronics verification code`
- Body:
```
Hello {{to_name}},

Your verification code for Frank Electronics is:

{{otp_code}}

This code expires in 10 minutes. Do not share it with anyone.

— Frank Electronics Team
```
- Note the **Template ID** (e.g. `template_xyz789`)

### Step 4 — Get your Public Key
- Dashboard → Account → General → Public Key

### Step 5 — Update otp.html
Open `otp.html` and find this section near the top:
```javascript
const EMAILJS_CONFIG = {
  publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',   // ← paste here
  serviceId:  'YOUR_SERVICE_ID',           // ← paste here
  templateId: 'YOUR_TEMPLATE_ID',          // ← paste here
  enabled:    false,                       // ← change to TRUE
};
```

That's it! Real OTP emails will now be sent automatically.

---

## 📱 Enable Real SMS OTP (Africa's Talking)

For SMS OTP in Rwanda (MTN/Airtel):
1. Sign up at **https://africastalking.com** (Rwanda supported)
2. Get API key from dashboard
3. Since this is a frontend-only site, you'll need a small backend (Node.js/PHP) to send SMS securely
4. Alternatively use **Twilio** which has a serverless function option

---

## 🔐 Login Credentials

### Customer login
- Any email + password `frank123` (demo)
- Or register a new account

### Admin login
- Email: `admin@frankelectronics.rw`
- Password: `admin123`
- OTP: `123456` (demo) or real email code
- Redirected automatically to admin panel

### Add more admin emails
Open `app.js` and add to the `ADMIN_EMAILS` array:
```javascript
const ADMIN_EMAILS = [
  'admin@frankelectronics.rw',
  'frank@frankelectronics.rw',
  'manager@frankelectronics.rw',
  'yourname@frankelectronics.rw', // ← add here
];
```
Same list in `otp.html` and `login.html`.

---

## 🎨 Customize Colors

Open `style.css`, edit `:root`:
```css
:root {
  --black:  #1a1a1a;  /* navbar, sidebar, footer */
  --orange: #ff6200;  /* buttons, accents */
  --white:  #ffffff;  /* page background */
}
```

---

## 🛍️ Add / Edit Products

**Via Admin Panel** (recommended):
1. Login with admin email
2. Go to Manage Products
3. Click "+ Add product"

**Via code** (`app.js`):
```javascript
{ id:13, name:"New Product", cat:"phones", em:"📱",
  price:500000, old:600000, badge:"new", rating:4.5, rev:10,
  desc:"Product description here." }
```

Categories: `phones` · `laptops` · `audio` · `tv` · `accessories`

---

## 📞 Update Business Info

Search and replace across all HTML files:
- Phone: `+250 788 000 000`
- Email: `info@frankelectronics.rw`
- Address: `KG 7 Ave, Kiyovu, Kigali`
- WhatsApp: `https://wa.me/250788000000`

---

## ✅ Features Summary

| Feature | Status |
|---------|--------|
| 8 shop pages | ✅ |
| 6 auth pages | ✅ |
| Admin panel | ✅ |
| Product detail page | ✅ |
| Cart (localStorage) | ✅ |
| Wishlist | ✅ |
| Checkout + confirmation | ✅ |
| Google sign-in flow | ✅ |
| Facebook sign-in flow | ✅ |
| OTP verification | ✅ EmailJS ready |
| Admin ↔ Shop sync | ✅ |
| Category nav dropdown | ✅ |
| Search bar | ✅ |
| Responsive (mobile) | ✅ |
| Netlify deployment | ✅ |
| Real email OTP | ⚙️ Configure EmailJS |
| Real SMS OTP | ⚙️ Configure Africa's Talking |
| Real payments | ⚙️ MTN MoMo API |
| Backend/database | ⚙️ Add Node.js/Firebase |

---

© 2026 Frank Electronics · Kigali, Rwanda
