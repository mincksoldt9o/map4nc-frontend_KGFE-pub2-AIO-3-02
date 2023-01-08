import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabelAndValue, OfficeServiceKindListOfServiceList, OfficeSateliteNameList, KaigoServiceItemKasan } from 'maps4nc-frontend-web-api/dist/lib/model';
import { EventType } from '@my/components/organisms/WeekCalendarTimeGrid';
import DateUtils from '@my/utils/DateUtils';

export type Riyousha = {
  riyoushaSeq: number;
  futanwariai?: LabelAndValue;
  youkaigodo?: LabelAndValue;
};

export type ServiceKindColor = {
  backgroundColor: string;
  color: string;
};

export type ServiceKindColorMap = { [key: string]: ServiceKindColor };

/** 新しく返して欲しいサービスコードの内容 */
export type ServiceCodeItem = LabelAndValue & {
  serviceCode: string;
  // 画面で時間変更による絞り込みに使用する
  timeSlot?: string; // 'midnight': 深夜, 'night': 夜, 'day': 日中, undefined: 時間関係なし

  // ↓ここから画面での絞り込み条件復元で使用する
  ninzuuKbn?: string;
  youkaigodo?: Array<string>; // 対象になる要介護度コードのリスト
  futanwariai?: string; // 自己負担割合のコード
  joukouKaijo?: boolean; // 乗降介助
  teiinChoka?: string; // 定員超過のコード

  // ↓ ここからデフォルト値設定で使用する
  seikatsuenjoJikan?: number; // 生活援助時間
  kaisuu?: number; // 回数
};

/** 新しく返して欲しい加算情報の内容 */
export type KaigoSanteiKasan = KaigoServiceItemKasan & {
  // ↓ここから画面での絞り込み条件復元で使用する
  serviceCode?: string;
  youkaigodo?: Array<string>;
  futanwariai?: number;
};

export type WeeklyServicePlanService = {
  serviceNaiyouSeq: number;
  hokenServiceKbn: string;
  teikyouWeeks: Array<number>;
  teikyouStartTime: number;
  teikyouEndTime: number;
  serviceKindItem?: OfficeServiceKindListOfServiceList;
  displayName?: string;

  serviceOffice?: OfficeSateliteNameList;
  serviceCodeItem?: ServiceCodeItem;
  seikatsuenjoJikan?: number;
  kaisuuNissuu?: number;
  kasanList?: Array<KaigoSanteiKasan>;
};

/** 計画書のキー */
export type KeikakushoBaseKey = {
  officeSeq: number;
  officeServiceKindSeq: number;
  riyoushaSeq: number;
  keikakushoShubetsu: string;
};

/** 計画書データのキー */
export type KeikakushoKey = KeikakushoBaseKey & {
  keikakushoSeq: number;
};

/** 計画書データの登録時のキー */
export type KeikakushoSaveKey = KeikakushoBaseKey & {
  keikakushoSeq?: number;
};

/** 週間サービス計画データ(キーなし) */
export type WeeklyServicePlanBase = {
  tekiyouStart?: number;
  fontSize: LabelAndValue;
  katsudou1?: string;
  katsudou2?: string;
  katsudou3?: string;
  katsudou4?: string;
  katsudou5?: string;
  katsudou6?: string;
  katsudou7?: string;
  katsudou8?: string;
  katsudou9?: string;
  katsudou10?: string;
  katsudou11?: string;
  katsudou12?: string;
  sonotaService?: string;
  serviceList: Array<WeeklyServicePlanService>;
};

/** 取得した週間サービス計画データ型 */
export type WeeklyServicePlan = KeikakushoKey & WeeklyServicePlanBase;
/** 登録時に使用する週間サービス計画データ型（計画書SEQが undefined 可） */
export type WeeklyServicePlanUpdateData = KeikakushoSaveKey & WeeklyServicePlanBase;

