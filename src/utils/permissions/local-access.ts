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

export async function applyLocalFilter(
  strapi,
  ctx,
  options: ApplyLocalFilterOptions = {},
) {
  const { relationField = "locales", actions = ["findMany", "count"] } =
    options;
  if (!actions.includes(ctx.action)) {
    return;
  }
  
  const access = await getUserLocalAccess(strapi);
  
  if (!access) {
    return;
  }

  const { isSuperAdmin, allowedLocalIds } = access;

  if (isSuperAdmin) {
    return;
  }

  if (allowedLocalIds.length === 0) {
    throw new ForbiddenError("Usted no tiene permisos");
  }
  console.log("relationField: ", relationField)
  console.log("allowedLocalIds: ", allowedLocalIds)
  ctx.params.filters = {
    ...ctx.params.filters,

    [relationField]: {
      id: {
        $in: allowedLocalIds,
      },
    },
  };
}
