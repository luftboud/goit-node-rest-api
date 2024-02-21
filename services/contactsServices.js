

import { contacts } from "../models/contactModel.js";


export async function listContacts() {
  try {
    const listOfCont = await contacts.find({});
    return listOfCont;
  } catch (err) {
    console.log(err);
  }
}

export async function getContactById(id) {
  try {
    const cont = await contacts.findById(id);
    return cont;
  } catch (err) {
    console.log(err);
  }
}

export async function removeContact(contactId) {
  const result = await contacts.findByIdAndDelete(contactId).catch((err) => {
    console.log(err);
  });
  return result;
}

export async function addContact(body) {
  const result = await contacts.create(body);
  return result;
}
export async function putContact(id, body) {
  await contacts.findByIdAndUpdate(id, body);
  const result = await getContactById(id);
  return result;
}
export async function updateStatusContact(contactId, body) {
  await contacts.findByIdAndUpdate(contactId, body).catch((err) => {
    return err;
  });
  const result = await getContactById(contactId);
  return result;
}