export interface CmsArray<T> {
    includes: { Asset: CmsAsset[] };
    items: Array<{
        fields: T;
    }>;
    limit: number;
    skip: number;
    sys: SystemInfo;
    total: number;
}

export interface CmsAsset {
    fields: {
        title: string;
        description: string;
        file: CmsAssetFile;
    };
    sys: SystemInfo;
}

interface CmsAssetFile {
    contentType: string;
    fileName: string;
    url: string;
}

export interface SystemInfo {
    id: string;
    type: 'Link' | 'Array';
}