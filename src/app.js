import Express from 'express';
import cors from 'cors';
import router from './routers/index.js';
import sequelize from './db.js';
import errorMiddleware from './middleware/error.middleware.js';
const app = Express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use(Express.json());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log('server working in port', port));
  } catch (e) {
    console.log(e);
  }
};

start();
