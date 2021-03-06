
import { ecreate, eparse, separse, eappend, query } from  './utils.js';

import html from './../html/app-installer.html';

/**
 * @see file://./../html/install-app.html
 */
export class AppInstaller extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let template = separse(html).content.cloneNode(true);
        eappend(this.shadowRoot, template);
        
        this._installLink = query(".install-link", this.shadowRoot);
        this._configBase  = query(".config", this.shadowRoot);

        this._deferredPrompt = null;
        
        if (this._isBeforeInstallPromptSupported()) {
            if (this._isCompletelyVisible) {
                this._configBase.classList.remove('config-hidden');
            }
            window.addEventListener('load', () => {
                let link = this._installLink;
                if (link.textContent.trim() === 'Web App is loading...') {
                    link.textContent = 'Web App installed.';
                }
            });
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
            let rso = new ResizeObserver(() => {
                if (!this._isCompletelyVisible) {
                    this._configBase.classList.add('config-hidden');
                } else {
                    this._configBase.classList.remove('config-hidden');
                }
            });
            rso.observe(document.body);
        }
    }
    _isBeforeInstallPromptSupported() {
        let winProps = Object.keys(window);
        return winProps.includes('onbeforeinstallprompt');
    }
    _showInstallPromotion() {
        let link = this._installLink;
        link.textContent = 'Tap here to install this Web App locally.';
        link.classList.remove('installed');
        link.onclick = () => { this._install() };
        console.log('InstallApp._showInstallPromotion() was invoked.');
    }
    _hideInstallPromotion() {
        let link = this._installLink;
        link.textContent = 'Web App has been installed.';
        link.classList.add('installed');
        link.onclick = null;
        console.log('InstallApp._hideInstallPromotion() was invoked.');
    }
    async _install() {
        // Shows prompt.
        this._deferredPrompt.prompt();
        let { outcome } = await this._deferredPrompt.userChoice;
        console.log(`User install response: ${outcome}`);
        this._deferredPrompt = null;
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
    get _isCompletelyVisible() {
        let rect = this._configBase.getBoundingClientRect();
        let doc  = document.documentElement;
        let win  = window;
        return !((rect.top < 0 || rect.left < 0) ||
                 (rect.bottom > (win.innerHeight || doc.clientHeight)) ||
                 (rect.right  > (win.innerWidth  || doc.clientWidth)));
    }
}

customElements.define('app-installer', AppInstaller);

