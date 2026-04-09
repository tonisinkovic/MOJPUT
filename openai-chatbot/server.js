/**
 * Jednostavan Express server koji šalje poruke OpenAI API-ju.
 * Pokretanje: npm start (nakon npm install i .env s OPENAI_API_KEY)
 */

// Učitaj varijable iz .env (OPENAI_API_KEY)
require("dotenv").config();

const path = require("path");
const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

// Službeni OpenAI klijent — čita API ključ iz okoline (iz .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// JSON tijelo POST zahtjeva (npr. { "message": "..." })
app.use(express.json());

// Posluži index.html i ostale statičke datoteke iz iste mape kao server.js
app.use(express.static(path.join(__dirname)));

/**
 * Kontekst o fakultetima — model ga koristi uz system prompt.
 * (FER, FOI, PMF, TVZ — kratko što znači za savjet)
 */
const FACULTY_CONTEXT = `
Kontekst o fakultetima (koristi ga kad savjetuješ, ali ne kopiraj doslovno ako nije prirodno):

- FER: općenito teži program, puno rada, ali jako dobar za IT i kasniju karijeru u industriji.
- FOI: praktičniji naglasak, više projekata, često se doživljava kao malo lakši od FER-a za neke studente.
- PMF: jak fokus na matematiku i teoriju, manje „hands-on" nego čisto informatički smjerovi.
- TVZ: praktično usmjerenje, manje teorije u odnosu na klasična sveučilišta, brži ulazak u vještine za posao.
`.trim();

/**
 * System prompt: osobnost + pravila odgovora
 */
const SYSTEM_PROMPT = `
Ti si prijateljski student iz Hrvatske koji pomaže drugima odabrati fakultet.
Piši opušteno, prirodno i razgovorno — nikako robotski ili kao službeni dokument.

Fokusiraj se na ove ustanove kad je riječ o IT-u, matematici ili srodnim smjerovima: FER, FOI, PMF, TVZ.

Uvijek kad uspoređuješ ili preporučuješ nešto, navedi i prednosti i mane (što je dobro, što može biti teže ili manje prikladno).

Ako korisnik pita nešto izvan tog konteksta, i dalje budi pristupačan i pomogni koliko možeš.
`.trim();

/**
 * POST /chat
 * Tijelo: { "message": "tekst korisnika" }
 * Odgovor: { "reply": "tekst bota" }
 */
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      reply: "Pošalji JSON s poljem message (neprazan string).",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Nedostaje OPENAI_API_KEY u .env");
    return res.status(500).json({
      reply: "Server nema postavljen API ključ. Dodaj OPENAI_API_KEY u .env datoteku.",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${FACULTY_CONTEXT}`,
        },
        { role: "user", content: message.trim() },
      ],
      temperature: 0.8,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Nisam uspio sastaviti odgovor.";

    return res.json({ reply });
  } catch (err) {
    console.error("OpenAI greška:", err?.message || err);
    return res.status(500).json({
      reply:
        "Dogodila se greška pri pozivu AI-a. Provjeri ključ, model i internet.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server: http://localhost:${PORT}`);
  console.log(`Otvori http://localhost:${PORT}/ u pregledniku.`);
});
