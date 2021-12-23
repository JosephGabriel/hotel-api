import { UserInputError } from "apollo-server-errors";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const comparePassword = async (password, userPassword) => {
  const result = await bcrypt.compare(password, userPassword);
  return result;
};

export const verifyPassword = async (data) => {
  if (data.password !== data.passwordConfirm) {
    throw new UserInputError("As senhas não coincidem");
  }

  if (data.password.length < 8 || data.passwordConfirm.length < 8) {
    throw new UserInputError(
      "As senhas deve ser maior ou igual a 8 caracteres"
    );
  }

  //Fazer o hash da senha
  data.password = await hashPassword(data.password);

  //Exclui o campo de confirmação senha
  delete data.passwordConfirm;

  return data;
};
