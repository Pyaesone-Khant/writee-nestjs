export const extractImageKey = (image: string) => {
  const key = image.split("/").slice(-1)[0];
  return key;
}