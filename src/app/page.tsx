'use client';

import ProfileBanner from '@/components/profile_banner/profile_banner';
import Image from 'next/image';
import UploadImageModal from '@/components/upload_image_modal/upload_image_modal';
import { useCallback, useState } from 'react';
import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import { getImgSrc, getTotalSize } from '@/utils';
import { ImageListProps } from '@/components/image_list/image_list';
import { useImmer } from "use-immer";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageList, setImageList] = useImmer<ImageListProps>([]);

  const handleUpdatePicture = useCallback(() => setIsOpen(true), []);
  const handleOnClose = useCallback(() => setIsOpen(false), []);
  const handleUploadImage = async (files: File[]) => {
    // append pending processes in UI
    const sources = await getImgSrc(files);
    const imagesInUpload: ImageListProps = files.map((file, i) => {
      return {
        id: file.name,
        title: file.name,
        imgSrc: sources[i] as string,
        totalSize: getTotalSize(file.size),
        state: 'loading',
        progress: 0,
        onCancelUpload: () => { } // TODO:
      }
    });
    setImageList(draft => draft.concat(imagesInUpload));

    // upload files
    files.forEach((file, index) => {
      const i = imageList.length + index;
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
        }
      }

      axios.post('http://localhost:3000/api/upload', formData, config).then(res => {
        setImageList(draft => {
          const item = draft[i]
          if (item.state === 'loading') {
            draft[i] = {
              state: 'load-success',
              id: item.title, // use titles as id
              title: item.title,
              totalSize: item.totalSize,
              imgSrc: item.imgSrc,
              onDelete: () => { } // TODO:
            }
          }
        });

        setTimeout(() => {
          setImageList(draft => {
            const item = draft[i];
            if (item.state === 'load-success') {
              draft[i] = {
                state: 'complete',
                id: item.title,
                title: item.title,
                totalSize: item.totalSize,
                imgSrc: item.imgSrc,
                onCropImage: () => { }, // TODO:
                onDelete: () => { } // TODO:
              };
            }
          })
        }, 2000);
      }).catch(err => {
        if (err instanceof AxiosError) {
          setImageList(draft => {
            let error = err.response?.data.message;

            if (err.code === AxiosError.ERR_NETWORK) {
              error = 'An error occurred during the upload. Please check your network connection and try again.';
            }

            const item = draft[i];
            draft[i] = {
              state: 'error',
              id: item.title,
              title: item.title,
              totalSize: item.totalSize,
              onDelete: () => { }, // TODO:
              error
            }
          })
        }
      });
    });
  };

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
