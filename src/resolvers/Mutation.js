import { AuthenticationError, UserInputError } from "apollo-server-errors";
import slugify from "slugify";
import { verifyPassword, comparePassword } from "../utils/password";
import { signInToken, verifyToken } from "../utils/token";

export const Mutation = {
  //Faz login do usúario
  async loginUser(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });

    const passwordResult = await comparePassword(data.password, user.password);

    if (!passwordResult || !user) {
      throw new AuthenticationError("Credenciais inválidas");
    }

    const token = await signInToken(user.id);

    return {
      token,
      user,
    };
  },

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

    //Validação da senha
    data = await verifyPassword(data);

    //Criação do usúario
    const user = await prisma.mutation.createUser({ data });

    //Criação do token
    const token = await signInToken(user.id);

    return {
      user,
      token,
    };
  },

  //Atualiza informação não sensiveis
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

  //Atualiza senha do usúario
  async updatedUserPassword(parent, { data }, { prisma, headers }, info) {
    const token = await verifyToken(headers);

    const user = await prisma.query.user({ where: { id: token.id } });

    if (!user) {
      throw new AuthenticationError("Este usúario não é válido");
    }

    data = await verifyPassword(data);

    const updatedUser = await prisma.mutation.updateUser({
      data: {
        ...data,
        passwordChangedAt: new Date(),
      },
      where: { id: token.id },
    });

    const updatedToken = await signInToken(user.id);

    return {
      token: updatedToken,
      user: updatedUser,
    };
  },

  async deleteUser(parent, args, { prisma, headers }, info) {
    const token = await verifyToken(headers);

    const user = await prisma.query.user({ where: { id: token.id } });

    if (!user) {
      throw new AuthenticationError("Este usúario não é válido");
    }

    const deletedUser = await prisma.mutation.updateUser(
      {
        data: {
          active: false,
        },
        where: { id: token.id },
      },
      info
    );

    return deletedUser;
  },

  //Cria um hotel
  async createHotel(parent, { data }, { prisma, headers }, info) {
    const token = await verifyToken(headers);

    const admin = await prisma.query.user({ where: { id: token.id } });

    if (!admin || !admin.verified || !admin.active) {
      throw new AuthenticationError("Este administrador não é válido");
    }

    data.slug = slugify(data.name.trim(), { lower: true });

    const hotel = await prisma.mutation.createHotel({ data }, info);

    return hotel;
  },
};
