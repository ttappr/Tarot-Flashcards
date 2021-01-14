
/**
 * @see file://./html/index-body.html
 */

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
import './js/flashcard-coach.js';
import './js/app-options.js';

let icon     = ecreate('link', { rel: 'shortcut icon', href: favicon,
                                type: 'image/png',       id: 'favicon'});
let styles   = ecreate('link', { rel: 'stylesheet',    href: scss});

meappend(query('head'), [icon, styles]);

meappend(query('body'), meparse(index));

let tabs = query('tab-set');

query('nav-bar').onclick = (e) => {
    let tab = e.target.getAttribute('data-tab-name');
    if (tab) {
        tabs.display(tab);
    }
};

if (window.matchMedia('(display-mode: standalone)').matches) {
    console.info("Running in standalone mode.");
}

(async function () {
    try {
        if ('serviceWorker' in navigator) {
            let reg = await navigator.serviceWorker.register(
                                './service-worker.js',
                                { scope: '/Tarot-Flashcards/' }
                            );
            console.log('Service Worker registered successfully. ' +
                        'Scope is ' + reg.scope);
        }
    } catch (error) {
        console.log('Service Worker registration failed: ', error);
    }
})();

window.addEventListener('orientationchange', function () {
    var originalBodyStyle = getComputedStyle(document.body)
                            .getPropertyValue('display');
    document.body.style.display = 'none';
    let _ = document.body.offsetHeight;
    setTimeout(function () {
        document.body.style.display = originalBodyStyle;
    }, 10);
});
