import { ctrlWrap } from "../decorators/ctrlWrap.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite  } = req.query;
  const skip = (page - 1) * limit;
  const params = { skip, limit };
  const { _id: owner } = req.user;
  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const totalCount = await contactsService.getCountContacts(filter);

  if (favorite) {
    filter.favorite = favorite;
  }

  const result = await contactsService.listContacts({
    filter,
    fields,
    params,
  });
  res.json({
    totalCount,
    result,
  });
};

const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const fields = "-createdAt -updatedAt";
  const filter = { _id, owner };
  const result = await contactsService.getContact({ filter, fields });
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContact({ _id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const newContact = req.body;
  const { _id: owner } = req.user;
  const { error } = createContactSchema.validate(newContact);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await contactsService.addContact({ ...newContact, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await contactsService.updateContact({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id =${id} not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const { error } = updateFavoriteContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Favorite field is required");
  }
  const { id } = req.params;
  const result = await contactsService.updateContact({ _id, owner }, req.body);
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
