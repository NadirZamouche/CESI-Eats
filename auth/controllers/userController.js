const { users } = require('../SQLmodels');
const Restaurateur = require('../models/Restaurateur');
const Client = require('../models/Client');
const Delivery = require('../models/Delivery');

exports.update = async (req, res) => {
    try {
        const { first_name, last_name, phone, email, state, address, sponsorship_code_used, name } = req.body;
        const usertoUpdate = await users.findByPk(req.params.id);
        // Update the user details
        if (usertoUpdate) {
            console.log(state)
            if(first_name || last_name || phone || email || state===false || state===true || address){
                const updated = await users.update({ first_name, last_name, phone, email, state }, {
                    where: { id: req.params.id }
                });
                console.log(updated)
            }
        

            // Update role-specific details
            switch (usertoUpdate.role) {
                case 'restaurateur':
                    await Restaurateur.findOneAndUpdate({ ID_user: req.params.id },{ address, sponsorship_code_used, name });
                    break;
                case 'enduser':
                    await Client.findOneAndUpdate({ ID_user: req.params.id },{ address, sponsorship_code_used });
                    break;
                case 'delivery':
                    await Delivery.findOneAndUpdate({ ID_user: req.params.id },{ sponsorship_code_used });
                    break;
                
            }

            res.status(200).json({ message: "Edit successful"});
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    try {
        const userToDelete = await users.findByPk(req.params.id);
        
        if (userToDelete) {
            // Delete the user from the users table
            await users.destroy({
                where: { id: req.params.id }
            });

            // Delete the associated role-specific record
            switch (userToDelete.role) {
                case 'restaurateur':
                    await Restaurateur.deleteOne({ ID_user: req.params.id });
                    break;
                case 'enduser':
                    await Client.deleteOne({ ID_user: req.params.id });
                    break;
                case 'delivery':
                    await Delivery.deleteOne({ ID_user: req.params.id });
                    break;
            }

            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await users.findByPk(req.params.id);
        
        if (user) {
            let roleDetails;
            switch (user.role) {
                case 'restaurateur':
                    roleDetails = await Restaurateur.findOne({ ID_user: req.params.id });
                    break;
                case 'enduser':
                    roleDetails = await Client.findOne({ ID_user: req.params.id });
                    break;
                case 'delivery':
                    roleDetails = await Delivery.findOne({ ID_user: req.params.id });
                    break;
                default:
                    roleDetails = []
            }

            res.status(200).json({ user, roleDetails });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.findAll();
        
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};