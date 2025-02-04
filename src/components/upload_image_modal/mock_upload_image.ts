export function uploadFileToServer(files: File[]) {
  const job = new Subscriber();
  const completed = new Set();
  const progress = new Map();

  const errors = files
    .map((file) => isFileValid(file))
    .filter(Boolean);

  const validFiles = files.filter(
    (file) => isValidName(file) && isValidSize(file)
  );
  validFiles.forEach((file) => {
    progress.set(file.name, { loaded: 0, totalSize: file.size });
  });

  const timerId = setInterval(() => {
    // wait for job events to be subscribed during the first interval
    job.publish('error', errors);
    validFiles.forEach((file) => {
      const chunkSize = 1024 * 10;
      const p = progress.get(file.name);
      if (
        !completed.has(file.name) &&
        p.totalSize <= p.loaded + chunkSize
      ) {
        progress.set(file.name, {
          loaded: file.size,
          totalSize: file.size,
        });
        completed.add(file.name);
        job.publish('complete', file.name);
      } else {
        progress.set(file.name, {
          loaded: p.loaded + chunkSize,
          totalSize: file.size,
        });
      }
    });
    job.publish('uploading', progress);
    if (completed.size === validFiles.length) {
      clearInterval(timerId);
    }
  }, 1000);

  return job;
}

const isValidSize = (file: File) => file.size <= 5 * 1000 * 1000;
const isValidName = (file: File) =>
  file.name.match(/\.(png|jpg|jpeg)$/i);

function isFileValid(file: File) {
  if (!isValidName(file)) {
    return {
      fileName: file.name,
      error: `The file format of ${file.name} is not supported. Please upload an image in one of the following formats: JPG or PNG.`,
    };
  }
  if (!isValidSize(file)) {
    return {
      fileName: file.name,
      error: `This image is larger than 5MB. Please select a smaller image.`,
    };
  }
}

class Subscriber {
  constructor(
    private map: Map<string, ((...args: any[]) => void)[]> = new Map()
  ) {}

  on(event: string, handler: (...args: any[]) => void) {
    if (this.map.has(event)) {
      this.map.get(event)!.push(handler);
    } else {
      this.map.set(event, [handler]);
    }
  }

  publish(event: string, ...args: any[]) {
    if (this.map.has(event)) {
      this.map.get(event)!.forEach((handler) => handler(...args));
    }
  }
}
