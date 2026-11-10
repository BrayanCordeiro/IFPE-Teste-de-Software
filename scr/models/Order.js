const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Processando'
  }
}, {
  tableName: 'orders',
  timestamps: true 
});

module.exports = Order;