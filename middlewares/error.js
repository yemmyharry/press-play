
module.exports = (winston) => {
  return function (err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send('Something failed.')
  }
}
