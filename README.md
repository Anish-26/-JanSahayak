# JanSahayak (जन-सहायक)

**Offline-First Government Scheme Helper for Rural India.**
*Built for CodeSangram Hackathon.*

## 🚀 How to Run Locally

Since this app uses Service Workers (for offline support) and fetch API, **it must be served via a local server** (not double-clicking index.html).

### Method 1 (Using Python - Recommended)
1. Open a terminal in this folder.
2. Run:
   ```bash
   python -m http.server
   ```
3. Open your browser and go to: `http://localhost:8000`

### Method 2 (VS Code)
1. Install "Live Server" extension.
2. Right click `index.html` > "Open with Live Server".

## 📱 Features
- **Offline First**: Works without internet after the first load.
- **Multilingual**: Supports English, Hindi, and Bengali.
- **Icon-Driven**: Easy for users with low literacy.

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript.
- **Data**: JSON (Local).
- **Offline**: Service Workers + PWA Manifest.

## 📂 Project Structure
```
/JanSahayak
  ├── index.html       # Main UI Shell
  ├── app.js           # Logic (Routing, Data, i18n)
  ├── style.css        # Simple, high-contrast styles
  ├── sw.js            # Service Worker (Offline Cache)
  └── data/
      └── schemes.json # The Scheme Database
```

## 🤝 Social Impact
This app bridges the digital divide by removing language barriers and internet dependency for accessing critical rights.
