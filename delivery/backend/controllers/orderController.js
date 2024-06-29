const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Restaurateur =require('../models/Restaurateur');
const {User} = require('../SQLmodels/users')
exports.createOrder = async (req, res) => {
  try {
    const { price, del_price, state, notif_res, notif_cli, notif_del, Menu, Article, Client, Restaurateur, Delivery } = req.body;

    const order = new Order({
      price,
      state,
      del_price,
      notif_res,
      notif_cli,
      notif_del,
      Menu: Menu.map(menu => ({ menuId: menu.menuId, quantity: menu.quantity })),
      Article: Article.map(article => ({ articleId: article.articleId, quantity: article.quantity })),
      Client,
      Restaurateur,
      Delivery
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'Menu',
        populate: {
          path: 'menuId',
          populate: {
            path: 'Article',
            model: 'Article'
          },
          model: 'Menu'
        }
      })
      .populate({
        path: 'Article.articleId',
        model: 'Article'
      })
      .populate('Client')
      .populate('Restaurateur')
      .populate('Delivery');

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNewOrders = async (req, res) => {
  try {
    const restaurateur = await Restaurateur.findOne({ID_user: req.params.id})

    const orders = await Order.find({Restaurateur: restaurateur._id, state: "new_order"}).populate('Client')

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.putNotifOff = async (req, res) => {
  try {
    const restaurateur = await Restaurateur.findOne({ ID_user: req.params.id });

    if (!restaurateur) {
      return res.status(404).json({ error: 'Restaurateur not found' });
    }

    await Order.updateMany(
      { Restaurateur: restaurateur._id, state: 'new_order' },
      { $set: { notif_res: false } }
    );

    const updatedOrders = await Order.find({ Restaurateur: restaurateur._id, state: 'new_order' });

    res.status(200).json(updatedOrders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({state: "ready_to_deliver"})
      .populate({
        path: 'Menu',
        populate: {
          path: 'menuId',
          populate: {
            path: 'Article',
            model: 'Article'
          },
          model: 'Menu'
        }
      })
      .populate({
        path: 'Article.articleId',
        model: 'Article'
      })
      .populate('Client')
      .populate('Restaurateur')
      .populate('Delivery');

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDeliveryTakenOrders = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ ID_user: req.params.id });
 
    const orders = await Order.find({state: ["in_delivery","order_complete"], Delivery: delivery._id })
      .populate({
        path: 'Menu',
        populate: {
          path: 'menuId',
          populate: {
            path: 'Article',
            model: 'Article'
          },
          model: 'Menu'
        }
      })
      .populate({
        path: 'Article.articleId',
        model: 'Article'
      })
      .populate('Client')
      .populate('Restaurateur')
      .populate('Delivery');

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getOrderUser = async (req, res) => {
  try {
    const orders = await Order.find().populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Delivery');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Delivery');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { price, del_price, state, notif_res, notif_cli, notif_del, Menu, Article, Client, Restaurateur, Delivery } = req.body;

    const updateData = {
      price,
      del_price,
      state,
      notif_res,
      notif_cli,
      notif_del,
      Client,
      Restaurateur,
      Delivery
    };

    if (Menu && Array.isArray(Menu)) {
      updateData.Menu = Menu.map(menu => ({ menuId: menu.menuId, quantity: menu.quantity }));
    }

    if (Article && Array.isArray(Article)) {
      updateData.Article = Article.map(article => ({ articleId: article.articleId, quantity: article.quantity }));
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.takeOrder = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ ID_user: req.params.id });
    const getOrder = await Order.findById(req.body.id);
    console.log(getOrder, req.body.id)
    if (!getOrder) return res.status(404).json({ error: 'Order not found' });
    if(getOrder.state=== "ready_to_deliver"){
      await Order.findByIdAndUpdate(req.body.id,{ Delivery: delivery._id, state: "in_delivery" });
    }

    
    res.status(200).json({ message: 'Order taken' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};