
import {ecreate,
        meparse,
        meappend,
        eappend,
        query}          from './js/utils.js';

import favicon          from './img/sun.jpeg';
import index            from './html/index-body.html';
import scss             from './css/index.scss';

import fscreen from 'fscreen';

import './js/nav-bar.js';
import './js/tab-set.js';
import './js/card-deck.js';
import './js/coach.js';
import './js/app-options.js';


let m1 = ecreate('meta', {   name: 'apple-mobile-web-app-capable', 
                          content: 'yes'});
let m2 = ecreate('meta', {   name: 'apple-mobile-web-app-status-bar-style',
                          content: 'black-translucent'});

meappend(query('head'), [m1, m2]);

let icon    = ecreate('link', { rel: 'shortcut icon', href: favicon,
                               type: 'image/jpg',       id: 'favicon'});
let styles  = ecreate('link', { rel: 'stylesheet',    href: scss});

meappend(query('head'), [icon, styles]);

meappend(query('body'), meparse(index));

let tabs = query('tab-set');

query('nav-bar').onclick = (e) => {
    if (e.target.hash) {
        let option = e.target.hash.slice(1);
        if (option === 'fullscreen') {
            if (!fscreen.fullscreenElement) {
                fscreen.requestFullscreen(query('html'));
            } else {
                fscreen.exitFullscreen();
            }
        } else {
            tabs.display(option);
        }
    }
};
