const mongoose = require('mongoose');

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send({status: false, message: 'Invalid Id', data: null});
    
  next();
  
}