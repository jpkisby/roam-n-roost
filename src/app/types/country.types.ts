import { SystemInfo } from "./cms.types";
import { Asset } from "./common.types";

export interface Country {
    id: string;
    name: string;
    heroLarge: Asset | null;
}

export interface CmsCountry {
    id: string;
    name: string;
    heroLarge: { sys: SystemInfo; };
}