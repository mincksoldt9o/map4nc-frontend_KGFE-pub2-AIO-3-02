import React, { useState } from 'react';
import Assessment1AddForm from '@my/containers/pages/Plan/Careplan/Assessment/Assessment1/Assessment1AddForm';
import Assessment1EditForm from '@my/containers/pages/Plan/Careplan/Assessment/Assessment1/Assessment1EditForm';

export type Props = {
  id: string;
  tabName: string;
};

const Assessment1: React.FC<Props> = (props: Props) => {
  const { id, tabName } = props;

  // const [mode, setMode] = useState<string>('edit');
  const [mode] = useState<string>('edit');

  return (
    <>
      {mode === 'add' && <Assessment1AddForm id={id} tabName={tabName} />}
      {mode === 'edit' && <Assessment1EditForm id={id} tabName={tabName} />}
    </>
  );
};

export default Assessment1;
