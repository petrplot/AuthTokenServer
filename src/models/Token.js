import { DataTypes, Model } from 'sequelize';
import User from './User.js';
import db from '../db.js';

class Token extends Model {}

Token.init(
  {
    token: { type: DataTypes.STRING(1024), allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'token',
  }
);

User.hasOne(Token);
Token.belongsTo(User);

export default Token;
