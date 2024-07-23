export interface CmsArray<T> {
    includes: CmsAsset[];
    items: Array<{
        fields: T;
    }>;
    limit: number;
    skip: number;
    sys: {
        type: "Array";
    };
    total: number;
}

interface CmsAsset {
    title: string;
    description: string;
    file: CmsAssetFile;
}

interface CmsAssetFile {
    contentType: string;
    fileName: string;
    url: string;
}