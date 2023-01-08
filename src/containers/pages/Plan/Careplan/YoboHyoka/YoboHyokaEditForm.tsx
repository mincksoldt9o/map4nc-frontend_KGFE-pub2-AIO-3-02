import React from 'react';

import YoboHyokaInputForm, { getDefaultValue, YoboHyokaInputFormType } from './YoboHyokaInputForm';

type Props = {
  id: string;
};

const YoboHyokaEditForm: React.FC<Props> = (props: Props) => {
  const { id } = props;
  const defaultValues: YoboHyokaInputFormType = {
    yoboHyokaTableRows: getDefaultValue(),
    totalPolicy: '',
    regionalComprehensiveSupportCenterOpinion: '',
    planStatus: [],
    preventiveCare: [],
  };

  return <YoboHyokaInputForm id={`${id}-edit`} defaultValues={defaultValues} />;
};

export default YoboHyokaEditForm;
