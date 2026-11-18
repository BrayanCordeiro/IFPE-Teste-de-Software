const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Offer = sequelize.define('Offer', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  originalPrice: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  discount: { 
    type: DataTypes.STRING, 
    defaultValue: '-0%' 
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
  tableName: 'offers',
  timestamps: true // Cria as colunas createdAt e updatedAt automaticamente
});

module.exports = Offer;