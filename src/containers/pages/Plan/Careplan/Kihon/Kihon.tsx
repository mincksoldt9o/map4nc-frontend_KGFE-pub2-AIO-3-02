import React, { useState } from 'react';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { CustomConfirmProvider } from '@my/containers/pages/Common/CustomConfirm';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import { FormContext, useForm } from 'react-hook-form';
import useFetchCarePlanKihon from '@my/action-hooks/plan/careplan/kihon/useFetchCarePlanKihon';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import yup from '@my/yup';
import { RootState, useTypedSelector } from '@my/stores';
import { AddUserBasicInformationParam, LabelAndValue, PlanKeikakushoKanri, PlanRiyoushaKihonInfo } from 'maps4nc-frontend-web-api/dist/lib/model';
import screenIDs from '@my/screenIDs';
import { useDispatch, useStore } from 'react-redux';
import kihonStore from '@my/stores/plan/careplan/kihon/KihonStore';
import usePutCarePlanKihon from '@my/action-hooks/plan/careplan/kihon/usePutCarePlanKihon';
import usePostCarePlanKihon from '@my/action-hooks/plan/careplan/kihon/usePostCarePlanKihon';
import { youkaigoOptions, zenkaiYoukaigoOptions } from '../Datas';
import CurrentMedicalHistory from './CurrentMedicalHistory';
import CarePrevention from './CarePrevention';
import BasicInfo from './BasicInfo';

export type KihonMenuTabValueType = 'BASICINFO' | 'CAREPREVENTION' | 'CURRENTMEDICALHISTORY';

// 利用者基本情報内のメニュータブ
const kihonMenuTabs: Array<TabType> = [
  { id: 'BASICINFO', label: '基本情報', value: 'BASICINFO', enabled: true },
  { id: 'CAREPREVENTION', label: '介護予防に関する事項', value: 'CAREPREVENTION', enabled: true },
  { id: 'CURRENTMEDICALHISTORY', label: '現病歴・既往歴と経過', value: 'CURRENTMEDICALHISTORY', enabled: true },
];
const validationSchema = yup.object({});
type PlanRiyoushaKihonInfoData = PlanRiyoushaKihonInfo & {
  isHonninKyojuuJishitsuValue: string;
  isHonninKyojuuJuutakuKaishuuValue: string;
  youkaigoKbnValue: LabelAndValue;
  zenkaiYoukaigoKbnValue: LabelAndValue;
};

