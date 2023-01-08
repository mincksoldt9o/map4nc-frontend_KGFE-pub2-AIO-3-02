import React, { useEffect, useState, RefObject, useImperativeHandle } from 'react';
import { useEffectOnce } from 'react-use';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { RootState, useTypedSelector } from '@my/stores';
import DateUtils from '@my/utils/DateUtils';
import Tabs, { TabType } from '@my/components/molecules/Tabs/Tabs';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import { useClearApiMessage } from '@my/action-hooks';
import { useSetDirty } from '@my/action-hooks/plan/keikakusho';
import { useSaveKhoumonSkyotaku, usePrintKhoumonSkyotaku } from '@my/action-hooks/plan/keikakusho/keikakushoKhoumonSkyotaku';
import KihonNichijouForm, { KihonNichijouType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/KihonNichijouForm';
import EnjoMokuhyouForm, { EnjoMokuhyouType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/EnjoMokuhyouForm';
import HonninFamilyForm, { HonninFamilyType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/HonninFamilyForm';
import EnjoNaiyouForm, { EnjoNaiyouType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/EnjoNaiyouForm';
import ShuukanYoteiForm, { ShuukanYoteiColumnType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/ShuukanYoteiForm';
import ServiceJisshiForm, { ServiceJisshiType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/ServiceJisshiForm';
import { HistoryDateType, EditProps, PrintType } from '@my/containers/pages/Plan/Keikakusho';
import { HoumonKaigoKeikakushoBase } from 'maps4nc-frontend-web-api/dist/lib/model';

const InnerArea = styled.div`
  padding: 1em 0 0 0;
`;
// 計画書内のタブ //
const TabValues: Map<string, string> = new Map([
  ['kihonnichijou', '1'],
  ['enjomokuhyou', '2'],
  ['honninfamily', '3'],
  ['enjonaiyou', '4'],
  ['shuukanyotei', '5'],
  ['servicejisshi', '6'],
]);

export type KhoumonSkyotakuType = HistoryDateType &
  KihonNichijouType & {
    shuukanYoteihyouList: ShuukanYoteiColumnType[];
    enjoMokuhyouList: EnjoMokuhyouType[];
    enjoNaiyouList: EnjoNaiyouType[];
  } & HonninFamilyType &
  ServiceJisshiType &
  OtherType;

type OtherType = {
  officeName?: string;
  officeCode?: string;
  officeTel1?: string;
};

type EditFormProps = EditProps & {
  printRef: RefObject<PrintType>;
  // ※ 名をrefにしない。メソッドが必ずnullになる //
  defaultValues: KhoumonSkyotakuType;
};

const KhoumonSkyotakuEditForm: React.FC<EditFormProps> = (props: EditFormProps) => {
  const { screenId, headerTabId, defaultValues, printRef, isReadonly = false } = props;
  const clearApiMessage = useClearApiMessage();
  const saveKhoumonSkyotaku = useSaveKhoumonSkyotaku(screenId.id);
  const printKhoumonSkyotaku = usePrintKhoumonSkyotaku(screenId.id);
  const setDirty = useSetDirty();
  const { mode, selectEditTab } = useTypedSelector((state: RootState) => state.keikakusho);
  const { kihonInfo } = useTypedSelector((state: RootState) => state.keikakushoKhoumonSkyotaku);
  const isCreateMode = mode === 'add';
  const [isInit, setIsInit] = useState(false);
  const [values, setValues] = useState(defaultValues);
  const [selectedTab, setSelectedTab] = useState<string>(selectEditTab || TabValues.get('kihonnichijou') || '');
  const tabs: TabType[] = [
    { id: 'kihonnichijou', label: '日常生活の状況', value: TabValues.get('kihonnichijou') },
    { id: 'enjomokuhyou', label: '援助目標', value: TabValues.get('enjomokuhyou') },
    { id: 'honninfamily', label: '本人・家族の希望', value: TabValues.get('honninfamily') },
    { id: 'enjonaiyou', label: '具体的援助内容', value: TabValues.get('enjonaiyou') },
    { id: 'shuukanyotei', label: '週間予定表', value: TabValues.get('shuukanyotei') },
    { id: 'servicejisshi', label: 'サービス実施評価', value: TabValues.get('servicejisshi') },
  ];
  const {
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { dirty: formDirty },
    register,
  } = useFormContext<KhoumonSkyotakuType>();
  // const { dirty: formDirty } = formState;
  const formValuesChange = (tabId: string) => {
    let resultValues = {};
    let formType: 'enjoMokuhyouList' | 'enjoNaiyouList' | 'shuukanYoteihyouList' | undefined;
    // 配列は、watch で取得しないと配列形式でとれなかったので、watch する //
    if (tabId === TabValues.get('enjomokuhyou')) {
      formType = 'enjoMokuhyouList';
    } else if (tabId === TabValues.get('enjonaiyou')) {
      formType = 'enjoNaiyouList';
    } else if (tabId === TabValues.get('shuukanyotei')) {
      formType = 'shuukanYoteihyouList';
    }
    if (formType) {
      const sakuseiDate = getValues('sakuseiDate');
      const memo = getValues('memo');
      if (formType === 'enjoMokuhyouList') {
        const { enjoMokuhyouList: list } = values;
        resultValues = {
          sakuseiDate,
          memo,
          [formType]: (watch(formType) || []).map(
            (value, index): EnjoMokuhyouType => ({ rowIndex: index, enjoMokuhyouType: list[index].enjoMokuhyouType, enjoMokuhyouSeq: list[index].enjoMokuhyouSeq, ...value })
          ),
        };
      } else if (formType === 'enjoNaiyouList') {
        const { enjoNaiyouList: list } = values;
        resultValues = {
          sakuseiDate,
          memo,
          [formType]: (watch(formType) || []).map(
            (value, index): EnjoNaiyouType => ({ enjoNaiyouSeq: list[index].enjoNaiyouSeq, serviceNaiyouSeq: list[index].serviceNaiyouSeq, weeks: list[index].weeks, ...value })
          ),
        };
      } else {
        const { shuukanYoteihyouList: list } = values;
        resultValues = {
          sakuseiDate,
          memo,
          [formType]: (getValues(formType) || []).map((value, index): ShuukanYoteiColumnType => ({ shuukanYoteihyouSeq: list[index].shuukanYoteihyouSeq, ...value })),
        };
        // ShuukanYoteiForm の DataGrid は、reset かけているので getValues で取得する //
      }
    } else {
      resultValues = { ...(getValues() || {}) };
    }
    return resultValues;
  };
  const handleTabChange = (_: React.ChangeEvent<{}>, value: string) => {
    // console.log(e.currentTarget);
    // e.preventDefault();
    const changeValues = { ...values, ...formValuesChange(selectedTab) };
    // タブ変更前に現在の表示データを state 更新 //
    setValues(changeValues);
    reset(changeValues, { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false });
    setSelectedTab(value);
  };
  const handleRequestData = (data: KhoumonSkyotakuType, isPrint?: boolean): HoumonKaigoKeikakushoBase | undefined => {
    if (!data.sakuseiDate) {
      return undefined;
    }
    const enjoMokuhyouList = (isPrint
      ? data.enjoMokuhyouList
      : data.enjoMokuhyouList.filter(
          (value) => !(!value.mokuhyou && !value.mokuhyouStartDate && !value.mokuhyouEndDate && !value.mokuhyouGekkan && !value.mokuhyouMinaoshiDate && !value.mokuhyouMinaoshiShiten)
        )
    ).map((value) => ({
      enjoMokuhyouType: value.enjoMokuhyouType,
      enjoMokuhyouSeq: value.enjoMokuhyouSeq,
      mokuhyou: value.mokuhyou,
      mokuhyouStartDate: value.mokuhyouStartDate ? value.mokuhyouStartDate.getTime() : undefined,
      mokuhyouEndDate: value.mokuhyouEndDate ? value.mokuhyouEndDate.getTime() : undefined,
      mokuhyouGekkan: value.mokuhyouGekkan,
      mokuhyouMinaoshiDate: value.mokuhyouMinaoshiDate ? value.mokuhyouMinaoshiDate.getTime() : undefined,
      mokuhyouMinaoshiShiten: value.mokuhyouMinaoshiShiten,
    }));
    const enjoNaiyouList = (isPrint
      ? data.enjoNaiyouList
      : data.enjoNaiyouList.filter(
          (value) => !(!value.serviceKubun && !value.serviceNoNaiyou && !value.shoyouJikan && !value.ryuuiJikou && !value.weeks.length && !value.startTime && !value.endTime && !value.serviceItemName)
        )
    ).map((value) => {
      const weeks = {
        isMondayServiceTeikyou: value.weeks.indexOf('1') > -1,
        isTuesdayServiceTeikyou: value.weeks.indexOf('2') > -1,
        isWednesdayServiceTeikyou: value.weeks.indexOf('3') > -1,
        isThursdayServiceTeikyou: value.weeks.indexOf('4') > -1,
        isFridayServiceTeikyou: value.weeks.indexOf('5') > -1,
        isSaturdayServiceTeikyou: value.weeks.indexOf('6') > -1,
        isSundayServiceTeikyou: value.weeks.indexOf('0') > -1,
      };
      return {
        enjoNaiyouSeq: value.enjoNaiyouSeq,
        serviceNaiyouSeq: value.serviceNaiyouSeq,
        serviceKubun: value.serviceKubun,
        serviceNoNaiyou: value.serviceNoNaiyou,
        shoyouJikan: value.shoyouJikan,
        ryuuiJikou: value.ryuuiJikou,
        startTime: value.startTime ? DateUtils.convertTime(value.startTime) : undefined,
        endTime: value.endTime ? DateUtils.convertTime(value.endTime) : undefined,
        serviceItemName: value.serviceItemName,
        ...weeks,
      };
    });
    const shuukanYoteihyouList = (isPrint
      ? data.shuukanYoteihyouList
      : data.shuukanYoteihyouList.filter(
          (value) =>
            !(
              !value.startTime &&
              !value.endTime &&
              !value.goukeiTime &&
              !value.mondayServiceNaiyou &&
              !value.tuesdayServiceNaiyou &&
              !value.wednesdayServiceNaiyou &&
              !value.thursdayServiceNaiyou &&
              !value.fridayServiceNaiyou &&
              !value.saturdayServiceNaiyou &&
              !value.sundayServiceNaiyou
            )
        )
    ).map((value) => ({
      shuukanYoteihyouSeq: value.shuukanYoteihyouSeq,
      startTime: value.startTime ? DateUtils.convertTime(value.startTime) : undefined,
      endTime: value.endTime ? DateUtils.convertTime(value.endTime) : undefined,
      goukeiTime: value.goukeiTime,
      mondayServiceNaiyou: value.mondayServiceNaiyou,
      tuesdayServiceNaiyou: value.tuesdayServiceNaiyou,
      wednesdayServiceNaiyou: value.wednesdayServiceNaiyou,
      thursdayServiceNaiyou: value.thursdayServiceNaiyou,
      fridayServiceNaiyou: value.fridayServiceNaiyou,
      saturdayServiceNaiyou: value.saturdayServiceNaiyou,
      sundayServiceNaiyou: value.sundayServiceNaiyou,
    }));
    return {
      keikakuSakuseiDate: data.sakuseiDate.getTime(),
      keikakuSakuseiStaffName: data.keikakuSakuseiStaffName,
      memo: data.memo,
      zenkaiKeikakuSakuseiDate: data.zenkaiKeikakuSakuseiDate ? data.zenkaiKeikakuSakuseiDate.getTime() : undefined,
      riyoushaName: kihonInfo.riyoushaName,
      sexKbn: kihonInfo.sexKbn,
      birthDate: kihonInfo.birthDate,
      age: kihonInfo.age,
      address: kihonInfo.address,
      tel1: kihonInfo.tel1,
      youkaigoKaigodoNinteiDate: data.youkaigoKaigodoNinteiDate ? data.youkaigoKaigodoNinteiDate.getTime() : undefined,
      youkaigoShougaiShien: data.youkaigoShougaiShien,
      futangakuJougen: data.futangakuJougen,
      shuKaigoshaName: data.shuKaigoshaName,
      shuKaigoshaTsuzukigaraName: data.shuKaigoshaTsuzukigaraName,
      shuKaigoshaAddress: data.shuKaigoshaAddress,
      shuKaigoshaTel1: data.shuKaigoshaTel1,
      shuKaigoshaTel2: data.shuKaigoshaTel2,
      kyotakuOfficeName: data.kyotakuOfficeName,
      kyotakuOfficeCode: data.kyotakuOfficeCode,
      careLicenseStaffName: data.careLicenseStaffName,
      shintaiKaigoJikan: data.shintaiKaigoJikan,
      kajiEnjyoJikan: data.kajiEnjyoJikan,
      jyuudohoumonKaigoJikan: data.jyuudohoumonKaigoJikan,
      tsuuinJoukouKaijoJikan: data.tsuuinJoukouKaijoJikan,
      doukouEngoJikan: data.doukouEngoJikan,
      koudouEngoJikan: data.koudouEngoJikan,
      riyoushaDescriptionDate: data.riyoushaDescriptionDate ? data.riyoushaDescriptionDate.getTime() : undefined,
      riyoushaDescriptionStaffName: data.riyoushaDescriptionStaffName,
      nichijouSeikatsuZenpan: data.nichijouSeikatsuZenpan,
      enjoMokuhyouList,
      sintaiKaigoNaiyou: data.sintaiKaigoNaiyou,
      seikatsuEnjoNaiyou: data.seikatsuEnjoNaiyou,
      tsuuinJoukouKaijoNaiyou: data.tsuuinJoukouKaijoNaiyou,
      honninFamilyIkou: data.honninFamilyIkou,
      honninFamilyNegai: data.honninFamilyNegai,
      enjoNaiyouList,
      shuukanYoteihyouList,
      mokuhyouTasseido: data.mokuhyouTasseido,
      mokuhyouTasseidoHyoukaDate: data.mokuhyouTasseidoHyoukaDate ? data.mokuhyouTasseidoHyoukaDate.getTime() : undefined,
      riyoushaManzokudo: data.riyoushaManzokudo,
      riyoushaManzokudoHyoukaDate: data.riyoushaManzokudoHyoukaDate ? data.riyoushaManzokudoHyoukaDate.getTime() : undefined,
      keikakuMinaoshi: data.keikakuMinaoshi,
      keikakuMinaoshiHyoukaDate: data.keikakuMinaoshiHyoukaDate ? data.keikakuMinaoshiHyoukaDate.getTime() : undefined,
      ...(isPrint ? { officeName: data.officeName, officeCode: data.officeCode, officeTel1: data.officeTel1 } : {}),
    };
  };
  const handleSubmitForm = handleSubmit(async (data: KhoumonSkyotakuType) => {
    clearApiMessage(screenId.id);
    const { sakuseiDate, memo } = data;
    let resultValues;
    if (selectedTab === TabValues.get('enjomokuhyou')) {
      const { enjoMokuhyouList: list } = values;
      const { enjoMokuhyouList } = data;
      resultValues = {
        ...values,
        sakuseiDate,
        memo,
        enjoMokuhyouList: enjoMokuhyouList.map(
          (value, index): EnjoMokuhyouType => ({ rowIndex: index, enjoMokuhyouType: list[index].enjoMokuhyouType, enjoMokuhyouSeq: list[index].enjoMokuhyouSeq, ...value })
        ),
      };
    } else if (selectedTab === TabValues.get('enjonaiyou')) {
      const { enjoNaiyouList: list } = values;
      const { enjoNaiyouList } = data;
      resultValues = {
        ...values,
        sakuseiDate,
        memo,
        enjoNaiyouList: enjoNaiyouList.map(
          (value, index): EnjoNaiyouType => ({ enjoNaiyouSeq: list[index].enjoNaiyouSeq, serviceNaiyouSeq: list[index].serviceNaiyouSeq, weeks: list[index].weeks, ...value })
        ),
      };
    } else if (selectedTab === TabValues.get('shuukanyotei')) {
      const { shuukanYoteihyouList: list } = values;
      // const { shuukanYoteihyouList } = data;
      const shuukanYoteihyouList = getValues('shuukanYoteihyouList');
      // ShuukanYoteiForm の DataGrid は、reset かけているので handleSubmit data に変更前の値が渡される。 getValues で取得する //
      resultValues = {
        ...values,
        sakuseiDate,
        memo,
        shuukanYoteihyouList: shuukanYoteihyouList.map((value, index): ShuukanYoteiColumnType => ({ shuukanYoteihyouSeq: list[index].shuukanYoteihyouSeq, ...value })),
      };
    } else {
      resultValues = { ...values, ...data, enjoMokuhyouList: values.enjoMokuhyouList };
    }
    const reqData = handleRequestData(resultValues);
    if (reqData) {
      await saveKhoumonSkyotaku(reqData, selectedTab);
    }
  });
  useImperativeHandle(printRef, () => ({
    handleClickPDFDownload() {
      const reqData = handleRequestData({ ...values, ...formValuesChange(selectedTab) }, true);
      return reqData ? printKhoumonSkyotaku('1', reqData) : Promise.resolve(undefined);
    },
    handleClickEXCELDownload() {
      const reqData = handleRequestData({ ...values, ...formValuesChange(selectedTab) }, true);
      return reqData ? printKhoumonSkyotaku('2', reqData) : Promise.resolve(undefined);
    },
    handleClickPDFPreview() {
      const reqData = handleRequestData({ ...values, ...formValuesChange(selectedTab) }, true);
      return reqData ? printKhoumonSkyotaku('3', reqData) : Promise.resolve(undefined);
    },
  }));

  useEffect(() => {
    // console.log('headerTabId: ', headerTabId);
    if (headerTabId === '2') {
      register({ name: 'futangakuJougen' });
    }
    [...Array(values.enjoMokuhyouList.length)].forEach((_, index) => {
      register({ name: `enjoMokuhyouList[${index}].startEndDate` });
      register({ name: `enjoMokuhyouList[${index}].mokuhyouEndDate` });
      register({ name: `enjoMokuhyouList[${index}].mokuhyouStartDate` });
    });
  }, [headerTabId, register, values.enjoMokuhyouList.length]);

  useEffect(() => {
    if (!isCreateMode && formDirty) {
      setDirty(formDirty);
    }
  }, [setDirty, isCreateMode, formDirty]);

  useEffectOnce(() => {
    reset(defaultValues, { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false });
    setIsInit(true);
    return () => {
      // console.log('unmount');
    };
  });

  return (
    <>
      {isInit && (
        <>
          <Tabs id="khoumonskyotaku-edit-tabs" orientation="horizontal" value={selectedTab} tabs={tabs} onChange={handleTabChange} />
          <InnerArea>
            {selectedTab === TabValues.get('kihonnichijou') && <KihonNichijouForm id="kihonnichijou" headerTabId={headerTabId} />}
            {selectedTab === TabValues.get('enjomokuhyou') && <EnjoMokuhyouForm id="enjomokuhyou" headerTabId={headerTabId} />}
            {selectedTab === TabValues.get('honninfamily') && <HonninFamilyForm id="honninfamily" headerTabId={headerTabId} />}
            {selectedTab === TabValues.get('enjonaiyou') && <EnjoNaiyouForm id="enjonaiyou" headerTabId={headerTabId} />}
            {selectedTab === TabValues.get('shuukanyotei') && <ShuukanYoteiForm id="shuukanyotei" headerTabId={headerTabId} />}
            {selectedTab === TabValues.get('servicejisshi') && <ServiceJisshiForm id="servicejisshi" headerTabId={headerTabId} />}
          </InnerArea>
          <GeneralIconFloatingActionButton id="save-button" icon="register" onClick={handleSubmitForm} disabled={isReadonly}>
            登録
          </GeneralIconFloatingActionButton>
        </>
      )}
    </>
  );
};

export default KhoumonSkyotakuEditForm;
