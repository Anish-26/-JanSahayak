const chatbot = {
    state: {
        intent: null,
        step: 0,
        data: {}
    },

    labels: {
        en: {
            welcome: "Namaste! How can I help you?",
            opt_help: "Find Help",
            opt_eligibility: "Check Eligibility",
            opt_csc: "Find CSC Center",
            opt_status: "Track Status",
            ask_state: "Which state are you from?",
            ask_age: "What is your age in years?",
            ask_work: "What is your occupation?",
            ask_ration: "What is your Ration Card type?",
            ask_income: "What is your annual family income (₹)?",
            checking: "Checking schemes...",
            found_msg: "🎉 Found schemes for you!",
            no_scheme: "❌ No schemes found.",
            reasons: "Reasons:",
            what_else: "What else can I do?",
            restart: "Restart",
            view: "View",
            open_map: "Open Map",
            open_status: "Open Status Tracker",
            error_age: "Please enter a valid age (0-120).",
            error_income: "Income cannot be negative."
        },
        hi: {
            welcome: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
            opt_help: "सहायता प्राप्त करें",
            opt_eligibility: "पात्रता जांचें",
            opt_csc: "CSC केंद्र खोजें",
            opt_status: "स्थिति ट्रैक करें",
            ask_state: "आप किस राज्य से हैं?",
            ask_age: "आपकी उम्र क्या है?",
            ask_work: "आपका व्यवसाय क्या है?",
            ask_ration: "आपका राशन कार्ड प्रकार क्या है?",
            ask_income: "आपकी वार्षिक पारिवारिक आय (₹) क्या है?",
            checking: "योजनाओं की जांच की जा रही है...",
            found_msg: "🎉 आपके लिए योजनाएं मिलीं!",
            no_scheme: "❌ कोई योजना नहीं मिली।",
            reasons: "कारण:",
            what_else: "मैं और क्या कर सकता हूँ?",
            restart: "पुनः आरंभ करें",
            view: "देखें",
            open_map: "नक्शा खोलें",
            open_status: "स्थिति ट्रैकर खोलें",
            error_age: "कृपया मान्य आयु दर्ज करें (0-120)।",
            error_income: "आय नकारात्मक नहीं हो सकती।"
        },
        bn: {
            welcome: "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
            opt_help: "সাহায্য খুঁজুন",
            opt_eligibility: "যোগ্যতা যাচাই করুন",
            opt_csc: "CSC কেন্দ্র খুঁজুন",
            opt_status: "স্থিতি ট্র্যাক করুন",
            ask_state: "আপনি কোন রাজ্যের বাসিন্দা?",
            ask_age: "আপনার বয়স কত?",
            ask_work: "আপনার পেশা কি?",
            ask_ration: "আপনার রেশন কার্ডের ধরন কি?",
            ask_income: "আপনার বার্ষিক পারিবারিক আয় (₹) কত?",
            checking: "স্কিম যাচাই করা হচ্ছে...",
            found_msg: "🎉 আপনার জন্য স্কিম পাওয়া গেছে!",
            no_scheme: "❌ কোন স্কিম পাওয়া যায়নি।",
            reasons: "কারণ:",
            what_else: "আমি আর কি করতে পারি?",
            restart: "পুনরায় শুরু করুন",
            view: "দেখুন",
            open_map: "ম্যাপ খুলুন",
            open_status: "স্ট্যাটাস ট্র্যাকার খুলুন",
            error_age: "অনুগ্রহ করে সঠিক বয়স লিখুন (০-১২০)।",
            error_income: "আয় নেতিবাচক হতে পারে না।"
        }
    },

    // Localized options maps
    opts: {
        work: {
            en: { farmer: 'Farmer', student: 'Student', labour: 'Labour', other: 'Other' },
            hi: { farmer: 'किसान', student: 'छात्र', labour: 'मजदूर', other: 'अन्य' },
            bn: { farmer: 'কৃষক', student: 'ছাত্র', labour: 'শ্রমিক', other: 'অন্যান্য' }
        },
        state: {
            en: { wb: 'West Bengal', mh: 'Maharashtra', up: 'Uttar Pradesh', other: 'Other' },
            hi: { wb: 'पश्चिम बंगाल', mh: 'महाराष्ट्र', up: 'उत्तर प्रदेश', other: 'अन्य' },
            bn: { wb: 'পশ্চিমবঙ্গ', mh: 'মহারাষ্ট্র', up: 'উত্তর প্রদেশ', other: 'অন্যান্য' }
        },
        ration: {
            en: { phh: 'PHH (Priority)', aay: 'AAY (Antyodaya)', none: 'None (General)' },
            hi: { phh: 'PHH (प्राथमिकता)', aay: 'AAY (अंत्योदय)', none: 'कोई नहीं (सामान्य)' },
            bn: { phh: 'PHH (অগ্রাধিকার)', aay: 'AAY (অন্ত্যোদয়)', none: 'নেই (সাধারণ)' }
        }
    },

    t: (key) => {
        const lang = (typeof app !== 'undefined' && app.currentLang) ? app.currentLang : 'en';
        return chatbot.labels[lang][key] || chatbot.labels['en'][key];
    },

    // Helper to get localized options
    getOpts: (category) => {
        const lang = (typeof app !== 'undefined' && app.currentLang) ? app.currentLang : 'en';
        const map = chatbot.opts[category][lang] || chatbot.opts[category]['en'];
        // Convert to array format expected by showOptions
        return Object.keys(map).map(k => ({ text: map[k], value: k }));
    },

    init: () => {
        if (!document.getElementById('chat-widget')) chatbot.buildUI();
        const msgContainer = document.getElementById('chat-messages');
        if (msgContainer && chatbot.state.intent === null) msgContainer.innerHTML = '';

        chatbot.addMessage(chatbot.t('welcome'), 'bot');
        chatbot.showOptions([
            { text: chatbot.t('opt_eligibility'), value: "eligibility" },
            { text: chatbot.t('opt_csc'), value: "csc" },
            { text: chatbot.t('opt_status'), value: "status" }
        ]);
    },

    buildUI: () => {
        const div = document.createElement('div');
        div.id = 'chat-widget';
        div.innerHTML = `
            <div id="chat-header" onclick="chatbot.toggle()">
                🤖 Sahayak Assistant <span id="chat-toggle-icon">▼</span>
            </div>
            <div id="chat-body">
                <div id="chat-messages"></div>
                <div id="chat-controls"></div>
            </div>
        `;
        document.body.appendChild(div);
    },

    toggle: () => {
        const body = document.getElementById('chat-body');
        body.classList.toggle('hidden');
        if (!body.classList.contains('hidden')) {
            if (document.getElementById('chat-messages').innerHTML === '') chatbot.init();
        }
    },

    addMessage: (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.innerText = text;
        if (sender === 'bot') {
            const btn = document.createElement('button');
            btn.className = 'chat-speak-btn';
            btn.innerHTML = '🔊';
            btn.onclick = () => app.speakScheme(text);
            msgDiv.appendChild(btn);
        }
        document.getElementById('chat-messages').appendChild(msgDiv);
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    },

    showOptions: (options) => {
        const controls = document.getElementById('chat-controls');
        controls.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-opt-btn';
            btn.innerText = opt.text;
            btn.onclick = () => chatbot.handleInput(opt.value, opt.text);
            controls.appendChild(btn);
        });
    },

    showInput: (type, placeholder, nextAction) => {
        const controls = document.getElementById('chat-controls');
        controls.innerHTML = `
            <input type="${type}" id="chat-input" placeholder="${placeholder}">
            <button class="chat-send-btn" onclick="chatbot.handleFreeInput('${nextAction}')">➤</button>
        `;
    },

    handleInput: (value, displayText) => {
        chatbot.addMessage(displayText, 'user');
        if (!chatbot.state.intent) {
            if (value === 'eligibility') chatbot.startEligibility();
            else if (value === 'csc') chatbot.startCSC();
            else if (value === 'status') chatbot.startStatus();
            else if (value === 'restart') chatbot.reset();
            else chatbot.reset();
        } else {
            if (chatbot.state.intent === 'eligibility') chatbot.nextEligibilityStep(value);
        }
    },

    startEligibility: () => {
        chatbot.state.intent = 'eligibility';
        chatbot.state.step = 1;
        chatbot.state.data = {};
        setTimeout(() => {
            chatbot.addMessage(chatbot.t('ask_state'), 'bot');
            chatbot.showOptions(chatbot.getOpts('state'));
        }, 200);
    },

    nextEligibilityStep: (val) => {
        const step = chatbot.state.step;
        if (step === 1) {
            chatbot.state.data.state = val;
            chatbot.state.step++;
            chatbot.addMessage(chatbot.t('ask_age'), 'bot');
            chatbot.showInput('number', 'e.g., 25', 'process_age');
        }
        else if (step === 2) {
            chatbot.state.data.age = parseInt(val);
            chatbot.state.step++;
            chatbot.addMessage(chatbot.t('ask_work'), 'bot');
            chatbot.showOptions(chatbot.getOpts('work'));
        }
        else if (step === 3) {
            chatbot.state.data.occupation = val;
            chatbot.state.step++;
            chatbot.addMessage(chatbot.t('ask_ration'), 'bot');
            chatbot.showOptions(chatbot.getOpts('ration'));
        }
        else if (step === 4) {
            chatbot.state.data.rationCard = val;
            chatbot.state.step++;
            chatbot.addMessage(chatbot.t('ask_income'), 'bot');
            chatbot.showInput('number', 'e.g., 50000', 'process_income');
        }
    },

    handleFreeInput: (action) => {
        const val = document.getElementById('chat-input').value;
        if (!val) return;
        chatbot.addMessage(val, 'user');
        if (action === 'process_age') {
            const age = parseInt(val);
            if (isNaN(age) || age < 0 || age > 120) {
                chatbot.addMessage(chatbot.t('error_age'), 'bot');
                return;
            }
            chatbot.nextEligibilityStep(age);
        }
        else if (action === 'process_income') {
            const income = parseInt(val);
            if (isNaN(income) || income < 0) {
                chatbot.addMessage(chatbot.t('error_income'), 'bot');
                return;
            }
            chatbot.state.data.income = income;
            chatbot.finishEligibility();
        }
    },

    finishEligibility: () => {
        chatbot.addMessage(chatbot.t('checking'), 'bot');
        if (typeof eligibilityRules !== 'undefined' && app.data) {
            const result = eligibilityRules.check(chatbot.state.data, app.data);
            if (result.eligible.length > 0) {
                chatbot.addMessage(chatbot.t('found_msg'), 'bot');
                result.eligible.forEach(s => {
                    const btn = document.createElement('button');
                    btn.className = 'chat-link-btn';
                    const lang = app.currentLang || 'en';
                    const title = s.title[lang] || s.title['en'];
                    btn.innerText = `${chatbot.t('view')} ${title}`;
                    btn.onclick = () => {
                        app.renderDetail(s);
                        chatbot.toggle();
                    };
                    document.getElementById('chat-messages').appendChild(btn);
                });
            } else {
                chatbot.addMessage(chatbot.t('no_scheme'), 'bot');
                chatbot.addMessage(chatbot.t('reasons'), 'bot');
                result.rejectionReasons.forEach(r => {
                    chatbot.addMessage(`- ${r.name}: ${r.reason}`, 'bot');
                });
            }
        }
        setTimeout(() => {
            chatbot.addMessage(chatbot.t('what_else'), 'bot');
            chatbot.state.intent = null;
            chatbot.showOptions([
                { text: chatbot.t('opt_csc'), value: "csc" },
                { text: chatbot.t('restart'), value: "restart" }
            ]);
        }, 500);
    },

    startCSC: () => {
        chatbot.addMessage("🗺️", 'bot');
        const btn = document.createElement('button');
        btn.className = 'chat-link-btn';
        btn.innerText = chatbot.t('open_map');
        btn.onclick = () => {
            app.showCSC();
            chatbot.toggle();
        };
        document.getElementById('chat-messages').appendChild(btn);
        chatbot.state.intent = null;
        chatbot.init();
    },

    startStatus: () => {
        const btn = document.createElement('button');
        btn.className = 'chat-link-btn';
        btn.innerText = chatbot.t('open_status');
        btn.onclick = () => {
            app.showView('status-view');
            chatbot.toggle();
        };
        document.getElementById('chat-messages').appendChild(btn);
        chatbot.state.intent = null;
        chatbot.init();
    },

    reset: () => {
        chatbot.state.intent = null;
        chatbot.init();
    }
};

window.addEventListener('load', () => setTimeout(chatbot.init, 100));
