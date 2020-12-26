
import {ecreate,
        meparse,
        meappend,
        query}          from './js/utils.js';

import favicon          from './img/sun.jpeg';
import index            from './html/index-body.html';
import scss             from './css/index.scss';

import './js/nav-bar.js';
import './js/tab-set.js';
import './js/card-deck.js';
import './js/coach.js';
import './js/app-options.js';

let icon    = ecreate('link', {rel  : 'shortcut icon', href : favicon,
                               type : 'image/jpg',     id   : 'favicon'});
let styles  = ecreate('link', {rel  : 'stylesheet',    href : scss});

meappend(query('head'), [icon, styles]);

meappend(query('body'), meparse(index));

let tabs = query('tab-set');

query('nav-bar').onclick = (e) => {
    if (e.target.hash) {
        tabs.display(e.target.hash.slice(1));
    }
};

