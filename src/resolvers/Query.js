export const Query = {
  //Retorna todos os usúarios
  async users(parent, args, { prisma }, info) {
    const users = await prisma.query.users(args, info);
    return users;
  },

  //Retorna um usúarios usando o ID como parâmetro
  async user(parent, { id }, { prisma }, info) {
    const users = await prisma.query.users({ where: id }, info);
    return users;
  },
};
