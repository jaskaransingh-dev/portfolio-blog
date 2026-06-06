/* eslint-disable @next/next/no-img-element */

export function ImageGrid({
  images,
  rounded = "rounded-xl",
}: {
  images: string[];
  rounded?: string;
}) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`overflow-hidden border border-border ${rounded}`}>
        <img
          src={images[0]}
          alt=""
          className="max-h-[520px] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`grid gap-1.5 overflow-hidden ${rounded} ${
        images.length === 2 ? "grid-cols-2" : "grid-cols-2"
      }`}
    >
      {images.slice(0, 4).map((url, i) => (
        <div
          key={url}
          className={`relative overflow-hidden border border-border ${
            images.length === 3 && i === 0 ? "row-span-2" : ""
          }`}
        >
          <img
            src={url}
            alt=""
            className="h-full max-h-80 w-full object-cover"
          />
          {i === 3 && images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-medium text-white">
              +{images.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
