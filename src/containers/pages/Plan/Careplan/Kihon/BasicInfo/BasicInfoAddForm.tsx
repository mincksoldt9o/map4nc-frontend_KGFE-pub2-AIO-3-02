import React from 'react';

import BasicInfoInputForm from './BasicInfoInputForm';

type Props = {
  id: string;
  defaultData: any;
};

const BasicInfoAddForm: React.FC<Props> = (props: Props) => {
  const { id, defaultData } = props;

  return <BasicInfoInputForm id={`${id}-add`} defaultValues={defaultData} />;
};

export default BasicInfoAddForm;
