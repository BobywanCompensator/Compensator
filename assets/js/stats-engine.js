/**
 * stats-engine.js
 * --------------------------------------------------
 * Calculs et agrégations pour Compensator
 * Dépend de : DataModel
 * --------------------------------------------------
 */

const StatsEngine = (() => {

  /* =========================
     SCORES DES WARLORDS
  ========================= */

  function getWarlordScores() {
    const scores = {};
    const battles = DataModel.battles();

    battles.forEach(b => {
      if (!b.winner) return;
      scores[b.winner] = (scores[b.winner] || 0) + 1;
    });

    return scores;
  }

  function getWarlordRecord(warlordId) {
    let wins = 0;
    let losses = 0;

    DataModel.battlesForWarlord(warlordId).forEach(b => {
      if (b.winner === warlordId) wins++;
      else losses++;
    });

    return { wins, losses };
  }

  /* =========================
     PROGRESSION DES FACTIONS
  ========================= */

  function getFactionProgress() {
    const factions = DataModel.factions();
    const sectors = DataModel.sectors();

    const progress = {};
    const totalSectors = sectors.length || 1;

    factions.forEach(f => {
      progress[f.id] = {
        id: f.id,
        name: f.name,
        color: f.color,
        controlled: 0,
        percent: 0
      };
    });

    sectors.forEach(s => {
      if (progress[s.owner]) {
        progress[s.owner].controlled++;
      }
    });

    Object.values(progress).forEach(p => {
      p.percent = Math.round((p.controlled / totalSectors) * 100);
    });

    return progress;
  }

  /* =========================
     COMBATS PAR SECTEUR
  ========================= */

  function getBattlesPerSector() {
    const counts = {};

    DataModel.battles().forEach(b => {
      if (!b.sector) return;
      counts[b.sector] = (counts[b.sector] || 0) + 1;
    });

    return counts;
  }

  /* =========================
     API PUBLIQUE
  ========================= */

  return {
    getWarlordScores,
    getWarlordRecord,
    getFactionProgress,
    getBattlesPerSector
  };

})();

