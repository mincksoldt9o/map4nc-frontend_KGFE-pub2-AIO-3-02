import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import globalMessageStore from '@my/stores/globalMessageStore';
import commonStore from '@my/stores/commonStore';
import { useSnackbar } from '@my/components/atomic/Snackbar';

type MessageType = {
  type: 'none' | 'info' | 'success' | 'warn' | 'error';
  message?: string;
  incidentId?: string;
  detailMessages?: Array<string>;
};

type MessageMap = {
  [screenID: number]: MessageType;
};

const apiMessage: MessageMap = {
  200: { message: '正常に終了しました。', type: 'success' },
  400: { message: '処理でエラーが発生しました。', type: 'error' },
  403: { message: '権限がありません。', type: 'error' },
  404: { message: 'データがありませんでした。', type: 'error' },
  405: { message: 'メソッドは許可されていません。', type: 'error' },
  408: { message: 'タイムアウトしました。', type: 'error' },
  409: { message: '処理でエラーが発生しました。', type: 'error' },
  500: { message: '処理でエラーが発生しました。', type: 'error' },
  501: { message: '処理でエラーが発生しました。(501 Not Implemented)', type: 'error' },
  502: { message: 'サーバに接続できませんでした。(502 Bad Gateway)', type: 'error' },
  503: { message: 'サーバが一時的に利用できなくっています。', type: 'error' },
  504: { message: 'サーバに接続できませんでした。(504 Gateway Timeout)', type: 'error' },
};

export const useHandleApiError = (screenID: string, noSnackbar = false) => {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  return useCallback(
    // javascript の throw が何でも投げれる仕様のため any で受けている
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      console.error('API Error.', error);
      const axiosErr = error?.isAxiosError && error?.response?.status === undefined;

      // 401 のときはタイムアウト状態にする
      if (!axiosErr && error.response.status === 401) {
        dispatch(commonStore.actions.loginTimeout());
        return;
      }

      try {
        const snackbarMessage: MessageType = { type: 'none', message: '' };
        if (axiosErr) {
          snackbarMessage.type = 'error';
          snackbarMessage.message = 'サーバに接続できませんでした。';
        } else if (error.response && error.response.status && apiMessage[error.response.status]) {
          snackbarMessage.type = apiMessage[error.response.status].type;
          snackbarMessage.message = apiMessage[error.response.status].message;
        } else {
          snackbarMessage.type = apiMessage[500].type;
          snackbarMessage.message = apiMessage[500].message;
        }
        if (error.response && error.response.headers) {
          const overwriteMsg = error.response.headers['x-maps4nc-message'];
          if (overwriteMsg) {
            snackbarMessage.message = decodeURIComponent(overwriteMsg.replace(/\+/g, ' '));
          }
          const overwriteMsgDetail = error.response.headers['x-maps4nc-message-detail'];
          if (overwriteMsgDetail) {
            snackbarMessage.detailMessages = decodeURIComponent(overwriteMsgDetail.replace(/\+/g, ' '))
              .split(',')
              .map((str: string) => str.trim());
          }

          snackbarMessage.incidentId = error.response.headers['x-maps4nc-request-id'];
        }
        if (!noSnackbar && snackbarMessage.message && snackbarMessage.type !== 'none') {
          showSnackbar({ message: snackbarMessage.message, type: snackbarMessage.type, incidentId: snackbarMessage.incidentId, detailMessages: snackbarMessage.detailMessages });
        }

        const globalMessages: MessageType[] = [];
        if (noSnackbar) {
          globalMessages.push({ type: snackbarMessage.type, message: snackbarMessage.message, detailMessages: snackbarMessage.detailMessages });
        }
        if (error.response && error.response.data && error.response.data.messages) {
          error.response.data.messages.map((message: string) => globalMessages.push({ type: 'error', message }));
        }
        globalMessages.map((message) => dispatch(globalMessageStore.actions.push({ screenID, messageType: message })));
      } catch (e) {
        console.error('error handle failure.', e);
      }
    },
    // 実際の画面で snackbar, alert を表示させると、この関数も変わってしまうのを防ぐため showSnackbar を外している (snackbar 内で alert も使っている)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, screenID, noSnackbar]
  );
};

export const createThrowError = (message: string) => {
  return {
    response: {
      messages: [message],
    },
  };
};

export default useHandleApiError;
