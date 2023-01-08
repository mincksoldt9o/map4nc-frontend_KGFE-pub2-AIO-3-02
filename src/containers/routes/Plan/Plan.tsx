import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import KengenUtils from '@my/utils/KengenUtils';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import KengenWrapper from '@my/containers/organisms/KengenWrapper/KengenWrapper';

import Keikakusho from './Keikakusho';
import Careplan from './Careplan';
import Shienkeika from './Shienkeika';

type Props = {
  parentPath: string;
};

/**
 * プラン立案・評価＞共通のメニューRoute.
 */
const Plan: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const getLoginKengenInfo = useGetLoginKengenInfo();

  // 権限ベースツリー
  const kengenPath = getLoginKengenInfo(['plan']);

  // 初期選択状態のページキーを取得する
  let defaultSelectPageKey = '';
  if (KengenUtils.isReadable(kengenPath.shienkeika)) {
    defaultSelectPageKey = 'shienkeika';
  } else if (KengenUtils.isReadable(kengenPath.careplan)) {
    defaultSelectPageKey = 'careplan';
  } else if (KengenUtils.isReadable(kengenPath.keikakusho)) {
    defaultSelectPageKey = 'keikakusho';
  }

  return (
    <Switch>
      <Redirect from={parentPath} to={`${parentPath}/${defaultSelectPageKey}`} exact />
      <Route path={`${parentPath}/shienkeika`}>
        <KengenWrapper kengen={kengenPath} screenId="shienkeika">
          <Shienkeika parentPath={`${parentPath}/shienkeika`} />
        </KengenWrapper>
      </Route>
      <Route path={`${parentPath}/careplan`}>
        <KengenWrapper kengen={kengenPath} screenId="careplan">
          <Careplan parentPath={`${parentPath}/careplan`} />
        </KengenWrapper>
      </Route>
      <Route path={`${parentPath}/keikakusho`}>
        <KengenWrapper kengen={kengenPath} screenId="keikakusho">
          <Keikakusho parentPath={`${parentPath}/keikakusho`} />
        </KengenWrapper>
      </Route>
    </Switch>
  );
};

export default Plan;
