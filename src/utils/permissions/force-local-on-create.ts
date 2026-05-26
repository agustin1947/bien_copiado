import { errors } from "@strapi/utils";
const { ForbiddenError } = errors;
import { getUserLocalAccess } from "./get-user-local-access";

type ApplyLocalFilterOptions = {
  relationField?: string;
  actions?: StrapiDocumentAction[];
};

type StrapiDocumentAction =
  | "findMany"
  | "findOne"
  | "count"
  | "create"
  | "update"
  | "delete";

export async function forceLocalOnWrite(
  strapi,
  ctx,
  options: ApplyLocalFilterOptions = {}
) {

  const {
    relationField = "locales",
    actions = ["create", "update"],
  } = options;
  
  if (!actions.includes(ctx.action)) {
    return;
  }

  const access =
    await getUserLocalAccess(strapi);

  if (!access) {
    return;
  }

  const {
    isSuperAdmin,
    allowedLocalIds,
  } = access;
  console.log("ACCESS: ", access)
  /**
   * Super admin puede elegir
   */
  if (isSuperAdmin) {
    return;
  }

  /**
   * Sin permisos
   */
  if (allowedLocalIds.length === 0) {
    throw new ForbiddenError(
      "Usted no tiene permisos"
    );
  }

  /**
   * Forzar local
   */
  ctx.params.data[relationField] =
    allowedLocalIds;
}