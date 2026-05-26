import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import { factories } from "@strapi/strapi";
import { validateLocalPermissions } from "../../../../utils/validateLocalPermissions";

export default {
  async beforeCreate(event) {
    const { data } = event.params;
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;
    if (data.local.connect && data.local.connect.length > 0) {
      const localId = data.local.connect[0].id;
      validateLocalPermissions(user, localId);
    }

    (strapi as any).io.emit("refresh", "actualizado");
  },
  async afterCreate(event) {},
  beforeUpdate(event) {
    const { data } = event.params;
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    if (data.local.connect && data.local.connect.length > 0) {
      const localId = data.local.connect[0].id;
      validateLocalPermissions(user, localId);
    }
    (strapi as any).io.emit("refresh", "actualizado");
  },
};
