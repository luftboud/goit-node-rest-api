import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  putContact,
  removeContact,
  updateStatusContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const user = req.user;
  const contacts = await listContacts(user);
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const cont = await getContactById(id, user);
  if (cont === undefined || !cont) {
    res.status(404).json({
      msg: "Not found!!",
    });
  } else {
    res.status(200).json(cont);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const removedContact = await removeContact(id, user);
  if (removedContact === null || removedContact === undefined) {
    res.status(404).json({
      msg: "Not found!!",
    });
  } else {
    res.status(200).json(removedContact);
  }
};

export const createContact = async (req, res) => {
  const contactBody = req.body;
  const user = req.user;
  const validation = createContactSchema.validate(contactBody);
  if (validation.error) {
    res.status(400).json({
      msg: validation.error.message,
    });
  } else {
    const contact = await addContact(contactBody, user);
    res.status(201).json(contact);
  }
};

export const updateContact = async (req, res) => {
  const contactBody = req.body;
  const validation = updateContactSchema.validate(contactBody);
  if (validation.error) {
    res.status(400).json({
      msg: validation.error.message,
    });
  } else if (
    contactBody.name === undefined &&
    contactBody.email === undefined &&
    contactBody.phone === undefined
  ) {
    res.status(400).json({
      msg: "Body must have at least one field",
    });
  } else {
    const contactId = req.params.id;
    const user = req.user;
    const newContact = await putContact(contactId, contactBody, user);
    if (newContact === null) {
      res.status(404).json({
        msg: "Not found!",
      });
    } else {
      res.status(201).json(newContact);
    }
  }
};

export const patchContacts = async (req, res) => {
  const contactBody = req.body;
  const validation = updateStatusSchema.validate(contactBody);
  if (validation.error) {
    res.status(400).json({
      msg: validation.error.message,
    });
  } else {
    const contactId = req.params.id;
    const user = req.user;
    const cont = await updateStatusContact(contactId, contactBody, user);
    if (cont === undefined || !cont) {
      res.status(404).json({
        msg: "Not found!!",
      });
    } else {
      res.status(200).json(cont);
    }
  }
};
