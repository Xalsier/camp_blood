function populateWitnessSelect(timelineData) {
    let $witnessSelect = $('#witness-select');
    $witnessSelect.empty();
    $.each(timelineData.witnesses, function(index, witness) {
        let $option = $('<option></option>').attr('value', index).text(witness.name);
        $witnessSelect.append($option);
    });
}

function populateTimeline(witnessIndex, timelineData) {
    let witness = timelineData.witnesses[witnessIndex];
    let $timelineContent = $('#timeline-content');
    $timelineContent.empty();

    // Add header
    let $header = $('<div class="timeline-header"></div>').text(`Memories of ${witness.name}`);
    $timelineContent.append($header);

    // Iterate through sections
    let reversedTimelineData = witness.timeline.slice().reverse();
    $.each(reversedTimelineData, function(_, sectionData) {
        let $sectionHeader = $('<div class="timeline-section"></div>').text(sectionData.section);
        $timelineContent.append($sectionHeader);
        let $divider = $('<hr class="timeline-divider">');
        $timelineContent.append($divider);
        let reversedEvents = sectionData.events.slice().reverse();
        $.each(reversedEvents, function(_, entry) {
            let year = entry.year;
            let className = entry.class;
            let description = entry.description;
            let aware = entry.aware !== undefined ? entry.aware : true;

            let $entry = $('<div class="timeline-entry"></div>');
            let $circle = $('<div class="timeline-circle"></div>').addClass(className);
            let $year = $('<div class="timeline-year"></div>').text(`${year}`);
            let $description = $('<div class="timeline-description"></div>').text(description);
            $entry.append($year).append($circle).append($description);

            if (!aware) {
                $circle.css('opacity', '0.5');
                $year.css('opacity', '0.5');
                $description.css('opacity', '0.5');
            }

            $timelineContent.append($entry);
        });
    });
}

// Event handler for witness select change
function initializeTimelineHandlers() {
    $('#witness-select').on('change', function() {
        let witnessIndex = $(this).val();
        populateTimeline(witnessIndex, timelineData);
    });

    // Handle code/graph buttons
    $('#timeline-code-btn').on('click', function() {
        // Code mode is already active
    });

    $('#timeline-graph-btn').on('click', function() {
        // Graph mode is disabled
    });
}