const Kihon: React.FC = () => {
  const screenId = screenIDs.K1310_01;
  const mode = useTypedSelector((state: RootState) => state.careplanHeader.mode);
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const rootState = store.getState();
  const [kihonTabsValue, setKihonTabsValue] = React.useState<KihonMenuTabValueType>('CURRENTMEDICALHISTORY');
  const fetchCarePlanKihon = useFetchCarePlanKihon(screenId.id);
  const putCarePlanKihon = usePutCarePlanKihon(screenId.id);
  const postCarePlanKihon = usePostCarePlanKihon(screenId.id);

  const planRiyoushaKihonInfo = useTypedSelector((state: RootState) => state?.careplanKihon.planRiyoushaKihonInfo);
  const [values, setValues] = useState<any>({});
  const { selectedPlanKeikakushoKanri } = rootState.careplanHeader;
  const formMethods = useForm<PlanRiyoushaKihonInfoData>({
    mode: 'onChange',
    defaultValues: React.useMemo(() => planRiyoushaKihonInfo, [planRiyoushaKihonInfo]),
    validationSchema,
  });
  const { handleSubmit, reset, getValues } = formMethods;
  const getKihonKinkyuuRenrakusaki = (obj: any) => {
    const data: Array<any> = [];

    for (let i = 0; Object.prototype.hasOwnProperty.call(obj, `kihonKinkyuuRenrakusaki[${i}].tsuzukigaraName`); i += 1) {
      data.push({
        address: obj[`kihonKinkyuuRenrakusaki[${i}].address`],
        renrakusakiName: obj[`kihonKinkyuuRenrakusaki[${i}].renrakusakiName`],
        tsuzukigaraName: obj[`kihonKinkyuuRenrakusaki[${i}].tsuzukigaraName`],
        tel1: obj[`kihonKinkyuuRenrakusaki[${i}].tel1`],
        tel2: obj[`kihonKinkyuuRenrakusaki[${i}].tel2`],
      });
    }
    return data;
  };
  React.useEffect(
    UseEffectAsync.make(async () => {
      setKihonTabsValue('CURRENTMEDICALHISTORY');
      if (mode === 'edit') {
        await fetchCarePlanKihon();
      } else {
        dispatch(kihonStore.actions.fetchCarePlanKihon({}));
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchCarePlanKihon, mode]
  );
  React.useEffect(
    () => {
      if (planRiyoushaKihonInfo) {
        const data = {
          ...planRiyoushaKihonInfo,
          isHonninKyojuuJishitsuValue: planRiyoushaKihonInfo.isHonninKyojuuJishitsu ? '1' : '0',
          isHonninKyojuuJuutakuKaishuuValue: planRiyoushaKihonInfo.isHonninKyojuuJuutakuKaishuu ? '1' : '0',
          youkaigoKbnValue: youkaigoOptions.find((item: LabelAndValue) => {
            return item.value === planRiyoushaKihonInfo.youkaigoKbn;
          }),
          zenkaiYoukaigoKbnValue: zenkaiYoukaigoOptions.find((item: LabelAndValue) => {
            return item.value === planRiyoushaKihonInfo.zenkaiYoukaigoKbn;
          }),
        };
        reset(data, { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false });
        setKihonTabsValue('BASICINFO');
        setValues(data);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [planRiyoushaKihonInfo]
  );

  const handleSubmitForm = handleSubmit(async (data) => {
    let changeValues = await { ...(values || {}), ...data };
    if (Object.prototype.hasOwnProperty.call(getValues(), `soudanDate`)) {
      changeValues = { ...(changeValues || {}), kihonKinkyuuRenrakusaki: getKihonKinkyuuRenrakusaki(getValues()) };
    }
    const planKeikakushoKanriDefault: PlanKeikakushoKanri = {
      updateAt: new Date().getTime(),
      keikakuSakuseiDate: new Date().getTime(),
      keikakuSakuseiStaffName: '',
      serviceTeikyouYearMonth: 0,
      memo: '',
      isGenan: true,
      isTeishutsu: true,
      minaoshiDate: new Date().getTime(),
      officeSeq: new Date().getTime(),
      officeServiceKindSeq: new Date().getTime(),
      riyoushaSeq: new Date().getTime(),
      keikakushoShubetsu: '',
      keikakushoSeq: new Date().getTime(),
    };
    const requestBody: AddUserBasicInformationParam = {
      planRiyoushaKihonInfo: changeValues,
      planKeikakushoKanri: selectedPlanKeikakushoKanri?.info || planKeikakushoKanriDefault,
    };

    if (mode === 'add') {
      await postCarePlanKihon(requestBody);
    }
    if (mode === 'edit') {
      await putCarePlanKihon(requestBody);
    }
  });

  const getKihonKioureki = (obj: any) => {
    const data: Array<any> = [];

    for (let i = 0; Object.prototype.hasOwnProperty.call(obj, `kihonKioureki[${i}].byoumeiName`); i += 1) {
      data.push({
        byoumeiName: obj[`kihonKioureki[${i}].byoumeiName`],
        chiryouNaiyou: obj[`kihonKioureki[${i}].chiryouNaiyou`],
        doctorName: obj[`kihonKioureki[${i}].doctorName`],
        iryoukikanName: obj[`kihonKioureki[${i}].iryoukikanName`],
        isShuDoctor: obj[`kihonKioureki[${i}].isShuDoctor`],
        keikaKbn: obj[`kihonKioureki[${i}].keikaKbn`],
        tel: obj[`kihonKioureki[${i}].tel`],
        hasshoujikiTime: obj[`kihonKioureki[${i}].hasshoujikiTime`],
      });
    }
    return data;
  };

  const handleTabChange = (_: React.ChangeEvent<{}>, value: KihonMenuTabValueType) => {
    let changeValues = { ...(values || {}), ...getValues() };
    if (Object.prototype.hasOwnProperty.call(getValues(), `soudanDate`)) {
      changeValues = { ...(changeValues || {}), kihonKinkyuuRenrakusaki: getKihonKinkyuuRenrakusaki(getValues()) };
    }
    if (Object.prototype.hasOwnProperty.call(getValues(), `koutekiService`)) {
      console.log(getValues());
      changeValues = { ...(changeValues || {}), kihonKioureki: getKihonKioureki(getValues()) };
    }
    setValues(changeValues);
    reset(changeValues, { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false });
    setKihonTabsValue(value);
  };

  return (
    <CustomConfirmProvider>
      <FormContext {...formMethods}>
        <CareplanHeader id="kihon" screenId={screenIDs.L1310_01.id} screenName="利用者基本情報" screenKbn="21310" riyoushaSeq={1}>
          {/* 利用者基本情報内のメニュータブ */}
          <Tabs id="kihon-tabs" orientation="horizontal" value={kihonTabsValue} tabs={kihonMenuTabs} onChange={handleTabChange} minWidth={60} />
          {kihonTabsValue === 'BASICINFO' && <BasicInfo id="basicInfo" defaultData={values} mode={mode} />}
          {kihonTabsValue === 'CAREPREVENTION' && <CarePrevention id="carePrevention" mode={mode} />}
          {kihonTabsValue === 'CURRENTMEDICALHISTORY' && <CurrentMedicalHistory id="currentMedicalHistory" defaultData={values} mode={mode} />}
        </CareplanHeader>
      </FormContext>
      <GeneralIconFloatingActionButton id="form-submit-button" icon="register" onClick={handleSubmitForm}>
        登録
      </GeneralIconFloatingActionButton>
    </CustomConfirmProvider>
  );
};

export default Kihon;
