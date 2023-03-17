import { db } from "../connect.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = ({ body }, res) => {
  // CHECK USER IF EXISTS
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [body.username], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length) return res.status(409).send("User already exists!");

    // CREATE A NEW USER
    // HASH THE PASWORD
    const salt = bycrypt.genSaltSync(10);
    const hashedPassword = bycrypt.hashSync(body.password, salt);

    const q =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";

    const values = [body.username, body.email, hashedPassword, body.name];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send("User created succuessfuly.");
    });
  });
};

export const login = ({ body }, res) => {
  const q = "SELECT * FROM users where username = ?";

  db.query(q, [body.username], (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (data.length === 0) return res.status(404).send("User not found");

    const checkPassword = bycrypt.compareSync(body.password, data[0].password);

    if (!checkPassword)
      return res.status(400).send("Wrong password or username");

    const token = jwt.sign({ id: data[0].Id }, "socialsecretkey");
    const { password, ...other } = data[0];

    console.log(data[0].Id);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .send("User has been logged out.");
};
