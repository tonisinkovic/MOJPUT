# Kako prebaciti promjene na GitHub

## Korak 1: Otvori terminal u mapi projekta

```powershell
cd "c:\Users\Korisnik\Documents\MOJPUT-main\MOJPUT-2"
```

## Korak 2: Pokreni git naredbe

```powershell
git add -A
git status
git commit -m "Kalkulator bodova, Karta fakulteta, Kviz - moderni UI"
```

Ako piše "nothing to commit" – promjene su već commitane, samo pokreni:

```powershell
git push origin main
```

## Ako `git push` zatraži prijavu

GitHub više ne prihvaća lozinku – trebaš **Personal Access Token (PAT)**:

1. Otvori: https://github.com/settings/tokens
2. Klikni **Generate new token (classic)**
3. Označi scope **repo**
4. Kopiraj token
5. Kad `git push` zatraži lozinku, umjesto lozinke upiši token

## Alternativa: GitHub Desktop

1. Preuzmi [GitHub Desktop](https://desktop.github.com/)
2. Otvori repozitorij MOJPUT
3. Commitaj promjene i klikni **Push origin**

## Provjera

Nakon uspješnog pusha, otvori: https://github.com/tonisinkovic/MOJPUT
