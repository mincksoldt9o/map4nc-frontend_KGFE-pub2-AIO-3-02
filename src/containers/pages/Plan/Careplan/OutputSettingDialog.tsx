import React from 'react';
import Dialog from '@my/components/atomic/Dialog';
import { useFetchOutputSetting, useClearOutputSetting } from '@my/action-hooks/plan/careplan';
import screenIDs from '@my/screenIDs';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import { useTypedSelector, RootState } from '@my/stores';
import { useUnmount } from 'react-use';
import { useConfirm } from '@my/components/atomic/ConfirmDialog';
import messages from '@my/messages';
import OutputSettingDialogContents, { OutputSettingDialogFormType } from './OutputSettingDialogContents';
import { DialogNowLoadingContent } from '../../Common/Dialog';

/**
 *  z9999.10 出力設定（同意欄）ダイアログ
 */
const OutputSettingDialog: React.FC = () => {
  const screenID = screenIDs.Z9999_10.id;
  const fetchOutputSetting = useFetchOutputSetting(screenID);
  const clearOutputSetting = useClearOutputSetting();
  const confirm = useConfirm();

  const { loadingStatus, outputSetting, isDirty } = useTypedSelector((state: RootState) => state.outputSetting);
  const defaultValues: OutputSettingDialogFormType = {
    ...outputSetting,
  };

  const confirmUpdateDirtyForm = async () => {
    if (isDirty) {
      if (!(await confirm({ title: '入力内容が登録されていません', message: messages.MESSAGE_0001() }))) {
        return false;
      }
    }
    return true;
  };

  /** 戻るボタンをクリックした時の処理 */
  const handleClickReturn = async () => {
    if (await confirmUpdateDirtyForm()) {
      clearOutputSetting();
    }
  };

  React.useEffect(
    UseEffectAsync.make(async () => {
      if (loadingStatus === 'NotLoad') {
        await fetchOutputSetting();
      }
    }),
    [loadingStatus, fetchOutputSetting]
  );

  useUnmount(() => {
    clearOutputSetting();
  });

  return (
    <Dialog open variant="simple" title="出力設定" fullWidth onClickReturn={handleClickReturn} selfContentAndActions>
      {loadingStatus === 'Loading' && <DialogNowLoadingContent />}
      {loadingStatus === 'Loaded' && <OutputSettingDialogContents screenID={screenID} defaultValues={defaultValues} />}
    </Dialog>
  );
};

export default OutputSettingDialog;
