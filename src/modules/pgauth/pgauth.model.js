// const { pgPool } = require("../../config/pg");

// const createUser = async (name, email, password) => {
//     const result = await pgPool.query(
//         "INSERT INTO users(name, email, password) VALUES ($1,$2,$3) RETURNING *",
//         [name, email, password]
//     );

//     return result.rows[0];
// };
// const getAllUsers = async()=>{
//     const result = await pgPool.query("SELECT * FROM users");
//     return result.rows;
// }

// module.exports = { createUser, getAllUsers };