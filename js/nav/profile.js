function populateProfileSection(profile) {
    let profileHtml = '<ul>';
    $.each(profile, function(_, detail) {
        profileHtml += detail.length === 0 ? '<hr>' : `<li><strong>${detail[0]}:</strong> ${detail[1]}</li>`;
    });
    profileHtml += '</ul>';
    $(config.selectors.sections.profile).html(profileHtml);
}