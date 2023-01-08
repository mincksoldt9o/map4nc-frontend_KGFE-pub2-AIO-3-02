import React from 'react';
import CarePreventionAddForm from './CarePreventionAddForm';
import CarePreventionEditForm from './CarePreventionEditForm';

export type Props = {
  id: string;
  mode?: string;
};

const CarePrevention: React.FC<Props> = (props: Props) => {
  const { id, mode } = props;

  return (
    <>
      {mode === 'add' && <CarePreventionAddForm id={id} />}
      {mode === 'edit' && <CarePreventionEditForm id={id} />}
    </>
  );
};

export default CarePrevention;
