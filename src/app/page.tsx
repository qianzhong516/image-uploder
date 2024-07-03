'use client';

import ProfileBanner from '@/components/profile_banner/profile_banner';
import Image from 'next/image';
import UploadImageModal from '@/components/upload_image_modal/upload_image_modal';
import { useCallback, useState } from 'react';
import { ImageItemProps } from '@/components/image_list/image_item';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageListMap, setImageListMap] = useState<Map<string, {
    id: string,
  } & ImageItemProps>>(new Map());

  const hadnleUpdatePicture = useCallback(() => setIsOpen(true), []);
  const handleOnClose = useCallback(() => setIsOpen(false), []);
  const handleUploadImage = async (files: File[]) => {

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
        onUpdatePicture={hadnleUpdatePicture} />
      {isOpen && <UploadImageModal
        open={isOpen}
        allowMutiple={true}
        imageList={Array.from(imageListMap.values())}
        imageLimit={5}
        uploadFiles={handleUploadImage}
        onClose={handleOnClose}
      />}
    </div>
  );
}
