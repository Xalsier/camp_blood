function updateName(name) {
    $(config.selectors.name).text(name);
}
function updateHpDisplay(hpData) {
    const { capacity, current } = hpData;
    let hpHtml = '';
    for (let i = 0; i < capacity; i++) {
        hpHtml += (i < current) ? '<span class="active"></span>' : '<span class="inactive"></span>';
    }
    $(config.selectors.hp).html(hpHtml);

    const ekgPath = $(config.selectors.ekgPath);
    for (const threshold of config.hpThresholds) {
        if (current >= threshold.minHp) {
            ekgPath.attr('class', threshold.ekgClass);
            break;
        }
    }
}