import { supabase } from '../config/supabaseClient.js';

/**
 * Controller for Colors (Colores) Catalog
 */

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('colores')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching colors:', error);
    return res.status(500).json({ error: 'Failed to fetch colors', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('colores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Color not found' });
      throw error;
    }
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching color ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch color', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, codigo_hex } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Name is a required field' });
    }

    const { data, error } = await supabase
      .from('colores')
      .insert([{ nombre, codigo_hex }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating color:', error);
    return res.status(500).json({ error: 'Failed to create color', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo_hex } = req.body;

    const { data, error } = await supabase
      .from('colores')
      .update({ nombre, codigo_hex })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error(`Error updating color ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update color', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('colores')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({ 
          error: 'Cannot delete color', 
          details: 'This record is currently linked to existing quotations.' 
        });
      }
      throw error;
    }
    return res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error(`Error deleting color ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to delete color', details: error.message });
  }
};
