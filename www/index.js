
import {ecreate,
        meparse,
        eappend,
        meappend,
        query}          from './js/utils.js';

import favicon          from './img/sun.jpeg';
import index            from './html/index-body.html';
import scss             from './css/index.scss';

import './js/app-bar.js';
import './js/nav-bar.js';


let icon   = ecreate('link', { rel: 'shortcut icon', href: favicon,
                              type: 'image/jpg',       id: 'favicon'});
let styles = ecreate('link', { rel: 'stylesheet',    href: scss});

meappend(query('head'), [icon, styles]);

meappend(query('body'), meparse(index));
