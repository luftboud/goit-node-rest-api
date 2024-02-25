import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  patchContacts,
} from "../controllers/contactsControllers.js";
import { isValidId } from "../middlewares/isValidId.js";
import { auth } from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", isValidId, auth, getOneContact);

contactsRouter.delete("/:id", isValidId, auth, deleteContact);

contactsRouter.post("/", auth, createContact);

contactsRouter.put("/:id", isValidId, auth, updateContact);

contactsRouter.patch("/:id/favorite", isValidId, auth, patchContacts);

export default contactsRouter;
