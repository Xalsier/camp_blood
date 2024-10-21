var witnessesList = [];

function loadWitnessesList() {
    $.getJSON(config.witnessesUrl, function(data) {
        witnessesList = data;
        populateWitnessSelect();
        // Optionally, load the timeline for the first witness
        if (witnessesList.length > 0) {
            populateTimeline(0);
        }
    });
}

function populateWitnessSelect() {
    let $witnessSelect = $('#witness-select');
    $witnessSelect.empty();
    $.each(witnessesList, function(index, witness) {
        let $option = $('<option></option>').attr('value', index).text(witness.name);
        $witnessSelect.append($option);
    });
}

function populateTimeline(witnessIndex) {
    let witnessInfo = witnessesList[witnessIndex];
    let witnessName = witnessInfo.name;
    let witnessTxtFile = witnessInfo.txt;
    let witnessJsonFile = witnessInfo.json || witnessInfo.file; // Support both 'json' and 'file' keys

    let $timelineContent = $('#timeline-content');
    $timelineContent.empty();

    // Add header using the witness name
    let $header = $('<div class="timeline-header"></div>').text(`Dossier of ${witnessName}`);
    $timelineContent.append($header);

    if (witnessTxtFile) {
        // Load and parse the .txt file
        $.get(witnessTxtFile, function(txtData) {
            let timelineData = parseTxtTimeline(txtData);
            renderTimeline(timelineData, $timelineContent);
        }).fail(function() {
            alert('Failed to load witness text data from ' + witnessTxtFile);
        });
    } else if (witnessJsonFile) {
        // Load and parse the .json file
        $.getJSON(witnessJsonFile, function(witnessData) {
            let timelineData = witnessData; // Assuming the JSON is already the timeline array
            renderTimeline(timelineData, $timelineContent);
        }).fail(function() {
            alert('Failed to load witness JSON data from ' + witnessJsonFile);
        });
    } else {
        alert('No timeline data available for ' + witnessName);
    }
}

function parseTxtTimeline(txtData) {
    // Split the text into lines
    let lines = txtData.split('\n');

    let timelineData = [];
    let currentSection = null;
    let currentEvents = [];

    lines.forEach(function(line) {
        line = line.trim();

        // Check for section headers
        if (line && !line.startsWith('-')) {
            // New section
            if (currentSection) {
                // Save the previous section
                timelineData.push({
                    section: currentSection,
                    events: currentEvents
                });
            }
            currentSection = line.replace(/:$/, ''); // Remove trailing colon
            currentEvents = [];
        } else if (line.startsWith('-')) {
            // Event line
            let event = parseTxtEvent(line);
            if (event) {
                currentEvents.push(event);
            }
        }
    });

    // Add the last section
    if (currentSection && currentEvents.length > 0) {
        timelineData.push({
            section: currentSection,
            events: currentEvents
        });
    }

    return timelineData;
}

function parseTxtEvent(line) {
    // Remove the leading '- ' and trim
    line = line.substring(1).trim();

    // Extract the year, description, class, and awareness
    // Example line: '1971: Mike's sister Eun-byul was born. (Event) (no)'

    // Regex to match the event components
    let eventRegex = /^(\d{4}):\s*(.*?)\s*(?:\((.*?)\))?\s*(?:\((.*?)\))?$/;
    let match = line.match(eventRegex);

    if (match) {
        let year = match[1];
        let description = match[2];
        let className = match[3] || 'Event'; // Default to 'Event' if not specified
        let aware = true;
        if (match[4] && match[4].toLowerCase() === 'no') {
            aware = false;
        }

        return {
            year: year,
            class: className,
            description: description,
            aware: aware
        };
    } else {
        console.warn('Failed to parse event line:', line);
        return null;
    }
}

function renderTimeline(timelineData, $timelineContent) {
    // Reverse the timeline data to display most recent first
    let reversedTimelineData = timelineData.slice().reverse();

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

function initializeTimelineHandlers() {
    $('#witness-select').on('change', function() {
        let witnessIndex = $(this).val();
        populateTimeline(witnessIndex);
    });

    // Handle code/graph buttons
    $('#timeline-code-btn').on('click', function() {
        // Code mode is already active
    });

    $('#timeline-graph-btn').on('click', function() {
        // Graph mode is disabled
    });
}
