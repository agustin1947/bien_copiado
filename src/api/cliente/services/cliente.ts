/**
 * cliente service
 */

import { factories } from '@strapi/strapi';
import type { UID } from '@strapi/types';

export default factories.createCoreService('api::cliente.cliente' as UID.ContentType);
