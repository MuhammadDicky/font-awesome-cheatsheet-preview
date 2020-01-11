import $ from 'jquery/dist/jquery';
import Popper from 'popper.js/dist/umd/popper';

// Extend library to window
$.extend(window, {
    jQuery: $,
    Popper
});

// Bootstrap
import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';

// Bootstrap-colorpicker
import 'bootstrap-colorpicker';
import 'bootstrap-colorpicker/src/sass/colorpicker.scss';

// Font-Awesome
import '@fortawesome/fontawesome-free/css/all.css';

// Animate.css
import 'animate.css/source/_base.css';
import 'animate.css/source/_vars.css';
import 'animate.css/source/zooming_entrances/zoomIn.css';
import 'animate.css/source/zooming_exits/zoomOutDown.css';
import 'animate.css/source/bouncing_entrances/bounceIn.css';

// Custom style
import 'scss/style.scss';

import appHelpers from 'libs/helpers';

export {
    $,
    appHelpers
};