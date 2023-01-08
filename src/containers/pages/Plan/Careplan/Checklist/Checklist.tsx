import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import screenIDs from '@my/screenIDs';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import ChecklistAddForm from './ChecklistAddForm';
import ChecklistEditForm from './ChecklistEditForm';
import { ChecklistInputFormType } from './ChecklistInputForm';

export type Props = {
  id: string;
};

const Checklist: React.FC<Props> = (props: Props) => {
  const { id } = props;

  // const [mode, setMode] = useState<string>('edit');
  const [mode] = useState<string>('edit');

  const formMethods = useForm<ChecklistInputFormType>({
    mode: 'onChange',
    // validationSchema: checklistInputFormSchema, // FIXME: See Plan1.tsx as example.
  });

  return (
    <>
      <FormContext {...formMethods}>
        <CareplanHeader id={id} screenId={screenIDs.L1320_01.id} screenKbn="21320" screenName="基本チェックリスト" riyoushaSeq={1}>
          {mode === 'add' && <ChecklistAddForm id={id} />}
          {mode === 'edit' && <ChecklistEditForm id={id} />}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default Checklist;
