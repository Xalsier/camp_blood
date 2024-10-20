function populateTimelineSection(timelineData) {
    let $timeline = $(config.selectors.sections.timeline);
    $timeline.empty(); // Clear existing content
    let reversedTimelineData = timelineData.slice().reverse();
    $.each(reversedTimelineData, function(_, sectionData) {
        let $sectionHeader = $('<div class="timeline-section"></div>').text(sectionData.section);
        $timeline.append($sectionHeader);
        let $divider = $('<hr class="timeline-divider">');
        $timeline.append($divider);
        let reversedEvents = sectionData.events.slice().reverse();
        $.each(reversedEvents, function(_, entry) {
            let year = entry.year;
            let className = entry.class;
            let description = entry.description;
            let $entry = $('<div class="timeline-entry"></div>');
            let $circle = $('<div class="timeline-circle"></div>').addClass(className);
            let $year = $('<div class="timeline-year"></div>').text(`${year}`);
            let $description = $('<div class="timeline-description"></div>').text(description);
            $entry.append($year).append($circle).append($description);
            $timeline.append($entry);
        });
    });
}