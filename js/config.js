const eunUrl = 'https://raw.githubusercontent.com/Xalsier/blood_Inv/refs/heads/main/eun.json';
const debugUrl = 'https://raw.githubusercontent.com/Xalsier/blood_Inv/refs/heads/main/debug.json';
let currentDataUrl = eunUrl; // Default to Eun's data
const config = {
    totalCapacity: 24,
    hpThresholds: [
        { minHp: 3, ekgClass: 'ekg-high' },
        { minHp: 2, ekgClass: 'ekg-medium' },
        { minHp: 1, ekgClass: 'ekg-low' },
        { minHp: 0, ekgClass: 'ekg-critical' },
    ],
    opacities: {
        emptySlot: 0.5,
        lostItem: 0.4,
    },
    sectionNames: ['inventory', 'profile', 'tactics', 'discoverys'],
    selectors: {
        descriptionCard: '#description-card',
        name: '#name',
        hp: '#hp',
        ekgPath: '#ekgPath',
        profileSquare: '.profile-square',
        sections: {
            inventory: '.inventory',
            profile: '.profile-details',
            tactics: '.tactics',
            discoverys: '.discoverys',
        },
        navItems: {
            inventory: '#nav-inventory',
            profile: '#nav-profile',
            tactics: '#nav-tactics',
            discoverys: '#nav-discoverys',
        }
    },
    defaultSection: 'inventory',
};