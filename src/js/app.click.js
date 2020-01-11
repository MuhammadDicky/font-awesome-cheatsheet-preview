
export default (obj) => {

    const { $, appHelpers } = obj;
    const {
        iconListSelector,
        showCheatSheetSelector,
        copyToClipboardClass,
        previewIconClass,
        showMoreIconsSelector
    } = appHelpers.getData([
        'iconListSelector',
        'showCheatSheetSelector',
        'copyToClipboardClass',
        'previewIconClass',
        'showMoreIconsSelector'
    ]);
    
    $(document).on('click', `#${showMoreIconsSelector}`, function(eve) {
        eve.preventDefault();

        const $thisBtn = $(this);
        const { start } = $thisBtn.data();

        // Show icons
        appHelpers.showIcons(null, start);

        // Remove button
        $thisBtn.parent().remove();
    });

    $(document).on('click', `.${previewIconClass}`, function(eve) {
        eve.preventDefault();
        
        const $thisIconBtn = $(this);

        $('#modal-preview-icon').data($thisIconBtn.data()).modal('show');
    });

    $(showCheatSheetSelector).on('click', function(eve) {
        const $thisBtn = $(this);
        $thisBtn.toggleClass('active');

        // Show or hide cheatsheet
        $(`span.${copyToClipboardClass}`).not('.text').toggle($thisBtn.hasClass('active'));
    });

    $(iconListSelector).on('click', `span.${copyToClipboardClass}`, function(eve) {
        const $thisBtn = $(this);
        const { copy:copyStr, tooltipTitle, ['bs.tooltip']:tooltipConfigOr } = $thisBtn.data();
        const tooltipConfig = { ...tooltipConfigOr };

        // Return false if cheatsheet code not found
        if (!copyStr || copyStr === '') return false;

        // Create temporary input element
        const $temp = $('<input>');

        // Append to dom
        $('body').append($temp);

        // Set value to copy
        $temp.val(copyStr).select();

        // Copy selected text and remove temporary input element
        document.execCommand('copy');
        $temp.remove();

        const hideEventName = 'hidden.bs.tooltip';
        $thisBtn.off(hideEventName).on(hideEventName, function() {
            // Show copy status
            $thisBtn.off(hideEventName)
                .attr('title', 'Copied to clipboard!')
                .tooltip('dispose')
                .tooltip('show');
            
            // Hide copy status tooltip and turn back to original tooltip title
            setTimeout(() => {
                $thisBtn.attr('title', tooltipTitle)
                    .tooltip('hide')
                    .on(hideEventName, () => { $thisBtn.tooltip('dispose').tooltip(tooltipConfig.config) });
            }, 500);
        });

        // Hide tooltip
        $thisBtn.tooltip('hide');
    });

};