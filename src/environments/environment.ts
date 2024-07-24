import { Environment } from "./environment.types";

export const environment: Environment = {
    cmsSpaceId: process.env['CMS_SPACE_ID'] ?? '',
    cmsToken: process.env['CMS_TOKEN'] ?? '',
}