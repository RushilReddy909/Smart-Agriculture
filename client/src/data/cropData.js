/**
 * Determines the current Indian agricultural season based on the month.
 * - Kharif (Monsoon): June - October
 * - Rabi (Winter): November - March
 * - Zaid (Summer): April - May
 * @returns {string} The name of the current season ('Kharif', 'Rabi', or 'Zaid').
 */
export const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0 (Jan) to 11 (Dec)

  if (month >= 5 && month <= 9) { // June to October
    return 'Kharif (Monsoon)';
  } else if (month >= 10 || month <= 2) { // November to March
    return 'Rabi (Winter)';
  } else { // April to May
    return 'Zaid (Summer)';
  }
};

export const crops = [
  // Kharif (Monsoon) Crops
  {
    name: 'Rice (Paddy)',
    season: 'Kharif (Monsoon)',
    type: 'Cereal',
    difficulty: 'Medium',
    description: 'A staple food crop that requires significant water, making it ideal for the monsoon season.'
  },
  {
    name: 'Cotton',
    season: 'Kharif (Monsoon)',
    type: 'Fiber Crop',
    difficulty: 'Hard',
    description: 'A cash crop that grows well in the warm and humid conditions of the Kharif season.'
  },
  {
    name: 'Sugarcane',
    season: 'Kharif (Monsoon)',
    type: 'Cash Crop',
    difficulty: 'Medium',
    description: 'A long-duration crop that is typically planted during the monsoon season.'
  },
  {
    name: 'Maize (Corn)',
    season: 'Kharif (Monsoon)',
    type: 'Cereal',
    difficulty: 'Easy',
    description: 'A versatile crop used for food and animal feed, thriving in monsoon climates.'
  },

  // Rabi (Winter) Crops
  {
    name: 'Wheat',
    season: 'Rabi (Winter)',
    type: 'Cereal',
    difficulty: 'Medium',
    description: 'The primary winter crop in India, requiring cool weather for growth and warm weather for ripening.'
  },
  {
    name: 'Mustard',
    season: 'Rabi (Winter)',
    type: 'Oilseed',
    difficulty: 'Easy',
    description: 'An important oilseed crop that grows well in the cool temperatures of the Rabi season.'
  },
  {
    name: 'Gram (Chickpea)',
    season: 'Rabi (Winter)',
    type: 'Pulse',
    difficulty: 'Easy',
    description: 'A major pulse crop that prefers the dry and cool conditions of the winter months.'
  },

  // Zaid (Summer) Crops
  {
    name: 'Watermelon',
    season: 'Zaid (Summer)',
    type: 'Fruit',
    difficulty: 'Easy',
    description: 'A popular summer fruit that requires warm weather and plenty of sunlight to grow.'
  },
  {
    name: 'Cucumber',
    season: 'Zaid (Summer)',
    type: 'Vegetable',
    difficulty: 'Easy',
    description: 'A fast-growing vegetable that thrives in the heat of the Zaid season.'
  },
];