const eligibilityRules = {
    /**
     * Checks if the user input is valid before running eligibility.
     * @param {Object} user - User profile object
     * @returns {Object} { isValid: boolean, error: string|null }
     */
    validateInput: (user) => {
        if (typeof user.age !== 'number' || isNaN(user.age) || user.age < 0 || user.age > 120) {
            return { isValid: false, error: "Please enter a valid age (0-120)." };
        }
        if (typeof user.income !== 'number' || isNaN(user.income) || user.income < 0) {
            return { isValid: false, error: "Annual income cannot be negative." };
        }
        const validOccupations = ['farmer', 'labour', 'student', 'senior', 'other'];
        if (!validOccupations.includes(user.occupation)) {
            return { isValid: false, error: "Please select a valid occupation." };
        }
        return { isValid: true, error: null };
    },

    /**
     * Checks user profile against available schemes.
     * @param {Object} user - { state, age, occupation, rationCard, income }
     * @param {Array} schemes - List of scheme objects from DB
     * @returns {Object} { eligible: [], rejectionReasons: [] }
     */
    check: (user, schemes) => {
        const eligible = [];
        const rejectionReasons = [];

        // Define strict rules for each scheme ID
        // Note: Logic must match REAL requirements
        const rules = {
            'pmay_g': {
                name: "PM Awas Yojana (Rural)",
                check: (u) => u.income < 250000 && u.rationCard !== 'none' && u.age >= 18,
                reason: "Requires Age 18+, annual income < 2.5L, and a valid Ration Card."
            },
            'nfsa_ration': {
                name: "Free Ration (NFSA)",
                check: (u) => ['phh', 'aay'].includes(u.rationCard),
                reason: "Requires Priority Household (PHH) or Antyodaya (AAY) Ration Card."
            },
            'state_food_scheme': {
                name: "Annapurna Food Packet",
                check: (u) => ['phh', 'aay'].includes(u.rationCard),
                reason: "Requires valid Ration Card (linked to NFSA)."
            },
            'pm_kisan': {
                name: "PM Kisan Samman Nidhi",
                check: (u) => u.occupation === 'farmer' && u.age >= 18,
                reason: "Only for landholding farmers above 18 years."
            },
            'state_pension': {
                name: "Old Age Pension",
                check: (u) => u.age >= 60 && u.income < 48000,
                reason: "Requires Age 60+ and annual income below ₹48,000."
            },
            'ayushman_bharat': {
                name: "Ayushman Bharat",
                check: (u) => ['phh', 'aay'].includes(u.rationCard) || u.income < 250000,
                reason: "Requires Ration Card or low annual income (< 2.5L)."
            },
            'rte_education': {
                name: "PM SHRI / RTE Education",
                check: (u) => u.age >= 5 && u.age <= 14,
                reason: "For children aged 5-14 years."
            },
            'state_education': {
                name: "Savitribai Phule Scholarship",
                check: (u) => (u.occupation === 'student' && u.age < 21),
                reason: "For students under 21 years."
            },
            'svmcm_education': {
                name: "SVMCM Scholarship",
                check: (u) => u.occupation === 'student' && u.income < 250000,
                reason: "For students with family income < 2.5L."
            },
            'student_credit_card': {
                name: "Student Credit Card",
                check: (u) => u.occupation === 'student' && u.age <= 40,
                reason: "For students up to 40 years of age."
            },
            'state_housing': {
                name: "Bangla Awas Yojana (BAY)",
                check: (u) => u.income < 100000 && u.age >= 18,
                reason: "Requires Age 18+ and very low income (< 1L)."
            },
            'state_health': {
                name: "CM Relief Fund",
                check: (u) => u.income < 150000,
                reason: "Financial aid for families with income < 1.5L."
            }
        };

        schemes.forEach(scheme => {
            const rule = rules[scheme.id];

            if (rule) {
                if (rule.check(user)) {
                    eligible.push(scheme);
                } else {
                    rejectionReasons.push({ name: rule.name, reason: rule.reason });
                }
            } else {
                // If we don't have a specific rule for a scheme in the JSON,
                // we DO NOT assume eligibility. We skip it to be safe (Whitelist approach).
                // Or we can add a flag "Requires Verification" if desired.
                // For this strict logic task, we omit it.
            }
        });

        return { eligible, rejectionReasons };
    }
};
