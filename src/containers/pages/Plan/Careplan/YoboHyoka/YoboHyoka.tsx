import screenIDs from '@my/screenIDs';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import YoboHyokaAddForm from './YoboHyokaAddForm';
import YoboHyokaEditForm from './YoboHyokaEditForm';

export type Props = {
  id: string;
};

const YoboHyoka: React.FC<Props> = (props: Props) => {
  const { id } = props;

  // const [mode, setMode] = useState<string>('edit');
  const [mode] = useState<string>('edit');

  const formMethods = useForm({
    mode: 'onChange',
    // validationSchema: yoboHyokaInputFormSchema, // FIXME: See Plan1.tsx as example.
  });

  return (
    <>
      <FormContext {...formMethods}>
        <CareplanHeader id={id} screenId={screenIDs.L1370_01.id} screenName="介護予防支援・サービス評価表" screenKbn="21370" riyoushaSeq={1}>
          {mode === 'add' && <YoboHyokaAddForm id={id} />}
          {mode === 'edit' && <YoboHyokaEditForm id={id} />}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default YoboHyoka;
