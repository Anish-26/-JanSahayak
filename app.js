
const app = {
    data: [],
    centers: [],
    currentLang: 'en',

    // Labels will be loaded from JSON
    labels: {},

    init: async () => {
        // Load Language Preference
        const savedLang = localStorage.getItem('janSahayak_lang');
        if (savedLang) app.currentLang = savedLang;
        const langSelector = document.getElementById('language-selector');
        if (langSelector) langSelector.value = app.currentLang;

        // Fetch Data & Initial Language
        try {
            await Promise.all([
                app.loadLanguage(app.currentLang),
                app.loadData()
            ]);
        } catch (error) {
            console.error("Initialization error:", error);
            app.showOfflineToast();
        }

        // Setup Event Listeners
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                app.setLanguage(e.target.value);
            });
        }

        // Initial Render
        app.updateUIText();

        // Check connectivity
        window.addEventListener('online', app.updateOnlineStatus);
        window.addEventListener('offline', app.updateOnlineStatus);
        app.updateOnlineStatus();

        // Check Offline Cache Status
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const badge = document.getElementById('offline-badge');
            if (badge) badge.innerHTML = `🟢 <span data-i18n="offline_badge">${app.labels.offline_badge || 'Offline Ready'}</span>`;
        }
    },

    loadData: async () => {
        try {
            const [schemesRes, centersRes] = await Promise.all([
                fetch('./data/schemes.json'),
                fetch('./data/centers.json')
            ]);

            const schemesJson = await schemesRes.json();
            app.data = schemesJson.schemes;

            const centersJson = await centersRes.json();
            app.centers = centersJson.centers;
        } catch (e) {
            console.error("Data load failed", e);
            throw e;
        }
    },

    loadLanguage: async (lang) => {
        try {
            const response = await fetch(`./lang/${lang}.json`);
            app.labels = await response.json();
        } catch (e) {
            console.error("Language load failed", e);
            // Fallback to English if load fails logic could be here
        }
    },

    setLanguage: async (lang) => {
        app.currentLang = lang;
        localStorage.setItem('janSahayak_lang', lang);

        await app.loadLanguage(lang);
        app.updateUIText();

        // Re-render current view if needed
        const activeView = document.querySelector('.view.active');
        if (activeView && activeView.id === 'category-view') {
            const catTitle = document.getElementById('cat-title');
            if (catTitle) {
                const currentCat = catTitle.getAttribute('data-cat');
                if (currentCat) app.showCategory(currentCat);
            }
        } else if (activeView && activeView.id === 'detail-view') {
            const detailTitle = document.getElementById('detail-title');
            if (detailTitle) {
                const currentItem = detailTitle.getAttribute('data-id');
                if (currentItem) {
                    const item = app.data.find(i => i.id === currentItem);
                    if (item) app.renderDetail(item);
                }
            }
        }
    },

    updateUIText: () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (app.labels[key]) el.textContent = app.labels[key];
        });
    },

    updateOnlineStatus: () => {
        const toast = document.getElementById('offline-toast');
        if (!toast) return;

        if (!navigator.onLine) {
            toast.textContent = "You are offline. Showing saved data.";
            toast.classList.remove('hidden');
        } else {
            toast.classList.add('hidden');
        }
    },

    showOfflineToast: () => {
        const toast = document.getElementById('offline-toast');
        if (toast) {
            toast.textContent = "Could not load data. Check connection.";
            toast.classList.remove('hidden');
        }
    },

    showView: (viewId) => {
        const views = document.querySelectorAll('.view');
        views.forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        const target = document.getElementById(viewId);
        if (target) {
            target.classList.remove('hidden');
            requestAnimationFrame(() => target.classList.add('active'));
        }
        window.scrollTo(0, 0);
    },

    showHome: () => {
        app.showView('home-view');
    },

    showEligibility: () => {
        app.showView('eligibility-view');
        document.getElementById('eligibility-results').classList.add('hidden');
    },

    runEligibilityCheck: () => {
        const state = document.getElementById('inp_state').value;
        const age = parseInt(document.getElementById('inp_age').value);
        const occupation = document.getElementById('inp_occupation').value;
        const ration = document.getElementById('inp_ration').value;
        const income = parseInt(document.getElementById('inp_income').value);

        const profile = { state, age, occupation, rationCard: ration, income };
        const resultDiv = document.getElementById('eligibility-results');
        const list = document.getElementById('eligible-list');
        list.className = ''; // reset

        // 1. Validation Step
        if (typeof eligibilityRules !== 'undefined') {
            const val = eligibilityRules.validateInput(profile);
            if (!val.isValid) {
                alert("❌ Input Error: " + val.error);
                resultDiv.classList.add('hidden');
                return;
            }

            // 2. Logic Check
            const { eligible, rejectionReasons } = eligibilityRules.check(profile, app.data);

            list.innerHTML = '';

            if (eligible.length > 0) {
                // Success Case
                const header = document.createElement('h3');
                header.innerText = `✅ You are eligible for ${eligible.length} schemes!`;
                header.style.color = 'green';
                list.appendChild(header);

                eligible.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'scheme-item';
                    el.style.borderLeftColor = 'green';
                    el.onclick = () => app.renderDetail(item);

                    const title = item.title[app.currentLang] || item.title['en'];
                    el.innerHTML = `<h4>${title}</h4><p>Click to view details</p>`;
                    list.appendChild(el);
                });
            } else {
                // Failure Case - Show Explanations
                const header = document.createElement('h3');
                header.innerText = "❌ No eligible schemes found based on your details.";
                header.style.color = '#d32f2f';
                list.appendChild(header);

                const reasonList = document.createElement('ul');
                reasonList.style.marginTop = '10px';
                reasonList.style.textAlign = 'left';
                reasonList.style.paddingLeft = '20px';

                rejectionReasons.forEach(r => {
                    const li = document.createElement('li');
                    li.innerHTML = `<b>${r.name}:</b> <span style="color:#555">${r.reason}</span>`;
                    li.style.marginBottom = '5px';
                    reasonList.appendChild(li);
                });
                list.appendChild(reasonList);
            }

            resultDiv.classList.remove('hidden');

        } else {
            console.error("Eligibility Rules Engine not loaded.");
        }
    },

    checkStatus: () => {
        const mobile = document.getElementById('track_mobile').value;
        const aadhaar = document.getElementById('track_aadhaar').value;
        const resDiv = document.getElementById('status-result');

        if (mobile.length !== 10 || aadhaar.length !== 4) {
            alert("Please enter valid Mobile (10 digits) and Aadhaar (last 4 digits)");
            return;
        }

        resDiv.classList.remove('hidden');
        // Mock Logic
        const statuses = [
            { t: 'Application Submitted', c: 'status-success', msg: 'Your application for Ration Card is under process.' },
            { t: 'Under Verification', c: 'status-pending', msg: 'Documents are being verified by Block Officer.' },
            { t: 'Action Required', c: 'status-rejected', msg: 'Photo unclear. Please visit CSC to update.' }
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        resDiv.innerHTML = `
            <h3 class="${status.c}">${status.t}</h3>
            <p>${status.msg}</p>
            <small>Last updated: ${new Date().toLocaleDateString()}</small>
        `;
    },

    showStatus: () => {
        app.showView('status-view');
    },

    showCategory: (category) => {
        const catTitle = document.getElementById('cat-title');
        // Update Title based on labels
        const catKey = `cat_${category}`;
        const translatedTitle = app.labels[catKey] || category.toUpperCase();

        if (catTitle) {
            catTitle.textContent = translatedTitle;
            catTitle.setAttribute('data-cat', category);
        }

        const items = app.data.filter(item => item.category === category);
        const centralItems = items.filter(i => i.type === 'central');
        const stateItems = items.filter(i => i.type === 'state');

        const renderItems = (items, containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';

            if (items.length === 0) {
                container.innerHTML = '<p style="color:#888; font-style:italic;">No schemes available.</p>';
                return;
            }

            items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'scheme-item';
                el.setAttribute('data-type', item.type || 'central');
                el.onclick = () => app.renderDetail(item);

                const title = item.title[app.currentLang] || item.title['en'];
                const desc = item.description[app.currentLang] || item.description['en'];

                el.innerHTML = `
                    <h3>${title}</h3>
                    <p>${desc}</p>
                `;
                container.appendChild(el);
            });
        };

        renderItems(centralItems, 'scheme-list-central');
        renderItems(stateItems, 'scheme-list-state');

        app.showView('category-view');
    },

    renderDetail: (item) => {
        const titleEl = document.getElementById('detail-title');
        const lang = app.currentLang;

        const titleText = item.title[lang] || item.title['en'];
        const descText = item.description[lang] || item.description['en'];

        if (titleEl) {
            titleEl.innerText = titleText;
            titleEl.setAttribute('data-id', item.id);
        }

        const iconEl = document.getElementById('detail-icon');
        if (iconEl) iconEl.innerText = item.icon || '📄';

        const descEl = document.getElementById('detail-desc');
        if (descEl) descEl.innerHTML = `
            ${descText} <br><br>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn-small btn-secondary" onclick="app.speakScheme('${titleText}. ${descText}')">
                    🔊 ${app.labels.listen || 'Listen'}
                </button>
                ${item.link ? `
                <a href="${item.link}" target="_blank" class="btn-small btn-primary" style="text-decoration:none; display:inline-block;">
                    🌍 Official Website
                </a>` : ''}
            </div>
        `;

        const renderList = (elementId, arrayData) => {
            const ul = document.getElementById(elementId);
            if (!ul) return;
            ul.innerHTML = '';
            if (!arrayData) return;

            arrayData.forEach(text => {
                const li = document.createElement('li');
                if (typeof text === 'object') {
                    li.innerText = text[lang] || text['en'] || Object.values(text)[0];
                } else {
                    li.innerText = text;
                }
                ul.appendChild(li);
            });
        };

        renderList('detail-eligibility', item.eligibility);
        renderList('detail-docs', item.documents);
        const stepsData = item.steps[lang] || item.steps['en'];
        renderList('detail-steps', stepsData);

        // Append "What Will I Get" and "Common Problems" (Dynamic Injection)
        // Note: For a real app, these should be in the JSON. Injecting mocks for demo.
        const detailCard = document.querySelector('#detail-view .detail-card');

        // Remove old extras if any
        const oldExtras = document.querySelectorAll('.detail-extra');
        oldExtras.forEach(e => e.remove());

        const whatIGet = document.createElement('div');
        whatIGet.className = 'info-block detail-extra';
        whatIGet.innerHTML = `
            <h3>🎁 What Will I Get?</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
                <div style="background:#e8f5e9; padding:10px; border-radius:8px; flex:1; min-width:100px; text-align:center;">
                    <span style="font-size:1.5rem">💰</span><br>Financial Support
                </div>
                 <div style="background:#fff3e0; padding:10px; border-radius:8px; flex:1; min-width:100px; text-align:center;">
                    <span style="font-size:1.5rem">📜</span><br>Certificate
                </div>
            </div>

            <h3>⚠️ Common Problems & Fixes</h3>
            <div style="background:#fff5f5; padding:15px; border-radius:10px; border:1px solid #ffcdd2;">
                <details style="margin-bottom:10px;">
                    <summary style="font-weight:bold; cursor:pointer;">❓ Name Mismatch in Aadhaar</summary>
                    <p style="margin-top:5px; font-size:0.9rem;">
                        <b>Fix:</b> Update Aadhaar at nearest CSC.<br>
                        <b>Doc:</b> School Cert or Voter ID.
                    </p>
                </details>
                <details>
                    <summary style="font-weight:bold; cursor:pointer;">❓ Bank Account Inactive</summary>
                    <p style="margin-top:5px; font-size:0.9rem;">
                        <b>Fix:</b> Do KYT at your bank branch.<br>
                        <b>Doc:</b> Aadhaar & PAN.
                    </p>
                </details>
            </div>
        `;
        detailCard.appendChild(whatIGet);

        app.showView('detail-view');
    },

    speakScheme: (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);

            let targetLang = 'en-IN';
            if (app.currentLang === 'hi') targetLang = 'hi-IN';
            else if (app.currentLang === 'bn') targetLang = 'bn-IN';
            else if (app.currentLang === 'mr') targetLang = 'mr-IN'; // Future proof

            utterance.lang = targetLang;

            // improved voice selection
            const voices = window.speechSynthesis.getVoices();
            // Try exact match first, then loose match (e.g. 'hi' matching 'hi-IN')
            const voice = voices.find(v => v.lang === targetLang) ||
                voices.find(v => v.lang.startsWith(app.currentLang));

            if (voice) {
                utterance.voice = voice;
                console.log("Using voice:", voice.name);
            }

            // slightly slower rate for clarity
            utterance.rate = 0.9;

            window.speechSynthesis.speak(utterance);
        } else {
            alert("TTS not supported in this browser.");
        }
    },

    goBackFromDetail: () => {
        window.speechSynthesis.cancel();
        const detailTitle = document.getElementById('detail-title');
        const currentId = detailTitle ? detailTitle.getAttribute('data-id') : null;

        const item = app.data.find(i => i.id === currentId);
        if (item) {
            app.showCategory(item.category);
        } else {
            app.showHome();
        }
    },

    showCSC: () => {
        app.showView('csc-view');
        // Initialize map after view is visible to ensure container has size
        setTimeout(() => app.initMap(), 100);
    },

    initMap: () => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        if (!navigator.onLine) {
            mapContainer.innerHTML = '<div style="height:100%; display:flex; align-items:center; justify-content:center; background:#eee;">Map unavailable offline.</div>';
            return;
        }

        let lat = 20.5937;
        let lng = 78.9629;
        let zoom = 5;

        // Default to centers if available
        if (app.centers && app.centers.length > 0) {
            lat = app.centers[0].lat;
            lng = app.centers[0].lng;
            zoom = 13;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    app.renderLeaflet(userLat, userLng, 13);
                },
                (error) => {
                    console.error("Geo error", error);
                    app.renderLeaflet(lat, lng, zoom);
                }
            );
        } else {
            app.renderLeaflet(lat, lng, zoom);
        }
    },

    renderLeaflet: (lat, lng, zoom) => {
        const mapContainer = document.getElementById('map');
        if (app.map) {
            app.map.remove();
        }

        try {
            if (typeof L === 'undefined') {
                mapContainer.innerHTML = 'Map library not loaded.';
                return;
            }

            app.map = L.map('map').setView([lat, lng], zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(app.map);

            L.marker([lat, lng]).addTo(app.map)
                .bindPopup('<b>You are here</b>')
                .openPopup();

            if (app.centers) {
                app.centers.forEach(center => {
                    // Calculate mock distance (very rough)
                    const dist = Math.sqrt(Math.pow(center.lat - lat, 2) + Math.pow(center.lng - lng, 2)) * 111;

                    L.marker([center.lat, center.lng]).addTo(app.map)
                        .bindPopup(`
                            <div style="min-width:200px">
                                <b>${center.name}</b><br>
                                <span style="color:#666">${center.type}</span><br>
                                <small>📍 ${center.address}</small><br>
                                <small>🕒 ${center.hours || '9 AM - 5 PM'}</small><br>
                                <small>📏 ~${dist.toFixed(1)} km away</small>
                                <div style="margin-top:8px; display:flex; gap:5px;">
                                    <a href="tel:${center.phone || ''}" class="btn-small">📞 Call</a>
                                    <a href="https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}" target="_blank" class="btn-small btn-secondary">📍 Map</a>
                                </div>
                            </div>
                        `);
                });
            }

        } catch (e) {
            console.error("Map render failed", e);
            mapContainer.innerHTML = "Map could not load.";
        }
    }
};

document.addEventListener('DOMContentLoaded', app.init);
