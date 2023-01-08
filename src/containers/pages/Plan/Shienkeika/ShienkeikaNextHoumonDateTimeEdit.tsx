import React from 'react';
import Dialog from '@my/components/atomic/Dialog';

import ShienkeikaNextHoumonDateTimeInputForm from './ShienkeikaNextHoumonDateTimeInputForm';

type ShienkeikaNextHoumonDateTimeEditProps = {
  id: string;
  setIsOpenModal: any;
};

const ShienkeikaNextHoumonDateTimeEdit: React.FC<ShienkeikaNextHoumonDateTimeEditProps> = (props: ShienkeikaNextHoumonDateTimeEditProps) => {
  const { id, setIsOpenModal } = props;

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
    <Dialog open variant="simple" title="次回訪問日時設定" onClickReturn={handleClickReturn} selfContentAndActions>
      <ShienkeikaNextHoumonDateTimeInputForm id={`${id}-edit`} onSubmit={handleSubmitForm} />
    </Dialog>
  );
};

export default ShienkeikaNextHoumonDateTimeEdit;
