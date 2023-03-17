import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = `SELECT followerUserId FROM relationships where followedUserId = ?`;

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res
      .status(200)
      .send(data.map((realationship) => realationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) res.status(401).send("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).send("Token is not valid");

    const q =
      "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";

    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "socialsecretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};
