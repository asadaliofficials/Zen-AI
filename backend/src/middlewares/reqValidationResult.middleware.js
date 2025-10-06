// middlewares/validate.js
const { validationResult } = require('express-validator');

export const reqValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      mess
    });
  }
  next(); // go to controller
};
