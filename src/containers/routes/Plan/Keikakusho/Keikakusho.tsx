import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useRouteMatch, useHistory } from 'react-router';
import styled from 'styled-components';
import messages from '@my/messages';
import KengenWrapper from '@my/containers/organisms/KengenWrapper/KengenWrapper';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { RootState, useTypedSelector } from '@my/stores';
import { Container, Box } from '@material-ui/core';
import AlertMessage from '@my/components/atomic/AlertMessage';
import SearchIcon from '@my/components/icon/SearchIcon';
import KeikakushoCom, { KeikakushoTabIds, RouteParamsType } from '@my/containers/pages/Plan/Keikakusho';
import { useConfirm } from '@my/components/atomic/ConfirmDialog/useConfirm';
import { CustomConfirmProvider } from '@my/containers/pages/Common/CustomConfirm';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';

const StyledContainer = styled(Container)`
  padding: 0 0 1.5em 0;
` as typeof Container;
const InnerBox = styled(Box)`
  overflow-y: auto;
  @media (max-height: 660px) {
    overflow-y: visible;
  }
  @media (max-width: 780px) {
    overflow-y: visible;
  }
` as typeof Box;
const InnerSearchIcon = styled(SearchIcon)`
  width: 0.7em;
  height: 0.7em;
` as typeof SearchIcon;

type KeikakushoProps = {
  parentPath: string;
};

const Keikakusho: React.FC<KeikakushoProps> = (props: KeikakushoProps) => {
  const { parentPath } = props;
  const screenId = screenIDs.D1010_01;
  const confirm = useConfirm();
  const history = useHistory();
  const routeMatch = useRouteMatch<RouteParamsType>(`${parentPath}/:userId?/:tabId*`);
  const getLoginKengenInfo = useGetLoginKengenInfo();
  const currentRiyoushaSeq = useTypedSelector((state: RootState) => state.riyousha.currentRiyousha?.riyoushaSeq || 0);
  const { loadingInitStatus } = useTypedSelector((state: RootState) => state.chouhyouSakuseiDate);
  const { isDirty, loadingStatus, loadingEditStatus } = useTypedSelector((state: RootState) => state.keikakusho);
  const isCurrentRiyousha = currentRiyoushaSeq > 0;
  const tabId = routeMatch?.params.tabId;
  const isTabId = tabId && KeikakushoTabIds.has(tabId);
  const isRiyoushaOrTabChange = isCurrentRiyousha && !(currentRiyoushaSeq.toString(10) === (routeMatch?.params.userId || '0') && isTabId);
  const kengenPath = getLoginKengenInfo(['plan', 'keikakusho']);
  const [isTabChange, setIsTabChange] = useState(false);
  const defaultSelectPageId = 'kaigo';
  // ↑ 一旦介護で固定とする //
  const selectedId = isTabId ? tabId : defaultSelectPageId;
  const selectedPath = isCurrentRiyousha ? `${parentPath}/${currentRiyoushaSeq}/${selectedId}` : `${parentPath}`;
  const tabs: TabType[] = [
    { id: 'kaigo', label: '介護保険計画書', value: `${parentPath}/${currentRiyoushaSeq}/kaigo` },
    { id: 'shougai', label: '障害福祉計画書', value: `${parentPath}/${currentRiyoushaSeq}/shougai` },
  ];

  const handleTabChange = async (e: React.ChangeEvent<{}>, tabValue: string) => {
    if (tabValue !== selectedPath) {
      if (!(loadingInitStatus !== 'Loading' && loadingStatus !== 'Loading' && loadingEditStatus !== 'Loading')) {
        e.preventDefault();
        return;
      }
      if (isDirty) {
        e.preventDefault();
        if (!(await confirm({ title: '入力内容が登録されていません', message: messages.MESSAGE_0001() }))) {
          return;
        }
        history.push(tabValue);
      }
      setIsTabChange(true);
    }
  };

  useEffect(() => {
    if (isRiyoushaOrTabChange) {
      history.replace(selectedPath);
    }
    if (isTabChange) {
      setIsTabChange(!isTabChange);
    }
  }, [history, isRiyoushaOrTabChange, isTabChange, selectedPath]);

  if (isRiyoushaOrTabChange) {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }

  return (
    <CustomConfirmProvider>
      <StyledContainer maxWidth={false}>
        <InnerBox p="1em 1px 0 0">
          {isCurrentRiyousha ? (
            // <Tabs id="keikakusho-tabs" link orientation="horizontal" value={path}value={location.pathname} tabs={tabs}>
            <Tabs id="keikakusho-tabs" link orientation="horizontal" value={selectedPath} tabs={tabs} onChange={handleTabChange}>
              <Switch>
                <Redirect from={parentPath} to={`${parentPath}/${currentRiyoushaSeq}/${defaultSelectPageId}`} exact />
                <Redirect from={`${parentPath}/${currentRiyoushaSeq}`} to={`${parentPath}/${currentRiyoushaSeq}/${defaultSelectPageId}`} exact />
                {/* <Route path={`${parentPath}/:userId/:tabId`} component={KeikakushoPage} /> */}
                <Route path={`${parentPath}/:userId/:tabId(kaigo|shougai)`}>
                  <KengenWrapper kengen={kengenPath} screenId={screenId}>
                    {!isTabChange && <KeikakushoCom id="keikakusho" screenId={screenId} />}
                  </KengenWrapper>
                </Route>
              </Switch>
            </Tabs>
          ) : (
            <AlertMessage
              type="warn"
              message={
                <>
                  利用者が選択されていません。利用者台帳もしくは画面上部&nbsp;
                  <InnerSearchIcon />
                  &nbsp;にて利用者を選択してください。
                </>
              }
            />
          )}
        </InnerBox>
      </StyledContainer>
    </CustomConfirmProvider>
  );
};

export default Keikakusho;
