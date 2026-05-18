import { supabase } from '../config/supabaseClient.js';
import { calculateQuotation } from '../services/calculator.js';

/**
 * Creates a full quotation with header and details
 */
export const createFullQuotation = async (req, res) => {
  const { cotizacion, detalles } = req.body;

  try {
    // 1. Data validation
    if (!cotizacion || !detalles || !Array.isArray(detalles)) {
      return res.status(400).json({ error: 'Quotation data or details missing or invalid' });
    }

    // Optional: Run calculations on server for integrity
    const total_materiales = detalles.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);
    const calculos = calculateQuotation(
      total_materiales,
      cotizacion.porcentaje_desperdicio || 0,
      cotizacion.mano_obra || 0,
      cotizacion.margen_esperado || 0
    );

    // 2. Insert Header (Quotation)
    const { data: quoteData, error: quoteError } = await supabase
      .from('cotizaciones')
      .insert([
        {
          cliente: cotizacion.cliente,
          estado: 'Cotizado',
          total_costo_materiales: calculos.costo_total_materiales,
          total_costo_mano_obra: cotizacion.mano_obra || 0,
          porcentaje_desperdicio: cotizacion.porcentaje_desperdicio || 0,
          margen_esperado: cotizacion.margen_esperado || 0,
          precio_venta_final: calculos.precio_venta
        }
      ])
      .select()
      .single();

    if (quoteError) throw quoteError;

    const cotizacionId = quoteData.id;

    // 3. Link details to generated quotation ID
    const detallesConId = detalles.map((detalle, index) => ({
      cotizacion_id: cotizacionId,
      tipo_item: detalle.tipo,
      item_id: detalle.id_referencia || null,
      descripcion: detalle.item,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      subtotal: detalle.subtotal,
      orden_linea: index + 1
    }));

    // 4. Batch insert Details
    const { error: detallesError } = await supabase
      .from('cotizaciones_detalle')
      .insert(detallesConId);

    if (detallesError) {
      // Note: Ideally, you'd want a real database transaction here 
      // or cleanup logic if detail insertion fails.
      throw detallesError;
    }

    // 5. Return success response
    return res.status(201).json({
      message: 'Quotation created successfully',
      data: {
        id: cotizacionId,
        ...calculos
      }
    });

  } catch (error) {
    console.error('Error creating quotation:', error);
    return res.status(500).json({
      error: 'There was an error processing the quotation',
      details: error.message
    });
  }
};
