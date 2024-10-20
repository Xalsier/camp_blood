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
        $('#description-title').html(`<strong>${itemName}</strong>`);
        $('#description-content').html(`
            ${requirementsHtml}
            <p>${description}</p>
            ${progressBarHtml}
        `);
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

function initializeDescriptionCardHandlers() {
    $('#description-close').on('click', function(event) {
        event.stopPropagation();
        $(config.selectors.descriptionCard).hide();
    });
    $(document).on('click', function() {
        $(config.selectors.descriptionCard).hide();
    });
    $(config.selectors.descriptionCard).on('click', function(event) {
        event.stopPropagation();
    });
}