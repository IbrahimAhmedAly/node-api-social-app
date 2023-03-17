import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM users where Id = ?`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).send(err);
    const { password, ...others } = data[0];
    return res.status(200).send(others);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

export const getSuggestedUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) res.status(401).send("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token is not valid");

    const q = `SELECT * FROM users WHERE Id != ?`;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });
};
