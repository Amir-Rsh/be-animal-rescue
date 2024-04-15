const { postRescue, fetchRescues } = require("./app.models");

const addRescue = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await postRescue(data);
    res.status(201).send({});
  } catch (error) {
    next(error);
  }
};

const getRescues = async (req, res, next) => {
  try {
    const { name } = req.query;

    const rescues = await fetchRescues(name);
    res.status(200).send({ rescues });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRescue, getRescues };
