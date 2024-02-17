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
  const contacts = await listContacts();
  console.log(contacts);
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const cont = await getContactById(id);
  if (cont === undefined) {
    res.status(404).json({
      msg: "Not found!!",
    });
  } else {
    res.status(200).json(cont);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const removedContact = await removeContact(id);
  console.log(removedContact);
  if (removedContact === null) {
    res.status(404).json({
      msg: "Not found!!",
    });
  } else {
    res.status(200).json(removedContact);
  }
};

export const createContact = async (req, res) => {
  const contactBody = req.body;
  const validation = createContactSchema.validate(contactBody);
  if (validation.error) {
    res.status(400).json({
      msg: validation.error.message,
    });
  } else {
    const contact = await addContact(contactBody);
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
    const newContact = await putContact(contactId, contactBody);
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
    const cont = await updateStatusContact(contactId, contactBody);
    if (cont === undefined) {
      res.status(404).json({
        msg: "Not found!!",
      });
    } else {
      res.status(200).json(cont);
    }
  }
};
