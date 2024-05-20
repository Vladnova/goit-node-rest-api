import HttpError from "../helpers/HttpError.js";

export const isEmptyBody = (req, _, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(404, "Body must have at least one key"));
  }

  next();
};
