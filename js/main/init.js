function loadData(dataUrl) {
    $.getJSON(dataUrl, function(data) {
        updateName(data.name);
        updateHpDisplay(data.hp);
        populateSections(data);
        initializeNavHandlers(data);
        showSection(config.defaultSection);
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