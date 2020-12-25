
import {ecreate,
        meparse,
        eappend,
        meappend,
        query,
        mquery}         from './js/utils.js';

import favicon          from './img/sun.jpeg';
import index            from './html/index-body.html';
import scss             from './css/index.scss';
import options          from './html/options.html';

import './js/app-bar.js';
import './js/nav-bar.js';
import './js/tab-set.js';

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

