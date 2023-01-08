import React from 'react';
import Dialog from '@my/components/atomic/Dialog';

import ShienkeikaRiyoushaSelectInputForm from './ShienkeikaRiyoushaSelectInputForm';

type ShienkeikaRiyoushaSelectFormProps = {
  id: string;
  operationAfterRiyoushaSelect: (openEdit: boolean) => void;
};

const ShienkeikaRiyoushaSelectForm: React.FC<ShienkeikaRiyoushaSelectFormProps> = (props: ShienkeikaRiyoushaSelectFormProps) => {
  const { id, operationAfterRiyoushaSelect } = props;

  // 戻るボタン押下時
  const handleClickReturn = () => {
    operationAfterRiyoushaSelect(false);
    console.log('戻るボタン押下');
  };

  // 次へボタン押下時
  const handleNextForm = () => {
    operationAfterRiyoushaSelect(true);
    console.log('次へボタン押下');
  };

  return (
    <Dialog open variant="edit-page" title="支援経過追加" onClickReturn={handleClickReturn} selfContentAndActions>
      <ShienkeikaRiyoushaSelectInputForm id={id} onNext={handleNextForm} />
    </Dialog>
  );
};

export default ShienkeikaRiyoushaSelectForm;
