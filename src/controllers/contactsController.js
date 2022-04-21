import Contact from '../models/Contact.js';

class ContactsController {
  async createContact(req, res, next) {
    try {
      const { name, phone, userId } = req.body;
      const contact = await Contact.create({ name, phone, userId });
      return res.json(contact);
    } catch (e) {
      next(e);
    }
  }

  async getContacts(req, res, next) {
    try {
      const { userId } = req.query;
      const contacts = await Contact.findAll({ where: { userId } });
      return res.json(contacts);
    } catch (e) {
      next(e);
    }
  }

  async removeContact(req, res, next) {
    try {
      const { id } = req.params;
      const contact = await Contact.destroy({ where: { id } });
      return res.json(contact);
    } catch (e) {
      next(e);
    }
  }

  async updateContact(req, res, next) {
    try {
      const { name, phone } = req.body;
      const { id } = req.params;
      const contact = await Contact.update({ name, phone }, { where: { id } });
      return res.json(contact);
    } catch (e) {
      next(e);
    }
  }
}

export default new ContactsController();
