module.exports = (isExisting, label) => {
  return async (req, res, next) => {
    if (req.method === "PUT") next()
    const dataAlreadyInDB = await isExisting(req);
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
