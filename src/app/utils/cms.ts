import { environment } from "../../environments/environment";
import { CmsAsset } from "../types/cms.types";
import { Asset } from "../types/common.types";

export const baseCmsUrl = `https://cdn.contentful.com/spaces/${environment.cmsSpaceId}/environments/master`;
export const entryCmsUrl = `${baseCmsUrl}/entries?access_token=${environment.cmsToken}`;

export function cmsAssetToAsset(cmsAsset: CmsAsset): Asset {
    return {
        url: cmsAsset.fields.file.url,
        description: cmsAsset.fields.description,
        contentType: cmsAsset.sys.type
    }
}