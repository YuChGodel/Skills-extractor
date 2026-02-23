# Skills Extractor

Extract developer skills from a CV in PDF format and display them with proficiency levels.

## Project Structure

```
Skills-extractor/
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── skillsList.js        # Comprehensive developer skills catalogue
│   │   ├── controllers/
│   │   │   └── skillsController.js  # Request handling (SOLID – SRP)
│   │   ├── routes/
│   │   │   └── skillsRoutes.js      # Express route definitions
│   │   ├── services/
│   │   │   ├── pdfService.js        # PDF text extraction
│   │   │   └── skillsExtractor.js   # NLP-style skills identification
│   │   └── server.js                # Application entry point
│   ├── data/
│   │   └── skills.json              # Persisted skills output
│   └── package.json
└── client/                  # Vue.js 3 frontend (no build step required)
    ├── index.html
    ├── js/
    │   └── app.js
    └── css/
        └── style.css
```

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Server Setup

```bash
cd server
npm install
npm start          # production
# or
npm run dev        # development with auto-reload (nodemon)
```

The server starts on **http://localhost:3000** by default.  
Set the `PORT` environment variable to use a different port.

### Client Setup

The client is a plain HTML/CSS/JS application using Vue.js 3 via CDN – no build step needed.

Open `client/index.html` directly in a browser, or serve it with any static file server:

```bash
# Using Node.js http-server (install globally with: npm install -g http-server)
cd client
http-server .
```

> **Important:** make sure the server is running before clicking **RUN** in the UI.

## API Endpoints

| Method | Path                  | Description                                        |
|--------|-----------------------|----------------------------------------------------|
| POST   | `/api/skills/extract` | Upload a PDF CV (`multipart/form-data`, field `cv`). Returns extracted skills JSON. |
| GET    | `/api/skills`         | Returns the last saved `skills.json` data.         |
| GET    | `/api/skills/download` | Download the last saved skills as a ZIP archive (JSON + HTML). |
| POST   | `/api/skills/compare` | Upload two PDF CVs (`multipart/form-data`, fields `cvA` and `cvB`). Returns comparison of skills from both CVs. |

### Response format

**Extract/Get Skills:**
```json
{
  "skills": [
    { "name": "Java",   "level": "Advanced" },
    { "name": "Spring", "level": "Intermediate" }
  ]
}
```

**Compare Skills:**
```json
{
  "skillsA": [
    { "name": "Java", "level": "Advanced" }
  ],
  "skillsB": [
    { "name": "Java", "level": "Intermediate" }
  ],
  "comparison": [
    {
      "name": "Java",
      "cvA": { "level": "Advanced", "numericLevel": 4 },
      "cvB": { "level": "Intermediate", "numericLevel": 2 },
      "comparison": "stronger_a",
      "difference": 2
    }
  ]
}
```

## Features

### Skills Extractor
Upload a single CV in PDF format to extract and display developer skills with proficiency levels.

### Skills Comparer
Compare skills between two CVs side by side:
- Upload two PDF CVs independently
- Visual comparison showing stronger/weaker/equal/exclusive skills
- Sort by strongest differences or alphabetically
- Filter to show all skills, differences only, or exclusive skills only
- Responsive design for desktop and tablet

Access the Skills Comparer at `comparer.html`.

## Architecture

Both sides follow **SOLID** principles:

- **Single Responsibility** – each class/module has one job (PDF parsing, skills extraction, routing, controlling).
- **Open/Closed** – the skills catalogue (`skillsList.js`) can be extended without touching extraction logic.
- **Dependency Inversion** – controllers depend on service abstractions, not concrete implementations.

The client is structured with **separate files** for HTML (`index.html`), JavaScript (`js/app.js`) and CSS (`css/style.css`).
