function populateSections(data) {
    populateSection(data.inventory.items, $(config.selectors.sections.inventory));
    populateSection(data.tactics.items, $(config.selectors.sections.tactics));
    populateSection(data.discoverys.items, $(config.selectors.sections.discoverys));
}
function initializeNavHandlers(data) {
    $.each(config.selectors.navItems, function(section) {
        $(config.selectors.navItems[section]).on('click', function() {
            if (section === 'profile') {
                populateProfileSection(data.profile);
            } else if (section === 'timeline') {
                populateTimelineSection(data.timeline);
            } else if (section === 'geometry') {
                populateGeometrySection(); // Initialize geometry section
            }
            showSection(section);
        });
    });
}
function showSection(section) {
    $.each(config.selectors.sections, function(_, selector) {
        $(selector).hide();
    });
    $.each(config.selectors.navItems, function(_, selector) {
        $(selector).removeClass('active');
    });
    $(config.selectors.sections[section]).show();
    $(config.selectors.navItems[section]).addClass('active');
}