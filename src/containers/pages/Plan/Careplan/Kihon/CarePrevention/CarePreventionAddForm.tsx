import React from 'react';

import CarePreventionInputForm, { CarePreventionInputFormType } from './CarePreventionInputForm';

type Props = {
  id: string;
};

const CarePreventionAddForm: React.FC<Props> = (props: Props) => {
  const { id } = props;
  const defaultValues: CarePreventionInputFormType = {};

  return <CarePreventionInputForm id={`${id}-add`} defaultValues={defaultValues} />;
};

export default CarePreventionAddForm;
