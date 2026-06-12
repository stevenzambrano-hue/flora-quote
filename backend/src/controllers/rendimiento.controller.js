import { supabase } from '../config/supabaseClient.js';

export const getAllRendimientos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rendimientos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching rendimientos:', error);
    return res.status(500).json({ error: 'Failed to fetch rendimientos' });
  }
};

export const createRendimiento = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('rendimientos')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating rendimiento:', error);
    return res.status(500).json({ error: 'Failed to create rendimiento' });
  }
};

export const updateRendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase
      .from('rendimientos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating rendimiento:', error);
    return res.status(500).json({ error: 'Failed to update rendimiento' });
  }
};

export const removeRendimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('rendimientos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'Rendimiento deleted successfully' });
  } catch (error) {
    console.error('Error deleting rendimiento:', error);
    return res.status(500).json({ error: 'Failed to delete rendimiento' });
  }
};
