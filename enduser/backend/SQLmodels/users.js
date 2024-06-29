module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('commercial', 'delivery', 'developer', 'enduser', 'restaurateur', 'technical'),
            allowNull: false,
            validate: {
                isIn: [['commercial', 'delivery', 'developer', 'enduser', 'restaurateur', 'technical']]
            }
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        engine: 'InnoDB',
        indexes: [
            {
                unique: true,
                fields: ['email', 'role']
            }
        ]
    });

    return users;
};
