import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = useCallback((
    message: string,
    title?: string,
    type: 'error' | 'success' | 'warning' | 'info' = 'info'
  ) => {
    setModal({
      isOpen: true,
      title: title || (type === 'error' ? 'Atenção' : 'Aviso'),
      message,
      type,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    modal,
    showModal,
    closeModal,
  };
}

