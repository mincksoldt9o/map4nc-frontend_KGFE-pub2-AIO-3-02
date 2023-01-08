import React from 'react';

import BasicInfoInputForm from './BasicInfoInputForm';

type Props = {
  id: string;
  defaultData: any;
};

const BasicInfoEditForm: React.FC<Props> = (props: Props) => {
  const { id, defaultData } = props;

  return <BasicInfoInputForm id={`${id}-edit`} defaultValues={defaultData} />;
};

export default BasicInfoEditForm;
