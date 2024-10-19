
// Function to load and populate data with query string for fresh data
function loadData(dataUrl) {
    // Append a query string with a timestamp to ensure fresh data
    const freshUrl = dataUrl + '?t=' + new Date().getTime();
    
    $.getJSON(freshUrl, function(data) {
        // Populate the name section
        $('#name').text(data.name);

        // Populate the HP section
        let hpCapacity = data.hp.capacity;
        let hpCurrent = data.hp.current;
        let hpHtml = '';

        for (let i = 0; i < hpCapacity; i++) {
            if (i < hpCurrent) {
                hpHtml += '<span class="active"></span>';
            } else {
                hpHtml += '<span class="inactive"></span>';
            }
        }

        $('#hp').html(hpHtml);

        // Set the EKG animation class based on current HP
        let ekgPath = $('#ekgPath');
        let profileSquare = $('.profile-square');

        if (hpCurrent >= 3) {
            ekgPath.attr('class', 'ekg-high');
        } else if (hpCurrent === 2) {
            ekgPath.attr('class', 'ekg-medium');
        } else if (hpCurrent === 1) {
            ekgPath.attr('class', 'ekg-low');
        } else {
            ekgPath.attr('class', 'ekg-critical');
            profileSquare.css('background-color', '#330000'); // Dark reddish-gray background for critical HP
        }

        // General function to populate sections
        function populateSection(items, $section, totalCapacity = 24) {
            $section.empty();
            let filledSlots = 0;

            // Populate occupied slots
            items.forEach(function(item) {
                let $slot = createItemSlot(item);
                if (item.isCollection) {
                    handleCollection(item, $slot, $section);
                } else {
                    $section.append($slot);
                }
                filledSlots += item.size || 1; // Increment filled slots based on size or default to 1
            });

            // Fill remaining slots with empty ones to match totalCapacity
            for (let i = filledSlots; i < totalCapacity; i++) {
                let $emptySlot = $('<div class="item-slot"></div>');
                $emptySlot.css('opacity', '0.5');
                $section.append($emptySlot);
            }
        }

        // Function to create item slots
        function createItemSlot(item, isCollectionItem = false) {
            let itemName = item.name;
            // Check for icon and prepend it to the name if present
            if (item.icon) {
                itemName = `${item.icon} ${item.name}`;
            }
            let $slot = $('<div class="item-slot"></div>');
            $slot.html(`<span>${itemName}</span>`);
            if (isCollectionItem) {
                $slot.addClass('collection-item'); // Style collection items differently
            }
            if (item.size === 2) {
                $slot.addClass('medium');
            } else if (item.size === 4) {
                $slot.addClass('large');
            }
            $slot.addClass('occupied');
            if (item.lost) {
                $slot.css('opacity', '0.4');
            }
            // Show description on click
            $slot.on('click', function(event) {
                event.stopPropagation();
                let description = item.description || '';
                if (item.lost) {
                    description += "<br><br><em>This action, item, or memory cannot be used as it is missing 1 or more requirements.</em>";
                }
                $('#description-card').html(`
                    <p><strong>${itemName}</strong></p>
                    <p>${description}</p>
                `).show();
            });
            return $slot;
        }

        // Function to handle collection objects like Purse
        function handleCollection(item, $slot, $section) {
            let isOpen = false; // Track whether the collection is open or closed
            let collectionSlots = []; // Store the slots for the collection items

            // When clicked, toggle between Open and Close
            $slot.on('click', function(event) {
                event.stopPropagation();
                isOpen = !isOpen;
                $slot.html(`<span>${item.icon ? item.icon + ' ' : ''}${isOpen ? "Close" : "Open"} ${item.name}</span>`);

                // Toggle the collection items in the section
                if (isOpen) {
                    // Populate and add collection items immediately after the parent slot
                    item.collectionItems.forEach(function(subItem) {
                        let $subSlot = createItemSlot(subItem, true);
                        $slot.after($subSlot); // Insert each item after the parent slot
                        collectionSlots.push($subSlot); // Store reference to remove later
                    });
                } else {
                    // Remove collection items when closing
                    collectionSlots.forEach(function($subSlot) {
                        $subSlot.remove();
                    });
                    collectionSlots = []; // Clear the array
                }
            });

            $section.append($slot);
        }

        // Populate Inventory Section
        let inventoryItems = data.inventory.items;
        let $inventory = $('.inventory');
        populateSection(inventoryItems, $inventory);

        // Populate Tactics Section
        let tacticsItems = data.tactics.items;
        let $tactics = $('.tactics');
        populateSection(tacticsItems, $tactics);

        // Populate Discoverys Section
        let discoverysItems = data.discoverys.items;
        let $discoverys = $('.discoverys');
        populateSection(discoverysItems, $discoverys);

        // Navigation functionality
        function showSection(section) {
            $('.inventory, .profile-details, .tactics, .discoverys').hide(); // Hide all sections
            $('.nav-item').removeClass('active'); // Remove active state from all nav items

            if (section === 'inventory') {
                $('.inventory').show(); // Show inventory
                $('#nav-inventory').addClass('active');
            } else if (section === 'profile') {
                populateProfileSection(data.profile); // Populate and show profile
                $('.profile-details').show();
                $('#nav-profile').addClass('active');
            } else if (section === 'tactics') {
                $('.tactics').show();
                $('#nav-tactics').addClass('active');
            } else if (section === 'discoverys') {
                $('.discoverys').show();
                $('#nav-discoverys').addClass('active');
            }
        }

        // Populate profile section
        function populateProfileSection(profile) {
            let profileHtml = '<ul>';

            profile.forEach(function(detail) {
                if (detail.length === 0) {
                    profileHtml += '<hr>';
                } else {
                    profileHtml += `<li><strong>${detail[0]}:</strong> ${detail[1]}</li>`;
                }
            });

            profileHtml += '</ul>';
            $('.profile-details').html(profileHtml);
        }

        // Event listeners for nav items
        $('#nav-profile').on('click', function() {
            showSection('profile');
        });

        $('#nav-inventory').on('click', function() {
            showSection('inventory');
        });

        $('#nav-tactics').on('click', function() {
            showSection('tactics');
        });

        $('#nav-discoverys').on('click', function() {
            showSection('discoverys');
        });

        // Default view (Inventory)
        showSection('inventory');
    }).fail(function() {
        alert('Failed to load data from ' + dataUrl);
    });
}

// Click event to toggle between the two JSON files
$('#name').on('click', function() {
    if (currentDataUrl === eunUrl) {
        currentDataUrl = debugUrl;
    } else {
        currentDataUrl = eunUrl;
    }

    // Reload data based on the current URL
    loadData(currentDataUrl);
});

// Load the default data on page load
loadData(currentDataUrl);

// Hide description card when clicking outside
$(document).on('click', function() {
    $('#description-card').hide();
});

// Prevent clicks inside the description card from hiding it
$('#description-card').on('click', function(event) {
    event.stopPropagation();
});