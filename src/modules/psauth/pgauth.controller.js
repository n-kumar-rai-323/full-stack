const authModel = require("../psauth/pgauth.model");

const create = async (req, res) => {
  const data = await authModel.createUser(
    req.body.name,
    req.body.email,
    req.body.password,
  );

  res.json({
    message: "created",
    data,
  });
};

const getAll = async (req, res) => {
  const data = await authModel.getAllUsers();
  res.json({ message: "all users", data });
};

module.exports = { create, getAll};
