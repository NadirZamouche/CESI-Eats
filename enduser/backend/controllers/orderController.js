const Order = require('../models/Order');
const Client = require('../models/Client'); // Make sure to update the path as necessary
exports.createOrder = async (req, res) => {
  try {
    const {cartItems, total} = req.body;
    const clientIDUser = req.params.id; // Assuming the ID_user of the client is sent as a URL parameter

    // Find the client's _id using the ID_user
    const client = await Client.findOne({ ID_user: clientIDUser });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Group cart items by restaurateur
    const orders = {};
    cartItems.forEach(item => {
      const restaurateurId = item.restaurateur._id;
      if (!orders[restaurateurId]) {
        orders[restaurateurId] = {
          price: 0,
          state: 'new_order',
          del_price: 200,
          notif_res: true,
          notif_cli: false,
          notif_del: false,
          Menu: [],
          Article: [],
          Client: client._id,
          Restaurateur: restaurateurId
        };
      }

      if (item.type === 'menu') {
        orders[restaurateurId].Menu.push({
          menuId: item._id,
          quantity: item.quantity
        });
        orders[restaurateurId].price += item.price * item.quantity;
      } else if (item.type === 'article') {
        orders[restaurateurId].Article.push({
          articleId: item._id,
          quantity: item.quantity
        });
        orders[restaurateurId].price += item.price * item.quantity;
      }
    });

    // Convert the orders object to an array
    const orderArray = Object.values(orders);

    // Save orders to the database
    const savedOrders = await Order.insertMany(orderArray);

    res.status(200).json(savedOrders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Livreur');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('Menu').populate('Article').populate('Client').populate('Restaurateur').populate('Livreur');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
exports.getOrdersByClient = async (req, res) => {
  try {
    const client = await Client.findOne({ID_user: req.params.id})

    const orders = await Order.find({Client: client._id})
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