/** APIから取得したデータから変換した、画面編集週間サービス計画データ */
export type EditWeeklyServicePlan = {
  tekiyouStart?: number;
  fontSize: LabelAndValue;
  katsudou1?: string;
  katsudou2?: string;
  katsudou3?: string;
  katsudou4?: string;
  katsudou5?: string;
  katsudou6?: string;
  katsudou7?: string;
  katsudou8?: string;
  katsudou9?: string;
  katsudou10?: string;
  katsudou11?: string;
  katsudou12?: string;
  sonotaService?: string;
  serviceList: Array<EventType<WeeklyServicePlanService>>;
};

export type WeeklyPlanState = {
  /** 作成日時 FIXME: 共通で持つこと */
  createDate: number | null;

  /** 計画書の読み込み状態 */
  loadingStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  /** サービス追加・編集ダイアログでの読み込み状態 */
  dialogLoadingStatus: 'Loading' | 'Loaded' | 'Error';

  weeklyServicePlan: EditWeeklyServicePlan;
  serviceColorMap: ServiceKindColorMap;
  riyousha?: Riyousha;
  serviceKindList: Array<OfficeServiceKindListOfServiceList>;
  youkaigodoList: Array<LabelAndValue>;
  futanwariaiList: Array<LabelAndValue>;
  serviceOfficeList: Array<OfficeSateliteNameList>;
  serviceCodeList: Array<ServiceCodeItem>;
  kasanList: Array<KaigoSanteiKasan>;
};

const initialState = (): WeeklyPlanState => ({
  createDate: new Date().getTime(),
  loadingStatus: 'NotLoad',
  dialogLoadingStatus: 'Loaded',
  weeklyServicePlan: {
    serviceList: [],
    tekiyouStart: DateUtils.nowYearMonth().getTime(),
    fontSize: { label: '10', value: '10' },
  },
  serviceColorMap: {},
  riyousha: undefined,
  serviceKindList: [],
  youkaigodoList: [],
  futanwariaiList: [],
  serviceOfficeList: [],
  serviceCodeList: [],
  kasanList: [],
});

export function getServiceColor(colorMap: ServiceKindColorMap, hokenKbun: string, key: string | undefined): { backgroundColor?: string; color?: string } {
  if (hokenKbun === '2') {
    return { backgroundColor: '#ffffff', color: '#000000' };
  }
  return colorMap[`c${key}`] || {};
}

export function filterServiceCodeList(list: Array<ServiceCodeItem>, teikyouStartTime: string, teikyouEndTime: string): Array<ServiceCodeItem> {
  if (!teikyouStartTime || !teikyouEndTime) {
    return [];
  }

  return list.filter((v: ServiceCodeItem) => {
    if (!v.timeSlot) {
      return true;
    }

    if (teikyouStartTime >= '22:00' || teikyouStartTime < '06:00') {
      return v.timeSlot === 'midnight';
    }
    if ((teikyouStartTime >= '06:00' && teikyouStartTime < '08:00') || (teikyouStartTime >= '18:00' && teikyouStartTime < '22:00')) {
      return v.timeSlot === 'night';
    }

    return v.timeSlot === 'day';
  });
}

/** 自己負担割合の条件表示するかしないか */
export const isShownFutanwariai = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return serviceKindItem.serviceShubetu === '5';
};

/** 要介護度を"表示しない"、サービス種類のリスト */
const disabledYoukaigodoServiceKinds = ['11', '12', '14', '17', '31', '71', '34', '62', '63', '64', '67'];

/** 要介護度の条件表示するかしないか */
export const isShownYoukaigodo = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return !disabledYoukaigodoServiceKinds.includes(serviceKindItem.value);
};

/** 乗降介助の条件表示するかしないか */
export const isShownJoukoukaijo = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return serviceKindItem.value === '11';
};

/** 人数の条件表示するかしないか */
export const isShownNinzuu = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return serviceKindItem.value === '11' || serviceKindItem.value === '13' || serviceKindItem.value === '63';
};

