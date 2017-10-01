let wrap = require('express-async-wrap');
const jwt = require('jsonwebtoken');

let authCheck = wrap(async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const token = req.headers.authorization;

  try {
    await jwt.verify(token, req.JWT_SECRET);
  } catch (err) {
    res.status(401).end();
  }

  next();

});

module.exports = authCheck;
