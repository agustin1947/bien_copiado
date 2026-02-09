/**
 * ingreso router
 */

import { factories } from '@strapi/strapi';
import type { UID } from '@strapi/types';

export default factories.createCoreRouter('api::ingreso.ingreso' as UID.ContentType);
