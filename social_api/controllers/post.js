import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;

  const token = req.cookies.accessToken;
  if (!token) res.status(401).send("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token is not valid");

    const q =
      userId !== "undefined"
        ? `SELECT P.*, u.Id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.Id = p.userId) WHERE p.userId = ?`
        : `SELECT P.*, u.Id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.Id = p.userId)
      LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
      ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) res.status(401).send("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token is not valid");

    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) res.status(401).send("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token is not valid");

    const q = "DELETE FROM posts WHERE `Id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
