import { PlanRiyoushaKihonInfo } from 'maps4nc-frontend-web-api/dist/lib/model';
import React from 'react';
import CurrentMedicalHistoryAddForm from './CurrentMedicalHistoryAddForm';
import CurrentMedicalHistoryEditForm from './CurrentMedicalHistoryEditForm';

export type Props = {
  id: string;
  defaultData?: PlanRiyoushaKihonInfo;
  mode?: string;
};

const CurrentMedicalHistory: React.FC<Props> = (props: Props) => {
  const { id, defaultData, mode } = props;

  return (
    <>
      {mode === 'add' && <CurrentMedicalHistoryAddForm id={id} defaultValues={defaultData} />}
      {mode === 'edit' && <CurrentMedicalHistoryEditForm id={id} defaultValues={defaultData} />}
    </>
  );
};

export default CurrentMedicalHistory;
