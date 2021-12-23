import jwt from "jsonwebtoken";

export const signInToken = async (payload) => {
  const token = await jwt.sign({ id: payload }, "secret", {
    expiresIn: "2d",
  });

  return token;
};

export const verifyToken = async (header) => {
  const token = header.replace("Bearer ", "");
  const decoded = await jwt.verify(token, "secret");
  return decoded;
};
