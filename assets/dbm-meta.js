/* DBM Meta tracking. One implementation for every GitHub Pages funnel. */
(function (w, d) {
  'use strict';
  if (w.dbmMeta) return;
  var PIXEL = '1092425707023448';
  var script = d.currentScript;
  var page = script && script.getAttribute('data-dbm-page') || 'website';
  var products = {
    agenda: {id: 'dbm-agenda-intenzionale', name: 'Libro Agenda Intenzionale', category: 'libro'},
    videocorso: {id: 'dbm-videocorso', name: 'Videocorso Da Studio a Impresa', category: 'videocorso'},
    webinar: {id: 'dbm-webinar-2026-10-26', name: 'Webinar Metodo S.T.U.D.I.O. 26 ottobre 2026', category: 'webinar'},
    live: {id: 'dbm-live-2026-12-04', name: 'Live Intensive 4-5 dicembre 2026', category: 'live-intensive'},
    mastermind: {id: 'dbm-mastermind-2027', name: 'Mastermind 2027', category: 'mastermind'}
  };
  var productKey = page.indexOf('agenda') === 0 ? 'agenda' : page.indexOf('webinar') === 0 ? 'webinar' : page.indexOf('videocorso') === 0 ? 'videocorso' : page.indexOf('live') === 0 ? 'live' : 'mastermind';
  var product = products[productKey];
  var thankYou = /-thanks$/.test(page);
  var consentKey = 'dbm_meta_consent_v1';
  var enabled = false, initialized = false, pageSent = false;
  var memory = Object.create(null);
  var banner, preferences;

  function uid() {
    return w.crypto && w.crypto.randomUUID ? w.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  function getChoice() {
    var raw;
    try { raw = w.localStorage.getItem(consentKey); } catch (_) {}
    if (!raw) {
      var match = d.cookie.match(/(?:^|; )dbm_meta_consent_v1=([^;]*)/);
      if (match) raw = decodeURIComponent(match[1]);
    }
    try {
      var item = JSON.parse(raw);
      if (item && Date.now() - item.at < 180 * 86400000 && (item.choice === 'granted' || item.choice === 'denied')) return item.choice;
    } catch (_) {}
    return null;
  }
  function saveChoice(choice) {
    var raw = JSON.stringify({choice: choice, at: Date.now()});
    try { w.localStorage.setItem(consentKey, raw); } catch (_) {}
    var domain = /(^|\.)dentalbusinessmodel\.eu$/.test(w.location.hostname) ? '; Domain=.dentalbusinessmodel.eu' : '';
    d.cookie = consentKey + '=' + encodeURIComponent(raw) + '; Path=/; Max-Age=15552000; SameSite=Lax' + domain + (w.location.protocol === 'https:' ? '; Secure' : '');
  }
  function params() {
    return {content_name: product.name, content_ids: [product.id], content_category: product.category};
  }
  function remember(key) {
    var full = 'dbm_meta_' + PIXEL + '_' + key;
    if (memory[full]) return false;
    try {
      if (w.sessionStorage.getItem(full)) return false;
      w.sessionStorage.setItem(full, '1');
    } catch (_) {}
    memory[full] = true;
    return true;
  }
  function track(event, data, onceKey) {
    if (!enabled || !initialized) return false;
    if (onceKey && !remember(onceKey)) return false;
    w.fbq('trackSingle', PIXEL, event, data || params(), {eventID: uid()});
    return true;
  }
  function start() {
    enabled = true;
    if (!initialized) {
      !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
        t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
      }(w,d,'script','https://connect.facebook.net/en_US/fbevents.js');
      w.fbq('set', 'autoConfig', false, PIXEL);
      w.fbq('init', PIXEL);
      initialized = true;
    }
    w.fbq('consent', 'grant');
    if (!pageSent) {
      track('PageView', {});
      if (!thankYou) track('ViewContent');
      pageSent = true;
    }
    // Delera redirects successful free registrations to these confirmation pages.
    // Never emit a Lead from an iframe load, CTA click or unverified postMessage.
    if (thankYou) track('Lead', params(), 'lead_' + product.id);
  }
  function choose(choice) {
    saveChoice(choice);
    if (banner) banner.hidden = true;
    if (choice === 'granted') start();
    else {
      enabled = false;
      if (initialized) w.fbq('consent', 'revoke');
      ['_fbp', '_fbc'].forEach(function (name) {
        d.cookie = name + '=; Max-Age=0; Path=/';
        if (/(^|\.)dentalbusinessmodel\.eu$/.test(w.location.hostname)) d.cookie = name + '=; Max-Age=0; Path=/; Domain=.dentalbusinessmodel.eu';
      });
    }
    if (preferences) preferences.focus();
  }
  function renderConsent() {
    if (d.getElementById('dbm-meta-consent')) return;
    var css = d.createElement('style');
    css.textContent = '#dbm-meta-consent{position:fixed;z-index:100001;left:16px;right:16px;bottom:16px;margin:auto;max-width:980px;padding:22px;background:#071b2b;color:#fff;border:1px solid #36bfd0;border-radius:8px;box-shadow:0 12px 50px #0005;font:15px/1.5 Arial,sans-serif}#dbm-meta-consent[hidden]{display:none!important}#dbm-meta-consent p{margin:0 0 16px;color:#fff;font:15px/1.5 Arial,sans-serif}#dbm-meta-consent a{color:#9ce8ee;text-decoration:underline}#dbm-meta-consent .dbm-consent-actions{display:flex;flex-wrap:wrap;gap:12px}#dbm-meta-consent button{font:700 14px Arial,sans-serif;padding:12px 18px;border:1px solid #36bfd0;border-radius:4px;background:#36bfd0;color:#071b2b;cursor:pointer}#dbm-meta-preferences{position:fixed;z-index:99999;left:12px;bottom:86px;padding:7px 10px;border:1px solid #587785;border-radius:4px;background:#071b2b;color:#fff;font:12px Arial,sans-serif;cursor:pointer}';
    d.head.appendChild(css);
    banner = d.createElement('section');
    banner.id = 'dbm-meta-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Preferenze cookie pubblicitari Meta');
    banner.innerHTML = '<p>Con il tuo consenso utilizziamo il Pixel Meta per misurare iscrizioni e campagne e personalizzare gli annunci su Facebook e Instagram. Puoi rifiutare e continuare a usare il sito e i moduli. <a href="https://www.dentalbusinessmodel.eu/Cookie" target="_blank" rel="noopener">Cookie policy</a>.</p><div class="dbm-consent-actions"><button type="button" data-choice="denied">Rifiuta</button><button type="button" data-choice="granted">Accetta Meta</button></div>';
    banner.hidden = getChoice() !== null;
    banner.addEventListener('click', function(e) {
      var choice = e.target.getAttribute('data-choice');
      if (choice) choose(choice);
    });
    d.body.appendChild(banner);
    preferences = d.createElement('button');
    preferences.id = 'dbm-meta-preferences';
    preferences.type = 'button';
    preferences.textContent = 'Cookie Meta';
    preferences.addEventListener('click', function() { banner.hidden = false; banner.querySelector('button').focus(); });
    d.body.appendChild(preferences);
    if (getChoice() === 'granted') start();
  }

  d.addEventListener('click', function(e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href, w.location.href); } catch (_) { return; }
    if (url.hostname === 'crm.dentistaefficace.it' && url.pathname.replace(/\/$/, '') === '/studio-impresa-2026') {
      var checkout = params(); checkout.content_name = products.live.name; checkout.content_ids = [products.live.id]; checkout.content_category = products.live.category;
      track('InitiateCheckout', checkout, 'checkout_' + products.live.id);
    } else if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com' || url.protocol === 'tel:') {
      var contact = params(); contact.contact_method = url.protocol === 'tel:' ? 'telephone_click' : 'whatsapp_click';
      track('Contact', contact, 'contact_' + product.id);
    }
  });
  w.addEventListener('storage', function(e) {
    if (e.key !== consentKey) return;
    if (getChoice() === 'granted') start();
    else { enabled = false; if (initialized) w.fbq('consent', 'revoke'); }
  });
  w.dbmMeta = {pixelId: PIXEL, page: page, setConsent: choose};
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', renderConsent, {once:true});
  else renderConsent();
})(window, document);

