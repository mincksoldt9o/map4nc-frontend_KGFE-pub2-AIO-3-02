import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router';
import styled from 'styled-components';

import MUIButton from '@material-ui/core/Button';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';
import KengenUtils from '@my/utils/KengenUtils';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { Box } from '@material-ui/core';
import CustomGrid from '@my/containers/pages/Plan/Careplan/CustomGrid';
import KengenWrapper from '@my/containers/organisms/KengenWrapper/KengenWrapper';

import Assessment from '@my/containers/pages/Plan/Careplan/Assessment';
import Plan1 from '@my/containers/pages/Plan/Careplan/Plan1';
import Kaigi from '@my/containers/pages/Plan/Careplan/Kaigi';
import Plan2 from '@my/containers/pages/Plan/Careplan/Plan2';
// import Kaigi from '@my/containers/pages/Plan/Careplan/Kaigi';
import Monitoring from '@my/containers/pages/Plan/Careplan/Monitoring';
import WeeklyPlan from '@my/containers/pages/Plan/Careplan/WeeklyPlan';
import IconButton from '@my/components/atomic/IconButton';
import SettingIcon from '@my/components/icon/SettingIcon';
import OutputSettingDialog from '@my/containers/pages/Plan/Careplan/OutputSettingDialog';
import { useTypedSelector, RootState } from '@my/stores';
import { useOpenOutputSetting } from '@my/action-hooks/plan/careplan';

const StyledButton = styled(MUIButton)`
  color: #0044cc;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  display: inline;
  margin: 0;
  padding: 0;
` as typeof MUIButton;

type Props = {
  parentPath: string;
  riyoushaSeq: number;
  handleHeaderBreadcrumbClick: () => void;
};

type RouteParams = {
  tabId?: string;
};

const RiyoushaCarePlanKaigo: React.FC<Props> = (props: Props) => {
  const { parentPath, riyoushaSeq, handleHeaderBreadcrumbClick } = props;

  const history = useHistory();

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const openOutputSetting = useOpenOutputSetting();
  const kengenPath = getLoginKengenInfo(['plan', 'careplan', 'kaigo']);

  // 各タブの権限状態 : permission status of each tab
  const readableAssessment = KengenUtils.isReadable(kengenPath[screenIDs.L1000_01.id]);
  const readablePlan1 = KengenUtils.isReadable(kengenPath[screenIDs.L1210_01.id]);
  // const readableKaigi = KengenUtils.isReadable(kengenPath[screenIDs.L1210_01.id]);
  const readablePlan2 = KengenUtils.isReadable(kengenPath[screenIDs.L1220_01.id]);
  const readableWeeklyplan = KengenUtils.isReadable(kengenPath[screenIDs.L1230_01.id]);
  const readableKaigi = KengenUtils.isReadable(kengenPath[screenIDs.L1240_01.id]);
  const readableMonitoring = KengenUtils.isReadable(kengenPath[screenIDs.L1260_01.id]);

  // 初期選択状態 : Initial selection state
  let defaultSelectPageKey = '';
  if (readableAssessment) {
    defaultSelectPageKey = 'assessment';
  } else if (readablePlan1) {
    defaultSelectPageKey = 'plan1';
  } else if (readablePlan2) {
    defaultSelectPageKey = 'plan2';
  } else if (readableWeeklyplan) {
    defaultSelectPageKey = 'weeklyplan';
  } else if (readableKaigi) {
    defaultSelectPageKey = 'kaigi';
  } else if (readableMonitoring) {
    defaultSelectPageKey = 'monitoring';
  }

  // タブ情報 : Tab information
  const tabs: Array<TabType> = [];
  if (readableAssessment) {
    tabs.push({ id: '1', value: `${parentPath}/assessment`, label: 'アセスメント', enabled: true });
  }
  if (readablePlan1) {
    tabs.push({ id: '2', value: `${parentPath}/plan1`, label: '居宅サービス計画書(1)', enabled: true });
  }
  if (readablePlan2) {
    tabs.push({ id: '3', value: `${parentPath}/plan2`, label: '居宅サービス計画書(2)', enabled: true });
  }
  if (readableWeeklyplan) {
    tabs.push({ id: '4', value: `${parentPath}/weeklyplan`, label: '週間サービス計画表', enabled: true });
  }
  if (readableKaigi) {
    tabs.push({ id: '2', value: `${parentPath}/kaigi`, label: 'サービス担当者会議の要点', enabled: true });
  }
  if (readableMonitoring) {
    tabs.push({ id: '6', value: `${parentPath}/monitoring`, label: 'モニタリング表', enabled: true });
  }

  // URL変更を検知し rerender
  // ※以下を入れることで検知できる
  useRouteMatch<RouteParams>(`${parentPath}/:tabId`);
  const isDialogOpen = useTypedSelector((state: RootState) => state.outputSetting.isDialogOpen);

  /* 設定ボタン押下 */
  const handleClickSetting = () => {
    openOutputSetting();
  };

  return (
    <>
      {isDialogOpen && <OutputSettingDialog />}
      <Box mt={1}>
        <CustomGrid direction="row" justify="space-between">
          <CustomGrid direction="row">
            <StyledButton onClick={handleHeaderBreadcrumbClick}>介護計画書</StyledButton>
            <>＞</>
            <>0000000201 {riyoushaSeq === 2 ? `要介護３` : `要介護１`} (70歳)</>
          </CustomGrid>
          <Box mr={1}>
            <IconButton onClick={handleClickSetting} data-testid="setting-button" size="small">
              <SettingIcon />
            </IconButton>
          </Box>
        </CustomGrid>
      </Box>
      <Tabs id="tabs" link orientation="horizontal" value={history.location.pathname} tabs={tabs}>
        <Switch>
          <Redirect from={parentPath} to={`${parentPath}/${defaultSelectPageKey}`} exact />
          <Route path={`${parentPath}/assessment`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1000_01}>
              <Assessment />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/plan1`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1210_01}>
              <Plan1 id="plan1" riyoushaSeq={riyoushaSeq} />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/plan2`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1220_01}>
              <Plan2 id="plan2" riyoushaSeq={riyoushaSeq} />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/weeklyplan`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1230_01}>
              <WeeklyPlan keikakushoStatus={1} riyoushaSeq={riyoushaSeq} />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/kaigi`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1240_01}>
              <Kaigi id="kaigi" riyoushaSeq={riyoushaSeq} />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/monitoring`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1260_01}>
              <Monitoring id="monitoring" />
            </KengenWrapper>
          </Route>
        </Switch>
      </Tabs>
    </>
  );
};

export default RiyoushaCarePlanKaigo;
