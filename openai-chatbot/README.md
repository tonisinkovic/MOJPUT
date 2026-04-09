# Chatbot (Node.js + OpenAI)

## Instalacija ovisnosti

U mapi projekta (`openai-chatbot`) pokreni:

```bash
npm install
```

## Postavljanje API ključa

1. U istoj mapi napravi datoteku **`.env`** (ako je već nemaš).
2. Unutra stavi (vrijednost zamijeni svojim ključem s [OpenAI platforme](https://platform.openai.com)):

```
OPENAI_API_KEY=sk-...
```

## Pokretanje servera

```bash
npm start
```

Server sluša na **http://localhost:3000**.

Otvori preglednik na **http://localhost:3000/** — učitava se `index.html`, a poruke idu na **POST /chat**.

## Struktura

| Datoteka      | Opis                          |
| ------------- | ----------------------------- |
| `server.js`   | Express + OpenAI              |
| `index.html`  | Jednostavan chat UI           |
| `package.json`| Ovisnosti i skripta `start`   |
