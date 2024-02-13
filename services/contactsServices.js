import fs from "fs/promises"; 
import path from 'path';
import { nanoid } from 'nanoid'

const contactsPath = path.join('db', 'contacts.json');

export  async function listContacts() {
    try {
        const result = await fs.readFile(contactsPath);
        const listOfCont = JSON.parse(result)
        return listOfCont;
    } catch(err) {
        console.log(err);
  }
}

export  async function getContactById() {
  try {
      const result = await fs.readFile(contactsPath);
      const listOfCont = JSON.parse(result)
      return listOfCont;
    } catch(err) {
        console.log(err);
  }
}

export async function removeContact(contactId) {
    const result = await fs.readFile(contactsPath);
    const listOfCont = JSON.parse(result);
    const index = listOfCont.findIndex((el) => el.id === contactId)
    if (index === -1) {
        return null
    }
    const newList = listOfCont.splice(index, 1);
    fs.writeFile(contactsPath, JSON.stringify(listOfCont))
    return newList
}

export async function addContact(body) {
    const { name, email, phone } = body;
    const contact = {
        id: nanoid(),
        name,
        email,
        phone,
    }
    const result = await fs.readFile(contactsPath);
    const listOfCont = JSON.parse(result);
    listOfCont.push(contact);
    fs.writeFile(contactsPath, JSON.stringify(listOfCont))
    return contact;
}
export async function putContact(body, id) {
    const result = await fs.readFile(contactsPath);
    const listOfCont = JSON.parse(result);
    const cont = listOfCont.find((el) => el.id === id)
    const index = listOfCont.findIndex((el) => el.id === id)
    if (index === -1) {
        return null
    }
    for (const key in cont) {
            if (body[key] !== undefined) {
                cont[key] = body[key]
            }
    }
    const newList = listOfCont.splice(index, 1, cont);
    fs.writeFile(contactsPath, JSON.stringify(listOfCont))
    return newList;
}