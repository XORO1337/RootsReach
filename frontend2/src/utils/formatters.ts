// Helper function to format weight units
export const formatWeightUnit = (unit: string = 'g'): string => {
  const unitMap: { [key: string]: string } = {
    'g': 'g',
    'kg': 'kg',
    'piece': 'pc',
    'liter': 'L',
    'ml': 'ml',
    'dozen': 'dz'
  };
  return unitMap[unit] || unit;
};

// Helper function to get full weight unit name
export const getWeightUnitName = (unit: string = 'g'): string => {
  const nameMap: { [key: string]: string } = {
    'g': 'Gram (g)',
    'kg': 'Kilogram (kg)',
    'piece': 'Piece',
    'liter': 'Liter (L)',
    'ml': 'Milliliter (ml)',
    'dozen': 'Dozen'
  };
  return nameMap[unit] || unit;
};
