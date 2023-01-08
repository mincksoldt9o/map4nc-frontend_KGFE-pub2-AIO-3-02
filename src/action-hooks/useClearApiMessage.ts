import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import globalMessageStore from '@my/stores/globalMessageStore';

export const useClearApiMessage = () => {
  const dispatch = useDispatch();

  return useCallback(
    (screenID?: string) => {
      if (screenID) {
        dispatch(globalMessageStore.actions.clear(screenID));
      } else {
        dispatch(globalMessageStore.actions.allClear());
      }
    },
    [dispatch]
  );
};

export default useClearApiMessage;
