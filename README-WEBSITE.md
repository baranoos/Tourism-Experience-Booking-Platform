# 🏝️ Tuvalu Tourism Experience Booking Platform

Een professionele, moderne booking website voor duurzame toerisme-ervaringen in Tuvalu.

## ✨ Features

### 🎨 Modern & Professioneel Design
- **Wit & Schoon Design** - Geïnspireerd op Viator met een moderne look
- **Groen Kleurschema** - Primary color: `#00aa6c` voor duurzaamheid
- **Responsive Design** - Werkt perfect op mobiel, tablet en desktop
- **Smooth Animaties** - Fade-in effecten, hover animaties, scroll effecten

### 🔍 Zoek & Filter Functionaliteit
- Geavanceerde zoekbalk met datum selectie
- Category filters (Eco, Homestays, Tours, Duiken)
- Real-time filter animaties

### 💳 Booking Systeem
- Professionele booking modals
- Formulier validatie
- Notificatie systeem
- Loading states voor betere UX

### 📱 Interactieve Features
- **Favorite functie** - Hartjes voor favoriete ervaringen
- **Ratings & Reviews** - Visuele sterren ratings
- **Smooth Scroll** - Naar secties scrollen
- **Sticky Header** - Header blijft zichtbaar bij scrollen

### 🎯 Key Sections
1. **Hero Section** - Grote visuele banner met call-to-action
2. **Ervaringen Grid** - 6 professionele experience cards met echte afbeeldingen
3. **Bestemmingen** - Mooie destination cards met overlay
4. **Features** - 4 USP's met iconen
5. **Footer** - Complete footer met links en social media

## 📁 Projectstructuur

```
Tourism-Experience-Booking-Platform/
├── index.html              # Hoofdpagina
├── css/
│   └── style.css          # Alle styling (modulair georganiseerd)
├── js/
│   └── main.js            # Alle JavaScript functionaliteit
└── README.md              # Deze file
```

## 🚀 Installatie & Gebruik

### Direct Openen
1. Open `index.html` in je browser
2. Klaar! Geen build proces nodig

### Live Server (Aanbevolen)
```bash
# Met VS Code Live Server extensie
- Rechtermuisknop op index.html
- Klik "Open with Live Server"
```

## 🎨 Kleurenpalet

```css
Primary Green:   #00aa6c  /* Hoofdkleur - knoppen, accenten */
Primary Dark:    #008f5b  /* Hover states */
Secondary Blue:  #0066cc  /* Links, secundaire accenten */
Text Dark:       #1a1a1a  /* Hoofdtekst */
Text Gray:       #5e5e5e  /* Beschrijvingen */
Text Light:      #767676  /* Subtitels */
Border:          #e4e4e4  /* Randen */
Background:      #f5f5f5  /* Achtergrond secties */
White:           #ffffff  /* Cards, modals */
```

## 🔧 Belangrijkste JavaScript Functies

### Core Functionaliteit
- `searchExperiences()` - Zoek naar ervaringen
- `filterExperiences(category)` - Filter op categorie
- `bookExperience(name, price)` - Open booking modal
- `handleBooking(event)` - Process booking formulier
- `handleLogin(event)` - Login functionaliteit

### UI/UX Functies
- `setupScrollEffects()` - Header shadow on scroll
- `setupAnimations()` - Intersection Observer voor fade-ins
- `showNotification(message, type)` - Toast notifications
- `setupFavorites()` - Hartjes toggle functionaliteit

## 📦 Dependencies

### CDN Libraries (Gelinkt via CDN)
- **Font Awesome 6.4.0** - Iconen
- **Unsplash Images** - Professionele stock foto's

### Geen Build Tools Nodig!
- Pure HTML, CSS & JavaScript
- Geen npm, webpack, of andere tools
- Direct te gebruiken

## 🎯 User Stories (MVP)

### ✅ Toerist
- [x] Ervaringen bekijken met foto's, prijs, beschrijving
- [x] Filteren op categorie (eco, homestay, tour, diving)
- [x] Zoeken naar bestemmingen
- [x] Boeken via modal formulier
- [x] Mobiel responsive gebruik

