# Image Uploader

This is an image uploader widget that provides functions such as displaying, uploading and editing images. The images are saved in a remote storage (S3 bucket).

You can only upload 5 images at max in total.

## Tech Stack

NextJS, Typescript, Storybook, MongoDB, S3 bucket

## Learnings

- Deploy providers such as heroku or vercel are serverless, which means that they do not have a file system, hence `fs` is not a viable option for saving files with those hosting providers.
- Image urls are auto generated by loaders in next/image. It requires configurations in loaders with a remote storage. This can be either done globally in `next.config.json` or in per instance.
- In @aws-sdk, [the upload progress event is only triggered _progressively_ when the file is read as streaming inputs as opposed to being a single big chunk](https://github.com/aws/aws-sdk-js/issues/1945#issuecomment-367936328).
- Animation related - `Transition` of headless/ui works better than React Transition Group with NextJS.
- Tailwind is a totally new tool to me, I learnt a bunch while playing with it:
  - Any CSS class cannot include interpolated values or it would not take effect.
  - While there are conflicting classes, use `twMerge` from tailwind-merge to override.
- I gave up on writing my own image cropper component because it was too difficult. Instead, I discovered this awesome libraray called cropperjs. I had a read through the entire library to do the style customisations and it also helped me greatly on understanding the arithmatics inside so I can figure out how to use its APIs correctly to do the cropping function in my app.
