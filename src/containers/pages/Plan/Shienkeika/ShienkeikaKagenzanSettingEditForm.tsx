import React from 'react';
import Dialog from '@my/components/atomic/Dialog';

import ShienkeikaKagenzanSettingInputForm from './ShienkeikaKagenzanSettingInputForm';

/** TODO: z9999-11 へ変更する */

type ShienkeikaKagenzanSettingEditFormProps = {
  id: string;
  setIsOpenModal: any;
  isKaigo: boolean;
  isYobou: boolean;
  isIkkatu: boolean;
  editServiceKindValue?: string;
};

const getFormTitle = (isIkkatu: boolean) => {
  let riyoushaName = '';
  if (isIkkatu) {
    riyoushaName = '(日本　一郎)';
  }
  return `加減算設定 ${riyoushaName}`;
};

const ShienkeikaKagenzanSettingEditForm: React.FC<ShienkeikaKagenzanSettingEditFormProps> = (props: ShienkeikaKagenzanSettingEditFormProps) => {
  const { id, setIsOpenModal, isKaigo, isYobou, isIkkatu, editServiceKindValue } = props;

  // 戻るボタン押下時
  const handleClickReturn = () => {
    setIsOpenModal(false);
    console.log('戻るボタン押下');
  };

  // 登録ボタン押下時
  const handleSubmitForm = () => {
    setIsOpenModal(false);
    console.log('登録ボタン押下');
  };

  return (
    <Dialog open variant="simple" maxWidth="lg" title={getFormTitle(isIkkatu)} onClickReturn={handleClickReturn} selfContentAndActions fullWidth fullHeight>
      <ShienkeikaKagenzanSettingInputForm id={id} onSubmit={handleSubmitForm} isKaigo={isKaigo} isYobou={isYobou} isIkkatu={isIkkatu} editServiceKindValue={editServiceKindValue} />
    </Dialog>
  );
};

export default ShienkeikaKagenzanSettingEditForm;
