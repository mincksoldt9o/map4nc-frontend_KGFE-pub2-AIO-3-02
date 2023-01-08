import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { NumberSchema, ObjectSchema, StringSchema } from 'yup';

import { LabelAndValue, OfficeServiceKindListOfServiceList, OfficeSateliteNameList } from 'maps4nc-frontend-web-api/dist/lib/model';
import {
  getServiceColor,
  WeeklyServicePlanService,
  ServiceCodeItem,
  KaigoSanteiKasan,
  isShownSeikatsuenjoJikan,
  isShownKaisuu,
  isShownFutanwariai,
  isShownJoukoukaijo,
  isShownNinzuu,
  isShownYoukaigodo,
  isShownTeiinChoka,
} from '@my/stores/plan/careplan/weeklyplan';
import { RootState, useTypedSelector } from '@my/stores';

import useFetchWeeklyPlanDialogData, { FetchWeeklyPlanDialogDataParams } from '@my/action-hooks/plan/careplan/weeklyPlan/useFetchWeeklyPlanDialogData';
import screenIDs from '@my/screenIDs';
import yup, { yupCombobox, yupNumber } from '@my/yup';
import DateUtils from '@my/utils/DateUtils';
import UseEffectAsync from '@my/utils/UseEffectAsync';

import { LayoutForm, LayoutView, LayoutItem } from '@my/components/layouts/Form';
import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import Label from '@my/components/atomic/Label';
import NumberInput from '@my/components/atomic/NumberInput';
import Accordion from '@my/components/molecules/Accordion';
import CheckboxField from '@my/components/molecules/CheckboxField';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import AvailableDataGrid, { AvailableDataGridValueType } from '@my/components/molecules/AvailableDataGrid';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import NumberInputField from '@my/components/molecules/NumberInputField';
import OptionButtonField from '@my/components/molecules/OptionButtonField';
import TimeInputField from '@my/components/molecules/TimeInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import { EventType, WeekCalendarEventEditDialogContentProps, toStringWeekArray, toWeekArray } from '@my/components/organisms/WeekCalendarTimeGrid';

const DisplayLayoutItem = styled(LayoutItem)<{ $display?: boolean }>`
  display: ${({ $display }) => ($display === undefined || $display ? 'inline' : 'none')};
`;

