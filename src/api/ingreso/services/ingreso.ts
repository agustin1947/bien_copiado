/**
 * ingreso service
 */

import { factories } from '@strapi/strapi';
import type { UID } from '@strapi/types';

export default factories.createCoreService('api::ingreso.ingreso' as UID.ContentType);
