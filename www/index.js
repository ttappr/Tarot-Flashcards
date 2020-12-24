
import index            from './html/index-body.html';
import scss             from './css/index.scss';
import {ecreate,
        meparse,
        eappend,
        meappend,
        query}          from './js/utils.js';

import './js/app-bar.js'

eappend(query('head'), ecreate('link', {rel: 'stylesheet', href: scss}));

meappend(query('body'), meparse(index));
