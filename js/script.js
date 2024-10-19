function loadData(dataUrl) {
    const freshUrl = dataUrl + '?t=' + new Date().getTime();
    $.getJSON(freshUrl, function(data) {
        $(config.selectors.name).text(data.name);
        let hpCapacity = data.hp.capacity;
        let hpCurrent = data.hp.current;
        let hpHtml = '';
        for (let i = 0; i < hpCapacity; i++) {
            hpHtml += (i < hpCurrent) ? '<span class="active"></span>' : '<span class="inactive"></span>';
        }
        $(config.selectors.hp).html(hpHtml);
        let ekgPath = $(config.selectors.ekgPath);
        for (let threshold of config.hpThresholds) {
            if (hpCurrent >= threshold.minHp) {
                ekgPath.attr('class', threshold.ekgClass);
                break;
            }
        }
        function populateSection(items, $section, totalCapacity = config.totalCapacity) {
            $section.empty();
            let filledSlots = 0;
            items.forEach(function(item) {
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
            if (isCollectionItem) $slot.addClass('collection-item');
            if (item.size === 2) $slot.addClass('medium');
            if (item.size === 4) $slot.addClass('large');
            if (item.lost) $slot.css('opacity', config.opacities.lostItem);
            $slot.on('click', function(event) {
                event.stopPropagation();
                let description = item.description || '';
                if (item.lost) {
                    description += "<br><br><em>This action, item, or thought cannot be used as it is missing 1 or more requirements.</em>";
                }
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
                if (item.req !== undefined && Array.isArray(item.req)) {
                    requirementsHtml = '<div class="requirements">';
                    item.req.forEach(function(requirement) {
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
                $(config.selectors.descriptionCard).html(`
                    <p><strong>${itemName}</strong></p>
                    ${progressBarHtml}
                    ${requirementsHtml}
                    <p>${description}</p>
                `).show();
            });
            return $slot;
        }
        function handleCollection(item, $slot, $section) {
            let isOpen = false;
            let collectionSlots = [];
            $slot.on('click', function(event) {
                event.stopPropagation();
                isOpen = !isOpen;
                $slot.html(`<span>${item.icon ? item.icon + ' ' : ''}${isOpen ? "Close" : "Open"} ${item.name}</span>`);
                if (isOpen) {
                    item.collectionItems.forEach(function(subItem) {
                        let $subSlot = createItemSlot(subItem, true);
                        $slot.after($subSlot);
                        collectionSlots.push($subSlot);
                    });
                } else {
                    collectionSlots.forEach($subSlot => $subSlot.remove());
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
            Object.values(config.selectors.sections).forEach(selector => $(selector).hide());
            Object.values(config.selectors.navItems).forEach(selector => $(selector).removeClass('active'));
            $(config.selectors.sections[section]).show();
            $(config.selectors.navItems[section]).addClass('active');
        }
        function populateProfileSection(profile) {
            let profileHtml = '<ul>';
            profile.forEach(function(detail) {
                profileHtml += detail.length === 0 ? '<hr>' : `<li><strong>${detail[0]}:</strong> ${detail[1]}</li>`;
            });
            profileHtml += '</ul>';
            $(config.selectors.sections.profile).html(profileHtml);
        }
        Object.keys(config.selectors.navItems).forEach(section => {
            $(config.selectors.navItems[section]).on('click', function() {
                if (section === 'profile') {
                    populateProfileSection(data.profile);
                }
                showSection(section);
            });
        });
        showSection(config.defaultSection);
    }).fail(function() {
        alert('Failed to load data from ' + dataUrl);
    });
}
$(config.selectors.name).on('click', function() {
    currentDataUrl = currentDataUrl === eunUrl ? debugUrl : eunUrl;
    loadData(currentDataUrl);
});
loadData(currentDataUrl);
$(document).on('click', function() {
    $(config.selectors.descriptionCard).hide();
});
$(config.selectors.descriptionCard).on('click', function(event) {
    event.stopPropagation();
});