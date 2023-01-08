import React from 'react';

import Assessment1InputForm from '@my/containers/pages/Plan/Careplan/Assessment/Assessment1/Assessment1InputForm';

type Props = {
  id: string;
  tabName: string;
};

const Assessment1AddForm: React.FC<Props> = (props: Props) => {
  const { id, tabName } = props;

  return <Assessment1InputForm id={`${id}-add`} tabName={tabName} />;
};

export default Assessment1AddForm;
