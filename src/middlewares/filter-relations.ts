import { ROLE_LOCAL_MAP } from "../utils/permissions/role-local-map";

export default (config: any, { strapi }: { strapi: typeof global.strapi }) => {
  return async (ctx, next) => {
    if (
      ctx.url.includes(
        "/content-manager/relations/api::producto.producto/locales",
      )
    ) {
      const authorization = ctx.request.header.authorization;

      if (!authorization) {
        return next();
      }

      const token = authorization.replace("Bearer ", "");

      const decoded = await strapi.admin.services.token.decodeJwtToken(token);

      const user = await strapi.db.query("admin::user").findOne({
        where: {
          id: decoded.payload.id,
        },

        populate: ["roles"],
      });

      console.log("ADMIN USER:");
      console.log(user);

      if (!user) {
        return null;
      }

      const roles = user.roles || [];
      console.log("ROLES: ", roles);
      const isSuperAdmin = roles.some(
        (role) => role.code === "strapi-super-admin",
      );
      console.log("IS SUPER ADMIN: ", isSuperAdmin);

      const allowedLocalIds = roles
        .map((role) => ROLE_LOCAL_MAP[role.name])
        .filter((id): id is number => Boolean(id));

      console.log("allowedLocalIds: ", allowedLocalIds);

      if (!isSuperAdmin) {
        ctx.query.filters = {
          id: {
            $in: allowedLocalIds,
          },
        };
      }
    }

    await next();
  };
};