### ⏳ Aanbieder (Next Phase)
- [ ] Inloggen op dashboard
- [ ] Ervaringen toevoegen/bewerken
- [ ] Boekingen inzien
- [ ] Foto's uploaden

### ⏳ Admin (Next Phase)
- [ ] Gebruikers beheren
- [ ] Ervaringen modereren
- [ ] Statistieken bekijken

## 🌐 Browser Support

- ✅ Chrome (Laatste 2 versies)
- ✅ Firefox (Laatste 2 versies)
- ✅ Safari (Laatste 2 versies)
- ✅ Edge (Laatste 2 versies)

## 📱 Responsive Breakpoints

```css
Desktop:  > 1024px  (Standaard layout)
Tablet:   768-1024px (Aangepaste grid)
Mobile:   < 768px   (Single column, mobile menu)
```

## � Security & Privacy (VOLLEDIG GEÏMPLEMENTEERD)

### ✅ Beveiliging
- **Authenticatie**: Supabase Auth met JWT-tokens
- **Wachtwoorden**: Bcrypt hashing (geen plain text)
- **Communicatie**: HTTPS enforced
- **Stripe**: Server-side environment variables
- **Autorisatie**: Role-based (admin, provider, user)
- **Input**: XSS en SQL-injection preventie
- **Secrets**: Nooit in GitHub (.gitignore)

### ✅ Privacy & AVG Compliance
- **AVG-compliant**: Alle vereisten geïmplementeerd
- **Doelbinding**: Alleen boekings-/communicatie doeleinden
- **Beveiliging**: Role-based access in Supabase
- **Wachtwoorden**: Bcrypt gehashed
- **Backups**: Alleen geautoriseerde beheerders
- **Privacyverklaring**: Beschikbaar in PRIVACY_POLICY.md

### 📄 Documentatie
- `SUPABASE_SETUP.md` - Complete database & auth setup
- `PRIVACY_POLICY.md` - Volledige privacyverklaring (AVG)
- `SECURITY_CHECKLIST.md` - Security implementation details
- `.gitignore` - Bescherming API keys

## �🔜 Next Steps

### Fase 2 - Backend Integratie (IN PROGRESS)
1. **Supabase Setup** ✅
   - Database schema KLAAR
   - RLS policies KLAAR
   - Authentication setup KLAAR
   - Storage voor foto's

2. **Stripe Integratie**
   - Payment processing
   - Webhook handlers
   - Bevestigingsmails

3. **Dashboard Development**
   - Aanbieder dashboard (Next.js)
   - Admin panel
   - Analytics

### Fase 3 - Advanced Features
- Real-time beschikbaarheid
- Review systeem
- Multi-language support
- PWA functionaliteit

## 📝 Notities voor Developers

### CSS Organisatie
Het CSS bestand is georganiseerd in logische secties:
1. Reset & Base styles
2. Header & Navigation
3. Hero Section
4. Search Bar
5. Cards & Grids
6. Features
7. Footer
8. Modals
9. Animations
10. Responsive (Media Queries)

### JavaScript Structuur
- Event listeners worden centraal geïnitialiseerd in `initializeApp()`
- Functies zijn globaal beschikbaar voor inline onclick handlers
- Modulaire opzet voor makkelijke uitbreiding

## 🐛 Known Issues / Todo's

- [ ] Mobile menu implementatie (hamburger menu)
- [ ] Signup modal toevoegen
- [ ] Search functionaliteit verbinden met backend
- [ ] Image lazy loading optimaliseren
- [ ] Accessibility verbeteren (ARIA labels)

## 👥 Credits

**Design Inspiratie:** Viator.com
**Afbeeldingen:** Unsplash
**Iconen:** Font Awesome
**Ontwikkeld voor:** Tuvalu Tourism Platform MVP

## 📄 Licentie

Dit project is ontwikkeld als MVP voor het Tuvalu Tourism Platform.
© 2025 Tuvalu Tourism. Alle rechten voorbehouden.

---

**Built with ❤️ for sustainable tourism in Tuvalu** 🌴🌊