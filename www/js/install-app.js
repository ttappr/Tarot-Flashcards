
import { ecreate, eparse, separse, eappend, query } from  './utils.js';

import html from './../html/install-app.html';

/**
 * @see file://./../html/install-app.html
 */
export class InstallApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let template = separse(html).content.cloneNode(true);
        eappend(this.shadowRoot, template);
        this._deferredPrompt = null;
        
        // https://web.dev/customize-install/
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this._deferredPrompt = e;
            this._showInstallPromotion();
            console.log("'beforeinstallprompt' was fired.");
        });
        window.addEventListener('appinstalled', () => {
            this._hideInstallPromotion();
            this._deferredPrompt = null;
            console.log('PWA was installed.');
        });
    }
    _showInstallPromotion() {
        let link = query('.install-link', this.shadowRoot);
        link.onclick = this._installClickHandler.bind(this);
        console.log('InstallApp._showInstallPromotion() was invoked.');
    }
    _hideInstallPromotion() {
        console.log('InstallApp._hideInstallPromotion() was invoked.');
    }
    async _install() {
        // Shows prompt.
        this._deferredPrompt.prompt();
        let { outcome } = await this._deferredPrompt.userChoice;
        console.log(`User install response: ${outcome}`);
        this._deferredPrompt = null;
    }
    _installClickHandler(e) {
        this._install();
    }
    get displayMode() {
        let isStandalone = window.matchMedia('(display-mode: standalone)')
                                 .matches;
        if (document.referrer.startsWith('android-app://')) {
            return 'twa';
        } else if (navigator.standalone || isStandalone) {
            return 'standalone';
        }
        return 'browser';
    }
}

customElements.define('install-app', InstallApp);

