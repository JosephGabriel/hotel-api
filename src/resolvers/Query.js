export const Query = {
  async users(parent, args, { prisma }, info) {
    const users = await prisma.query.users(args, info);
    return users;
  },
};
