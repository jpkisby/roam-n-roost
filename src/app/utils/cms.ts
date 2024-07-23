import { environment } from "../../environments/environment";

export const baseCmsUrl = `https://cdn.contentful.com/spaces/${environment.cmsSpaceId}/environments/master/entries?access_token=${environment.cmsToken}`;