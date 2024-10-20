function loadData(dataUrl) {
    const freshUrl = dataUrl + '?t=' + new Date().getTime();
    $.getJSON(freshUrl, function(data) {
        $(config.selectors.name).text(data.name);
        let hpCapacity = data.hp.capacity;
        let hpCurrent = data.hp.current;
        let hpHtml = '';
        $.each(new Array(hpCapacity), function(i) {
            hpHtml += (i < hpCurrent) ? '<span class="active"></span>' : '<span class="inactive"></span>';
        });
        $(config.selectors.hp).html(hpHtml);

        let ekgPath = $(config.selectors.ekgPath);
        $.each(config.hpThresholds, function(_, threshold) {
            if (hpCurrent >= threshold.minHp) {
                ekgPath.attr('class', threshold.ekgClass);
                return false; // Break loop equivalent
            }
        });

        function populateSection(items, $section, totalCapacity = config.totalCapacity) {
            $section.empty();
            let filledSlots = 0;
            $.each(items, function(_, item) {
                let $slot = createItemSlot(item);
                if (item.isCollection) {
                    handleCollection(item, $slot, $section);
                } else {
                    $section.append($slot);
                }
                filledSlots += item.size || 1;
            });
            for (let i = filledSlots; i < totalCapacity; i++) {
                let $emptySlot = $('<div class="item-slot"></div>');
                $emptySlot.css('opacity', config.opacities.emptySlot);
                $section.append($emptySlot);
            }
        }

        function createItemSlot(item, isCollectionItem = false) {
            let itemName = item.icon ? `${item.icon} ${item.name}` : item.name;
            let $slot = $('<div class="item-slot"></div>').html(`<span>${itemName}</span>`).addClass('occupied');
            $slot.addClass(isCollectionItem ? 'collection-item' : '')
                 .addClass(item.size === 2 ? 'medium' : item.size === 4 ? 'large' : '')
                 .css('opacity', item.lost ? config.opacities.lostItem : '');       

            $slot.on('click', function(event) {
                event.stopPropagation();

                // Update description card content
                let description = item.description || '';
                let progressBarHtml = '';
                if (item.progress !== undefined) {
                    progressBarHtml = `
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                            </div>
                        </div>
                    `;
                }
                let requirementsHtml = '';
                if (item.req !== undefined && $.isArray(item.req)) {
                    requirementsHtml = '<div class="requirements">';
                    $.each(item.req, function(_, requirement) {
                        let [reqName, reqMet] = requirement;
                        requirementsHtml += `
                            <div class="requirement">
                                <span class="requirement-circle ${reqMet ? 'active' : 'inactive'}"></span>
                                <span class="requirement-name">${reqName}</span>
                            </div>
                        `;
                    });
                    requirementsHtml += '</div>';
                }

                // Set the title and content
                $('#description-title').html(`<strong>${itemName}</strong>`);
                $('#description-content').html(`
                    ${requirementsHtml}
                    <p>${description}</p>
                    ${progressBarHtml}
                `);

                // Show the description card
                $(config.selectors.descriptionCard).show();
            });
            return $slot;
        }

        function handleCollection(item, $slot, $section) {
            let isOpen = false;
            let collectionSlots = [];
            
            $slot.on('click', function(event) {
                event.stopPropagation();
                isOpen = !isOpen;
                $slot.html(`<span>${item.icon ? item.icon + ' ' : ''} ${item.name}</span>`);
                if (isOpen) {
                    $.each(item.collectionItems, function(_, subItem) {
                        let $subSlot = createItemSlot(subItem, true);
                        $slot.after($subSlot);
                        collectionSlots.push($subSlot);
                    });
                } else {
                    $.each(collectionSlots, function(_, $subSlot) {
                        $subSlot.remove();
                    });
                    collectionSlots = [];
                }
            });
            $section.append($slot);
        }

        let $inventory = $(config.selectors.sections.inventory);
        let $tactics = $(config.selectors.sections.tactics);
        let $discoverys = $(config.selectors.sections.discoverys);
        populateSection(data.inventory.items, $inventory);
        populateSection(data.tactics.items, $tactics);
        populateSection(data.discoverys.items, $discoverys);

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

        function populateProfileSection(profile) {
            let profileHtml = '<ul>';
            $.each(profile, function(_, detail) {
                profileHtml += detail.length === 0 ? '<hr>' : `<li><strong>${detail[0]}:</strong> ${detail[1]}</li>`;
            });
            profileHtml += '</ul>';
            $(config.selectors.sections.profile).html(profileHtml);
        }

        $.each(config.selectors.navItems, function(section) {
            $(config.selectors.navItems[section]).on('click', function() {
                if (section === 'profile') {
                    populateProfileSection(data.profile);
                }
                showSection(section);
            });
        });
        showSection(config.defaultSection);

        // Close button handler
        $('#description-close').on('click', function(event) {
            event.stopPropagation();
            $(config.selectors.descriptionCard).hide();
        });

    }).fail(function() {
        alert('Failed to load data from ' + dataUrl);
    });
}

$(config.selectors.name).on('click', function() {
    currentDataUrl = currentDataUrl === eunUrl ? debugUrl : eunUrl;
    loadData(currentDataUrl);
});
loadData(currentDataUrl);

// Prevent the description card from hiding when clicked
$(document).on('click', function() {
    $(config.selectors.descriptionCard).hide();
});

$(config.selectors.descriptionCard).on('click', function(event) {
    event.stopPropagation();
});
