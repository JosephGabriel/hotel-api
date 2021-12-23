import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-errors";

export const signInToken = async (payload) => {
  const token = await jwt.sign({ id: payload }, "secret", {
    expiresIn: "2d",
  });

  return token;
};

export const verifyToken = async (header) => {
  try {
    const token = header.replace("Bearer ", "");

    const decoded = await jwt.verify(token, "secret");

    console.log(decoded);

    return decoded;
  } catch (error) {
    throw new AuthenticationError("Token inválido");
  }
};