const ServiceCodeConditionSetLayoutItem = styled(DisplayLayoutItem)`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const ServiceCodeConditionFieldSet = styled.fieldset``;

const ServiceCodeConditionLegend = styled.legend``;

function toNumberOrNull(num?: number | null): number | null {
  if (typeof num === 'number') {
    return num;
  }
  return null;
}

const hokenKbnOptions = [
  { label: '保険', value: '1' },
  { label: '保険外', value: '2' },
];

const teikyouKeitaiJoukoukaijoOptions = [{ label: '乗降介助', value: 'kaijo' }];
// const teikyouKeitaiGiabuServiceOptions = [{ label: '外部サービス', value: 'gaibuService' }]; // Phase2では使用されない
// const teikyouKeitaiFullOptions = [
//   { label: '乗降介助', value: 'kaijo' },
//   { label: '外部サービス', value: 'gaibuService' },
// ]; // Phase2では使用されない

const ninzuuOptions = [
  { label: '1人', value: '1' },
  { label: '2人', value: '2' },
];

const teiinChokaOptions = [
  { value: '1', label: '減算なし' },
  { value: '2', label: '定員超過' },
  { value: '3', label: '人員欠員' },
];

const formSchema = yup.object({
  teikyouStartTime: yup.string().required().label('提供時間開始'),
  teikyouEndTime: yup.string().required().label('提供時間終了'),
  weeks: yup.array<string>().required().min(1).label('提供曜日'),

  serviceKindItem: yupCombobox()
    .label('サービス種類')
    .when('hokenServiceKbn', {
      is: '1',
      then: (schema: ObjectSchema) => schema.required(),
    }),

  displayName: yup
    .string()
    .label('表示名')
    .when('hokenServiceKbn', {
      is: '2',
      then: (schema: StringSchema) => schema.required(),
    }),

  serviceOffice: yupCombobox()
    .label('サービス提供事業所')
    .when(['hokenServiceKbn', 'saveServiceCodeFlag'], {
      is: (hokenServiceKbn, saveServiceCodeFlag) => {
        return hokenServiceKbn === '1' && saveServiceCodeFlag === '1';
      },
      then: (schema: ObjectSchema) => schema.required(),
    }),

  serviceCodeItem: yupCombobox()
    .label('サービスコード')
    .when(['hokenServiceKbn', 'saveServiceCodeFlag'], {
      is: (hokenServiceKbn, saveServiceCodeFlag) => {
        return hokenServiceKbn === '1' && saveServiceCodeFlag === '1';
      },
      then: (schema: ObjectSchema) => schema.required(),
    }),

  seikatsuenjoJikan: yupNumber()
    .label('生活援助時間')
    .when(['hokenServiceKbn', 'saveServiceCodeFlag', 'serviceKindItem', 'serviceCodeItem'], {
      is: (hokenServiceKbn, saveServiceCodeFlag, serviceKindItem?: OfficeServiceKindListOfServiceList, serviceCodeItem?: ServiceCodeItem) => {
        const r1 = hokenServiceKbn === '1' && saveServiceCodeFlag === '1';
        const r2 = isShownSeikatsuenjoJikan(serviceKindItem);
        const r3 = !serviceCodeItem || !serviceCodeItem.joukouKaijo;
        return r1 && r2 && r3;
      },
      then: (schema: NumberSchema) => schema.required(),
    }),

  kaisuuNissuu: yupNumber()
    .label('回数')
    .when(['hokenServiceKbn', 'saveServiceCodeFlag', 'serviceKindItem'], {
      is: (hokenServiceKbn, saveServiceCodeFlag, serviceKindItem?: OfficeServiceKindListOfServiceList) => {
        const r1 = hokenServiceKbn === '1' && saveServiceCodeFlag === '1';
        const r2 = isShownKaisuu(serviceKindItem);
        return r1 && r2;
      },
      then: (schema: NumberSchema) => schema.required(),
    }),
});

type ServiceInputNoSavedFormType = {
  // 条件としてのみ
  youkaigodo?: LabelAndValue | null;
  futanwariai?: LabelAndValue | null;
  ninzuuKbn?: string;
  teikyouKeitai?: Array<string>;
  teiinChoka?: LabelAndValue | null;
};

type ServiceInputFormType = ServiceInputNoSavedFormType & {
  teikyouStartTime?: string;
  teikyouEndTime?: string;
  serviceOffice?: OfficeSateliteNameList;
  serviceCodeItem?: ServiceCodeItem | null;
  seikatsuenjoJikan?: number | null;
  kaisuuNissuu?: number | null;
};

type FormType = ServiceInputFormType & {
  hokenServiceKbn: string;
  weeks?: Array<string>;
  serviceKindItem?: OfficeServiceKindListOfServiceList;
  displayName?: string;

  saveServiceCodeFlag: string; // hidden
};

// サービス絞り込み条件のコンボの選択肢を決定する
function getDefaultLabelAndValue(list: Array<LabelAndValue>, chooses: Array<string>, highPriolityValue?: LabelAndValue) {
  // 選択すべき対象がひとつもない（どれでもいい）場合は、優先＞先頭
  if (!chooses.length) {
    if (highPriolityValue) {
      return highPriolityValue;
    }
    if (list.length) {
      return list[0];
    }
    return null;
  }

  // 選択すべき対象のものに絞る
  const filtered = list.filter((v) => chooses.includes(v.value));
  if (filtered.length) {
    if (highPriolityValue) {
      // 絞ったなかで優先がある場合は優先を使用する
      const filtered2 = filtered.filter((v) => v.value === highPriolityValue.value);
      if (filtered2.length) {
        return highPriolityValue;
      }
      // そうでない場合は先頭
      return filtered[0];
    }
    return filtered[0];
  }

  if (list.length) {
    return list[0];
  }
  return null;
}

type EditSanteiKasanMap = { [key: string]: AvailableDataGridValueType };

// 追加/編集ダイアログの中身を定義する（ダイアログ自体は WeekCalendarTimeGrid が保持、表示など制御する）
// WeekCalendarEventEditDialogContentProps の generics に作成した EventExtendProps を指定したコンポーネントとして作成する
const WeeklyPlanServiceEditDialogContent: React.FC<WeekCalendarEventEditDialogContentProps<WeeklyServicePlanService>> = (props: WeekCalendarEventEditDialogContentProps<WeeklyServicePlanService>) => {
  const {
    event, // イベントデータ。新規でも渡される。新規の場合 data は undefined, id = -1 固定。
    setEvent, // 内容確定時に呼び出す関数
    readonly, // 読み取り専用フラグ。これを用いて部品の制御を行う
    contentRef, // 後述
    weekOptions, // 曜日のオプション（LabelAndValue の配列)。カレンダーの設定により、月曜日開始、日曜日開始で構成されたものが渡してもらえる
    EditDialogContentProps,
  } = props;

  const { keikakushoStatus, riyoushaSeq, createDate } = EditDialogContentProps;
  const screenId = keikakushoStatus === 1 ? screenIDs.L1230_02 : screenIDs.L1340_02;

  const riyousha = useTypedSelector((state: RootState) => state.weeklyPlan.riyousha);
  const loadingStatus = useTypedSelector((state: RootState) => state.weeklyPlan.dialogLoadingStatus);
  const serviceColorMap = useTypedSelector((state: RootState) => state.weeklyPlan.serviceColorMap);
  const serviceKindList = useTypedSelector((state: RootState) => state.weeklyPlan.serviceKindList);
  const serviceOfficeList = useTypedSelector((state: RootState) => state.weeklyPlan.serviceOfficeList);
  const youkaigodoList = useTypedSelector((state: RootState) => state.weeklyPlan.youkaigodoList);
  const futanwariaiList = useTypedSelector((state: RootState) => state.weeklyPlan.futanwariaiList);
  const serviceCodeList = useTypedSelector((state: RootState) => state.weeklyPlan.serviceCodeList);
  const kasanList = useTypedSelector((state: RootState) => state.weeklyPlan.kasanList);

  // 登録データとしてセットされている加算情報リスト
  const defaultEditedKasanMap = React.useMemo<EditSanteiKasanMap>((): EditSanteiKasanMap => {
    if (event.data?.kasanList) {
      const list = event.data.kasanList;
      const map: { [key: string]: AvailableDataGridValueType } = {};

      list.forEach((kasan: KaigoSanteiKasan) => {
        const value: AvailableDataGridValueType = {
          key: kasan.serviceItem,
          label: kasan.serviceItemName,
          value: kasan.sentaku,
        };
        map[value.key] = value;
      });

      return map;
    }
    return {};
    // ダイアログが開いた際に１度だけでいいので
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [editedKasanMap, setEditedKasanMap] = React.useState<EditSanteiKasanMap>(defaultEditedKasanMap);

  const handleChangeKasanDataGrid = (value: AvailableDataGridValueType) => {
    console.log('算定加算変更', value);
    const newEditedKasanMap = { ...editedKasanMap };
    newEditedKasanMap[value.key] = value;
    console.log('算定加算TO', newEditedKasanMap);
    setEditedKasanMap(newEditedKasanMap);
  };

  // APIで取得した編集用の加算リスト
  const defaultKasanList = React.useMemo<Array<AvailableDataGridValueType>>((): Array<AvailableDataGridValueType> => {
    return kasanList.map<AvailableDataGridValueType>((kasan: KaigoSanteiKasan) => {
      const edited = editedKasanMap[kasan.serviceItem];
      const sentaku = edited ? edited.value : kasan.sentaku;
      return {
        key: kasan.serviceItem,
        label: kasan.serviceItemName,
        value: sentaku,
      };
    });
  }, [kasanList, editedKasanMap]);

  const defaultServiceInputNoSavedParams = React.useMemo<ServiceInputNoSavedFormType>((): ServiceInputNoSavedFormType => {
    if (event.data?.hokenServiceKbn !== '2' && event.data?.serviceCodeItem) {
      const { serviceCodeItem } = event.data;
      // TODO 設定されている加算全体の内容の要介護度、負担割合もどれを選択するべきかの内容に含めること
      const defaultRiyoushaYoukaigodo = getDefaultLabelAndValue(youkaigodoList, serviceCodeItem.youkaigodo || [], riyousha?.youkaigodo);
      const defaultRiyoushaFutanwariai = getDefaultLabelAndValue(futanwariaiList, serviceCodeItem.futanwariai ? [serviceCodeItem.futanwariai] : [], riyousha?.futanwariai);
      const defaultTeiinChoka = getDefaultLabelAndValue(teiinChokaOptions, serviceCodeItem.teiinChoka ? [serviceCodeItem.teiinChoka] : []);

      return {
        youkaigodo: defaultRiyoushaYoukaigodo,
        futanwariai: defaultRiyoushaFutanwariai,
        teiinChoka: defaultTeiinChoka,
        ninzuuKbn: serviceCodeItem.ninzuuKbn || '1',
        teikyouKeitai: serviceCodeItem.joukouKaijo ? [teikyouKeitaiJoukoukaijoOptions[0].value] : [],
      };
    }

    const defaultRiyoushaYoukaigodo = getDefaultLabelAndValue(youkaigodoList, [], riyousha?.youkaigodo);
    const defaultRiyoushaFutanwariai = getDefaultLabelAndValue(futanwariaiList, [], riyousha?.futanwariai);
    const defaultTeiinChoka = getDefaultLabelAndValue(teiinChokaOptions, []);
    return {
      youkaigodo: defaultRiyoushaYoukaigodo,
      futanwariai: defaultRiyoushaFutanwariai,
      teiinChoka: defaultTeiinChoka,
      ninzuuKbn: '1',
      teikyouKeitai: [],
    };
    // ダイアログが開いた際に１度だけでいいので
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FormType や validationSchema も画面ごとに定義し、それを使用する
  const { control, errors, handleSubmit, formState, watch, setValue, getValues, register } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: {
      teikyouStartTime: event.start,
      teikyouEndTime: event.end,
      weeks: toStringWeekArray(event.weeks),

      hokenServiceKbn: event.data?.hokenServiceKbn || hokenKbnOptions[0].value,
      serviceKindItem: event.data?.serviceKindItem || serviceKindList[0],
      displayName: event.data?.displayName,

      saveServiceCodeFlag: event.data?.serviceCodeItem ? '1' : '0',
      serviceOffice: event.data?.serviceOffice,
      serviceCodeItem: event.data?.serviceCodeItem,
      seikatsuenjoJikan: toNumberOrNull(event.data?.seikatsuenjoJikan),
      kaisuuNissuu: toNumberOrNull(event.data?.kaisuuNissuu),

      youkaigodo: defaultServiceInputNoSavedParams.youkaigodo,
      futanwariai: defaultServiceInputNoSavedParams.futanwariai,
      teiinChoka: defaultServiceInputNoSavedParams.teiinChoka,
      ninzuuKbn: defaultServiceInputNoSavedParams.ninzuuKbn,
      teikyouKeitai: defaultServiceInputNoSavedParams.teikyouKeitai,
    },
    validationSchema: formSchema,
  });

  const [startTime, setStartTime] = React.useState<string>(event.start);
  const [endTime, setEndTime] = React.useState<string>(event.end);

  const seikatsuenjoJikanRef = React.useRef<number | null>(toNumberOrNull(event.data?.seikatsuenjoJikan));
  const kaisuuNissuuRef = React.useRef<number | null>(toNumberOrNull(event.data?.kaisuuNissuu));

  // 追加や編集で内容に変更があった場合は、props から受け取れる contentRef で編集済みをマークすると、ダイアログの戻るボタンで確認ダイアログが表示されるようになる
  React.useEffect(() => {
    contentRef.current.dirty = formState.dirty;
  }, [contentRef, formState.dirty]);

  // 値変更で画面の表示切り替えを行う必要があるものをwatch
  const watchedHokenKbn = watch('hokenServiceKbn');
  const watchedServiceKindItem = watch('serviceKindItem');
  const watchedServiceCodeItem = watch('serviceCodeItem');
  const watchedTeikyouKeitai = watch('teikyouKeitai');
  const isSaveServiceCode = watch('saveServiceCodeFlag') === '1';

  const handleChangeAccordion = (_: React.ChangeEvent<{}>, expanded: boolean) => {
    setValue('saveServiceCodeFlag', expanded ? '1' : '0');
  };

  // サービスコード絞り込み条件の表示/非表示
  const showFutanwariai = isShownFutanwariai(watchedServiceKindItem);
  const showYoukaigodo = isShownYoukaigodo(watchedServiceKindItem);
  const showJoukoukaijo = isShownJoukoukaijo(watchedServiceKindItem);
  const showNinzuu = isShownNinzuu(watchedServiceKindItem);
  const showTeiinChoka = isShownTeiinChoka(watchedServiceKindItem);

  const showTeikyouKeitai = showJoukoukaijo;
  const teikyouKeitaiOptions = teikyouKeitaiJoukoukaijoOptions;

  const showConditionPane = showFutanwariai || showYoukaigodo || showJoukoukaijo || showNinzuu || showTeiinChoka;

  // 回数, 生活援助時間の表示/非表示
  const showKaisuu = isShownKaisuu(watchedServiceKindItem);
  const showSeikatsuenjoJikan = isShownSeikatsuenjoJikan(watchedServiceKindItem);
  const disabledSeikatsuenjoJikan = !!watchedServiceCodeItem?.joukouKaijo || watchedTeikyouKeitai?.includes('kaijo');

  // データ変更時の取得関係
  const fetchWeeklyPlanDialogData = useFetchWeeklyPlanDialogData(screenId.id, keikakushoStatus, riyoushaSeq, createDate);

  const createFetchParams = (params?: ServiceInputFormType, options?: { skipFetchServiceOfficeList?: boolean; skipFetchServiceCodeList?: boolean }): FetchWeeklyPlanDialogDataParams => {
    const teikyouStartTime = params?.teikyouStartTime === undefined ? startTime : params.teikyouStartTime;
    const teikyouEndTime = params?.teikyouEndTime === undefined ? endTime : params.teikyouEndTime;
    const serviceOffice = params?.serviceOffice || getValues('serviceOffice');
    const serviceCodeItem = params?.serviceCodeItem === undefined ? getValues('serviceCodeItem') : params.serviceCodeItem;
    const seikatsuenjoJikan = params?.seikatsuenjoJikan || getValues('seikatsuenjoJikan');
    const kaisuu = params?.kaisuuNissuu || getValues('kaisuuNissuu');
    const teikyouKeitai = params?.teikyouKeitai || getValues('teikyouKeitai') || [];
    const youkaigodo = params?.youkaigodo || getValues('youkaigodo');
    const futanwariai = params?.futanwariai || getValues('futanwariai');
    const ninzuuKbn = params?.ninzuuKbn || getValues('ninzuuKbn');
    const teiinChoka = params?.teiinChoka || getValues('teiinChoka');

    return {
      teikyouStartTime,
      teikyouEndTime,
      serviceKindItem: watchedServiceKindItem as OfficeServiceKindListOfServiceList,
      serviceOffice,
      serviceCodeItem: serviceCodeItem === null ? undefined : serviceCodeItem,
      seikatsuenjoJikan: showSeikatsuenjoJikan ? (params?.serviceCodeItem ? params.serviceCodeItem.seikatsuenjoJikan : seikatsuenjoJikan) : null,
      kaisuu: showKaisuu ? (params?.serviceCodeItem ? params.serviceCodeItem.kaisuu : kaisuu) : null,
      joukouKaijo: showJoukoukaijo ? (params?.serviceCodeItem ? params.serviceCodeItem.joukouKaijo : teikyouKeitai.includes('kaijo')) : undefined,
      ninzuuKbn: showNinzuu ? ninzuuKbn : undefined,
      youkaigodo: showYoukaigodo && youkaigodo ? youkaigodo.value : undefined,
      futanwariai: showFutanwariai && futanwariai ? futanwariai.value : undefined,
      teiinChoka: showTeiinChoka && teiinChoka ? teiinChoka.value : undefined,
      skipFetchServiceOfficeList: options?.skipFetchServiceOfficeList,
      skipFetchServiceCodeList: options?.skipFetchServiceCodeList,
    };
  };

  const iniializedEffectRef = React.useRef<boolean>(false);

  // 初期とサービス種類変更時
  React.useEffect(
    UseEffectAsync.make(async () => {
      if (watchedHokenKbn === '1' && watchedServiceKindItem) {
        const params = createFetchParams();
        console.log('初期orサービス種類変更', params.serviceKindItem, params);

        const ret = await fetchWeeklyPlanDialogData(params);

        if (ret.serviceOffice) {
          setValue('serviceOffice', ret.serviceOffice);
        }

        if (!ret.serviceCodeItem) {
          setValue('serviceCodeItem', undefined);
          setValue('seikatsuenjoJikan', null, false);
          seikatsuenjoJikanRef.current = null;
          setValue('kaisuuNissuu', null, false);
          kaisuuNissuuRef.current = null;
        }

        if (iniializedEffectRef.current) {
          setEditedKasanMap({});
        }

        iniializedEffectRef.current = true;
      }
    }),
    [watchedHokenKbn, fetchWeeklyPlanDialogData, watchedServiceKindItem?.value]
  );

  // 提供時間（開始）フォーカスアウト時
  const handleBlurTeikyouStartTime = () => {
    const val = getValues('teikyouStartTime') || '';
    setStartTime(val);
  };

  React.useEffect(
    UseEffectAsync.make(async () => {
      if (!iniializedEffectRef.current) {
        return;
      }

      const params = createFetchParams({ teikyouStartTime: startTime }, { skipFetchServiceOfficeList: true });
      console.log('提供時間（開始）変更', params.teikyouStartTime, params);
      const ret = await fetchWeeklyPlanDialogData(params);
      if (!ret.serviceCodeItem) {
        setValue('serviceCodeItem', undefined);
        setValue('seikatsuenjoJikan', null, false);
        seikatsuenjoJikanRef.current = null;
        setValue('kaisuuNissuu', null, false);
        kaisuuNissuuRef.current = null;
      }
    }),
    [startTime]
  );

  // 提供時間（終了）フォーカスアウト時
  const handleBlurTeikyouEndTime = () => {
    const val = getValues('teikyouEndTime') || '';
    setEndTime(val);
  };

  React.useEffect(
    UseEffectAsync.make(async () => {
      if (!iniializedEffectRef.current) {
        return;
      }

      const params = createFetchParams({ teikyouEndTime: endTime }, { skipFetchServiceOfficeList: true });
      console.log('提供時間（終了）変更', params.teikyouEndTime, params);
      const ret = await fetchWeeklyPlanDialogData(params);
      if (!ret.serviceCodeItem) {
        setValue('serviceCodeItem', undefined);
        setValue('seikatsuenjoJikan', null, false);
        seikatsuenjoJikanRef.current = null;
        setValue('kaisuuNissuu', null, false);
        kaisuuNissuuRef.current = null;
      }
    }),
    [endTime]
  );

  // サービス提供事業所変更時
  const handleChangeServiceOffice = async (value?: LabelAndValue | Array<LabelAndValue>) => {
    const serviceOffice = value as OfficeSateliteNameList;
    const params = createFetchParams({ serviceOffice }, { skipFetchServiceOfficeList: true });
    console.log('サービス事業所変更', params.serviceOffice, params);
    await fetchWeeklyPlanDialogData(params);

    setValue('serviceCodeItem', undefined);
    setValue('seikatsuenjoJikan', null, false);
    seikatsuenjoJikanRef.current = null;
    setValue('kaisuuNissuu', null, false);
    kaisuuNissuuRef.current = null;
  };

  // 自己負担割合変更時
  const handleChangeFutanwariai = async (value?: LabelAndValue | Array<LabelAndValue>) => {
    const futanwariai = value as LabelAndValue;
    const params = createFetchParams({ futanwariai }, { skipFetchServiceOfficeList: true });
    console.log('自己負担割合変更', params.futanwariai, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
  };

  // 要介護度変更時
  const handleChangeYoukaigodo = async (value?: LabelAndValue | Array<LabelAndValue>) => {
    const youkaigodo = value as LabelAndValue;
    const params = createFetchParams({ youkaigodo }, { skipFetchServiceOfficeList: true });
    console.log('要介護度変更', params.youkaigodo, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
  };

  // 提供形態変更時
  const handleChangeTeikyouKeitai = async (value?: Array<string>) => {
    const params = createFetchParams({ teikyouKeitai: value }, { skipFetchServiceOfficeList: true });
    console.log('提供形態変更(乗降介助)', value, params.joukouKaijo, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
    const sj = toNumberOrNull(ret.serviceCodeItem?.seikatsuenjoJikan);
    const k = toNumberOrNull(ret.serviceCodeItem?.kaisuu);
    if (seikatsuenjoJikanRef.current === null) {
      seikatsuenjoJikanRef.current = sj;
      setValue('seikatsuenjoJikan', sj, true);
    }
    if (kaisuuNissuuRef.current === null) {
      kaisuuNissuuRef.current = k;
      setValue('kaisuuNissuu', k, true);
    }
  };

  // 人数変更時
  const handleChangeNinzuu = async (value?: string) => {
    const params = createFetchParams({ ninzuuKbn: value }, { skipFetchServiceOfficeList: true });
    console.log('人数変更', params.ninzuuKbn, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
    const sj = toNumberOrNull(ret.serviceCodeItem?.seikatsuenjoJikan);
    const k = toNumberOrNull(ret.serviceCodeItem?.kaisuu);
    if (seikatsuenjoJikanRef.current === null) {
      seikatsuenjoJikanRef.current = sj;
      setValue('seikatsuenjoJikan', sj, true);
    }
    if (kaisuuNissuuRef.current === null) {
      kaisuuNissuuRef.current = k;
      setValue('kaisuuNissuu', k, true);
    }
  };

  // 定員超過変更時
  const handleChangeTeiinChoka = async (value?: LabelAndValue | Array<LabelAndValue>) => {
    const teiinChoka = value as LabelAndValue;
    const params = createFetchParams({ teiinChoka }, { skipFetchServiceOfficeList: true });
    console.log('定員超過変更', params.teiinChoka, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
  };

  // サービスコード変更時
  const handleChangeServiceCode = async (value?: LabelAndValue | Array<LabelAndValue>) => {
    const currentServiceCodeItem = value === undefined ? null : (value as ServiceCodeItem);
    const params = createFetchParams({ serviceCodeItem: currentServiceCodeItem }, { skipFetchServiceOfficeList: true });
    console.log('サービスコード変更', params.serviceCodeItem, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    const sj = toNumberOrNull(ret.serviceCodeItem?.seikatsuenjoJikan);
    const k = toNumberOrNull(ret.serviceCodeItem?.kaisuu);
    if (seikatsuenjoJikanRef.current === null) {
      seikatsuenjoJikanRef.current = sj;
      setValue('seikatsuenjoJikan', sj, true);
    }
    if (kaisuuNissuuRef.current === null) {
      kaisuuNissuuRef.current = k;
      setValue('kaisuuNissuu', k, true);
    }
  };

  // 回数入力フォーカスアウト時
  const handleBlurKaissu = async () => {
    const value = toNumberOrNull(getValues('kaisuuNissuu'));
    if (kaisuuNissuuRef.current === value) {
      return;
    }

    kaisuuNissuuRef.current = value;

    const params = createFetchParams({ kaisuuNissuu: value }, { skipFetchServiceOfficeList: true });
    console.log('回数変更', params.kaisuu, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
  };

  // 生活援助時間入力フォーカスアウト時
  const handleBlurSeikatsuenjoJikan = async () => {
    const value = toNumberOrNull(getValues('seikatsuenjoJikan'));
    if (seikatsuenjoJikanRef.current === value) {
      return;
    }

    seikatsuenjoJikanRef.current = value;

    const params = createFetchParams({ seikatsuenjoJikan: value }, { skipFetchServiceOfficeList: true });
    console.log('生活援助時間変更', params.seikatsuenjoJikan, params);
    const ret = await fetchWeeklyPlanDialogData(params);
    setValue('serviceCodeItem', ret.serviceCodeItem);
  };

  // 登録処理(共通)
  const saveWeeklyPlan = async (data: FormType, copyFlag: boolean) => {
    if (!data.weeks || !data.teikyouStartTime || !data.teikyouEndTime) {
      // required なので引っかかりはしない
      return;
    }

    const serviceKindColor = getServiceColor(serviceColorMap, data.hokenServiceKbn, data.serviceKindItem?.value);

    const weeks = toWeekArray(data.weeks);

    const { hokenServiceKbn } = data;
    const saveServiceCode = hokenServiceKbn === '1' && isSaveServiceCode;

    // コピーの場合は id を -1 にすることで新規追加される
    const id = copyFlag ? -1 : event.id;

    // 加算の編集情報を作成する
    const saveKasanList: Array<KaigoSanteiKasan> = [];
    if (saveServiceCode) {
      kasanList.forEach((kasan: KaigoSanteiKasan) => {
        const saveKasan = { ...kasan };
        const editedKasan = editedKasanMap[kasan.serviceItem];
        saveKasan.sentaku = editedKasan ? !!editedKasan.value : !!kasan.sentaku;
        saveKasanList.push(saveKasan);
      });
    }

    // イベントデータ内に持たせるサービスの情報を作成する
    const serviceData: WeeklyServicePlanService = {
      serviceNaiyouSeq: id,
      hokenServiceKbn,
      teikyouStartTime: DateUtils.convertTime(data.teikyouStartTime) || 0,
      teikyouEndTime: DateUtils.convertTime(data.teikyouEndTime) || 0,
      teikyouWeeks: weeks,

      serviceKindItem: hokenServiceKbn === '1' ? data.serviceKindItem : undefined,
      displayName: data.displayName,

      serviceOffice: saveServiceCode ? data.serviceOffice : undefined,
      serviceCodeItem: saveServiceCode ? data.serviceCodeItem || undefined : undefined,

      // 登録対象かつ、表示されていて、無効（乗降解除じゃない）でない場合にのみ入力内容を設定
      seikatsuenjoJikan: saveServiceCode && showSeikatsuenjoJikan && !disabledSeikatsuenjoJikan ? (data.seikatsuenjoJikan !== null ? data.seikatsuenjoJikan : undefined) : undefined,
      // そもそも登録対象出ない場合は undefined, 非表示になっている場合は 1 固定, 表示されている場合は入力内容
      kaisuuNissuu: !saveServiceCode ? undefined : !showKaisuu ? 1 : data.kaisuuNissuu !== null ? data.kaisuuNissuu : undefined,

      kasanList: saveKasanList,
    };

    // イベントデータを作成する
    const title = data.displayName || `${data.serviceKindItem?.label}`;
    let title4tp = data.displayName || '';
    if (data.serviceKindItem) {
      title4tp += `${title4tp ? '\n' : ''}${data.serviceKindItem.label}`;
    }
    if (saveServiceCode) {
      title4tp += `\n${data.serviceCodeItem?.label}`;
    }

    const newEvent: EventType<WeeklyServicePlanService> = {
      id,
      start: data.teikyouStartTime,
      end: data.teikyouEndTime,
      weeks,
      title, // title, title4tp はイベント(およびツールチップ)に表示する内容を作成して渡す
      title4tp,
      backgroundColor: serviceKindColor.backgroundColor, // 背景色を決める
      color: serviceKindColor.color, // 文字色を決める
      data: serviceData,
    };

    await setEvent(newEvent); // 成功でダイアログは自動で閉じる（NGの場合エラー表示してダイアログはそのまま)
  };

  // 登録処理(通常)
  const handleClickRegister = handleSubmit(async (data) => {
    await saveWeeklyPlan(data, false);
  });

  // 登録処理(コピー追加)
  const handleClickCopyRegister = handleSubmit(async (data) => {
    await saveWeeklyPlan(data, true);
  });

  const id = 'weeklyplan-service-dialog';

  return (
    <>
      <GlobalMessagePanel screenID={screenId.id} mb={2} />

      <DialogContent>
        <LayoutForm id={`${id}-form`}>
          <LayoutItem variant="right-margin">
            <OptionButtonField id={`${id}-hoken-service-kbn`} name="hokenServiceKbn" label="保険区分" options={hokenKbnOptions} control={control} />
          </LayoutItem>

          <LayoutItem variant="1-item-full">
            <CheckboxField
              id={`${id}-weeks`}
              name="weeks"
              label="提供曜日"
              required
              checkboxes={weekOptions}
              orientation="horizontal"
              control={control}
              disabled={readonly}
              error={!!errors.weeks}
              errorMessage={errors.weeks?.message}
            />
          </LayoutItem>

          <LayoutItem variant="1-item-full">
            <Grid container>
              <Grid item>
                <TimeInputField
                  id={`${id}-teikyou-end-time`}
                  name="teikyouStartTime"
                  label="提供時間"
                  required
                  control={control}
                  error={!!errors.teikyouStartTime}
                  errorMessage={errors.teikyouStartTime?.message}
                  onBlur={handleBlurTeikyouStartTime}
                  disabled={readonly}
                />
              </Grid>
              <Grid item>
                <Box ml={1}>
                  <TimeInputField
                    id={`${id}-teikyou-end-time`}
                    labelWidth={45}
                    name="teikyouEndTime"
                    label="～"
                    required
                    control={control}
                    error={!!errors.teikyouEndTime}
                    errorMessage={errors.teikyouEndTime?.message}
                    onBlur={handleBlurTeikyouEndTime}
                    disabled={readonly}
                  />
                </Box>
              </Grid>
            </Grid>
          </LayoutItem>

          {watchedHokenKbn === '1' && (
            <LayoutItem variant="1-item-full">
              <ComboBoxField
                id={`${id}-service-kind`}
                name="serviceKindItem"
                options={serviceKindList}
                label="サービス種類"
                clearable={false}
                required
                control={control}
                error={!!errors.serviceKindItem}
                errorMessage={errors.serviceKindItem?.message}
                disabled={readonly}
              />
            </LayoutItem>
          )}

          <LayoutItem variant="1-item-full">
            <TextInputField
              id={`${id}-display-name`}
              name="displayName"
              type="text"
              label="表示名"
              required={watchedHokenKbn === '2'}
              control={control}
              error={!!errors.displayName}
              errorMessage={errors.displayName?.message}
              disabled={readonly}
            />
          </LayoutItem>

          {watchedHokenKbn === '1' && (
            <div style={{ width: '100%', marginBottom: '8px' }}>
              <input name="saveServiceCodeFlag" type="hidden" ref={register} />
              <Accordion
                id={`${id}-service-code-accordion`}
                summary={`サービスコード入力 ${isSaveServiceCode ? '（設定する）' : '（設定しない）'}`}
                opened={isSaveServiceCode}
                onChange={handleChangeAccordion}>
                <LayoutView>
                  <LayoutItem variant="1-item-full">
                    <ComboBoxField
                      id={`${id}-service-office`}
                      name="serviceOffice"
                      options={serviceOfficeList}
                      label="サービス提供事業所"
                      labelWidth={160}
                      clearable={false}
                      required
                      control={control}
                      onChange={handleChangeServiceOffice}
                      error={!!errors.serviceOffice}
                      errorMessage={errors.serviceOffice?.message}
                      disabled={readonly}
                    />
                  </LayoutItem>

                  <ServiceCodeConditionSetLayoutItem variant="1-item-full" $display={showConditionPane}>
                    <ServiceCodeConditionFieldSet>
                      <ServiceCodeConditionLegend>サービスコード絞込条件</ServiceCodeConditionLegend>

                      <LayoutView>
                        <DisplayLayoutItem variant="right-margin" $display={showFutanwariai}>
                          <ComboBoxField
                            id={`${id}-futanwariai`}
                            name="futanwariai"
                            options={futanwariaiList}
                            label="自己負担割合"
                            labelWidth={154}
                            clearable={false}
                            control={control}
                            disabled={readonly}
                            onChange={handleChangeFutanwariai}
                          />
                        </DisplayLayoutItem>

                        <DisplayLayoutItem variant="right-margin" $display={showYoukaigodo}>
                          <ComboBoxField
                            id={`${id}-youkaigodo`}
                            name="youkaigodo"
                            options={youkaigodoList}
                            label="要介護度"
                            labelWidth={154}
                            clearable={false}
                            control={control}
                            onChange={handleChangeYoukaigodo}
                            disabled={readonly}
                          />
                        </DisplayLayoutItem>

                        <DisplayLayoutItem variant="1-item-full" $display={showTeikyouKeitai}>
                          <CheckboxField
                            id={`${id}-teikyou-keitai`}
                            name="teikyouKeitai"
                            label="提供形態"
                            labelWidth={154}
                            checkboxes={teikyouKeitaiOptions}
                            control={control}
                            onChange={handleChangeTeikyouKeitai}
                            disabled={readonly}
                          />
                        </DisplayLayoutItem>

                        <DisplayLayoutItem variant="right-margin" $display={showNinzuu}>
                          <OptionButtonField
                            id={`${id}-ninzuu-kbn`}
                            name="ninzuuKbn"
                            label="人数"
                            labelWidth={154}
                            options={ninzuuOptions}
                            control={control}
                            onChange={handleChangeNinzuu}
                            disabled={readonly}
                          />
                        </DisplayLayoutItem>

                        <DisplayLayoutItem variant="right-margin" $display={showTeiinChoka}>
                          <ComboBoxField
                            id={`${id}-teiin-choka`}
                            name="teiinChoka"
                            options={teiinChokaOptions}
                            label="定員超過識別"
                            labelWidth={154}
                            clearable={false}
                            control={control}
                            onChange={handleChangeTeiinChoka}
                            disabled={readonly}
                          />
                        </DisplayLayoutItem>
                      </LayoutView>
                    </ServiceCodeConditionFieldSet>
                  </ServiceCodeConditionSetLayoutItem>

                  <LayoutItem variant="1-item-full">
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0 30px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <ComboBoxField
                          id={`${id}-service-code`}
                          name="serviceCodeItem"
                          options={serviceCodeList}
                          label="サービスコード"
                          labelWidth={160}
                          required
                          clearable
                          searchable
                          control={control}
                          onChange={handleChangeServiceCode}
                          error={!!errors.serviceCodeItem}
                          errorMessage={errors.serviceCodeItem?.message}
                          disabled={loadingStatus !== 'Loaded' || readonly}
                        />
                      </div>

                      <div style={{ width: '80px', display: showKaisuu ? undefined : 'none' }}>
                        <NumberInput id={`${id}-kaisuu`} name="kaisuuNissuu" suffix="回" control={control} disabled={readonly} min={0} max={99} onBlur={handleBlurKaissu} />
                      </div>
                    </div>
                  </LayoutItem>

                  <DisplayLayoutItem variant="right-margin" $display={showSeikatsuenjoJikan}>
                    <NumberInputField
                      id={`${id}-seikatsuenjo-jikan`}
                      name="seikatsuenjoJikan"
                      label="生活援助時間"
                      labelWidth={160}
                      suffix="分"
                      min={0}
                      max={999}
                      required
                      control={control}
                      onBlur={handleBlurSeikatsuenjoJikan}
                      error={!!errors.seikatsuenjoJikan}
                      errorMessage={errors.seikatsuenjoJikan?.message}
                      disabled={readonly || disabledSeikatsuenjoJikan}
                    />
                  </DisplayLayoutItem>

                  <Box mt={0} mb={2} ml={1} mr={1} style={{ display: showSeikatsuenjoJikan || showKaisuu ? undefined : 'none' }}>
                    <div style={{ marginLeft: '160px' }}>
                      ※ 先に
                      {showSeikatsuenjoJikan ? '生活援助時間' : ''}
                      {showKaisuu ? '回数' : ''}
                      を入力することでサービスコードをあらかじめ絞り込むこともできます
                    </div>
                  </Box>

                  <LayoutItem variant="1-item-full">
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <div style={{ width: '160px' }}>
                        <Label id={`${id}-santeikanoukasan-label`}>加算情報</Label>
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <AvailableDataGrid id={`${id}-santeikanoukasan`} labelHeaderName="算定可能加算" optionHeaderName="対象" onChange={handleChangeKasanDataGrid} defaultValues={defaultKasanList} />
                      </div>
                    </div>
                  </LayoutItem>
                </LayoutView>
              </Accordion>
            </div>
          )}
        </LayoutForm>
      </DialogContent>

      <DialogActions>
        {event.id > -1 && (
          <GeneralIconButton icon="register" id={`${id}-copy-button`} disabled={loadingStatus !== 'Loaded' || readonly} onClick={handleClickCopyRegister}>
            別サービスとして追加
          </GeneralIconButton>
        )}
        <GeneralIconButton icon="register" id={`${id}-save-button`} disabled={loadingStatus !== 'Loaded' || readonly} onClick={handleClickRegister}>
          決定
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default WeeklyPlanServiceEditDialogContent;
