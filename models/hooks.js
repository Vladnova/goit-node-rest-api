export const handlerSaveError = (error, data, next) => {
  const { name, code } = error;

  error.status = name === "MongoServerError" && code === 1100 ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
