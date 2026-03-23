import { supabase } from '../config/supabaseClient.js';

/**
 * Controller for Supplies (Insumos) Catalog
 */

export const getAll = async (req, res) => {
  try {
    const { tipo } = req.query;
    
    let query = supabase.from('insumos').select('*');

    // Smart Filtering: Detect if "tipo=urbanstems" is present
    if (tipo === 'urbanstems') {
      query = query.eq('es_urbanstems', true);
    } else if (tipo === 'regular') {
      query = query.eq('es_urbanstems', false);
    }

    const { data, error } = await query.order('nombre', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    return res.status(500).json({ error: 'Failed to fetch supplies', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('insumos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Supply not found' });
      throw error;
    }
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching supply ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch supply', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, categoria, costo_unitario, es_urbanstems } = req.body;

    if (!nombre || costo_unitario === undefined) {
      return res.status(400).json({ error: 'Name and unit cost are required fields' });
    }

    const { data, error } = await supabase
      .from('insumos')
      .insert([{ nombre, categoria, costo_unitario, es_urbanstems }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating supply:', error);
    return res.status(500).json({ error: 'Failed to create supply', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, costo_unitario, es_urbanstems } = req.body;

    const { data, error } = await supabase
      .from('insumos')
      .update({ nombre, categoria, costo_unitario, es_urbanstems })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error(`Error updating supply ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update supply', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('insumos')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({ 
          error: 'Cannot delete supply', 
          details: 'This record is currently linked to one or more quotations.' 
        });
      }
      throw error;
    }
    return res.json({ message: 'Supply deleted successfully' });
  } catch (error) {
    console.error(`Error deleting supply ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to delete supply', details: error.message });
  }
};
