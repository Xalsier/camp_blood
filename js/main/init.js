function loadData(dataUrl) {
    $.getJSON(dataUrl, function(data) {
        updateName(data.name);
        updateHpDisplay(data.hp);
        populateSections(data);
        initializeNavHandlers(data);
        showSection(config.defaultSection);
        // Remove initializeTimeline(data);
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
    loadWitnessesList();            // Moved here
    initializeTimelineHandlers();   // Moved here
});
