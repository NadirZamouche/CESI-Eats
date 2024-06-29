const { users } = require('../SQLmodels');

exports.create = async (req, res) => {
    try {
        const role = req.originalUrl.split('/')[1]; // Extract the role from the URL
        const { first_name, last_name, phone, email, password, state } = req.body;
        const user = await users.create({ first_name, last_name, phone, email, password, role, state });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const user = await users.findAll();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const user = await users.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status500().json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const role = req.originalUrl.split('/')[1]; // Extract the role from the URL
        const { first_name, last_name, phone, email, password, state } = req.body;
        const [updated] = await users.update({ first_name, last_name, phone, email, password, role, state }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await users.findByPk(req.params.id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await users.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
