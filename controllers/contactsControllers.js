import { ctrlWrap } from "../decorators/ctrlWrap.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts({
    fields: "-createdAt -updatedAt",
  });
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const newContact = req.body;
  const { error } = createContactSchema.validate(newContact);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await contactsService.addContact(newContact);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { error } = updateFavoriteContactSchema.validate(req.body);
  if (error) {
    throw HttpError(404, "Not found");
  }
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

export const contactsControllers = {
  getAllContacts: ctrlWrap(getAllContacts),
  getOneContact: ctrlWrap(getOneContact),
  deleteContact: ctrlWrap(deleteContact),
  createContact: ctrlWrap(createContact),
  updateContact: ctrlWrap(updateContact),
  updateStatusContact: ctrlWrap(updateStatusContact),
};
