import { getImageSource } from '.';

const remoteImageLoader = ({ src }: { src: string }) => {
  return getImageSource(src);
};

export default remoteImageLoader;
