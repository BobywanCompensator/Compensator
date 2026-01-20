/**
 * csv-loader.js
 * --------------------------------------------------
 * Chargeur CSV simple et fiable pour GitHub Pages
 * - Charge tous les CSV depuis /data
 * - Parsing via PapaParse
 * - Cache interne
 * - Système de subscription
 * --------------------------------------------------
 */

const CSVLoader = (() => {

  /* =========================
     CONFIG
  ========================= */

  const BASE_PATH = './data/';

  const FILES = {
    factions:  'factions.csv',
    warlords:  'warlords.csv',
    sectors:   'sectors.csv',
    battles:   'battles.csv',
    journal:   'journal.csv'
  };

  /* =========================
     ÉTAT INTERNE
  ========================= */

  const cache = {};
  const subscribers = [];

  /* =========================
     OUTILS
  ========================= */

  function log(...args) {
    console.log('[CSVLoader]', ...args);
  }

  function error(...args) {
    console.error('[CSVLoader]', ...args);
  }

  function notify(key) {
    subscribers.forEach(cb => {
      try {
        cb(key, cache);
      } catch (e) {
        error('Subscriber error', e);
      }
    });
  }

  /* =========================
     CHARGEMENT
  ========================= */

  function loadFile(key) {
    const filename = FILES[key];
    if (!filename) {
      error(`Unknown CSV key: ${key}`);
      return;
    }

    Papa.parse(BASE_PATH + filename, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      complete: results => {
        if (results.errors.length) {
          error(`Errors in ${filename}`, results.errors);
        }

        cache[key] = results.data;
        log(`Loaded ${filename} (${results.data.length} rows)`);
        notify(key);
      },

      error: err => {
        error(`Failed to load ${filename}`, err);
      }
    });
  }

  function loadAll() {
    Object.keys(FILES).forEach(loadFile);
  }

  /* =========================
     API PUBLIQUE
  ========================= */

  return {
    loadAll,

    load: loadFile,

    get(key) {
      return cache[key] || [];
    },

    getAll() {
      return cache;
    },

    subscribe(callback) {
      if (typeof callback === 'function') {
        subscribers.push(callback);
      }
    }
  };

})();

