/**
 * ingreso controller
 */

import { factories } from '@strapi/strapi'
import type { UID } from '@strapi/types';

export default factories.createCoreController('api::ingreso.ingreso' as UID.ContentType);
