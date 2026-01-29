# Jan Sahayak
**[Live Demo](https://anish-26.github.io/-JanSahayak/)**
## Project Description
Jan Sahayak is a web-based application designed to assist citizens in rural and underserved areas of India in identifying government welfare schemes for which they are eligible. The platform provides a simplified, multilingual interface that screens users based on demographic and economic criteria to suggest relevant schemes such as food security, housing, and pensions.



## Problem Statement
Accessing government welfare schemes in India is often complicated by:
*   **Information Asymmetry:** Fragmented sources of information make it difficult for citizens to know what is available.
*   **Complex Eligibility Criteria:** Technical bureaucratic language is hard for the average user to interpret.
*   **Language Barriers:** Many official portals primarily operate in English, excluding non-English speakers.
*   **Connectivity Issues:** Rural areas often face intermittent internet connectivity, hindering access to online-only portals.

## Solution Overview
Jan Sahayak addresses these challenges by offering an offline-first, guided eligibility tool. Instead of browsing through lengthy documents, users answer simple questions regarding their state, age, occupation, and income. The system uses a local logic engine to match these inputs against a database of scheme rules and provides an immediate list of eligible benefits with clear application instructions.

## Key Features
*   **Simplistic Interface:** Minimal text and icon-driven navigation suitable for users with limited digital literacy.
*   **Multilingual Support:** Fully localized interface available in English, Hindi, and Bengali.
*   **Offline Functionality:** Service Worker implementation allows the application to function without an active internet connection after the initial load.
*   **Rule-Based Assistance:** Interactive assistant and form-based logic to guide users through the eligibility process.
*   **Location Services:** Integrated map feature to locate the nearest Common Service Centers (CSC).

## User Flow
1.  **Language Selection:** The user selects their preferred language (English, Hindi, Bengali).
2.  **Navigation:** The user chooses a specific scheme category (e.g., Ration, Pension) or opts for the "Check Eligibility" wizard.
3.  **Data Input:** The user provides basic details:
    *   State of Residence
    *   Age
    *   Occupation
    *   Income Bracket
    *   Ration Card Type
4.  **Processing:** The application validates inputs and processes them through the internal rules engine.
5.  **Output:** The system displays a filtered list of schemes the user qualifies for, along with required documents and application steps.

## Scope and Limitations
*   **Data Source:** The current version uses a static JSON database of schemes for demonstration purposes and is not connected to a live government API.
*   **Eligibility Logic:** The eligibility check is based on simplified criteria and does not cover every edge case of official government regulations.
*   **Geography:** The database currently includes schemes for a limited number of states (Maharashtra, West Bengal, Uttar Pradesh) as examples.
*   **Validation:** The application does not verify the authenticity of user inputs; it operates solely on self-declared data.

## Tech Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript.
*   **Data Storage:** Local JSON files.
*   **Mapping:** Leaflet.js (OpenStreetMap) for location services.
*   **Offline Support:** Service Workers and Web App Manifest.
*   **Hosting:** GitHub Pages.

## Future Enhancements
*   **Voice Interface:** Integration of voice-to-text to allow oral interaction for illiterate users.
*   **Expanded Database:** Comprehensive inclusion of schemes from all Indian states.
*   **Official Integration:** Connection with open government APIs for real-time status tracking.
*   **Community Features:** Adding a feedback loop for users to report issues at local centers.

## How to Run Locally

Since this app uses Service Workers, it must be served via a local web server (not by opening `index.html` directly).

**Method 1: VS Code (Recommended)**
1.  Install the "Live Server" extension.
2.  Right-click `index.html` and select "Open with Live Server".

**Method 2: Python**
1.  Run `python -m http.server` in the project directory.
2.  Open `http://localhost:8000` in your browser.

