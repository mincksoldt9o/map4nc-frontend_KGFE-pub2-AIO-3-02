import styled from 'styled-components';
import DateUtils from '@my/utils/DateUtils';
import { TableCell } from '@material-ui/core';
import { ScreenID } from '@my/screenIDs';
import { AxiosResponse } from 'axios';

export const CustomThCell = styled(TableCell)<{ bl?: number }>`
  background: #a49696 0 0 no-repeat padding-box;
  color: #fff;
  border-left: ${({ bl }) => (bl ? `${bl}px solid #e8dac3` : undefined)};
  border-bottom: 1px solid #fff;
  padding: 0 4px;
  min-width: 64px;
`;
export const CustomTbCell = styled(TableCell)`
  padding: 2px 8px;
`;
// ※ styled の props の引数名は小文字にすること・・・警告でる cellMinWidth → cellminwidth //
// export const CustomTbCell = styled(TableCell)<{ cellminwidth?: number; fieldautowidth?: boolean }>`
//   padding: 2px 8px;
//   min-width: ${({ cellminwidth }) => `${cellminwidth}px`};
//   & .MuiFormControl-root.MuiFormControl-fullWidth {
//     width: ${({ fieldautowidth }) => (fieldautowidth === false ? 'auto' : undefined)};
//   }
// `;
// ※ padding top bottom に 2px もうけないとスクロールがでる //
// 計画書タブ //
export const KeikakushoTabIds: Map<string, string> = new Map([
  ['kaigo', '1'],
  ['shougai', '2'],
]);

export type RouteParamsType = {
  userId?: string;
  tabId?: string;
};

export type HistoryDateType = {
  sakuseiDate: Date | null;
  seidoType?: string;
  memo?: string;
};

export type StartEndTimeType = {
  startTime: string;
  endTime: string;
};

export type HistoryCalendarChangeType = {
  handleCalendarChange: (date: Date | null) => void;
};

export type PrintType = {
  handleClickPDFDownload: () => Promise<AxiosResponse | undefined>;
  handleClickEXCELDownload: () => Promise<AxiosResponse | undefined>;
  handleClickPDFPreview: () => Promise<AxiosResponse | undefined>;
};

export type EditProps = {
  screenId: ScreenID;
  headerTabId: string;
  isReadonly?: boolean;
};
export type EditTabProps = {
  id: string;
  headerTabId: string;
  isReadonly?: boolean;
};
// const ToNullDate = (num?: number) => (num ? new Date(num) : null);
export const ToNullDate = (num?: number): Date | null => {
  const dt = num ? new Date(num) : null;
  return dt && !Number.isNaN(dt.getTime()) ? dt : null;
};
export const ToEmptyStringTime = (num?: number) => (ToNullDate(num) ? DateUtils.convertTimeString(num) : '');
