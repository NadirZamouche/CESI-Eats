const Menu = require('../models/Menu');
const Article = require('../models/Article');

exports.createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find()
      .populate({
        path: 'Article',
        populate: {
          path: 'Restaurateur',
          select: 'name'
        }
      });
    res.status(200).json(menus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('Article');
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.status(200).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.status(200).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.status(200).json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
