import React from 'react';

import CarePreventionInputForm, { CarePreventionInputFormType } from './CarePreventionInputForm';

type Props = {
  id: string;
};

const CarePreventionEditForm: React.FC<Props> = (props: Props) => {
  const { id } = props;
  const defaultValues: CarePreventionInputFormType = {
    visitCategory1: ['0'],
    visitCategory2: ['0'],
    personalSituation: ['0'],
  };

  return <CarePreventionInputForm id={`${id}-edit`} defaultValues={defaultValues} />;
};

export default CarePreventionEditForm;
