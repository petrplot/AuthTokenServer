import Router from 'express';
import contactsController from '../controllers/contactsController.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = new Router();

router.post('/', authMiddleware, contactsController.createContact);
router.get('/', authMiddleware, contactsController.getContacts);
router.delete('/:id', authMiddleware, contactsController.removeContact);
router.put('/:id', authMiddleware, contactsController.updateContact);

export default router;
