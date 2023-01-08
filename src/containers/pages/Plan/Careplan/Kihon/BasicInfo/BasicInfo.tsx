import React from 'react';
import BasicInfoAddForm from './BasicInfoAddForm';
import BasicInfoEditForm from './BasicInfoEditForm';

export type Props = {
  id: string;
  defaultData: any;
  mode?: string;
};

const BasicInfo: React.FC<Props> = (props: Props) => {
  const { id, defaultData, mode } = props;

  return (
    <>
      {mode === 'add' && <BasicInfoAddForm id={id} defaultData={defaultData} />}
      {mode === 'edit' && <BasicInfoEditForm id={id} defaultData={defaultData} />}
    </>
  );
};

export default BasicInfo;
