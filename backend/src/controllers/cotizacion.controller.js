import { supabase } from '../config/supabaseClient.js';

/**
 * Creates a full quotation with header and details
 */
export const createFullQuotation = async (req, res) => {
  const { cotizacion, detalles } = req.body;
  
  try {
    // Validar que no haya valores negativos clave
    if (cotizacion.mano_obra < 0 || cotizacion.porcentaje_desperdicio < 0 || cotizacion.margen_esperado < 0) {
      return res.status(400).json({ success: false, error: 'No se permiten valores negativos en los costos o márgenes.' });
    }
    
    // Validar que no haya cantidades ni precios negativos en los detalles
    const tieneNegativos = detalles.some(d => d.cantidad < 1 || d.precio_unitario < 0);
    if (tieneNegativos) {
      return res.status(400).json({ success: false, error: 'Las cantidades deben ser mayores a 0 y los precios no pueden ser negativos.' });
    }

    const { data: cotizacionId, error } = await supabase.rpc('guardar_cotizacion_completa', {
      p_cliente: cotizacion.cliente,
      p_total_materiales: cotizacion.costo_total_materiales || 0,
      p_total_mano_obra: cotizacion.mano_obra || 0,
      p_porcentaje_desperdicio: cotizacion.porcentaje_desperdicio || 0,
      p_margen_esperado: cotizacion.margen_esperado || 0,
      p_precio_venta_final: cotizacion.precio_venta || 0,
      p_detalles: detalles,
      p_caja_id: cotizacion.caja_id || null,    // <-- ENVIAR CAJA_ID AL RPC
      p_costo_caja: cotizacion.costo_caja || 0  // <-- ENVIAR COSTO AL RPC
    });

    if (error) throw error;

    return res.status(201).json({ 
      success: true, 
      id: cotizacionId 
    });

  } catch (error) {
    console.error("Error creating quotation:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, cotizaciones_detalle(*)')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return res.status(500).json({ error: 'Failed to fetch quotations' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('cotizaciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return res.status(500).json({ error: 'Failed to delete quotation' });
  }
};
