'use client';

import ProfileBanner from '@/components/profile_banner/profile_banner';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/axios';
import { createUploadImageModal } from '@/components/upload_image_modal/create';
import { ProfileIcons } from '@/models/ProfileIcon';

// TODO: remove this later
const CURRENT_USER_ID = '66882ac39085ad43fb32ce05';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryIcon, setPrimaryIcon] = useState<ProfileIcons>();

  const handleUpdatePicture = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    async function displayUserProfileIcon() {
      try {
        const res = await axios.get(`/api/user/${CURRENT_USER_ID}`);
        const profileIcon = res.data.message.icon;
        if (profileIcon) {
          setPrimaryIcon(profileIcon);
        }
      } catch (err) {
        console.log(err);
      }
    }

    displayUserProfileIcon();
  }, []);

  const UploadImageModal = createUploadImageModal();

  return (
    <div className='w-full max-w-[600px] mt-[200px] mx-auto p-4'>
      <ProfileBanner
        profileIconSrc={primaryIcon?.path || ''}
        name='Jack Smith'
        handler='kingjack'
        title='Senior Product Designer'
        company={<><Image src='/webflow.png' width={18} height={18} alt='' className='inline' /> Webflow</>}
        pronounce='He/Him'
        nation='Canada'
        city='Vancouver'
        onUpdatePicture={handleUpdatePicture} />
      <UploadImageModal
        currentProfileIcon={primaryIcon}
        isOpen={isOpen}
        closeModal={closeModal}
        updatePrimaryIcon={setPrimaryIcon} />
    </div>
  );
}

