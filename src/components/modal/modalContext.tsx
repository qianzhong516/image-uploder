'use client'

import { createContext, SetStateAction, useState } from 'react';

export type ModalKey = 'uploadImage' | 'imageCrop';

export const ModalContext = createContext<{
    /**
     * Save keys of open modals into an array. Whether a modal should stack on top of
     * the others depends on whether its key is the last item of the array.
     * See usage in '@/components/modal/modal.tsx'.
     */
    modals: ModalKey[],
    updateModals: React.Dispatch<SetStateAction<ModalKey[]>>
}>({
    modals: [],
    updateModals: () => { }
});

export default function ModalContextProvider({ children }: { children: React.ReactNode }) {
    const [modals, setModals] = useState<ModalKey[]>([]);

    return (
        <ModalContext.Provider value={{ modals, updateModals: setModals }}>
            {children}
        </ModalContext.Provider>
    )
}