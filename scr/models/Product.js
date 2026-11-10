const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  category: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  glow: { 
    type: DataTypes.STRING, 
    defaultValue: 'var(--primary)' 
  }
}, {
  tableName: 'products',
  timestamps: true 
});

module.exports = Product;