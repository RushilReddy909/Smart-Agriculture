/**
 * Determines the current Indian agricultural season and returns a non-translatable key.
 * - 'kharif': June - October
 * - 'rabi': November - March
 * - 'zaid': April - May
 * @returns {string} The key for the current season ('kharif', 'rabi', or 'zaid').
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0 (Jan) to 11 (Dec)

  if (month >= 5 && month <= 9) { // June to October
    return 'kharif';
  } else if (month >= 10 || month <= 2) { // November to March
    return 'rabi';
  } else { // April to May
    return 'zaid';
  }
};

// This list now uses keys to point to the JSON file for translations.
export const crops = [
  // Kharif (Monsoon) Crops
  {
    id: 'rice_paddy',
    season: 'kharif',
    typeKey: 'shared_terms.cereal',
    difficultyKey: 'shared_terms.medium',
  },
  {
    id: 'cotton',
    season: 'kharif',
    typeKey: 'shared_terms.fiber_crop',
    difficultyKey: 'shared_terms.hard',
  },
  {
    id: 'sugarcane',
    season: 'kharif',
    typeKey: 'shared_terms.cash_crop',
    difficultyKey: 'shared_terms.medium',
  },
  {
    id: 'maize',
    season: 'kharif',
    typeKey: 'shared_terms.cereal',
    difficultyKey: 'shared_terms.easy',
  },

  // Rabi (Winter) Crops
  {
    id: 'wheat',
    season: 'rabi',
    typeKey: 'shared_terms.cereal',
    difficultyKey: 'shared_terms.medium',
  },
  {
    id: 'mustard',
    season: 'rabi',
    typeKey: 'shared_terms.oilseed',
    difficultyKey: 'shared_terms.easy',
  },
  {
    id: 'gram',
    season: 'rabi',
    typeKey: 'shared_terms.pulse',
    difficultyKey: 'shared_terms.easy',
  },

  // Zaid (Summer) Crops
  {
    id: 'watermelon',
    season: 'zaid',
    typeKey: 'shared_terms.fruit',
    difficultyKey: 'shared_terms.easy',
  },
  {
    id: 'cucumber',
    season: 'zaid',
    typeKey: 'shared_terms.vegetable',
    difficultyKey: 'shared_terms.easy',
  },
];
