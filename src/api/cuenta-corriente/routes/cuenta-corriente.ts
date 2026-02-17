/**
 * cuenta-corriente router
 */

import { factories } from '@strapi/strapi';
import type { UID } from '@strapi/types';

export default factories.createCoreRouter('api::cuenta-corriente.cuenta-corriente' as UID.CollectionType);
