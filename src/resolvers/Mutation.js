import { ApolloError } from "apollo-server-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    //Validação
    const userExists = await prisma.exists.User({ email: data.email });

    if (userExists) {
      throw new ApolloError("Este email já esta em uso", 401);
    }

    const userNameExists = await prisma.exists.User({
      username: data.username,
    });

    if (userNameExists) {
      throw new ApolloError("Este nome de usúario já esta em uso", 401);
    }

    if (data.password !== data.passwordConfirm) {
      throw new ApolloError("As senhas não coincidem", 401);
    }

    if (data.password.length < 8 || data.passwordConfirm.length < 8) {
      throw new ApolloError(
        "As senhas deve ser maior ou igual a 8 caracteres",
        401
      );
    }

    //Fazer o hash da senha
    data.password = await bcrypt.hash(data.password, 10);

    //Exclui o campo de confirmação senha
    delete data.passwordConfirm;

    //Criação do usúario
    const user = await prisma.mutation.createUser({ data });

    //Criação do token
    const token = await jwt.sign({ id: user.id }, "secret");

    return {
      user,
      token,
    };
  },
};
