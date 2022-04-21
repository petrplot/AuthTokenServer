import { DataTypes, Model } from 'sequelize';
import db from '../db.js';

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
  },
  {
    sequelize: db,
    modelName: 'user',
  }
);

export default User;
