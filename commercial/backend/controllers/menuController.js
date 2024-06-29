const Menu = require('../models/Menu');

exports.createMenu = async (req, res) => {
  try {
    console.log(req.body)
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json({ newMenu: menu, message: "The menu has been created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('Article');
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
    console.log(req.body)
    const { name, price, Article, path } = req.body;

    const updateData = { name, price, Article, path };

    const menu = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.status(200).json({ getEditedMenu: menu, message: "The menu has been updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });

    

    res.status(200).json({ message: 'Menu deleted', path: menu.path });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
