# Welcome to your Lovable project

## Project info

**URL**: https://tonisinkovic.github.io/MOJPUT/

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## AI Chatbot (fakulteti i studiji)

Chatbot odgovara na pitanja o fakultetima i studijima u Hrvatskoj koristeći RAG (Retrieval Augmented Generation) — pretražuje bazu podataka i šalje relevantne podatke AI modelu.

### Zahtjevi

- **PostgreSQL** — baza za fakultete, studije i gradove
- **OpenAI API ključ** — za generiranje odgovora

### Pokretanje

1. **Postavi `.env`** (kopiraj iz `.env.example`):
   ```
   DATABASE_URL="postgresql://korisnik:lozinka@localhost:5432/mojput?schema=public"
   OPENAI_API_KEY=sk-...
   ```

### Registracija i potvrda emaila

**Produkcija (Render + GitHub Pages)** — glavni tok:

1. Deployaj API na Render (`render.yaml` već postavlja `API_PUBLIC_URL` i `APP_ORIGIN`).
2. U Render dashboardu dodaj **`JWT_SECRET`** i **SMTP** (`SMTP_*`, `MAIL_FROM`) ili **Resend**.
3. Build frontenda za Pages mora imati **`VITE_API_URL`** = javni URL API-ja (vidi `.env.production`).
4. Korisnik se registrira na Pages → API na Renderu šalje mail s linkom  
   `https://mojput-api.onrender.com/api/auth/verify?token=...&redirect=1`  
   → potvrda u bazi na Renderu → redirect na  
   `https://tonisinkovic.github.io/MOJPUT/prijava?...`

**Lokalno:** `npm run dev:full`, baza `data/mojput.db`, link u mailu na `http://127.0.0.1:3000/...` (potvrda samo na tom PC-u). Za potvrdu s mobitela na istom Wi‑Fi-u postavi `MAIL_USE_LAN_IP=1`. Očisti testne račune: `npm run clear:auth` (zaustavi server prije).

2. **Kreiraj bazu i tablice**:
   ```sh
   npm run db:push
   ```

3. **Ubaci primjer podataka**:
   ```sh
   npm run db:seed
   ```

4. **Pokreni backend i frontend**:
   ```sh
   npm run dev:full
   ```

### API rute

| Ruta | Opis |
|------|------|
| `GET /api/gradovi` | Lista gradova |
| `GET /api/fakulteti?grad=Zagreb` | Lista fakulteta (opcionalno filtrirano po gradu) |
| `GET /api/studiji?fakultet_id=1` | Lista studija (opcionalno filtrirano po fakultetu) |
| `POST /api/chat` | Chat s AI (body: `{ messages: [{ role, content }] }`) |

### Kako chatbot koristi bazu

1. Korisnik postavi pitanje (npr. "Koji fakulteti imaju računarstvo?")
2. Backend izvlači ključne riječi i pretražuje tablice `Fakultet`, `Studij`, `Grad`
3. Relevantni podaci šalju se OpenAI modelu kao kontekst
4. AI generira odgovor temeljen isključivo na tim podacima
5. Ako podatak nije u bazi, AI to jasno navede

### Dodavanje novih fakulteta

1. Otvori `prisma/seed.cjs` i dodaj u `fakultetiData` ili `studijiData`
2. Pokreni `npm run db:seed` (prazni i ponovno puni tablice)

Ili koristi Prisma Studio za ručno uređivanje:
```sh
npm run db:studio
```

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Prisma (PostgreSQL) — za AI chatbot
- OpenAI API — za RAG chatbot

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
