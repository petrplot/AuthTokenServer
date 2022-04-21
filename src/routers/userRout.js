import Router from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = new Router();

router.post('/reg', UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/re', UserController.refreshTokens);
router.get('/', authMiddleware, UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.delete('/:id', UserController.removeUser);
router.put('/update', UserController.updateUser);

export default router;
