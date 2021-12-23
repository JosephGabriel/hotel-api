import { ApolloError, UserInputError } from "apollo-server-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Mutation = {
  //Cria um usúario
  async createUser(parent, { data }, { prisma }, info) {
    //Validação
    const userExists = await prisma.exists.User({ email: data.email });

    if (userExists) {
      throw new UserInputError("Este email já esta em uso");
    }

    const userNameExists = await prisma.exists.User({
      username: data.username,
    });

    if (userNameExists) {
      throw new UserInputError("Este nome de usúario já esta em uso");
    }

    if (data.password !== data.passwordConfirm) {
      throw new UserInputError("As senhas não coincidem");
    }

    if (data.password.length < 8 || data.passwordConfirm.length < 8) {
      throw new UserInputError(
        "As senhas deve ser maior ou igual a 8 caracteres"
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

  async createHotel(parent, { data }, { prisma, headers }, info) {
    const hotel = await prisma.mutation.createHotel();
  },
};
