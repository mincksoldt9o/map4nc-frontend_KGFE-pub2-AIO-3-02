import React from 'react';
import Dialog from '@my/components/atomic/Dialog';

import ShienkeikaAddForm from './ShienkeikaAddForm';

type ShienkeikaFormProps = {
  id: string;
  setIsOpenModal: any;
  title: string;
  isKaigo: boolean;
  isYobou: boolean;
  isIkkatu: boolean;
};

const ShienkeikaForm: React.FC<ShienkeikaFormProps> = (props: ShienkeikaFormProps) => {
  const { id, setIsOpenModal, title, isKaigo, isYobou, isIkkatu } = props;

  // 戻るボタン押下時
  const handleClickReturn = () => {
    setIsOpenModal(false);
    console.log('戻るボタン押下');
  };

  return (
    <Dialog open variant="edit-page" title={title} onClickReturn={handleClickReturn} selfContentAndActions fullWidth>
      <ShienkeikaAddForm id={`${id}-add`} setIsOpenModal={setIsOpenModal} isKaigo={isKaigo} isYobou={isYobou} isIkkatu={isIkkatu} />
    </Dialog>
  );
};

export default ShienkeikaForm;
