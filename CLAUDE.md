# CLAUDE.md

Ce fichier guide le développement du projet **Telmi Sync**. Le code est en anglais, l'interface utilisateur est en français (et en anglais), la documentation est en français.

## Présentation

**Telmi Sync** est une application desktop (Electron) de gestion des histoires pour la boîte à histoires **Telmi OS**. Elle s'adresse au parent.

### Fonctions
- Gérer les histoires (fichiers) sur l'ordinateur.
- Transférer les histoires vers Telmi OS (carte SD insérée dans l'ordinateur).
- Créer des histoires interactives à choix multiples grâce au **Studio** intégré (gestion de nœuds, édition des audios, TTS...).
- Créer des packs d'histoires depuis des flux RSS de podcasts (onglet **Podcasts**).
- Accéder au **Store** de Telmi pour télécharger gratuitement des histoires créées par la communauté.

Projet open source, entièrement gratuit.

### Contexte : l'écosystème Telmi
- **Telmi OS** — OS pour Miyoo Mini Plus (la boîte à histoires).
- **Telmi Sync** — ce projet : logiciel desktop de gestion des packs d'histoires.
- **Telmi Android** — application boîte à histoires pour téléphones/tablettes Android.
- **podcasts.telmi.fr** (repo `telmi-podcast-rate`) — site public de notation (5 étoiles) et d'avis des flux RSS de podcasts pour enfants. **Les avis de ce site sont consommés par Telmi Sync** (voir « Données » ci-dessous).

## Stack technique

| Couche | Technologie |
|---|---|
| Desktop | Electron 43 — point d'entrée `public/electron.js` |
| UI | React 18 (JSX, **pas de TypeScript**) via `react-scripts` 5 (CRA) |
| Styles | SCSS modules (`*.module.scss`) + variables partagées `src/App/variables.scss` |
| Icônes | FontAwesome — police locale `icons`, utilisée via **codepoints unicode** (ex. `'\uf05a'`) |
| Packaging | `electron-builder` — Windows x64, macOS x64/arm64 (signature sans certificat Apple Developer), Linux x64/arm64 |
| Tests | Aucun framework de test |

**Règle** : éviter toute dépendance (npm) pour une fonctionnalité qui peut être implémentée facilement directement.

## Architecture

### Processus principal (Electron main) — `public/`
- `public/electron.js` — point d'entrée : crée la `BrowserWindow` (`nodeIntegration: true`, `contextIsolation: false`, `webSecurity: false`), supprime le menu, puis enregistre tous les `mainEvent*(mainWindow)`.
- `public/MainEvents/*.js` — un fichier par domaine (`Stores.js`, `TelmiOS.js`, `TelmiOSStories.js`, `Studio.js`, `Audio.js`, `Import.js`, `Update.js`, `Window.js`, `TableState.js`, `Server.js`, ...) : handlers IPC (`ipcMain.on`) qui gèrent les fichiers/ressources de l'ordinateur.
- `public/MainEvents/Helpers/` — helpers partagés : `Request.js` (`requestJson`, `requestJsonOrXml`, `downloadFile`, `requestData`), `AppPaths.js` (chemins applicatifs), `Files.js`, `Strings.js`, `Stories.js`, ...
- `public/MainEvents/Processes/` — **processus d'arrière plan** (tâches lourdes/longues), un sous-dossier par domaine (`Store/`, `Import/`, `PiperTTS/`, `Audio/`, `Music/`, `Stories/`, `Studio/`, `TelmiOS/`, `FileManager/`, `Server/`, `BinFiles/`, `Helpers/`).

### Processus d'arrière plan (`runProcess`)
Toujours appelés depuis les `MainEvents` via `Processes/RunProcess.js` :

```js
runProcess(mainWindow, path.join('Store', 'StoreDownload.js'), [param],
  onSuccess, onProgress, onError, onFinished)
```

- Lancé avec `utilityProcess.fork` ; les paramètres sont préfixés `[electron]` (à lire avec `getProcessParams()` de `Processes/Helpers/ProcessParams.js`).
- **Protocole stdout** (messages séparés par `*`) :
  - progression : `*message*current*total*` (ex. `*story-download*42*100*`) ;
  - avertissement : `error-warning` + titre + message (3 segments) ;
  - `success` (segment final) → tâche terminée.
- **stderr** = erreur → `onError(message)`.
- Exemples : `Processes/Store/StoreDownload.js`, `Processes/Store/StoreBuild.js`.

### UI (React) — `src/App/`
- `src/index.js` → `App.js` : providers imbriqués :
  `LocaleProvider` → `TelmiSyncParamsProvider` → `ModalProvider` → `TelmiOSProvider` → `LocalStoriesProvider` → `LocalMusicProvider` → `RouterProvider` (+ `ErrorListener`).
- `Router/` — routing interne par modules (pas de react-router) : `RouterProvider` + `Routes.js` (registre des modules) + `useRouter()`. Chaque module exporte sa route depuis `Modules/<Module>/Routes.js`.
- `Layout/` — `TopBar` (navigation + contrôles de fenêtre) et `AppContainer`.
- `Modules/` — un dossier par module, chacun avec `Home.js`, `Routes.js`, ses composants et son `*.module.scss` :
  - `Synchronize` — synchronisation carte SD ↔ Telmi OS (histoires, musique).
  - `Stores` — stores de packs d'histoires (téléchargement, construction de packs, stores RSS).
  - `Studio` — création d'histoires interactives (nœuds, audios, TTS Piper).
  - `RSSFeed` — **onglet Podcasts** : liste des flux RSS de podcasts pour enfants, popup d'infos, ajout d'un flux en store.
  - `AndroidApp`, `DownloadFFmpeg`, `Import`, `TelmiSyncParams`.
- `Components/` — composants partagés :
  - `Table/` — liste générique (recherche, groupes repliables, sélection, actions par cellule). Données : `tableGroup` / `tableChildren` / `cellTitle` / `cellSubtitle` / `image` / `cellLabelIcon` (+`cellLabelIconText`) / `cellDisabled`.
  - `Modal/` — `ModalLayoutPadded` + `ModalTitle` + `ModalContent` (scrollable) + `ButtonsContainer` ; hooks `useModal()` → `addModal` / `rmModal`.
  - `Locale/` — `useLocale()` → `getLocale('cle', ...args)` (format printf) ; traductions dans `src/Locales/{fr,en}.js` (clés en kebab-case).
  - `Electron/Hooks/` — `useElectronEmitter(channel, deps)` / `useElectronListener(channel, cb, deps)` pour l'IPC côté renderer.
  - `Buttons/` — boutons et icônes (FontAwesome en codepoints unicode).
- `src/Locales/` — `fr.js`, `en.js` (l'app est bilingue FR/EN, FR par défaut).

### Pattern IPC (renderer ↔ main)
- Renderer → main : `ipcRenderer.send('evenement', ...)` ou `useElectronEmitter('evenement', deps)`.
- Main → renderer : `mainWindow.webContents.send('evenement-data', data)` ; le renderer écoute avec `useElectronListener('evenement-data', cb, deps)`.
- **Convention de noms** : `xxx-get` (demande) → `xxx-data` (réponse). Ex. `store-rssfeed-get` → `store-rssfeed-data`.

## Données

- **Stores** : `getStoresPath('stores.json')` — liste des stores JSON distants (défauts : Telmi Interactive, Litteratureaudio.com + stores RSS ajoutés par l'utilisateur).
- **Flux RSS de podcasts** (onglet Podcasts) : gist `https://gist.githubusercontent.com/DantSu/75dfd354b587e7e353302834967e48bc/raw/rss-feed.json`.
  - Structure : `{ "<Groupe éditeur>": [ { title, category, link, rssFeed, image, ads, description, averageRating, recommendedAge, reviewsCount, dataUrl }, ... ] }` — ~174 podcasts. Les clés sont des **groupes d'éditeurs** (Radio France, ARTE Radio, Bayard Presse, ...), pas des catégories de contenu ; `category` = nom de l'éditeur du podcast.
  - `averageRating` (float | null), `recommendedAge` (int | null), `reviewsCount` (int) : **agrégats issus de podcasts.telmi.fr**.
  - `dataUrl` : URL raw GitHub du JSON détaillé du podcast (repo public `DantSu/telmi-rss-feed-podcasts`, `podcasts/{slug}.json`) contenant le tableau `reviews[]` complet : `{ stars, comment, authorName, minAge, createdAt }` (+ les mêmes agrégats).
- **Histoires / musique locales** : dossiers de l'utilisateur (`getStoriesPath()`, `getMusicPath()`, `getTmpPath()`, `initTmpPath()`, ...).
- **TTS** : Piper — binaires dans `extraResources/` (copiés au build, `getExtraResourcesPath()`).
- **Carte SD / Telmi OS** : détection via `drivelist`, formatage FAT32, etc.

## Conventions de développement
- **Langue** :
  - Code (variables, fonctions, commentaires) : **anglais**.
  - UI : français + anglais (`src/Locales/`).
  - Documentation (CLAUDE.md, README, plans) : **français**.
  - Commits : **anglais** (impératif).
- **Style JS** : pas de point-virgule, guillemets simples, indentation 2 espaces, imports ESM avec extension `.js` explicite.
- **Plans** : `documents/plans/` (⚠️ le dossier `documents/` est gitignoré dans ce repo (repo public)).
- **Pas de CI/CD** : releases manuelles via electron-builder.

## Commandes
```bash
yarn               # installation
yarn start         # dev : react-scripts (localhost:3000) + electron
yarn build         # build Windows x64
yarn build:mac     # build macOS x64 + arm64
yarn build:linux   # build Linux x64 + arm64
```
