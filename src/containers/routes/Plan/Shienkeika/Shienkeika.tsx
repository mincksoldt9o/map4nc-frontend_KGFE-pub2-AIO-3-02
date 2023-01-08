import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router';

import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';
import KengenUtils from '@my/utils/KengenUtils';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { RootState, useTypedSelector } from '@my/stores';

import ShienkeikaList from '@my/containers/pages/Plan/Shienkeika/Shienkeika';
import ShienkeikaKobetsu from './ShienkeikaKobetsu';

type RouteParams = {
  tabId: string;
  riyoushaSeq: string;
  optionsId: string;
};

type Props = {
  parentPath: string;
};

const Shienkeika: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const history = useHistory();

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'shienkeika']);

  // 権限状態
  const readable = KengenUtils.isReadable(kengenPath[screenIDs.L1410_01.id]);

  // 初期選択状態
  let defaultSelectPageKey = '';
  if (readable) {
    defaultSelectPageKey = 'kobetsu';
  }

  // URL変更を検知し rerender
  // ※以下を入れることで検知できる
  const routeMatch = useRouteMatch<RouteParams>(`${parentPath}/:tabId/:riyoushaSeq/:optionsId`);
  const tabId = routeMatch?.params.tabId;
  const optionsId = routeMatch?.params.optionsId;

  // タブ情報
  const currentRiyousha = useTypedSelector((state: RootState) => state.riyousha.currentRiyousha);
  const riyoushaSeq = currentRiyousha?.riyoushaSeq !== undefined ? currentRiyousha?.riyoushaSeq.toString() : '0';
  const kobetsuPath = riyoushaSeq === '0' ? `${parentPath}/kobetsu` : `${parentPath}/kobetsu/${riyoushaSeq}/${optionsId}`;
  const tabs: Array<TabType> = [];
  if (readable) {
    tabs.push({ id: '1', value: kobetsuPath, label: '個別', enabled: true });
    tabs.push({ id: '2', value: `${parentPath}/ikkatsu`, label: '一括', enabled: true });
  }

  // 利用者プールのバツボタン押下時はパスを /plan/shienkeika/kobetsu にする
  React.useEffect(() => {
    if (riyoushaSeq === '0' && tabId === 'kobetsu') {
      history.push(`${parentPath}/${defaultSelectPageKey}`);
    }
  }, [history, riyoushaSeq, parentPath, tabId, defaultSelectPageKey]);

  return (
    <>
      <Tabs id="tabs" link orientation="horizontal" value={history.location.pathname} tabs={tabs} />
      <Switch>
        <Redirect from={parentPath} to={`${parentPath}/${defaultSelectPageKey}`} exact />
        <Route path={`${parentPath}/kobetsu`}>
          <ShienkeikaKobetsu parentPath={`${parentPath}/kobetsu`} />
        </Route>
        <Route path={`${parentPath}/ikkatsu`}>
          <ShienkeikaList id="shienkeika-ikkatsu" screen={screenIDs.L1430_01} />
        </Route>
      </Switch>
    </>
  );
};

export default Shienkeika;
