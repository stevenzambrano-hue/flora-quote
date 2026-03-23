import { supabase } from '../config/supabaseClient.js';

/**
 * Controller for Accessories (Complementos) Catalog
 */

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complementos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return res.status(500).json({ error: 'Failed to fetch accessories', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('complementos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Accessory not found' });
      throw error;
    }
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching accessory ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch accessory', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, costo } = req.body;

    if (!nombre || costo === undefined) {
      return res.status(400).json({ error: 'Name and cost are required fields' });
    }

    const { data, error } = await supabase
      .from('complementos')
      .insert([{ nombre, costo }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating accessory:', error);
    return res.status(500).json({ error: 'Failed to create accessory', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, costo } = req.body;

    const { data, error } = await supabase
      .from('complementos')
      .update({ nombre, costo })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error(`Error updating accessory ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update accessory', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('complementos')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({ 
          error: 'Cannot delete accessory', 
          details: 'This record is currently linked to one or more quotations.' 
        });
      }
      throw error;
    }
    return res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    console.error(`Error deleting accessory ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to delete accessory', details: error.message });
  }
};
