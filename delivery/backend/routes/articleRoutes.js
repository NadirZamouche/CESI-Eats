const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');


router.post('/',articleController.createArticle); // Handle file upload
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id',  articleController.updateArticle); // Handle file upload
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
