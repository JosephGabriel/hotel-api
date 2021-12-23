export const Query = {
  //Retorna um usúarios usando o ID como parâmetro
  async user(parent, { id }, { prisma }, info) {
    const users = await prisma.query.users({ where: { id } }, info);
    return users;
  },

  //Retorna todos os usúarios
  async users(parent, args, { prisma }, info) {
    const users = await prisma.query.users(args, info);
    return users;
  },

  //Retorna um usúario usando o ID como parâmetro
  async hotel(parent, { id }, { prisma }, info) {
    const hotel = await prisma.query.hotel({ where: { id } }, info);
    return hotel;
  },

  //Retorna todos os hóteis
  async hotels(parent, args, { prisma }, info) {
    const hotels = await prisma.query.hotels(args, info);
    return hotels;
  },
};
