import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';

import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';
import KengenUtils from '@my/utils/KengenUtils';

import ShienkeikaList from '@my/containers/pages/Plan/Shienkeika/Shienkeika';

type RouteParams = {
  serviceKbn: string;
};

type Props = {
  parentPath: string;
};

const ShienkeikaKobetsuRiyousha: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'shienkeika']);

  // 権限状態
  const readable = KengenUtils.isReadable(kengenPath[screenIDs.L1410_01.id]);

  // 初期選択状態
  let defaultSelectPageKey = '';
  if (readable) {
    defaultSelectPageKey = 'kaigo';
  }

  // URL変更を検知し rerender
  // ※以下を入れることで検知できる
  useRouteMatch<RouteParams>(`${parentPath}/:serviceKbn`);

  return (
    <Switch>
      <Redirect from={parentPath} to={`${parentPath}/${defaultSelectPageKey}`} exact />
      <Route path={`${parentPath}/kaigo`}>
        <ShienkeikaList id="shienkeika-kobetsu-kaigo" screen={screenIDs.L1410_01} />
      </Route>
      <Route path={`${parentPath}/yobou`}>
        <ShienkeikaList id="shienkeika-kobetsu-yobou" screen={screenIDs.L1420_01} />
      </Route>
    </Switch>
  );
};

export default ShienkeikaKobetsuRiyousha;
