# Codka Soomaaliga AI 🎙️ (Natural Somali Voice Synthesis)

Mashiin casri ah oo ku shaqaynaya Caqliga Macmalka ah (AI) oo qoraalka Af-Soomaaliga u akhriya cod dabiici ah oo la mid ah kan qofka nool, si cad oo bilaa khaladaad ah.

---

## 🌟 Tilmaamaha Muhiimka ah (Key Features)

- **Dhawaaqa Sugan ee Af-Soomaaliga**:
  - Xarafka **C** (Ayn `[ʕ]`): Waxaa loo akhriyaa dhawaaqa dhabta ah ee dhuunta, laguma qaldo *ch*, *ka*, ama *ja*.
  - **Xarfaha Labanlaaban (bb, dd, gg, mm, nn, rr, ll)**: Waxaa la siiyay culeys laba jibaar ah (gemination) si uusan ugu dhawaaqin hal xaraf.
  - Shaqallada dhaadheer (*aa, ee, ii, oo, uu*) iyo xarfaha gaarka ah (*c, x, q, dh, kh*).
- **5 Cod oo Dabiici ah**: Deeqo (Kore), Warsame (Puck), Garaad (Fenrir), Shire (Zephyr), iyo Cumar (Charon).
- **Interface Fudud & Xarrago leh**:
  - Sanduuqa qoraalka oo ballaaran.
  - Badhanka tooska ah ee **"Aqri"**.
  - **Fallaarta La Degista (Download Arrow)**: Soo degso codka oo ah Studio WAV 24kHz.
- **Settings & Koontada Google**:
  - Ku gal koontadaada Google si aad u keydsato codadkaaga.
  - Hagaajinta xawaaraha (0.75x, 1x, 1.25x, 1.5x) iyo lahjadaha (Maxaa Tiri, Benaadiri, Idaacad).
- **Resilient Fallback Engine**:
  - Waxaa ku jira nidaam labaad (Device Web Speech Engine & Audio Synthesis) haddii xadka Gemini API la gaaro, si uusan adeeggu marnaba u kala go'in.

---

## 🛠️ Tiknoolajiyadda (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **AI Audio Engine**: Google Gemini 3.8 Audio API (`@google/genai`)
- **Build Tool**: Vite 8

---

## 🚀 Sida Loo Rakibo & Loo Kiciyo (Installation & Setup)

### 1. Soo deji ama Clone-garee:
```bash
git clone https://github.com/YOUR_USERNAME/codka-soomaaliga-ai.git
cd codka-soomaaliga-ai
```

### 2. Ku shub Dependencies-ka:
```bash
npm install
```

### 3. Diyaari Environment Variables (.env):
Abuur file lagu magacaabo `.env` kuna dar furahaaga Gemini API:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```
*(Furaha Gemini API waxaad si bilaash ah uga qaadan kartaa [Google AI Studio](https://aistudio.google.com/app/apikey)).*

### 4. Kici Mashruuca (Start Development Server):
```bash
npm run dev
```
Fur browser-kaaga oo booqo: `http://localhost:3000`

### 5. Build for Production:
```bash
npm run build
npm start
```

---

## 📄 Shatiga (License)
Apache-2.0 License
