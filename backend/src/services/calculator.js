/**
 * FloraQuote Calculation Logic
 */

/**
 * Calculates costs and suggested sale price
 * @param {number} costo_total_materiales - Sum of flower and supply subtotals
 * @param {number} porcentaje_desperdicio - Waste percentage (e.g. 10 for 10%)
 * @param {number} mano_obra - Labor cost
 * @param {number} margen_esperado - Expected utility margin (e.g. 30 for 30%)
 * @returns {object} Calculation results
 */
export const calculateQuotation = (costo_total_materiales, porcentaje_desperdicio, mano_obra, margen_esperado) => {
  const costo_con_desperdicio = costo_total_materiales * (1 + porcentaje_desperdicio / 100);
  
  // Sale Price = (Cost With Waste + Labor) / (1 - Expected Margin / 100)
  const precio_venta = (costo_con_desperdicio + mano_obra) / (1 - margen_esperado / 100);
  
  return {
    costo_total_materiales,
    costo_con_desperdicio: parseFloat(costo_con_desperdicio.toFixed(2)),
    precio_venta: parseFloat(precio_venta.toFixed(2))
  };
};
