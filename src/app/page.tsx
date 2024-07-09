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

const IMAGE_UPLOAD_LIMIT = 5;

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageList, setImageList] = useImmer<ImageListProps>([]);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleUpdatePicture = useCallback(() => setIsOpen(true), []);
  const handleOnClose = useCallback(() => setIsOpen(false), []);
  const handleOnConfirm = async () => {
    setIsOpen(false);
    await axios.put(`api/user/${CURRENT_USER_ID}`, {
      data: {
        profileIconTitle: selectedOption
      }
    });
  };

  const createDeleteImageHandler = useCallback((fileName: string) => async () => {
    setImageList(draft => draft.filter(d => d.title !== fileName));
    await axios.delete(`api/profile-icons/${fileName}`).catch(err => {
      // TODO: show the error in a toast
      console.log(err);
    });
  }, [setImageList]);

  const createCancelUploadHandler = useCallback((fileName: string, controller: AbortController) => () => {
    setImageList(draft => draft.filter(d => d.title !== fileName));
    controller.abort('Cancel upload.');
  }, [setImageList]);

  const handleUploadImage = async (files: File[]) => {
    // read image baseUrls in parallel
    const sources = await getImgSrc(files);

    files.forEach((file, index) => {
      const i = imageList.length + index;
      const title = files[index].name; // TODO: deal with duplicate file name
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
          onCancelUpload: createCancelUploadHandler(title, controller)
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
            onDelete: createDeleteImageHandler(item.title)
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
              onChangeSelection: (e) => setSelectedOption(e.target.value),
              onCropImage: () => { }, // TODO:
              onDelete: createDeleteImageHandler(item.title)
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

            draft[i] = {
              state: 'error',
              id: title,
              title,
              totalSize,
              onDelete: () => setImageList(draft => draft.filter(d => d.title !== title)),
              error
            }
          })
        }
      });
    });
  };

  useEffect(() => {
    if (isOpen) {
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
          onChangeSelection: (e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedOption(e.target.value),
          onCropImage: () => { }, // TODO:
          onDelete: createDeleteImageHandler(title),
        })))
      }).catch(_ => {
        setHasFetchError(true);
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
        error={imageList.length >= IMAGE_UPLOAD_LIMIT ? 'reachedLimit' : hasFetchError ? 'dataFetch' : undefined}
        uploadFiles={handleUploadImage}
        onClose={handleOnClose}
        onConfirm={handleOnConfirm}
      />}
    </div>
  );
}
