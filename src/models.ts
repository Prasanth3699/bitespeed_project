import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

// Define ContactAttributes interface
interface ContactAttributes {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: 'primary' | 'secondary';
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

// Define creation attributes
interface ContactCreationAttributes extends Optional<ContactAttributes, 'id'> {}

// Define Contact class
class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
    public id!: number;
    public phoneNumber?: string;
    public email?: string;
    public linkedId?: number;
    public linkPrecedence!: 'primary' | 'secondary';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public deletedAt!: Date | null;
}

// Initialize Contact model
Contact.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Contact',
    timestamps: false,
});

export { sequelize, Contact };
