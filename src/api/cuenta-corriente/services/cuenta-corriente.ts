/**
 * cuenta-corriente service
 */

import { factories } from '@strapi/strapi';
import type { UID } from '@strapi/types';

export default factories.createCoreService('api::cuenta-corriente.cuenta-corriente' as UID.CollectionType);
