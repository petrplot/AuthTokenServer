import { DataTypes, Model } from 'sequelize';
import User from './User.js';
import db from '../db.js';

class Contact extends Model {}

Contact.init(
  {
    name: { type: DataTypes.STRING(1024), allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'contact',
  }
);

User.hasMany(Contact);
Contact.belongsTo(User);

export default Contact;
