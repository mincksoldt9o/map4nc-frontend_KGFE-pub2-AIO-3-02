import React from 'react';

import ChecklistInputForm, { ChecklistInputFormType } from './ChecklistInputForm';

type Props = {
  id: string;
};

const ChecklistAddForm: React.FC<Props> = (props: Props) => {
  const { id } = props;
  const defaultValues: ChecklistInputFormType = {
    checklist1: ['0'],
    checklist2: ['0'],
    checklist3: ['0'],
    checklist4: ['0'],
    checklist5: ['0'],
    checklist6: ['0'],
    checklist7: ['0'],
    checklist8: ['0'],
    checklist9: ['0'],
    checklist10: ['0'],
    checklist11: ['0'],
    checklist12: ['0'],
    checklist13: ['0'],
    checklist14: ['0'],
    checklist15: ['0'],
    checklist16: ['0'],
    checklist17: ['0'],
    checklist18: ['0'],
    checklist19: ['0'],
    checklist20: ['0'],
    checklist21: ['0'],
    checklist22: ['0'],
    checklist23: ['0'],
    checklist24: ['0'],
    checklist25: ['0'],
  };

  return <ChecklistInputForm id={`${id}-add`} defaultValues={defaultValues} />;
};

export default ChecklistAddForm;
