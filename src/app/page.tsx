'use client';

import ProfileBanner from '@/components/profile_banner/profile_banner';
import Image from 'next/image';
import UploadImageModal from '@/components/upload_image_modal/upload_image_modal';
import { useCallback, useEffect, useState } from 'react';
import { AxiosError, AxiosProgressEvent } from 'axios';
import axios from '@/axios';
import { getImgSrc, getTotalSize } from '@/utils';
import { ImageListProps } from '@/components/image_list/image_list';
import { useImmer } from "use-immer";
import { ProfileIcons } from '@/models/ProfileIcon';

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageList, setImageList] = useImmer<ImageListProps>([]);

  const handleUpdatePicture = useCallback(() => setIsOpen(true), []);
  const handleOnClose = useCallback(() => setIsOpen(false), []);
  const createDeleteImageHandler = useCallback((i: number, id: string) => async () => {
    setImageList(draft => {
      draft.splice(i, 1);
      return draft;
    });
    await axios.delete(`api/profile-icons/${id}`).catch(err => {
      // TODO: show the error in a toast
      console.log(err);
    });
  }, [setImageList]);
  const createCancelUploadHandler = useCallback((i: number, controller: AbortController) => () => {
    setImageList(draft => {
      draft.splice(i, 1);
      return draft;
    });
    controller.abort('Cancel upload.');
  }, [setImageList]);
  const handleUploadImage = async (files: File[]) => {
    // read image baseUrls in parallel
    const sources = await getImgSrc(files);

    files.forEach((file, index) => {
      const i = imageList.length + index;
      const title = files[i].name;
      const imgSrc = sources[index] as string;
      const totalSize = getTotalSize(file.size);

      const controller = new AbortController();
      setImageList(draft => {
        draft[i] = {
          state: 'loading',
          id: title,
          title,
          imgSrc,
          totalSize,
          progress: 0,
          onCancelUpload: createCancelUploadHandler(i, controller)
        }
      });

      const formData = new FormData();
      formData.append('file', file);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          if (!total) { return }
          // use setState callback here to avoid stale state
          setImageList(draft => {
            if (draft[i].state === 'loading') {
              draft[i].progress = Math.round(loaded / total * 100);
            }
          });
        },
        signal: controller.signal
      }

      axios.post('/api/upload', formData, config).then(res => {
        setImageList(draft => {
          const item = draft[i]
          draft[i] = {
            state: 'load-success',
            id: title, // use titles as id
            title,
            totalSize,
            imgSrc,
            onDelete: createDeleteImageHandler(i, item.title)
          }
        });

        setTimeout(() => {
          setImageList(draft => {
            const item = draft[i];
            draft[i] = {
              state: 'complete',
              id: title,
              title,
              totalSize,
              imgSrc,
              onCropImage: () => { }, // TODO:
              onDelete: createDeleteImageHandler(i, item.title)
            };
          })
        }, 2000);
      }).catch(err => {
        console.log(err)

        if (err instanceof AxiosError) {
          setImageList(draft => {
            let error = err.response?.data.message;

            if (err.code === AxiosError.ERR_CANCELED) {
              error = 'The uploading process has been cancelled';
            }

            if (err.code === AxiosError.ERR_NETWORK) {
              error = 'An error occurred during the upload. Please check your network connection and try again.';
            }

            const item = draft[i];
            draft[i] = {
              state: 'error',
              id: title,
              title,
              totalSize,
              onDelete: () => setImageList(draft => {
                draft.splice(i, 1);
                return draft;
              }),
              error
            }
          })
        }
      });
    });
  };

  useEffect(() => {
    if (isOpen) {
      // TODO: handle data fetch issue UI
      axios.get('/api/profile-icons', {
        params: {
          userId: CURRENT_USER_ID
        }
      }).then(res => {
        console.log(res.data);
        setImageList(res.data.message.map(({ title, totalSizeInBytes, path }: ProfileIcons, i: number) => ({
          state: 'complete',
          id: title,
          title,
          totalSize: totalSizeInBytes,
          imgSrc: path,
          onCropImage: () => { }, // TODO:
          onDelete: createDeleteImageHandler(i, title)
        })))
      });
    }
  }, [createDeleteImageHandler, isOpen, setImageList]);

  return (
    <div className='w-full max-w-[600px] mt-[200px] mx-auto'>
      <ProfileBanner
        profileIconSrc='/avatar-jack.jpg'
        name='Jack Smith'
        handler='kingjack'
        title='Senior Product Designer'
        company={<><Image src='/webflow.png' width={18} height={18} alt='' className='inline' /> Webflow</>}
        pronounce='He/Him'
        nation='Canada'
        city='Vancouver'
        onUpdatePicture={handleUpdatePicture} />
      {isOpen && <UploadImageModal
        open={isOpen}
        allowMutiple={true}
        imageList={Array.from(imageList.values())}
        imageLimit={5}
        uploadFiles={handleUploadImage}
        onClose={handleOnClose}
      />}
    </div>
  );
}
