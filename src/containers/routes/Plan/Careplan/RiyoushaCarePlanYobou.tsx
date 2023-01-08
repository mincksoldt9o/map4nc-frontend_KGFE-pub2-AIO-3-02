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
import Kihon from '@my/containers/pages/Plan/Careplan/Kihon';
import Checklist from '@my/containers/pages/Plan/Careplan/Checklist';
import YoboPlan from '@my/containers/pages/Plan/Careplan/YoboPlan';
import YoboHyoka from '@my/containers/pages/Plan/Careplan/YoboHyoka';
import WeeklyPlan from '@my/containers/pages/Plan/Careplan/WeeklyPlan';
import Kaigi from '@my/containers/pages/Plan/Careplan/Kaigi';
import IconButton from '@my/components/atomic/IconButton';
import SettingIcon from '@my/components/icon/SettingIcon';
import OutputSettingDialog from '@my/containers/pages/Plan/Careplan/OutputSettingDialog';
import { useOpenOutputSetting } from '@my/action-hooks/plan/careplan';
import { useTypedSelector, RootState } from '@my/stores';

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

const RiyoushaCarePlanYobou: React.FC<Props> = (props: Props) => {
  const { parentPath, riyoushaSeq, handleHeaderBreadcrumbClick } = props;

  const openOutputSetting = useOpenOutputSetting();
  const history = useHistory();

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'careplan', 'yobou']);

  // 各タブの権限状態
  const readableAssessment = KengenUtils.isReadable(kengenPath[screenIDs.L1001_01.id]);
  const readableKihon = KengenUtils.isReadable(kengenPath[screenIDs.L1310_01.id]);
  const readableChecklist = KengenUtils.isReadable(kengenPath[screenIDs.L1320_01.id]);
  const readableYoboplanKouroushou = KengenUtils.isReadable(kengenPath[screenIDs.L1330_01.id]);
  const readableYoboweeklyplan = KengenUtils.isReadable(kengenPath[screenIDs.L1340_01.id]);
  const readableYobokaigi = KengenUtils.isReadable(kengenPath[screenIDs.L1350_01.id]);
  const readableYobohyoka = KengenUtils.isReadable(kengenPath[screenIDs.L1370_01.id]);

  // 初期選択状態
  let defaultSelectPageKey = '';
  if (readableAssessment) {
    defaultSelectPageKey = 'assessment';
  } else if (readableKihon) {
    defaultSelectPageKey = 'kihon';
  } else if (readableChecklist) {
    defaultSelectPageKey = 'checklist';
  } else if (readableYoboplanKouroushou) {
    defaultSelectPageKey = 'yoboplanKouroushou';
  } else if (readableYoboweeklyplan) {
    defaultSelectPageKey = 'yoboweeklyplan';
  } else if (readableYobokaigi) {
    defaultSelectPageKey = 'yobokaigi';
  } else if (readableYobohyoka) {
    defaultSelectPageKey = 'yobohyoka';
  }

  // タブ情報
  const tabs: Array<TabType> = [];
  if (readableAssessment) {
    tabs.push({ id: '1', value: `${parentPath}/assessment`, label: 'アセスメント', enabled: true });
  }
  if (readableKihon) {
    tabs.push({ id: '2', value: `${parentPath}/kihon`, label: '利用者基本情報', enabled: true });
  }
  if (readableChecklist) {
    tabs.push({ id: '3', value: `${parentPath}/checklist`, label: '基本チェックリスト', enabled: true });
  }
  if (readableYoboplanKouroushou) {
    tabs.push({ id: '4', value: `${parentPath}/yoboplanKouroushou`, label: '支援計画書', enabled: true });
  }
  if (readableYoboweeklyplan) {
    tabs.push({ id: '5', value: `${parentPath}/yoboweeklyplan`, label: '週間支援計画表', enabled: true });
  }
  if (readableYobokaigi) {
    tabs.push({ id: '6', value: `${parentPath}/yobokaigi`, label: '担当者会議の要点', enabled: true });
  }
  if (readableYobohyoka) {
    tabs.push({ id: '7', value: `${parentPath}/yobohyoka`, label: 'サービス評価表', enabled: true });
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
            <StyledButton onClick={handleHeaderBreadcrumbClick}>予防計画書</StyledButton>
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
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1001_01}>
              <Assessment />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/kihon`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1310_01}>
              <Kihon />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/checklist`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1320_01}>
              <Checklist id="checklist" />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/yoboplanKouroushou`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1330_01}>
              <YoboPlan />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/yoboweeklyplan`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1340_01}>
              <WeeklyPlan keikakushoStatus={2} riyoushaSeq={riyoushaSeq} />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/yobokaigi`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1350_01}>
              <Kaigi />
            </KengenWrapper>
          </Route>
          <Route path={`${parentPath}/yobohyoka`}>
            <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1370_01}>
              <YoboHyoka id="yobo-hyoka" />
            </KengenWrapper>
          </Route>
        </Switch>
      </Tabs>
    </>
  );
};

export default RiyoushaCarePlanYobou;
