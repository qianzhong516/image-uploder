// up to `MB`
export function getTotalSize(sizeInBytes: number) {
  if (sizeInBytes < 1000) {
    return `${sizeInBytes}B`;
  }

  if (sizeInBytes < 1000 * 1000) {
    return `${Math.round(sizeInBytes / 1000)}KB`;
  }

  return `${Math.round(sizeInBytes / 1000 / 1000)}MB`;
}

// In order to read files in parallel, we create one fileReader for each file,
// because one fileReader can only process one file at a time.
export async function getImgSrc(files: File[]) {
  const results: (string | ArrayBuffer | null)[] = [];

  return await new Promise<(string | ArrayBuffer | null)[]>((res) => {
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        results[i] = reader.result;
        if (files.length === results.length) {
          res(results);
        }
      };
      // TODO: file process error handling
      reader.readAsDataURL(file);
    });
  });
}

export function getFileExt(fileName: string) {
  const match = fileName.match(/.(png|jpeg|jpg)$/);

  if (!match) {
    throw new Error('The file has no matched extension.');
  }

  return match[1];
}

export function getImageSource(relativePath: string) {
  return `https://imageuploader516.s3.eu-north-1.amazonaws.com/${relativePath}`;
}
