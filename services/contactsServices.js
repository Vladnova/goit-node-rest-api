import Contact from "../models/Contact.js";

export const listContacts = (options = {}) => {
  const { filter = {}, fields = "", params = {} } = options;
  return Contact.find(filter, fields, params).populate(
    "owner",
    "email subscription"
  );
};

export const getContact = ({ filter = {}, fields = "" }) =>
  Contact.findOne(filter, fields).populate("owner", "email subscription");

export const getCountContacts = (filter) => Contact.countDocuments(filter);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);
