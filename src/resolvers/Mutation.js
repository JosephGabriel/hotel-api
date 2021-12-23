import { AuthenticationError, UserInputError } from "apollo-server-errors";
import slugify from "slugify";

import { comparePassword, hashPassword } from "../utils/password";
import { signInToken, verifyToken } from "../utils/token";

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
    data.password = await hashPassword(data.password);

    //Exclui o campo de confirmação senha
    delete data.passwordConfirm;

    //Criação do usúario
    const user = await prisma.mutation.createUser({ data });

    //Criação do token
    const token = await signInToken(user.id);

    return {
      user,
      token,
    };
  },

  async updateUser(parent, { data }, { prisma, headers }, info) {
    const token = await verifyToken(headers);

    const user = await prisma.query.user({ where: { id: token.id } });

    if (!user) {
      throw new AuthenticationError("Este usúario não é válido");
    }

    const updatedUser = await prisma.mutation.updateUser({
      data,
      where: { id: token.id },
    });

    const updatedToken = await signInToken(user.id);

    return {
      token: updatedToken,
      user: updatedUser,
    };
  },

  async createHotel(parent, { data }, { prisma, headers }, info) {
    const token = headers.replace("Bearer ", "");

    const admin = await prisma.query.user({ where: { id: token } });

    if (!admin || !admin.verified || !admin.active) {
      throw new AuthenticationError("Este administrador não é válido");
    }

    console.log(data);

    data.slug = slugify(data.name.trim(), { lower: true });

    const hotel = await prisma.mutation.createHotel({ data });

    return hotel;
  },
};
