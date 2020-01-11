// App module
import { $, appHelpers } from './components';
import appModal from './app.modal';
import appClick from './app.click';

// Library
import Fuse from 'fuse.js';

// Icon and category list
import fontAwesomeMetaData from 'json-loader!@fortawesome/fontawesome-free/metadata/icons.yml';
import fontAwesomeCategories from 'json-loader!@fortawesome/fontawesome-free/metadata/categories.yml';

const fontAwesome = [];
const fontAwesomeAll = {
    solid: {
        icons: [],
        mainClass: 'fas'
    },
    regular: {
        icons: [],
        mainClass: 'far'
    },
    brands: {
        icons: [],
        mainClass: 'fab'
    }
};
const setIconType = function(obj) {
    const { styles, name } = obj;

    styles.forEach(iconType => {
        if (fontAwesomeAll.hasOwnProperty(iconType)) {
            const iconMainClass = fontAwesomeAll[iconType].mainClass;
            const fullClass = `${iconMainClass} fa-${name}`;

            // Put icon data to separate icon type
            fontAwesomeAll[iconType].icons.push({
                ...obj,
                mainClass: iconMainClass,
                fullClass
            });

            obj.fullClass = obj.hasOwnProperty('fullClass') ? [...obj.fullClass, fullClass] : [fullClass];
        }
    });

    return obj;
}

$.each(fontAwesomeMetaData, function(iconName, iconData) {
    Object.assign(iconData, {
        name: iconName
    });

    // Set icon type and put on separate icon type
    setIconType(iconData);
    
    fontAwesome.push(iconData);
});

let currentSelectedIcons, currentShowedIcons;
const iconListSelector = '#icons-list';
const iconTypeClass = '.icon-type';
const showMoreIconsSelector = 'show-more-icons';
const copyToClipboardClass = 'copy-to-clipboard';
const previewIconClass = 'preview-icon';
const showCheatSheetSelector = '#show-cheatsheet';

appHelpers.saveData({
    currentSelectedIcons,
    currentShowedIcons,
    iconListSelector,
    iconTypeClass,
    showMoreIconsSelector,
    copyToClipboardClass,
    previewIconClass,
    showCheatSheetSelector,
    fontAwesome,
    fontAwesomeAll,
    fontAwesomeCategories
});

const allIcons = currentSelectedIcons = appHelpers.sortIcon({
    icons: [
        ...fontAwesomeAll.solid.icons,
        ...fontAwesomeAll.regular.icons,
        ...fontAwesomeAll.brands.icons
    ]
});
const totalAllIcons = appHelpers.numberWithDot(allIcons.length);

$(function() {
    // Init Module
    const requiredVars = { $, appHelpers };
    appModal(requiredVars);
    appClick(requiredVars);
    
    // Init back to top button
    appHelpers.backToTop({
        iconName : 'fas fa-angle-up',
        fxName : 'right-to-left'
    });

    const $allIconCheck = $('#all-icon');
    const $searchBox = $('#search-icon-box');

    // Show all icons and total icons
    appHelpers.showIcons(allIcons);
    $('#total-icons').html(`Total Icons: ${totalAllIcons}`);
    $searchBox.attr('placeholder', `Search from ${totalAllIcons} icons for...`);

    $(iconTypeClass).on('change', function(eve) {
        const $thisCheck = $(this);
        const $allIconTypeCheck = $(iconTypeClass);
        const selectedIcons = [];
        let statusTypeFilter = false;

        $.each($allIconTypeCheck, function(indexEl, el) {
            const $iconTypeCheck = $(el);
            const iconType = $iconTypeCheck.data('type');

            if ($iconTypeCheck.prop('checked') && fontAwesomeAll.hasOwnProperty(iconType)) {
                statusTypeFilter = true;
                selectedIcons.push(...fontAwesomeAll[iconType].icons);
            }
        });
        
        if (statusTypeFilter) {
            // Set currenct selected icons
            currentSelectedIcons = selectedIcons;
            appHelpers.saveData('currentSelectedIcons', selectedIcons);

            // Show icons
            appHelpers.showIcons(selectedIcons);

            // Clear Search box
            $searchBox.val(null);
        }
        
        $allIconCheck.prop('checked', !statusTypeFilter).trigger('change');
    });

    $allIconCheck.on('change', function(eve) {
        const $thisCheck = $(this);

        // Unchecked all icon type check if all icon check is checked
        if ($thisCheck.prop('checked')) {
            $(iconTypeClass).prop('checked', false);

            currentSelectedIcons = allIcons;
            appHelpers.saveData('currentSelectedIcons', allIcons);
            appHelpers.showIcons(allIcons);
        }

        // Clear Search box
        $searchBox.val(null);
    });

    $searchBox.on('keyup', function(eve) {
        const $thisSearchBox = $(this);
        const searchKey = $thisSearchBox.val();

        const fuse = new Fuse(currentSelectedIcons, {
            shouldSort: true,
            threshold: 0.2,
            keys: [
                'name'
            ]
        });
        const filteredIcons = searchKey !== '' ? fuse.search(searchKey) : currentSelectedIcons;

        appHelpers.showIcons(filteredIcons);
    });

    // Basic instantiation:
    $('#demo-input-color').colorpicker();

    $('[data-toggle="tooltip"]').tooltip();
    
});