## 📝 TODO & Ideas Backlog

### 🎨 Visual & UI/UX
- [ ] **Interaktívny Onboarding Tutorial:** Walkthrough pre nových používateľov s využitím knižnice (napr. Driver.js), stav uložený v `localStorage` s možnosťou kedykoľvek ho spustiť znova z menu.
- [ ] **Dynamic Theme Engine Extensions:** Možnosť vytvárať vlastné používateľské témy alebo exportovať/importovať farebné schémy.
- [ ] **Mini-mapa plátna:** Navigation overview v rohu obrazovky pre rýchly posun v rozsiahlych sieťach.
- [ ] **Snap-to-Grid & Alignment Guides:** Pomocné vodiace čiary pre presné zarovnávanie uzlov pri drag-and-drop.

### ⚡ Funkcionalita Editora & Engine
- [ ] **Vytváranie hrán (Arcs):** Prepojenie uzlov potiahnutím z uzla na uzol alebo interaktívnym výberom.
- [ ] **Validácia Petriho siete:** Zamedzenie vytvoreniu neplatných hrán (napr. Place $\rightarrow$ Place alebo Transition $\rightarrow$ Transition).
- [ ] **Vlastnosti hrán & uzlov:** Nastavovanie váhy hrán (arc weight), kapacity miest a počtu tokenov cez property panel.
- [ ] **Knižnica vzorových sietí (Blueprints/Templates):** Predpripravené ukážkové Petriho siete (napr. Producer-Consumer, Readers-Writers, Dining Philosophers, Deadlock example) pre rýchle načítanie a testovanie simulácie.
- [ ] **Undo / Redo história:** Implementácia stohu zmien v Zustand store pre krok späť/dopredu.

### 🚀 Simulácia & Analýza
- [ ] **Kroková simulácia:** Manuálne odpálenie (fire) vykonateľných prechodov kliknutím používateľa.
- [ ] **Automatická simulácia:** Pustenie/pozastavenie simulácie s nastaviteľnou rýchlosťou (play/pause/speed slider).
- [ ] **Generovanie grafu dosiahnuteľnosti:** Detekcia uviaznutia (deadlock) a analýza živosti siete.

### 💾 Import / Export & PWA
- [ ] **Export do formátov:** PNML (Petri Net Markup Language - štandardizovaný XML formát), JSON, PNG a SVG.
- [ ] **Offline PWA support:** Nastavenie Service Workerov a offline cache pre plnú funkčnosť bez pripojenia k internetu.

---

## 📚 Teoretické podklady pre písomnú časť DP

- [ ] **Formálna definícia Petriho sietí:** 5-tica $N = (P, T, F, W, M_0)$ (množiny miest, prechodov, hrán, váhová funkcia, počiatočné značenie).
- [ ] **Dynamika a pravidlá prechodu:** Podmienky vykonateľnosti prechodov (enabled transitions), pravidlá konzumácie a generovania tokenov.
- [ ] **Analytické metódy:** Graf dosiahnuteľnosti (Reachability Graph), maticová reprezentácia (Incidence Matrix), pokryteľnosť a invarianty.
- [ ] **State Management v SPAs:** Porovnanie Zustand vs. Redux/Context API, architektúra jediného zdroja pravdy (Single Source of Truth), immutable zmeny stavu.
- [ ] **Vykresľovací engine (SVG vs. Canvas):** Dôvody voľby deklaratívneho SVG pre interaktívne node-graph editory (DOM udalosť nad elementmi, škálovateľnosť pri zoomovaní).
- [ ] **Progresívne webové aplikácie (PWA):** Service Workers, offline-first stratégia, Web App Manifest.
- [ ] **Analýza technologického stacku:** React 18, Vite, Tailwind CSS, pnpm.