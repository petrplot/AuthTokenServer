import Router from 'express';
import userRout from './userRout.js';
import contactsRout from './contactsRout.js';
const router = new Router();

router.use('/user', userRout);

router.use('/contacts', contactsRout);

export default router;
