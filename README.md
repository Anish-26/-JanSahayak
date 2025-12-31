# Jan Sahayak(জন-সহায়ক)

### Project Description
Jan Sahayak is a simple web app built to help people in rural and underserved parts of India find government welfare schemes they actually qualify for. It’s got a clean, easy-to-use interface that works in multiple languages, so you don’t need to be a techie—or even speak English—to use it. The app asks a few questions about who you are and what you earn, then shows you government programs you can apply for, like food support, housing, or pensions.

## Live Demo: https://anish-26.github.io/-JanSahayak/

## Problem Statement
Let’s face it: getting access to government welfare in India is confusing. Here’s why:
- Information is scattered everywhere. Most people don’t even know what’s available.
- The rules are written in heavy, bureaucratic language that’s tough to understand.
- Official websites mostly use English, leaving out huge chunks of the population.
- On top of that, rural internet is spotty, so online-only sites don’t always work when you need them.

### Solution Overview
Jan Sahayak cuts through the mess. It’s designed to work offline, right from the start. Instead of forcing people to scroll through endless government documents, the app just asks a few straightforward questions—your state, age, job, income—and matches your answers to a local database of schemes. Instantly, you get a filtered list of benefits you’re eligible for, with clear steps on how to apply.

## Key Features
- Super simple interface. Minimal text, lots of icons—easy for anyone to use, even if you’re not comfortable with tech.
- Multilingual. The app speaks English, Hindi, and Bengali out of the box.
- Works offline. After the first load, you don’t need an internet connection to keep using it.
- Smart assistant. The app guides you through eligibility checks with interactive forms and logic.
- Built-in maps. Quickly find your nearest Common Service Center (CSC) with the integrated map.

## User Flow
1. Pick your language—English, Hindi, or Bengali.
2. Choose a category (like Ration or Pension) or use the "Check Eligibility" wizard.
3. Enter your details:
   - State you live in
   - Age
   - Occupation
   - Income range
   - Ration card type
4. The app checks your info against its rules engine.
5. You get a list of schemes you qualify for, plus what documents you’ll need and how to apply.

## Scope and Limitations
- Data source: Right now, the app uses a static JSON database for demo purposes. It’s not linked to any live government systems yet.
- Eligibility logic: It covers the basics but doesn’t catch every edge case from official rules.
- Geography: Only includes a few states so far—Maharashtra, West Bengal, and Uttar Pradesh.
- Input validation: The app trusts whatever you enter; it doesn’t verify your details.

## Tech Stack
- Frontend: HTML5, CSS3, and plain JavaScript.
- Data storage: Local JSON files.
- Mapping: Leaflet.js (with OpenStreetMap).
- Offline support: Service Workers and a Web App Manifest.
- Hosting: GitHub Pages.

## Future Enhancements
- Voice interface: Let users interact by speaking, which helps if they can’t read or write.
- Expanded database: Add schemes from every Indian state.
- Official integration: Connect to government APIs for real-time updates and status tracking.
- Community features: Allow users to provide feedback or flag issues at local centers.

## How to Run Locally

Since Jan Sahayak uses Service Workers, you can’t just open index.html directly; it needs to run on a local server.

### Method 1: VS Code (Recommended)
1. Install the “Live Server” extension.
2. Right-click index.html and pick “Open with Live Server.”

### Method 2: Python
1. In your project folder, run python -m http.server.
2. Open http://localhost:8000 in your web browser.

