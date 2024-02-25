import { contacts } from "../models/contactModel.js";

export async function listContacts(user) {
  try {
    const { _id } = user;
    const listOfCont = await contacts.find({ owner: _id });
    return listOfCont;
  } catch (err) {
    console.log(err);
  }
}

export async function getContactById(id, user) {
  try {
    const userId = user._id;
    const cont = await contacts.findOne({ _id: id, owner: userId });
    return cont;
  } catch (err) {
    console.log(err);
  }
}

export async function removeContact(contactId, user) {
  const { _id } = user;
  const result = await contacts
    .findOneAndDelete({ _id: contactId, owner: _id })
    .catch((err) => {
      console.log(err);
    });
  return result;
}

export async function addContact(body, user) {
  const { name, email, phone } = body;
  const { _id } = user;
  const contactBody = {
    name,
    email,
    phone,
    owner: _id,
  };
  const result = await contacts.create(contactBody);
  return result;
}
export async function putContact(id, body, user) {
  const { _id } = user;
  await contacts.findOneAndUpdate({ _id: id, owner: _id }, body);
  const result = await getContactById(id, user);
  return result;
}
export async function updateStatusContact(contactId, body, user) {
  const { _id } = user;
  await contacts
    .findOneAndUpdate({ _id: contactId, owner: _id }, body)
    .catch((err) => {
      return err;
    });
  const result = await getContactById(contactId, user);
  return result;
}
