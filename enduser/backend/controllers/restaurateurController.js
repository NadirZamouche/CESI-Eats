const Restaurateur = require('../models/Restaurateur');

exports.createRestaurateur = async (req, res) => {
  try {
    const restaurateur = new Restaurateur(req.body);
    await restaurateur.save();
    res.status(201).json(restaurateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRestaurateurs = async (req, res) => {
  try {
    const restaurateurs = await Restaurateur.find();
    res.status(200).json(restaurateurs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRestaurateurById = async (req, res) => {
  try {
    const restaurateur = await Restaurateur.findById(req.params.id);
    if (!restaurateur) return res.status(404).json({ error: 'Restaurateur not found' });
    res.status(200).json(restaurateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRestaurateur = async (req, res) => {
  try {
    const restaurateur = await Restaurateur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurateur) return res.status(404).json({ error: 'Restaurateur not found' });
    res.status(200).json(restaurateur);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRestaurateur = async (req, res) => {
  try {
    const restaurateur = await Restaurateur.findByIdAndDelete(req.params.id);
    if (!restaurateur) return res.status(404).json({ error: 'Restaurateur not found' });
    res.status(200).json({ message: 'Restaurateur deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
