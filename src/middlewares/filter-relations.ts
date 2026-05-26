import { ROLE_LOCAL_MAP } from "../utils/permissions/role-local-map";
import { obtainUserForMiddleware } from "../utils/permissions/obtain-user-for-middleware"

export default (config: any, { strapi }: { strapi: typeof global.strapi }) => {
  return async (ctx, next) => {
    if (
      ctx.url.includes(
        "/content-manager/relations/api::producto.producto/locales",
      ) || ctx.url.includes(
        "/content-manager/relations/api::venta.venta/local",
      ) || ctx.url.includes(
        "/content-manager/relations/api::caja-diaria.caja-diaria/local",
      ) || ctx.url.includes(
        "/content-manager/relations/api::gasto-diario.gasto-diario/local",
      ) || ctx.url.includes(
        "/content-manager/relations/api::cuenta-corriente.cuenta-corriente/local",
      ) 
    ) {

      const user = await obtainUserForMiddleware(strapi, ctx)  
      //console.log("ADMIN USER:");
      //console.log(user);

      if (!user) {
        return null;
      }
 
      const roles = user.roles || [];
      //console.log("ROLES: ", roles);
      const isSuperAdmin = roles.some(
        (role) => role.code === "strapi-super-admin",
      );
      //console.log("IS SUPER ADMIN: ", isSuperAdmin);

      const allowedLocalIds = roles
        .map((role) => ROLE_LOCAL_MAP[role.name])
        .filter((id): id is number => Boolean(id));

      //console.log("allowedLocalIds: ", allowedLocalIds);

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
