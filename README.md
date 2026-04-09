# 🔥 Sauna Booking 2026

Et topmoderne, lynhurtigt og sikkert bookingsystem til fælles sauna. Bygget med fokus på Clean Code, et mørkt "glassmorphism" 2026-design og en robust fuld-stack arkitektur kørende i Docker.

## 🚀 Funktioner

- **Sikker Autentificering:** Login-system med krypterede adgangskoder (bcrypt) via NextAuth.
- **Rollebaseret Adgang:** Adskillelse mellem almindelige brugere (`USER`) og administratorer (`ADMIN`).
- **Interaktiv Kalender:** Live overblik over ledige, egne og andres bookinger fra kl. 09:00 til 22:00.
- **Forhindring af Dobbeltbookinger:** Sikret på database-niveau (Prisma/PostgreSQL) med unikke constraints.
- **Admin Panel:**
  - Opret nye brugere direkte fra systemet.
  - Book tider på vegne af andre brugere.
  - Lås specifikke tidsrum (f.eks. til "Service vindue").
  - Tving sletning af eksisterende bookinger.
  - Opret og aktivér globale servicebeskeder (vises som et banner for alle brugere).

---

## 🛠 Teknologistak

Applikationen er bygget som en moderne Monorepo og udnytter de nyeste standarder inden for webudvikling.

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **UI Bibliotek:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikoner:** [Lucide React](https://lucide.dev/)

### Backend & Database
- **Database:** [PostgreSQL 17](https://www.postgresql.org/)
- **ORM:** [Prisma v7.7.0](https://www.prisma.io/) (Opsat med `@prisma/adapter-pg` og `pg` driver adapter for at understøtte Prismas nye motor-løse arkitektur).
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider).
- **Kryptering:** `bcryptjs` til sikker hash-lagring af brugeres passwords.

### Infrastruktur & Deployment
- **Containerization:** Docker & Docker Compose.
- **Reverse Proxy:** Nginx Proxy Manager (NPM) håndterer SSL/HTTPS trafik.
- **Miljø:** Bygget til at køre fuldt isoleret i produktionstilstand bag en proxy.

---

## ⚙️ Lokal Udvikling & Opsætning

Følg disse trin for at køre projektet lokalt eller på din egen server.

### 1. Klon repository
```bash
git clone [https://github.com/hostrup/sauna_booking.git](https://github.com/hostrup/sauna_booking.git)
cd sauna_booking