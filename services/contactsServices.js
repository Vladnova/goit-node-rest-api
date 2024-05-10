import Contact from "../models/Contact.js";

export const listContacts = (options = {}) => {
  const { filter = {}, fields } = options;
  return Contact.find(filter, fields);
};

export const getContactById = (contactId) => Contact.findById(contactId);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (contactId, data) =>
  Contact.findByIdAndUpdate(contactId, data);
