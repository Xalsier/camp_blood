const eunUrl = 'lib/eun.json';
const debugUrl = 'lib/debug.json';
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
    sectionNames: ['inventory', 'profile', 'tactics', 'discoverys', 'timeline'],    selectors: {
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
            timeline: '.timeline',
            geometry: '.geometry'
        },
        navItems: {
            inventory: '#nav-inventory',
            profile: '#nav-profile',
            tactics: '#nav-tactics',
            discoverys: '#nav-discoverys',
            timeline: '#nav-timeline',
            geometry: '#nav-map'
        }
    },
    defaultSection: 'inventory',
    witnessesUrl: 'lib/directory.json', // Add this line
};