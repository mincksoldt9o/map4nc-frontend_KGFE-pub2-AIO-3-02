import React from 'react';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import screenIDs from '@my/screenIDs';
import useDocumentTitle from '@my/hooks/useDocumentTitle';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import { FormContext, useForm } from 'react-hook-form';
import yup from '@my/yup';
import { Box } from '@material-ui/core';
import Assessment7 from './Assessment7';
import Assessment3 from './Assessment3';
import Assessment1 from './Assessment1';
import Schedule from './Schedule';
import Assessment2 from './Assessment2';
import Assessment4 from './Assessment4';
import Assessment61 from './Assessment6/Assessment61';
import Assessment62 from './Assessment6/Assessment62';
import Assessment65 from './Assessment6/Assessment65/Assessment65';
import Assessment5 from './Assessment5';
import { AssessmentMenuTabValueType } from './Common/utils';
import Assessment634 from './Assessment6/Assessment634';
import Assessment66 from './Assessment6/Assessment66';
import { CarePlanAssessment } from './AssessmentDataType';

const validationSchema = yup.object({
  statusAndProblem: yup.string(),
});

// アセスメント内のメニュータブ
const assessmentMenuTabs: Array<TabType> = [
  { id: 'ASSESSMENT1', label: '1', value: 'ASSESSMENT1', enabled: true },
  { id: 'ASSESSMENT2', label: '2', value: 'ASSESSMENT2', enabled: true },
  { id: 'ASSESSMENT3', label: '3', value: 'ASSESSMENT3', enabled: true },
  { id: 'ASSESSMENT4', label: '4', value: 'ASSESSMENT4', enabled: true },
  { id: 'ASSESSMENT5', label: '5', value: 'ASSESSMENT5', enabled: true },
  { id: 'ASSESSMENT61', label: '6①', value: 'ASSESSMENT61', enabled: true },
  { id: 'ASSESSMENT62', label: '6②', value: 'ASSESSMENT62', enabled: true },
  { id: 'ASSESSMENT634', label: '6③④', value: 'ASSESSMENT634', enabled: true },
  { id: 'ASSESSMENT65', label: '6⑤', value: 'ASSESSMENT65', enabled: true },
  { id: 'ASSESSMENT66', label: '6⑥', value: 'ASSESSMENT66', enabled: true },
  { id: 'ASSESSMENT7', label: '7', value: 'ASSESSMENT7', enabled: true },
  { id: 'SCHEDULE', label: 'ｽｹｼﾞｭｰﾙ', value: 'SCHEDULE', enabled: true },
];

/* TODO */
const defaultValues: CarePlanAssessment = {
  assessment1: {
    jiritsushienIryouJukyuushaUmuCheck: [],
    kinkyuuSameHonninCheck: [],
    ryouikuTechouCheck: [],
    seishinShougaishaHokenFukushiTechouCheck: [],
    shinshouTechouCheck: [],
    soudanSameHonninCheck: [],
    uketsukeCheck: [],
    youkaigoNinteiCheck: { misumi: false, sumi: true },
    zipCode: '5470034',
  },
};

const Assessment: React.FC = () => {
  useDocumentTitle(screenIDs.L1000_01);
  const [assessmentTabsValue, setAssessmentTabsValue] = React.useState<AssessmentMenuTabValueType>('ASSESSMENT1');
  const formMethods = useForm<CarePlanAssessment>({
    mode: 'onChange',
    defaultValues,
    validationSchema,
  });
  const { handleSubmit, reset, getValues } = formMethods;

  /** タブ切り替えの処理 */
  const handleChangeTab = (event: React.ChangeEvent<{}>, tabValue: AssessmentMenuTabValueType) => {
    console.log(getValues());
    /*  */
    reset(
      { ...defaultValues, assessment1: { zipCode: getValues('assessment1.zipCode') }, assessment2: { imageFile: getValues('assessment2.imageFile') } },
      { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false }
    );
    setAssessmentTabsValue(tabValue);
  };

  /* 登録ボタン押下  */
  const handleClickRegister = handleSubmit(async (data) => {
    await console.log(data);
  });

  return (
    <>
      {/* アセスメントタブ直下 */}

      {/* アセスメント内のメニュータブ */}
      <Tabs id="assessment-tabs" orientation="horizontal" value={assessmentTabsValue} tabs={assessmentMenuTabs} onChange={handleChangeTab} minWidth={60} />
      <FormContext {...formMethods}>
        <CareplanHeader id="yoboplan" riyoushaSeq={1} screenId={screenIDs.L1000_01.id} screenKbn="21000" screenName="アセスメント表">
          <Box m={2}>
            {assessmentTabsValue === 'ASSESSMENT1' && <Assessment1 id="assessment1" tabName="assessment1" />}
            {assessmentTabsValue === 'ASSESSMENT2' && <Assessment2 id="assessment2" tabName="assessment2" />}
            {assessmentTabsValue === 'ASSESSMENT3' && <Assessment3 id="assessment3" tabName="assessment3" />}
            {assessmentTabsValue === 'ASSESSMENT4' && <Assessment4 id="assessment4" tabName="assessment4" />}
            {assessmentTabsValue === 'ASSESSMENT5' && <Assessment5 id="assessment5" tabName="assessment5" onClickTab={setAssessmentTabsValue} />}
            {assessmentTabsValue === 'ASSESSMENT61' && <Assessment61 />}
            {assessmentTabsValue === 'ASSESSMENT62' && <Assessment62 />}
            {assessmentTabsValue === 'ASSESSMENT634' && <Assessment634 />}
            {assessmentTabsValue === 'ASSESSMENT65' && <Assessment65 />}
            {assessmentTabsValue === 'ASSESSMENT66' && <Assessment66 />}
            {assessmentTabsValue === 'ASSESSMENT7' && <Assessment7 />}
            {assessmentTabsValue === 'SCHEDULE' && <Schedule />}
          </Box>
        </CareplanHeader>
      </FormContext>
      <GeneralIconFloatingActionButton id="assessment-submit-button" icon="register" onClick={handleClickRegister}>
        登録
      </GeneralIconFloatingActionButton>
    </>
  );
};

export default Assessment;
