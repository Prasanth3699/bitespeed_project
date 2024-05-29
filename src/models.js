"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// Initialize Sequelize
const sequelize = new sequelize_1.Sequelize('postgres://postgres:postgres@localhost:5432/postgres');
exports.sequelize = sequelize;
// Define Contact class
class Contact extends sequelize_1.Model {
}
exports.Contact = Contact;
// Initialize Contact model
Contact.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: sequelize_1.DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Contact',
    timestamps: false,
});
