import { PlanRiyoushaKihonInfo } from 'maps4nc-frontend-web-api/dist/lib/model';
import React from 'react';

import CurrentMedicalHistoryInputForm from './CurrentMedicalHistoryInputForm';

type Props = {
  id: string;
  defaultValues?: PlanRiyoushaKihonInfo;
};

const CurrentMedicalHistoryEditForm: React.FC<Props> = (props: Props) => {
  const { id, defaultValues } = props;

  return <CurrentMedicalHistoryInputForm id={`${id}-edit`} defaultValues={defaultValues?.kihonKioureki} />;
};

export default CurrentMedicalHistoryEditForm;
