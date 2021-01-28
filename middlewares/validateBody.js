module.exports = (validator) => {
  return async (req, res, next) => {
    const { error } = await validator(req.body);
    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
        data: null,
      });
    }
    next();
  };
};
