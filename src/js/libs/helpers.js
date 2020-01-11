(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        (global = global || self, factory(global.jQuery));
    }
} (this, function ($) {
    'use strict';

    const savedData = {};

    const objFunctions = {
        saveData(dataName, value) {
            if (typeof dataName === 'string' && dataName !== '') {
                Object.assign(savedData, {
                    [dataName]: value
                });
            } else if (typeof dataName === 'object' && !value) {
                Object.assign(savedData, dataName);
            } else if (!PRODUCTION) {
                console.warn('Helpers -> saveData: First parameter must string or object.');
            }

            return savedData;
        },

        getData(dataName) {
            const data = {};

            // Check type of first parameter
            if (typeof dataName === 'string') {
                dataName = [dataName];
            } else if (typeof dataName !== 'object') {
                console.warn('Helpers -> getData: First parameter must string or array.');

                return data;
            }

            dataName.forEach(prop => {
                if (savedData.hasOwnProperty(prop)) {
                    Object.assign(data, {
                        [prop]: savedData[prop]
                    });
                } else if (!PRODUCTION) {
                    console.warn(`Helpers -> getData: Property '${prop}' is not found.`);
                }
            });

            return data;
        },

        numberWithDot(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },

        sortIcon(obj) {
            const { icons, sortBy } = Object.assign({
                icons: [],
                sortBy: 'name'
            }, obj);
        
            icons.sort(function(a, b) {
                const nameA = a[sortBy].toUpperCase(); // ignore upper and lowercase
                const nameB = b[sortBy].toUpperCase(); // ignore upper and lowercase
            
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                }
              
                // names must be equal
                return 0;
            });
        
            return icons;
        },

        showIcons(icons, entryOptions = {}) {
            const currentShowedIconsVar = 'currentShowedIcons';
            const {
                currentShowedIcons,
                iconListSelector,
                showCheatSheetSelector,
                copyToClipboardClass,
                previewIconClass,
                showMoreIconsSelector
            } = this.getData([
                currentShowedIconsVar,
                'iconListSelector',
                'showCheatSheetSelector',
                'copyToClipboardClass',
                'previewIconClass',
                'showMoreIconsSelector'
            ]);

            icons = !icons && currentShowedIcons ? currentShowedIcons : icons;
        
            const iconContainerClass = 'icon-container';
            const $iconListContainer = $(iconListSelector);
            const $totalIconContainer = $('#total-filtered-icons');
            const totalIcons = icons.length;
            const maxPageLength = 99;
            const typeofOptions = typeof entryOptions;
            const { start, showcheatSheet } = Object.assign({
                start: 0,
                showcheatSheet: $(showCheatSheetSelector).hasClass('active')
            }, typeofOptions === 'object' ? entryOptions : typeofOptions === 'string' || typeofOptions === 'number' ? { start: entryOptions } : {});
            const tooltipOptions = {
                'data-toggle': 'tooltip',
                'data-placement': 'top'
            };
        
            // Clear all icon list if show from first icon and set current icons
            if (start === 0) {
                $iconListContainer.html('');
        
                this.saveData(currentShowedIconsVar, icons);
            }
        
            // Resort icons
            this.sortIcon({
                icons
            });

            for (let index = start; index - start < maxPageLength && index < totalIcons; index++) {
                const iconData = icons[index];
                const { name:iconClass, label:iconLabel, fullClass:fullIconClass, unicode } = iconData;
                const iconTooltipTitle = `Copy ${iconLabel} icon class to clipboard`;
                const unicodeTooltipTitle = `Copy "${unicode}" to clipboard`;
        
                const $cheatSheet = $('<span></span>', {
                    class: `db ${copyToClipboardClass} gray5 hover-gray7`,
                    html: `<i class="fas fa-clipboard"></i> ${unicode}`,
                    data: {
                        copy: unicode,
                        tooltipTitle: unicodeTooltipTitle
                    },
                    'title': unicodeTooltipTitle,
                    ...tooltipOptions,
                });
                const $icon = [
                    $('<a></a>', {
                        href: '#',
                        class: `flex flex-column items-center justify-center color-inherit w-100 pa2 br2 br--top no-underline hover-bg-blue4 hover-white ${previewIconClass}`,
                        html: $('<i></i>', {
                            class: fullIconClass,
                            css: {
                                fontSize: '48px'
                            }
                        }),
                        data: iconData
                    }),
                    $('<div></div>', {
                        class: 'w-100 ph1 pv2 tc f2',
                        html: [
                            $('<span></span>', {
                                class: `db gray5 hover-gray7 text select-all ${copyToClipboardClass}`,
                                html: iconClass,
                                data: {
                                    copy: fullIconClass,
                                    tooltipTitle: iconTooltipTitle
                                },
                                'title': iconTooltipTitle,
                                ...tooltipOptions
                            }),
                            $cheatSheet
                        ]
                    })
                ];
                const $iconContainer = $('<li></li>', {
                    class: `dib ma0 pb3 w-grid-2 w-grid-4-m w-grid-6-l w-grid-9-xl ${iconContainerClass} icon-place`,
                    html: $('<div></div>', {
                        class: 'flex flex-column justify-center relative shadow-hover default hover-bg-white br2 hide-child',
                        html: $icon
                    })
                });
        
                if (!showcheatSheet) $cheatSheet.hide();
        
                $iconListContainer.append($iconContainer);
        
                // Add show more icon button
                if (maxPageLength - (index - start) === 1 && index < totalIcons) {
                    $iconListContainer.append([
                        $('<div></div>', {
                            class: 'col-12',
                            html: $('<a></a>', {
                                href: '#',
                                id: showMoreIconsSelector,
                                class: 'btn btn-block btn-primary text-center',
                                html: '<i class="fas fa-arrow-down"></i> Show more icons...',
                                data: {
                                    start: index + 1
                                }
                            })
                        })
                    ]);
                }
            }
        
            if (totalIcons > 0) {
                const currentShowIcons = $iconListContainer.find(`.${iconContainerClass}`).length;
        
                // Show number of icon that found and currently show
                $totalIconContainer.html(`Found ${this.numberWithDot(totalIcons)} icons, show: ${this.numberWithDot(currentShowIcons)} icons`);
            } else {
                const $emptyIcon = $('<li></li>', {
                    class: 'text-center',
                    html: [
                        $('<i></i>', {
                            class: 'fas fa-search icon-place mb-3',
                            css: {
                                fontSize: '100px',
                                display: 'block'
                            }
                        }),
                        'Oopss..., we cannot find icon that you looking for.'
                    ],
                    css: {
                        width: '100%'
                    }
                });

                $iconListContainer.html($emptyIcon);
                $totalIconContainer.html('Not found any match icon');
            }

            // Init tooltips
            $iconListContainer.find('[data-toggle="tooltip"]').tooltip({
                delay: {
                    'show': 500,
                    'hide': 0
                }
            });
        
            return totalIcons;
        },

        backToTop(options = {}) {
            //Default options
            const {
                target,
                iconName:icon,
                trigger,
                fxName,
                fxTransitionDuration:duration,
                scrollDuration
            } = $.extend({
                target: $('.bck'),
                iconName : 'fas fa-chevron-up',
                trigger : 500,
                fxName : 'fade',
                fxTransitionDuration : 300,
                scrollDuration : 300
            }, options);	
            
            const btn = target.jquery ? target : typeof target === 'string' ? $(target) : null;

            if (!btn) return false;
                
            btn.each(function(indexEl, btnEl) {
                const $btn = $(btnEl);

                $btn.prepend('<i class="'+icon+'"></i>')
                    .addClass(fxName)
                    .css({
                        transitionDuration: `${duration}ms`
                    });
                
                $(window).scroll(function(){
                    if ($(window).scrollTop() > trigger) {
                        $btn.addClass('bck-on');
                    } else {
                        $btn.removeClass('bck-on');
                    }
                });		
                
                $btn.on('click',function(e){		
                    e.preventDefault();

                    $('html, body').animate({
                        scrollTop: 0
                    }, scrollDuration);			
                });
            });		

            return btn;
        }
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = objFunctions;
    } else {
        window.helpers = objFunctions;
    }
}));