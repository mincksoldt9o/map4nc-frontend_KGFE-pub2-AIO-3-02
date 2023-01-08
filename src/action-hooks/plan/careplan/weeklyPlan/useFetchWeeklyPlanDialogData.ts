import React from 'react';
import { useDispatch } from 'react-redux';
import { OfficeServiceKindListOfServiceList, OfficeSateliteNameList } from 'maps4nc-frontend-web-api/dist/lib/model';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import weeklyPlanStore, {
  ServiceCodeItem,
  KaigoSanteiKasan,
  isShownSeikatsuenjoJikan,
  isShownKaisuu,
  isShownFutanwariai,
  isShownNinzuu,
  isShownYoukaigodo,
  isShownTeiinChoka,
  filterServiceCodeList,
} from '@my/stores/plan/careplan/weeklyplan';

export type ServiceCodeSearchConditionParamsType = {
  teikyouStartTime: string;
  teikyouEndTime: string;
  ninzuuKbn?: string;
  youkaigodo?: string;
  futanwariai?: string;
  joukouKaijo?: boolean;
  teiinChoka?: string;
  seikatsuenjoJikan?: number | null;
  kaisuu?: number | null;
};

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

// Sample
// サンプルのため使用しない部分の内容は適当
const SAMPLE_SERVICE_OFFICE_MAP: { [key: string]: Array<OfficeSateliteNameList> } = {
  '11': [
    { value: '1', label: '事業所1', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
    { value: '2', label: '事業所2', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
    { value: '3', label: '事業所3', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
  ],
  '12': [
    { value: '1', label: '事業所1', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
    { value: '2', label: '事業所2', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
  ],
  '13': [
    { value: '2', label: '事業所2', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
    { value: '3', label: '事業所3', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' },
  ],
};

// Sample
const DEFAULT_SERVICE_OFFICE_LIST = [{ value: '1', label: '事業所1', officeSeq: 1, satelliteSeq: 1, officeServiceKindSeq: 1, officeName: '', officeCode: '', hokenshaNo: '' }];

// Sample
type SAMPLETYPE = ServiceCodeSearchConditionParamsType & {
  serviceKindItem: OfficeServiceKindListOfServiceList;
};

// Sample
function addSampleServiceCode(
  list: Array<ServiceCodeItem>,
  code: string,
  serviceKindItem: OfficeServiceKindListOfServiceList,
  name: string,
  ninzuuKbn: string | undefined,
  youkaigodo: string | undefined,
  futanwariai: string | undefined,
  teiinChoka: string | undefined,
  seikatsuenjoJikan: number | undefined,
  kaisuu: number | undefined,
  joukouKaijo: undefined | boolean
) {
  const serviceKindVal = serviceKindItem.value;
  const c = code.padEnd(5, '0');
  if (serviceKindVal === '11' || serviceKindVal === '13' || serviceKindVal === '63') {
    list.push({
      value: `${c}1`,
      label: `${c}1 ${serviceKindItem.label}${name}・Ⅰ`,
      serviceCode: `${c}1`,
      timeSlot: 'day',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}2`,
      label: `${c}2 ${serviceKindItem.label}${name}・夜・Ⅰ`,
      serviceCode: `${c}2`,
      timeSlot: 'night',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}3`,
      label: `${c}3 ${serviceKindItem.label}${name}・深・Ⅰ`,
      serviceCode: `${c}3`,
      timeSlot: 'midnight',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });
    list.push({
      value: `${c}4`,
      label: `${c}4 ${serviceKindItem.label}${name}・Ⅱ`,
      serviceCode: `${c}4`,
      timeSlot: 'day',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}5`,
      label: `${c}5 ${serviceKindItem.label}${name}・夜・Ⅱ`,
      serviceCode: `${c}5`,
      timeSlot: 'night',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}6`,
      label: `${c}6 ${serviceKindItem.label}${name}・深・Ⅱ`,
      serviceCode: `${c}6`,
      timeSlot: 'midnight',
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });
  } else {
    list.push({
      value: `${c}1`,
      label: `${c}1 ${serviceKindItem.label}${name}・Ⅰ`,
      serviceCode: `${c}1`,
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}2`,
      label: `${c}2 ${serviceKindItem.label}${name}・Ⅱ`,
      serviceCode: `${c}2`,
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });

    list.push({
      value: `${c}3`,
      label: `${c}3 ${serviceKindItem.label}${name}・Ⅲ`,
      serviceCode: `${c}3`,
      ninzuuKbn,
      youkaigodo: youkaigodo ? [youkaigodo] : undefined,
      futanwariai,
      teiinChoka,
      seikatsuenjoJikan,
      kaisuu,
      joukouKaijo,
    });
  }
}

// Sample
const createSampleServiceCodeList = (params: SAMPLETYPE) => {
  const { teikyouStartTime, teikyouEndTime, serviceKindItem, ninzuuKbn, youkaigodo, futanwariai, joukouKaijo, teiinChoka, seikatsuenjoJikan, kaisuu } = params;
  const list: Array<ServiceCodeItem> = [];

  if (!teikyouStartTime || !teikyouEndTime) {
    return list;
  }

  let name = '';
  let code = `${serviceKindItem.value}`;

  if (isShownNinzuu(serviceKindItem)) {
    if (ninzuuKbn !== undefined) {
      name = `${name} ${ninzuuKbn}人`;
      code = `${code}${ninzuuKbn}`;
    } else {
      code = `${code}0`;
    }
  }

  if (isShownYoukaigodo(serviceKindItem)) {
    if (youkaigodo !== undefined) {
      name = `${name} 要介護度コード${youkaigodo}`;
      code = `${code}${youkaigodo}`;
    } else {
      code = `${code}0`;
    }
  }

  if (isShownFutanwariai(serviceKindItem)) {
    if (futanwariai !== undefined) {
      name = `${name} 負担割合コード${futanwariai}`;
      code = `${code}${futanwariai}`;
    } else {
      code = `${code}0`;
    }
  }

  if (isShownTeiinChoka(serviceKindItem)) {
    if (teiinChoka !== undefined) {
      name = `${name} 定員超過コード${teiinChoka}`;
      code = `${code}${teiinChoka}`;
    } else {
      code = `${code}0`;
    }
  }

  const showSeikatsuenjoJikan = isShownSeikatsuenjoJikan(serviceKindItem);
  const showKaisuu = isShownKaisuu(serviceKindItem);

  if (!showSeikatsuenjoJikan && !showKaisuu) {
    addSampleServiceCode(list, code, serviceKindItem, name, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, undefined, undefined);
  } else if (showSeikatsuenjoJikan) {
    if (joukouKaijo !== undefined && joukouKaijo) {
      addSampleServiceCode(list, `${code}10`, serviceKindItem, `${name} 乗降介助`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, undefined, joukouKaijo);
    } else if (typeof seikatsuenjoJikan === 'number') {
      if (seikatsuenjoJikan < 20) {
        addSampleServiceCode(list, `${code}00`, serviceKindItem, `${name}`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 0, undefined, undefined);
      } else if (seikatsuenjoJikan < 45) {
        addSampleServiceCode(list, `${code}01`, serviceKindItem, `${name} 生１(>=20分,<45分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 20, undefined, undefined);
      } else if (seikatsuenjoJikan < 70) {
        addSampleServiceCode(list, `${code}02`, serviceKindItem, `${name} 生２(>=45分,<70分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 45, undefined, undefined);
      } else {
        addSampleServiceCode(list, `${code}03`, serviceKindItem, `${name} 生３(>=70分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 70, undefined, undefined);
      }
    } else {
      addSampleServiceCode(list, `${code}00`, serviceKindItem, `${name}`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 0, undefined, undefined);
      addSampleServiceCode(list, `${code}01`, serviceKindItem, `${name} 生１(>=20分,<45分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 20, undefined, undefined);
      addSampleServiceCode(list, `${code}02`, serviceKindItem, `${name} 生２(>=45分,<70分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 45, undefined, undefined);
      addSampleServiceCode(list, `${code}03`, serviceKindItem, `${name} 生３(>=70分)`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, 70, undefined, undefined);
    }
  } else if (showKaisuu) {
    if (kaisuu !== undefined && kaisuu !== null) {
      if (kaisuu <= 1) {
        addSampleServiceCode(list, `${code}1`, serviceKindItem, `${name}回数1`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 1, undefined);
      } else if (kaisuu < 3) {
        addSampleServiceCode(list, `${code}2`, serviceKindItem, `${name}回数2`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 2, undefined);
      } else {
        addSampleServiceCode(list, `${code}3`, serviceKindItem, `${name}回数X`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 4, undefined);
      }
    } else {
      addSampleServiceCode(list, `${code}1`, serviceKindItem, `${name}回数1`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 1, undefined);
      addSampleServiceCode(list, `${code}2`, serviceKindItem, `${name}回数2`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 2, undefined);
      addSampleServiceCode(list, `${code}3`, serviceKindItem, `${name}回数X`, ninzuuKbn, youkaigodo, futanwariai, teiinChoka, undefined, 4, undefined);
    }
  }

  return filterServiceCodeList(list, teikyouStartTime, teikyouEndTime);
};

const SAMPLE_KASAN_LIST: Array<KaigoSanteiKasan> = [
  { serviceItem: '4114', serviceItemName: '算定加算1', tanisuu: -10, tanisuuShikibetsu: 7, santeiTani: '03', sentaku: true, isHiwari: false },
  { serviceItem: '4115', serviceItemName: '算定加算2', tanisuu: -15, tanisuuShikibetsu: 7, santeiTani: '03', sentaku: false, isHiwari: false },
  { serviceItem: '8110', serviceItemName: '算定加算3', tanisuu: 5, tanisuuShikibetsu: 3, santeiTani: '01', sentaku: false, isHiwari: false },
  { serviceItem: '4000', serviceItemName: '算定加算4', tanisuu: 100, tanisuuShikibetsu: 1, santeiTani: '01', sentaku: false, isHiwari: false },
  { serviceItem: '4001', serviceItemName: '算定加算5', tanisuu: 200, tanisuuShikibetsu: 1, santeiTani: '03', sentaku: false, isHiwari: false },
  { serviceItem: '4004', serviceItemName: '算定加算6', tanisuu: 3, tanisuuShikibetsu: 1, santeiTani: '02', sentaku: false, isHiwari: false },
];

export type FetchWeeklyPlanDialogDataParams = ServiceCodeSearchConditionParamsType & {
  serviceKindItem: OfficeServiceKindListOfServiceList;
  serviceOffice?: OfficeSateliteNameList;
  serviceCodeItem?: ServiceCodeItem;
  skipFetchServiceOfficeList?: boolean;
  skipFetchServiceCodeList?: boolean;
};

type Result = {
  serviceOffice?: OfficeSateliteNameList;
  serviceCodeItem?: ServiceCodeItem;
};

function getCurrentOffice(serviceOfficeList?: Array<OfficeSateliteNameList>, currentOffice?: OfficeSateliteNameList): OfficeSateliteNameList | undefined {
  // 編集時はすでに選択されているもの。新規の場合は取得したものの先頭
  if (!currentOffice) {
    if (!serviceOfficeList) {
      return undefined;
    }
    return serviceOfficeList[0];
  }

  if (!serviceOfficeList) {
    return currentOffice;
  }

  // ただし一覧からなくなっている場合も取得した物の先頭
  const filtered = serviceOfficeList.filter((v) => v.value === currentOffice.value);
  if (!filtered.length) {
    return serviceOfficeList[0];
  }

  return currentOffice;
}

function getCurrentServiceCode(serviceCodeList?: Array<ServiceCodeItem>, currentServiceCode?: ServiceCodeItem): ServiceCodeItem | undefined {
  // 一覧取得がスキップされてるとき
  if (!serviceCodeList) {
    return currentServiceCode;
  }

  // 選択されていないとき
  if (!currentServiceCode) {
    return undefined;
  }

  // 編集時はすでに選択されているもの。新規の場合は未選択
  // 一覧からなくなっている場合はクリア
  const filtered = serviceCodeList.filter((v) => v.value === currentServiceCode.value);
  if (!filtered.length) {
    return undefined;
  }

  return currentServiceCode;
}

const useFetchWeeklyPlanDialogData = (screenID: string, keikakushoStatus: number, riyoushaSeq: number, createDate: number | null) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID, true);

  return React.useCallback(
    async (params: FetchWeeklyPlanDialogDataParams): Promise<Result> => {
      const {
        teikyouStartTime,
        teikyouEndTime,
        serviceKindItem,
        serviceOffice,
        serviceCodeItem,
        seikatsuenjoJikan,
        kaisuu,
        joukouKaijo,
        ninzuuKbn,
        youkaigodo,
        futanwariai,
        teiinChoka,
        skipFetchServiceOfficeList,
        skipFetchServiceCodeList,
      } = params;

      try {
        dispatch(weeklyPlanStore.actions.dialogLoading());
        await sleep(500); // API呼び出してる感用（削除すること）

        // サービス適用事業所の一覧を取得
        let serviceOfficeList;
        if (!skipFetchServiceCodeList && !serviceOfficeList) {
          serviceOfficeList = SAMPLE_SERVICE_OFFICE_MAP[serviceKindItem.value] || DEFAULT_SERVICE_OFFICE_LIST;
        }

        const currentOffice = getCurrentOffice(serviceOfficeList, serviceOffice);

        // サービスコードの一覧を取得
        let serviceCodeList;
        if (!skipFetchServiceCodeList) {
          serviceCodeList = createSampleServiceCodeList({
            teikyouStartTime,
            teikyouEndTime,
            serviceKindItem,
            seikatsuenjoJikan,
            kaisuu,
            joukouKaijo,
            ninzuuKbn,
            youkaigodo,
            futanwariai,
            teiinChoka,
          });
        }

        const currentServiceCode = getCurrentServiceCode(serviceCodeList, serviceCodeItem);

        // 算定加算情報一覧の取得
        const kasanList = [...SAMPLE_KASAN_LIST];

        if (skipFetchServiceCodeList) {
          dispatch(weeklyPlanStore.actions.fetchedWeeklyPlanDialogKasanList({ kasanList }));
        } else if (skipFetchServiceOfficeList) {
          dispatch(
            weeklyPlanStore.actions.fetchedWeeklyPlanDialogServiceCode({
              serviceCodeList: serviceCodeList || [],
              kasanList,
            })
          );
        } else {
          dispatch(
            weeklyPlanStore.actions.fetchedWeeklyPlanDialogData({
              serviceOfficeList: serviceOfficeList || [],
              serviceCodeList: serviceCodeList || [],
              kasanList,
            })
          );
        }

        return {
          serviceOffice: currentOffice,
          serviceCodeItem: currentServiceCode,
        };
      } catch (e) {
        dispatch(weeklyPlanStore.actions.dialogErrored());
        handleApiError(e);
        return { serviceOffice };
      }
    },
    // FIXME: サンプルとして作っているため使っていないものがある
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleApiError, keikakushoStatus, riyoushaSeq, createDate]
  );
};

export default useFetchWeeklyPlanDialogData;
