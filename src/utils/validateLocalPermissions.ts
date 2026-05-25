import { errors } from "@strapi/utils";

export const validateLocalPermissions = (user, localId) => {
  const localIdInt = Number(localId);
  if (!Number.isInteger(localIdInt)) {
    console.log("Local inválido");
    throw new errors.ApplicationError("Local inválido");
  }

  const roles = user.roles || [];

  const isSuperAdmin = roles.some(
    (role: any) => role.code === "strapi-super-admin",
  );

  if (isSuperAdmin) return;

  const hasLocalA = roles.some((role: any) => role.name === "local-a");
  const hasLocalB = roles.some((role: any) => role.name === "local-b");

  if (hasLocalA && localIdInt !== 1) {
    throw new errors.ApplicationError(
      "Usted no tiene permisos para grabar en ese local.",
    );
  }

  if (hasLocalB && localIdInt !== 2) {
    throw new errors.ApplicationError(
      "Usted no tiene permisos para grabar en ese local.",
    );
  }
};
