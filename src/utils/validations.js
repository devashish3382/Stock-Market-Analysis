const inputSchema = require('./../schemas/getTickingdata.json')
const validateInput = (req, res, next) => {
  const query_strings = req.query;
  const isValid = inputSchema.every((e) => query_strings[e]);
  if (!isValid) {
    res.status(400).send("Requested Data is incorrect");
  }
  next();
}

module.exports = { validateInput };