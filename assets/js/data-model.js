/**
 * data-model.js
 * --------------------------------------------------
 * Accès structuré et lisible aux données CSV
 * Dépend de : CSVLoader
 * --------------------------------------------------
 */

const DataModel = (() => {

  /* =========================
     DONNÉES BRUTES
  ========================= */

  function factions() {
    return CSVLoader.get('factions');
  }

  function warlords() {
    return CSVLoader.get('warlords');
  }

  function sectors() {
    return CSVLoader.get('sectors');
  }

  function battles() {
    return CSVLoader.get('battles');
  }

  function journal() {
    return CSVLoader.get('journal');
  }

  /* =========================
     HELPERS SIMPLES
  ========================= */

  function factionById(id) {
    return factions().find(f => f.id === id) || null;
  }

  function warlordById(id) {
    return warlords().find(w => w.id === id) || null;
  }

  function sectorById(id) {
    return sectors().find(s => s.id === id) || null;
  }

  function battlesForSector(sectorId) {
    return battles().filter(b => b.sector === sectorId);
  }

  function battlesForWarlord(warlordId) {
    return battles().filter(
      b => b.attacker === warlordId || b.defender === warlordId
    );
  }

  /* =========================
     API PUBLIQUE
  ========================= */

  return {
    // accès directs
    factions,
    warlords,
    sectors,
    battles,
    journal,

    // helpers
    factionById,
    warlordById,
    sectorById,
    battlesForSector,
    battlesForWarlord
  };

})();

