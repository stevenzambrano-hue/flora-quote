import { supabase } from '../config/supabaseClient.js';

/**
 * Controller for Boxes (Cajas) Catalog
 */

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cajas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error('Error fetching boxes:', error);
    return res.status(500).json({ error: 'Failed to fetch boxes', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cajas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Box not found' });
      throw error;
    }
    return res.json(data);
  } catch (error) {
    console.error(`Error fetching box ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch box', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, costo, tallos, volumen, peso, descripcion } = req.body;

    if (!nombre || costo === undefined) {
      return res.status(400).json({ error: 'Name and cost are required fields' });
    }

    const { data, error } = await supabase
      .from('cajas')
      .insert([{ nombre, costo, tallos, volumen, peso, descripcion }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating box:', error);
    return res.status(500).json({ error: 'Failed to create box', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, costo, tallos, volumen, peso, descripcion } = req.body;

    const { data, error } = await supabase
      .from('cajas')
      .update({ nombre, costo, tallos, volumen, peso, descripcion })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error(`Error updating box ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update box', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('cajas')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return res.status(409).json({ 
          error: 'Cannot delete box', 
          details: 'This record is currently linked to existing data.' 
        });
      }
      throw error;
    }
    return res.json({ message: 'Box deleted successfully' });
  } catch (error) {
    console.error(`Error deleting box ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to delete box', details: error.message });
  }
};
