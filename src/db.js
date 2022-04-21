import { Sequelize } from 'sequelize';
import env from 'dotenv';
env.config();

export default new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '+00:00',
  define: {
    timestamps: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },
});
