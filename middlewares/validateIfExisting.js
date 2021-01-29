module.exports = (isExisting, label) => {
  return async (req, res, next) => {
    const dataAlreadyInDB = await isExisting(req);
    console.log(dataAlreadyInDB)
    if (dataAlreadyInDB) {
      return res.status(400).send({
        status: false,
        message: `${label} already exists`,
        data: null,
      });
    }
    next();
  };
};
