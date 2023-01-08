import { useCallback } from 'react';
import { useSnackbar } from '@my/components/atomic/Snackbar';
import { AxiosResponse } from 'axios';

type MessageType = {
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  detailMessages?: Array<string>;
};

export const useShowSuccessSnacbar = () => {
  const showSnackbar = useSnackbar();

  return useCallback(
    (res: AxiosResponse) => {
      try {
        const snackbarMessage: MessageType = { type: 'success', message: '正常に終了しました。' };
        if (res && res.headers) {
          const messages: string[] = [];
          const overwriteMsg = res.headers['x-maps4nc-message'];
          if (overwriteMsg) {
            messages.push(
              ...decodeURIComponent(overwriteMsg.replace(/\+/g, ' '))
                .split(',')
                .map((str: string) => str.trim())
            );
          }
          const overwriteMsgDetail = res.headers['x-maps4nc-message-detail'];
          if (overwriteMsgDetail) {
            snackbarMessage.detailMessages = decodeURIComponent(overwriteMsgDetail.replace(/\+/g, ' '))
              .split(',')
              .map((str: string) => str.trim());
          }
          const overwriteMsgType = res.headers['x-maps4nc-message-type'];
          if (overwriteMsgType === 'Warning') {
            snackbarMessage.type = 'warn';
            if (!overwriteMsg) {
              snackbarMessage.message = '正常に終了しましたが、警告が発生しています。';
            }
          }
          if (messages.length > 0) {
            messages.forEach((message) => {
              showSnackbar({ message, type: snackbarMessage.type, detailMessages: snackbarMessage.detailMessages });
            });
            return;
          }
        }
        showSnackbar({ message: snackbarMessage.message, type: snackbarMessage.type, detailMessages: snackbarMessage.detailMessages });
      } catch (e) {
        console.error(e);
      }
    },
    // 実際の画面で snackbar, alert を表示させると、この関数も変わってしまうのを防ぐため (snackbar 内で alert も使っている)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

export default useShowSuccessSnacbar;
