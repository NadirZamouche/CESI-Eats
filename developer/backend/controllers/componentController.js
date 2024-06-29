const Component = require('../models/Component');

exports.getComponents = async (req, res) => {
  try {
    const components = await Component.find();
    res.status(200).json(components);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};