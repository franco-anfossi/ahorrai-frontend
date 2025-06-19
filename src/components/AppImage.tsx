import React from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}: ImageProps): React.JSX.Element {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/assets/images/no_image.png"
      }}
      {...props}
    />
  );
}

export default Image; 