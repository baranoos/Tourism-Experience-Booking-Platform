# .tv Tourism Experience Booking Platform — To-Do Checklist

**Contract ID:** ad325055-c9ba-41c3-b1a0-cb0436eec547  
**Board ID:** 85f466b6-8d22-497a-90b7-cc16a5995f8c  
**Platform:** Web (Next.js, Supabase)  
**Location:** Tuvalu  
**Tags:** tourism, booking, sustainability  

---

## 1. Integrate Stripe API and local payment solutions
- [ ] Has to connect successfully to Stripe using test and live keys  
- [ ] Has to process end-to-end payments (create, confirm, and store payment data)  
- [ ] Has to include webhook for payment confirmation  
- [ ] Has to integrate at least one local payment option or fallback method  
- [ ] Has to log and display payment status inside admin dashboard  

---

## 2. Build responsive web application (Next.js + Supabase)
- [ ] Has to run on Next.js 14+  
- [ ] Has to store booking, user, and provider data in Supabase  
- [ ] Has to support authentication for both travelers and operators  
- [ ] Has to load within 2 seconds on 3G network (performance target for Tuvalu)  

---

## 3. Configure Tailwind CSS for mobile-first UI
- [ ] Has to apply consistent color scheme and typography  
- [ ] Has to render correctly on all major devices (desktop, tablet, mobile)  
- [ ] Has to pass basic accessibility and contrast tests  
- [ ] Has to include reusable UI components (buttons, forms, modals, cards)  

---

## 4. Develop booking workflows (eco-attractions, homestays, tours)
- [ ] Has to allow users to browse and filter experiences  
- [ ] Has to show detailed pages for each tour/homestay  
- [ ] Has to allow user to select date, group size, and submit reservation  
- [ ] Has to confirm booking after payment success  
- [ ] Has to send confirmation email with booking summary  

---

## 5. Create administrative dashboard for local operators
- [ ] Has to authenticate local operators (Supabase Auth)  
- [ ] Has to allow CRUD (create, read, update, delete) of experiences  
- [ ] Has to show incoming bookings and their statuses  
- [ ] Has to restrict data visibility per operator (no cross-access)  
- [ ] Has to notify operator of new bookings (email or in-dashboard alert)  

---

## 6. Documentation and deployment
- [ ] Has to include setup instructions for local deployment (Vercel + Supabase)  
- [ ] Has to provide Stripe and local payment configuration guide  
- [ ] Has to include admin and operator user guides  
- [ ] Has to be tested and approved by Tuvaluan stakeholders  

---

## 7. Sustainability and accessibility validation
- [ ] Has to implement eco-friendly hosting and minimal resource footprint  
- [ ] Has to meet WCAG 2.1 AA accessibility standards  
- [ ] Has to provide multilingual readiness (English + Tuvaluan for phase 2)  
