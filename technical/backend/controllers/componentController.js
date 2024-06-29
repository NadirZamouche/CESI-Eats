const Component = require('../models/Component');

exports.createComponent = async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json({newProduct: component, message: "The component has been created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getComponents = async (req, res) => {
  try {
    const components = await Component.find();
    res.status(200).json(components);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.status(200).json(component);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.status(200).json(component);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.status(200).json({ message: 'Component deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};