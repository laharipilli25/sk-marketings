# SK Marketings — Business Consultancy Website

A complete, production-ready React website for **SK Marketings**, a premium business consultancy firm based in Tirupati, India.

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** | UI Framework |
| **Vite** | Build tool (fast HMR) |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **React Router v6** | Client-side routing |
| **React Helmet Async** | SEO meta tags |
| **React Icons** | Icon library |

---

## 📁 Project Structure

```
sk-marketings/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky navbar with scroll-aware styling
│   │   ├── Footer.jsx          # Full footer with links & contact
│   │   ├── WhatsAppButton.jsx  # Floating WhatsApp CTA
│   │   ├── SEO.jsx             # React Helmet wrapper for meta tags
│   │   └── SectionWrapper.jsx  # Scroll-reveal section container
│   ├── layouts/
│   │   └── Layout.jsx          # Page layout (Navbar + Footer)
│   ├── pages/
│   │   ├── Home.jsx            # Full landing page
│   │   ├── About.jsx           # Company, vision, values, team
│   │   ├── Services.jsx        # 4 service categories with cards
│   │   ├── Clients.jsx         # Clients, testimonials, geography
│   │   └── Contact.jsx         # Form, map, contact details
│   ├── utils/
│   │   └── animations.js       # Framer Motion animation presets
│   ├── App.jsx                 # Router + AnimatePresence
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind + custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js **18+**
- npm or yarn

### Steps

```bash
# 1. Navigate to the project folder
cd sk-marketings

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, services overview, why us, India section, testimonials, CTA |
| About | `/about` | Company intro, vision, mission, values, team |
| Services | `/services` | MSME, Promotions, Financial, Digital Marketing |
| Clients | `/clients` | Global presence, client grid with filter, testimonial carousel |
| Contact | `/contact` | Validated form, Google Maps, FAQ, social links |

---

## ✨ Features

- **Sticky Navbar** — transparent on top, frosted glass on scroll
- **Page Transitions** — smooth fade+slide via Framer Motion AnimatePresence
- **Scroll Animations** — fade, slide, stagger reveals on every section
- **WhatsApp Float Button** — animated, pulsing, mobile-friendly
- **Contact Form** — client-side validation, loading state, success screen
- **Client Filter** — animated industry filter with Framer Motion layout
- **Testimonial Carousel** — animated with dot navigation
- **Google Maps Embed** — Tirupati, Andhra Pradesh
- **SEO Optimized** — per-page meta tags, semantic HTML, proper heading hierarchy
- **Fully Responsive** — mobile-first Tailwind CSS
- **India Theme** — Navy + Saffron/Orange color palette with 🇮🇳 pride

---

## 🎨 Design System

### Colors
```
Primary:   Navy   #0d1b5e (navy-700)
Secondary: Saffron #ff8f00 (saffron-500)
Accent:    Orange  #f57c00 (orange-500)
```

### Fonts
```
Headings:  Playfair Display (Google Fonts)
Body:      DM Sans (Google Fonts)
Quotes:    Cormorant Garamond (Google Fonts)
```

---

## 📞 Contact Details Configured

- **Phone:** +91 85010 11026 / +91 91824 60018
- **Email:** skmak13@gmail.com
- **Location:** Tirupati, Andhra Pradesh, India
- **WhatsApp:** https://wa.me/918501011026

---

## 🔧 Customization

### Change Company Info
Update contact details in:
- `src/components/Footer.jsx`
- `src/pages/Contact.jsx`

### Update Colors
Edit `tailwind.config.js` under `theme.extend.colors`

### Add New Services
Edit the `categories` array in `src/pages/Services.jsx`

### Add Team Members
Edit the `team` array in `src/pages/About.jsx`

---

## 📦 Build Output

The `npm run build` command generates a `dist/` folder with:
- Minified JS (code-split: vendor + animations chunks)
- Optimized CSS
- Static HTML

Ready to deploy on **Netlify**, **Vercel**, **Firebase Hosting**, or any static host.

---

Made with ❤️ for SK Marketings — Tirupati, India 🇮🇳
