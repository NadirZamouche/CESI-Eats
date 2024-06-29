const Article = require('../models/Article');
const Menu = require('../models/Menu');

exports.createArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({newProduct: article, message: "The article has been created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { name, category, quantity, price, path } = req.body;

    const updateData = { name, category, quantity, price, path };

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json({getEditedProduct: article, message: "The article has been updated successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });


    // Remove the article from any menus that contain it
    await Menu.updateMany(
      { Article: req.params.id },
      { $pull: { Article: req.params.id } }
    );

    res.status(200).json({ message: 'Article deleted and references removed from menus', path: article.path});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

