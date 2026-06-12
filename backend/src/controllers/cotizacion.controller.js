import { supabase } from '../config/supabaseClient.js';

/**
 * Creates a full quotation with header and details
 */
export const createFullQuotation = async (req, res) => {
  const { cotizacion, detalles } = req.body;
  
  try {
    const { data: cotizacionId, error } = await supabase.rpc('guardar_cotizacion_completa', {
      p_cliente: cotizacion.cliente,
      p_total_materiales: calculos.costo_total_materiales,
      p_total_mano_obra: cotizacion.mano_obra || 0,
      p_porcentaje_desperdicio: cotizacion.porcentaje_desperdicio || 0,
      p_margen_esperado: cotizacion.margen_esperado || 0,
      p_precio_venta_final: calculos.precio_venta,
      p_detalles: detalles
    });

    if (error) throw error;

    return res.status(201).json({ 
      success: true, 
      message: 'Quotation created successfully', 
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
