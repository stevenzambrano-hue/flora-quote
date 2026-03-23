import { supabase } from '../config/supabaseClient.js';

/**
 * Controller for Flowers (Flores) Catalog
 */

export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('flores')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    
    // Map database field 'costo_alta_temporada' to 'costo_alta' for API
    const mappedData = data.map(item => ({
      ...item,
      costo_alta: item.costo_alta_temporada
    }));

    return res.json(mappedData);
  } catch (error) {
    console.error('Error fetching flowers:', error);
    return res.status(500).json({ error: 'Failed to fetch flowers', details: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('flores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Flower not found' });
      throw error;
    }

    // Map database field 'costo_alta_temporada' to 'costo_alta' for API
    return res.json({
      ...data,
      costo_alta: data.costo_alta_temporada
    });
  } catch (error) {
    console.error(`Error fetching flower ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch flower', details: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const { nombre, costo_regular, costo_alta, costo_local } = req.body;

    if (!nombre || costo_regular === undefined) {
      return res.status(400).json({ error: 'Name and regular cost are required fields' });
    }

    const { data, error } = await supabase
      .from('flores')
      .insert([{ 
        nombre, 
        costo_regular, 
        costo_alta_temporada: costo_alta, 
        costo_local 
      }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({
      ...data,
      costo_alta: data.costo_alta_temporada
    });
  } catch (error) {
    console.error('Error creating flower:', error);
    return res.status(500).json({ error: 'Failed to create flower', details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, costo_regular, costo_alta, costo_local } = req.body;

    const { data, error } = await supabase
      .from('flores')
      .update({ 
        nombre, 
        costo_regular, 
        costo_alta_temporada: costo_alta, 
        costo_local 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({
      ...data,
      costo_alta: data.costo_alta_temporada
    });
  } catch (error) {
    console.error(`Error updating flower ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update flower', details: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('flores')
      .delete()
      .eq('id', id);

    if (error) {
      // Check for foreign key violation (usually code 23503 in Postgres)
      if (error.code === '23503') {
        return res.status(409).json({ 
          error: 'Cannot delete flower', 
          details: 'This record is currently linked to one or more quotations.' 
        });
      }
      throw error;
    }
    return res.json({ message: 'Flower deleted successfully' });
  } catch (error) {
    console.error(`Error deleting flower ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to delete flower', details: error.message });
  }
};
