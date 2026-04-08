"""Jednokratno povuci datoteke s GitHuba na tocan commit (bez git mreze u Cursoru)."""
from __future__ import annotations

import base64
import json
import os
import ssl
import urllib.request

COMMITS_API = "https://api.github.com/repos/tonisinkovic/MOJPUT/commits/main"
BASE = "https://api.github.com/repos/tonisinkovic/MOJPUT/contents"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def latest_main_sha(ctx: ssl.SSLContext) -> str:
    req = urllib.request.Request(
        COMMITS_API,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "MOJPUT-local-sync",
        },
    )
    with urllib.request.urlopen(req, context=ctx) as r:
        j = json.load(r)
    return str(j["sha"])

PATHS = [
    "server.cjs",
    "src/App.tsx",
    "src/components/Navbar.tsx",
    "src/components/career-quiz/CareerQuizFlow.tsx",
    "src/components/profile/userTypes.ts",
    "src/data/career-quiz/careers-database.json",
    "src/data/career-quiz/questions-competencies.json",
    "src/data/career-quiz/questions-interests.json",
    "src/data/parentHub.ts",
    "src/lib/api.ts",
    "src/lib/auth.ts",
    "src/lib/careerAdvisor.ts",
    "src/lib/careerQuizApi.ts",
    "src/lib/careerQuizEngine.ts",
    "src/lib/careerQuizThemes.ts",
    "src/lib/parentForumStore.ts",
    "src/lib/profileApi.ts",
    "src/main.tsx",
    "src/pages/Index.tsx",
    "src/pages/Kalkulator.tsx",
    "src/pages/KalkulatorDoma.tsx",
    "src/pages/ParentForum.tsx",
    "src/pages/Prijava.tsx",
    "src/pages/ProfilDashboard.tsx",
    "src/pages/Registracija.tsx",
    "src/pages/Samoprocjena.tsx",
]


def main() -> None:
    ctx = ssl.create_default_context()
    ref = latest_main_sha(ctx)
    print(f"Sync ref: main @ {ref}")
    for rel in PATHS:
        url = f"{BASE}/{rel}?ref={ref}"
        req = urllib.request.Request(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "MOJPUT-local-sync",
            },
        )
        with urllib.request.urlopen(req, context=ctx) as r:
            j = json.load(r)
        raw = base64.b64decode(j["content"])
        out = os.path.join(ROOT, *rel.split("/"))
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "wb") as f:
            f.write(raw)
        print(f"OK {rel} ({len(raw)} B)")


if __name__ == "__main__":
    main()
