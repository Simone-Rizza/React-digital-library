# 📚 Biblioteca Digitale

Sistema di gestione per biblioteca digitale sviluppato in React che permette agli utenti di prendere in prestito libri e agli amministratori di gestire l'intero sistema bibliotecario.

## 🎯 Panoramica del Progetto

Applicazione web completa per la gestione di una biblioteca digitale con funzionalità di:
- Catalogazione libri tramite Google Books API
- Sistema di prestiti con gestione scadenze
- Autenticazione utenti con ruoli (User/Admin)
- Sistema di recensioni e valutazioni
- Dashboard amministrativa per gestione completa

## 🚀 Istruzioni per l'Avvio

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione
```bash
# Clona il repository
cd digital-library

# Installa le dipendenze
npm install

# Avvia il server JSON (database locale)
npm run server

# In un nuovo terminale, avvia l'applicazione React
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`
Il server JSON sarà disponibile su `http://localhost:3001`

### Credenziali di Test
- **Utente Normale**: `user@example.com` / `password123`
- **Amministratore**: `admin@library.com` / `admin123`

## ✨ Funzionalità Implementate

### 👤 Funzionalità Utente
- ✅ Navigazione catalogo libri con filtri (genere, autore, anno)
- ✅ Ricerca libri tramite Google Books API
- ✅ Visualizzazione dettagli libro con recensioni
- ✅ Prestito libri disponibili
- ✅ Gestione prestiti personali con date di scadenza
- ✅ Restituzione libri
- ✅ Sistema di recensioni e valutazioni (1-5 stelle)
- ✅ Gestione profilo personale

### 🔧 Funzionalità Amministratore
- ✅ Dashboard completa prestiti attivi/scaduti
- ✅ Gestione utenti del sistema
- ✅ Aggiunta/rimozione libri dal catalogo
- ✅ Gestione disponibilità copie per libro
- ✅ Moderazione recensioni utenti
- ✅ Statistiche sistema bibliotecario

### 📱 Pagine Implementate
1. **Home/Dashboard** (`/`) - Panoramica sistema
2. **Catalogo Libri** (`/books`) - Elenco libri con filtri
3. **Dettaglio Libro** (`/books/:id`) - Informazioni dettagliate
4. **I Miei Prestiti** (`/my-loans`) - Gestione prestiti personali
5. **Admin Dashboard** (`/admin`) - Pannello amministrativo
6. **Login** (`/login`) - Autenticazione utenti
7. **Profilo** (`/profile`) - Gestione dati personali

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 19** - Framework JavaScript
- **React Router Dom 7** - Routing applicazione
- **Redux + Redux Thunk** - Gestione stato globale
- **Bootstrap 5 + React Bootstrap** - UI Framework
- **Vite** - Build tool e dev server

### Backend & Database
- **JSON Server** - Server REST API locale
- **Google Books API** - Integrazione catalogo libri

### Development Tools
- **ESLint** - Linting del codice
- **Vite** - Bundler e development server

## 🏗️ Architettura del Progetto

```
src/
├── components/          # Componenti riutilizzabili
│   ├── BookCard.jsx     # Card singolo libro
│   ├── BookList.jsx     # Lista libri
│   ├── ReviewForm.jsx   # Form recensioni
│   ├── Navbar.jsx       # Barra di navigazione
│   └── ...
├── pages/              # Pagine principali
│   ├── Home.jsx        # Dashboard home
│   ├── BookCatalog.jsx # Catalogo libri
│   ├── BookDetail.jsx  # Dettaglio libro
│   ├── MyLoans.jsx     # Prestiti utente
│   └── ...
├── redux/              # Gestione stato Redux
│   ├── store.js        # Configurazione store
│   ├── userSlice.js    # Stato utenti
│   ├── booksSlice.js   # Stato libri
│   └── ...
├── services/           # API calls
│   ├── googleBooksAPI.js
│   └── localAPI.js
└── utils/              # Utility functions
```

## 📊 Database Schema

Il sistema utilizza JSON Server con le seguenti entità:
- **users** - Utenti del sistema (user/admin)
- **books** - Catalogo libri (integrato con Google Books)
- **loans** - Prestiti attivi/completati
- **reviews** - Recensioni e valutazioni