import React from 'react';

import ShienkeikaInputForm from './ShienkeikaInputForm';

type ShienkeikaAddFormProps = {
  id: string;
  setIsOpenModal: any;
  isKaigo: boolean;
  isYobou: boolean;
  isIkkatu: boolean;
};

const ShienkeikaAddForm: React.FC<ShienkeikaAddFormProps> = (props: ShienkeikaAddFormProps) => {
  const { id, setIsOpenModal, isKaigo, isYobou, isIkkatu } = props;

  // 登録ボタン押下時
  const handleSubmitForm = () => {
    setIsOpenModal(false);
    console.log('登録ボタン押下');
  };

  return <ShienkeikaInputForm id={id} onSubmit={handleSubmitForm} isKaigo={isKaigo} isYobou={isYobou} isIkkatu={isIkkatu} />;
};

export default ShienkeikaAddForm;
