import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import globalMessageStore, { MessageType } from '@my/stores/globalMessageStore';

export const usePushApiMessage = () => {
  const dispatch = useDispatch();

  return useCallback(
    (screenID: string, messageType: MessageType) => {
      dispatch(globalMessageStore.actions.push({ screenID, messageType }));
    },
    [dispatch]
  );
};

export default usePushApiMessage;
