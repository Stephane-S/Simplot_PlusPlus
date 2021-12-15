export declare type Image = HTMLImageElement;
export declare type ImageLoaderOptions = {
    loaded?: (image: Image) => void;
    failed?: () => void;
    attempts?: number;
    timeout?: number;
};
export declare class ImageLoader {
    private _image;
    promise: Promise<Image>;
    constructor(url: string, options?: ImageLoaderOptions);
    private _finished;
    get finished(): boolean;
    get image(): Image;
}
