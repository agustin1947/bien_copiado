export async function obtainUserForMiddleware(strapi, ctx) {
  const authorization = ctx.request.header.authorization;

  if (!authorization) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");

  const decoded = await strapi.admin.services.token.decodeJwtToken(token);

  return await strapi.db.query("admin::user").findOne({
    where: {
      id: decoded.payload.id,
    },

    populate: ["roles"],
  });

}