/** 定員超過を表示する、サービス種類のリスト */
const enbaleTeiinChokaServiceKinds = ['15', '16', '21', '22', '23', '27', '2A', '28', '38', '68', '72', '73', '77', '78', '79', '24', '25', '26', '2B', '66', '39', '69', '74', '75', 'A2', 'A6'];

/** 定員超過の条件表示するかしないか */
export const isShownTeiinChoka = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return enbaleTeiinChokaServiceKinds.includes(serviceKindItem.value);
};

/** 回数を表示するかしないか */
export const isShownKaisuu = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return serviceKindItem.value === '14';
};

/** 生活援助時間を表示するかしないか */
export const isShownSeikatsuenjoJikan = (serviceKindItem?: OfficeServiceKindListOfServiceList) => {
  if (!serviceKindItem) {
    return false;
  }
  return serviceKindItem.value === '11';
};

const weeklyPlanStore = createSlice({
  name: 'weeklyPlan',
  initialState: initialState(),
  reducers: {
    loading: (draftState: WeeklyPlanState) => {
      draftState.loadingStatus = 'Loading';
    },
    errored: (draftState: WeeklyPlanState) => {
      draftState.loadingStatus = 'Error';
    },
    fetchedWeeklyPlan: (draftState: WeeklyPlanState, action: PayloadAction<{ colorMap: ServiceKindColorMap; futanwariaiList: Array<LabelAndValue>; weeklyServicePlan?: EditWeeklyServicePlan }>) => {
      draftState.loadingStatus = 'Loaded';
      draftState.serviceColorMap = action.payload.colorMap;
      draftState.futanwariaiList = action.payload.futanwariaiList;
      if (action.payload.weeklyServicePlan) {
        draftState.weeklyServicePlan = action.payload.weeklyServicePlan;
      } else {
        draftState.weeklyServicePlan = initialState().weeklyServicePlan;
      }
    },
    createDateChanged: (
      draftState: WeeklyPlanState,
      action: PayloadAction<{ riyousha: Riyousha; serviceKindList: Array<OfficeServiceKindListOfServiceList>; youkaigodoList: Array<LabelAndValue> }>
    ) => {
      draftState.riyousha = action.payload.riyousha;
      draftState.serviceKindList = action.payload.serviceKindList;
      draftState.youkaigodoList = action.payload.youkaigodoList;
    },

    dialogLoading: (draftState: WeeklyPlanState) => {
      draftState.dialogLoadingStatus = 'Loading';
    },
    dialogErrored: (draftState: WeeklyPlanState) => {
      draftState.dialogLoadingStatus = 'Error';
    },

    fetchedWeeklyPlanDialogData: (
      draftState: WeeklyPlanState,
      action: PayloadAction<{ serviceOfficeList: Array<OfficeSateliteNameList>; serviceCodeList: Array<ServiceCodeItem>; kasanList: Array<KaigoSanteiKasan> }>
    ) => {
      draftState.dialogLoadingStatus = 'Loaded';
      draftState.serviceOfficeList = action.payload.serviceOfficeList;
      draftState.serviceCodeList = action.payload.serviceCodeList;
      draftState.kasanList = action.payload.kasanList;
    },
    fetchedWeeklyPlanDialogServiceCode: (draftState: WeeklyPlanState, action: PayloadAction<{ serviceCodeList: Array<ServiceCodeItem>; kasanList: Array<KaigoSanteiKasan> }>) => {
      draftState.dialogLoadingStatus = 'Loaded';
      draftState.serviceCodeList = action.payload.serviceCodeList;
      draftState.kasanList = action.payload.kasanList;
    },
    fetchedWeeklyPlanDialogKasanList: (draftState: WeeklyPlanState, action: PayloadAction<{ kasanList: Array<KaigoSanteiKasan> }>) => {
      draftState.dialogLoadingStatus = 'Loaded';
      draftState.kasanList = action.payload.kasanList;
    },
  },
});

export default weeklyPlanStore;
