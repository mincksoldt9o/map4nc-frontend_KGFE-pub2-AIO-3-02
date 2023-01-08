import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import OutputSettingStore from '@my/stores/plan/careplan/OutputSettingStore';

export const useClearOutputSetting = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(OutputSettingStore.actions.clearOutputSetting());
  }, [dispatch]);
};

export default useClearOutputSetting;
