let timelineData;
function loadData(dataUrl) {
    $.getJSON(dataUrl, function(data) {
        updateName(data.name);
        updateHpDisplay(data.hp);
        populateSections(data);
        initializeNavHandlers(data);
        showSection(config.defaultSection);
        initializeTimeline(data);
        initializeTimelineHandlers();
    }).fail(function() {
        alert('Failed to load data from ' + dataUrl);
    });
}
$(config.selectors.name).on('click', function() {
    currentDataUrl = currentDataUrl === eunUrl ? debugUrl : eunUrl;
    loadData(currentDataUrl);
});
$(document).ready(function() {
    initializeDescriptionCardHandlers();
    loadData(currentDataUrl);
});
function initializeTimeline(data) {
    // Initialize the witness select and timeline with the loaded data
    timelineData = data.timeline; // Use the global variable declared in init.js
    populateWitnessSelect(timelineData);
    populateTimeline(0, timelineData); // Default to first witness
}