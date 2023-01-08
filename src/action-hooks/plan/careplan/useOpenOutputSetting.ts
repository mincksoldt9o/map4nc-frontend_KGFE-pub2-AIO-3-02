import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import OutputSettingStore from '@my/stores/plan/careplan/OutputSettingStore';

export const useOpenOutputSetting = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(OutputSettingStore.actions.openOutputSetting());
  }, [dispatch]);
};

export default useOpenOutputSetting;
