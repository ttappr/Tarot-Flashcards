
import {ecreate,
        meparse,
        meappend,
        eappend,
        query}          from './js/utils.js';

//import favicon          from './img/logo.png';
import favicon          from './img/noun_ace of swords_2159393.png';
import index            from './html/index-body.html';
import scss             from './css/index.scss';

import './js/nav-bar.js';
import './js/tab-set.js';
import './js/card-deck.js';
import './js/coach.js';
import './js/app-options.js';

//let manifest = ecreate('link', { rel: 'manifest',      href: '/manifest.json'});
let icon     = ecreate('link', { rel: 'shortcut icon', href: favicon,
                                type: 'image/png',       id: 'favicon'});
let styles   = ecreate('link', { rel: 'stylesheet',    href: scss});

meappend(query('head'), [icon, styles]);

meappend(query('body'), meparse(index));

let tabs = query('tab-set');

query('nav-bar').onclick = (e) => {
    if (e.target.hash) {
        let option = e.target.hash.slice(1);
        tabs.display(option);
    }
};

(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', {
                scope: '/Tarot-Flashcards/'
            })
            .then((reg) => console.log('Service Worker registered ' +
                                       'successfully. Scope is ' + reg.scope))
            .catch(error => console.log('Service Worker registration failed:', 
                                        error));
    }
})();