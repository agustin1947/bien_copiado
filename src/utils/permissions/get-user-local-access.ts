import { errors } from "@strapi/utils";
import { ROLE_LOCAL_MAP } from "./role-local-map";

const { ForbiddenError } = errors;

export async function getUserLocalAccess(strapi) {
  const requestContext = strapi.requestContext.get();

  const user = requestContext?.state?.user;

  if (!user) {
    return null;
  }

  const roles = user.roles || [];

  const isSuperAdmin = roles.some((role) => role.code === "strapi-super-admin");

  const allowedLocalIds = roles
    .map((role) => ROLE_LOCAL_MAP[role.name])
    .filter((id): id is number => Boolean(id));

  return {
    user,
    roles,
    isSuperAdmin,
    allowedLocalIds,
  };
  
}
