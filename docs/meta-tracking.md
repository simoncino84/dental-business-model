# Tracciamento Meta — Dental Business Model

Pixel attivo: `1092425707023448`. Il vecchio pixel `1554363362163174` viene rimosso dalle landing di questo repository.

## Pagine ed eventi

| Percorso | Azione | Evento | content_ids |
| --- | --- | --- | --- |
| `/` | Visita videocorso | PageView, ViewContent | dbm-videocorso |
| `/grazie/` | Conferma iscrizione videocorso | PageView, Lead | dbm-videocorso |
| `/webinar/` | Visita webinar | PageView, ViewContent | dbm-webinar-2026-10-26 |
| `/webinar/grazie/` | Conferma iscrizione webinar | PageView, Lead | dbm-webinar-2026-10-26 |
| `/live-intensive/` | Visita Live Intensive | PageView, ViewContent | dbm-live-2026-12-04 |
| `/live-intensive/priorita/` | Visita offerta webinar | PageView, ViewContent | dbm-live-2026-12-04 |
| Entrambe le pagine Live | Apertura percorso di iscrizione Delera | InitiateCheckout | dbm-live-2026-12-04 |
| `/mastermind-2027/` | Visita Mastermind | PageView, ViewContent | dbm-mastermind-2027 |
| Link WhatsApp/telefono | Click di contatto | Contact | prodotto della pagina |

Il contatto indica l'apertura del canale, non un messaggio effettivamente inviato.
InitiateCheckout indica il passaggio alla pagina Delera di iscrizione; non un acquisto.
I Lead si basano sull'arrivo alla pagina di conferma configurata dopo l'invio del modulo; non sono convalide server-side.

## Implementazione

`assets/dbm-meta.js` è l'unico punto di caricamento del Pixel Meta. Nelle landing ricostruite con `document.write` il tag viene inserito nel documento finale, non nella schermata di caricamento. I contenuti e le immagini delle landing non cambiano.

Il pixel viene caricato solo dopo l'accettazione dei cookie Meta. Accettazione e rifiuto hanno la stessa evidenza. Il pulsante Cookie Meta permette di cambiare scelta. Non è presente un beacon noscript che aggiri il consenso.

Ogni pagina invia un solo PageView per caricamento. I Lead sono deduplicati per prodotto nella stessa sessione/browser-tab. Non si contano conversioni per un semplice caricamento iframe o un postMessage non documentato. Ogni evento ha un eventID; non vengono passati nome, telefono, email o campi del modulo come parametri.

## Parti esterne al repository

- Il sito principale `www.dentalbusinessmodel.eu` è un CMS separato: richiede un'installazione nel template/gestore script di quel sito.
- I moduli e il checkout `crm.dentistaefficace.it` sono esterni al repository. Per Purchase occorre collegare il pagamento confermato in Delera/gestore pagamenti, trasmettendo importo effettivo, valuta EUR e identificativo ordine. Non generare Purchase dal click di iscrizione o da una query string pubblica.
- Le conversioni personalizzate in Gestione eventi Meta non vengono create tramite questo repository. Gli eventi Lead possono essere distinti per URL di conferma o content_ids.

Per confermare il percorso completo occorre un'iscrizione di prova Delera e il pannello Testa gli eventi del pixel. I test locali non generano lead nel CRM né richieste a Meta.

Riferimenti tecnici: https://developers.facebook.com/documentation/meta-pixel/reference/ e https://developers.facebook.com/documentation/meta-pixel/implementation/conversion-tracking/ .
