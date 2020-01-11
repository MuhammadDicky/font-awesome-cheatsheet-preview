export default (obj) => {

    const { $ } = obj;
    
    //Modal Event
    const modalShowAnimated = 'zoomIn';
    const modalHideAnimated = 'zoomOutDown';
    const animatedMainClass = 'animated';
    const currentIconPreviewClass = 'current-icon-preview';
    const $modalIconPreview = $('#modal-preview-icon');
    const $iconPreviewRange = $('#icon-preview-range');
    const defaultIconPreviewSize = '120';
    const $iconPreviewColor = $('#icon-preview-color');
    const iconDefaultColor = '#5e6974';
    const setModalAnimation = function($modal, show = true) {
        const fadeAnimationClass = 'fade';
        const animatedClass = show ? modalShowAnimated : modalHideAnimated;
        const removeAnimatedClass = show ? modalHideAnimated : modalShowAnimated;
        const $modalDialog = $modal.find('.modal-dialog').removeClass(`${removeAnimatedClass} ${animatedMainClass}`);

        if (show) {
            $modal.removeClass(fadeAnimationClass);
        } else {
            $modal.addClass(fadeAnimationClass);
        }

        // Add new animated class
        $modalDialog.addClass(`${animatedClass} ${animatedMainClass}`);
    };
    const setModalTitle = function($modal, title) {
        const $modalTitle = $modal.find('.modal-header > .modal-title');
        
        // Set modal title
        $modalTitle.html(title);

        return $modalTitle;
    };
    const setPreviewIcon = function($modal, iconClass = 'fab fa-font-awesome') {
        const $modalIcPreview = $modal.find('.modal-body .icon-preview');

        const $icon = $('<i></i>', {
            class: `${iconClass} ${currentIconPreviewClass}`,
            css: {
                fontSize: `${defaultIconPreviewSize}px`
            }
        });

        $modalIcPreview.html($icon);

        return $modalIcPreview;
    };
    
    $('.modal').on('show.bs.modal', function(eve) {
        const $modal = $(this);

        // Set modal show animation style
        setModalAnimation($modal);
    });

    $('.modal').on('hide.bs.modal', function(eve) {
        const $modal = $(this);

        // Set modal hide animation style
        setModalAnimation($modal, false);
    });

    $modalIconPreview.on({
        'show.bs.modal': function(eve) {
            const $modal = $(this);
            const { label:iconName, fullClass:iconClass, unicode } = $modal.data();
            const modalTitle = `Preview icon: <i class="${iconClass}"></i> ${iconName}`;

            // Set modal title
            setModalTitle($modal, modalTitle);

            // Set preview icon
            const $iconPreview = setPreviewIcon($modal, iconClass);

            // Set icon range size to default
            $iconPreviewRange.val(defaultIconPreviewSize);

            // Set icon to default color
            $iconPreviewColor.val(iconDefaultColor).trigger('change');
        },
        'hidden.bs.modal': function(eve) {
            const $modal = $(this);

            // Set modal title
            setModalTitle($modal, 'Icon Preview');
        }
    });

    $iconPreviewRange.on('change', function(eve) {
        const $thisRangeInput = $(this);
        const iconSize = $thisRangeInput.val();

        $modalIconPreview.find(`.${currentIconPreviewClass}`).css('font-size', `${iconSize}px`);
    });

    $iconPreviewColor.on('change', function(eve) {
        const iconColor = $(this).val();

        $modalIconPreview.find(`.${currentIconPreviewClass}`).css('color', iconColor);
    });
    //END -- Modal Event

};