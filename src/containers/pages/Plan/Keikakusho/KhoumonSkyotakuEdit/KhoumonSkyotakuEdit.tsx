import React, { RefObject, useImperativeHandle, useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import Container from '@material-ui/core/Container';
import { RootState, useTypedSelector } from '@my/stores';
import { useClearKhoumonSkyotaku, useFetchKhoumonSkyotaku, useFetchKihonInfo } from '@my/action-hooks/plan/keikakusho/keikakushoKhoumonSkyotaku';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import { EditProps, HistoryCalendarChangeType, PrintType, ToNullDate, ToEmptyStringTime } from '@my/containers/pages/Plan/Keikakusho';
import KhoumonSkyotakuEditForm, { KhoumonSkyotakuType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/KhoumonSkyotakuEditForm';
import { EnjoNaiyouType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/EnjoNaiyouForm';
import { EnjoMokuhyouType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/EnjoMokuhyouForm';
import { ShuukanYoteiColumnType } from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit/ShuukanYoteiForm';

type Props = EditProps & {
  // ※ 名をrefにしない。メソッドが必ずnullになる //
  printRef: RefObject<PrintType>;
  historyRef: RefObject<HistoryCalendarChangeType>;
};

const KhoumonSkyotakuEdit: React.FC<Props> = (props: Props) => {
  const { screenId, headerTabId, historyRef, printRef, isReadonly } = props;
  const clearKhoumonSkyotaku = useClearKhoumonSkyotaku();
  const fetchKhoumonSkyotaku = useFetchKhoumonSkyotaku(screenId.id);
  const fetchKihonInfo = useFetchKihonInfo(screenId.id);
  const { keikakushoInfo, loadingEditStatus: loadingStatus } = useTypedSelector((state: RootState) => state.keikakusho);
  const { khoumonSkyotakuKeikakusho: resData } = useTypedSelector((state: RootState) => state.keikakushoKhoumonSkyotaku);
  const formDefaultValues = useMemo((): KhoumonSkyotakuType => {
    const enjoMokuhyouList: EnjoMokuhyouType[] = [...Array(6)];
    const enjoMokuhyouData = resData.enjoMokuhyouList || [];
    const enjoMokuhyouCount = enjoMokuhyouData.length;
    for (let i = 0, enjoMokuhyouType = 0, enjoMokuhyouSeq = 0, mokuhyouGekkan: number | undefined, index = 0; i < enjoMokuhyouCount; i += 1) {
      enjoMokuhyouType = parseInt(enjoMokuhyouData[i].enjoMokuhyouType, 10) || 1;
      enjoMokuhyouSeq = enjoMokuhyouData[i].enjoMokuhyouSeq || 1;
      mokuhyouGekkan = enjoMokuhyouData[i].mokuhyouGekkan;
      index = (enjoMokuhyouType - 1) * 3 + enjoMokuhyouSeq - 1;
      enjoMokuhyouList[index] = {
        rowIndex: index,
        enjoMokuhyouType: enjoMokuhyouType.toString(),
        enjoMokuhyouSeq,
        mokuhyou: enjoMokuhyouData[i].mokuhyou,
        mokuhyouStartDate: ToNullDate(enjoMokuhyouData[i].mokuhyouStartDate),
        mokuhyouEndDate: ToNullDate(enjoMokuhyouData[i].mokuhyouEndDate),
        mokuhyouGekkan,
        mokuhyouMinaoshiDate: ToNullDate(enjoMokuhyouData[i].mokuhyouMinaoshiDate),
        mokuhyouMinaoshiShiten: enjoMokuhyouData[i].mokuhyouMinaoshiShiten,
      };
    }
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0, index = 0; j < 3; j += 1) {
        index = i * 3 + j;
        if (!enjoMokuhyouList[index]) {
          enjoMokuhyouList[index] = { rowIndex: index, enjoMokuhyouType: (i + 1).toString(), enjoMokuhyouSeq: j + 1, mokuhyouStartDate: null, mokuhyouEndDate: null, mokuhyouMinaoshiDate: null };
        }
      }
    }
    const enjoNaiyouList: EnjoNaiyouType[] = [...Array(35)];
    const enjoNaiyouListData = resData.enjoNaiyouList || [];
    const enjoNaiyouCount = enjoNaiyouListData.length;
    for (let i = 0, enjoNaiyouSeq = 0, serviceNaiyouSeq = 0, index = 0; i < enjoNaiyouCount; i += 1) {
      enjoNaiyouSeq = enjoNaiyouListData[i].enjoNaiyouSeq || 1;
      serviceNaiyouSeq = enjoNaiyouListData[i].serviceNaiyouSeq;
      index = (enjoNaiyouSeq - 1) * 7 + serviceNaiyouSeq;
      if (serviceNaiyouSeq) {
        enjoNaiyouList[index] = {
          enjoNaiyouSeq,
          serviceNaiyouSeq,
          serviceKubun: enjoNaiyouListData[i].serviceKubun,
          serviceNoNaiyou: enjoNaiyouListData[i].serviceNoNaiyou,
          shoyouJikan: enjoNaiyouListData[i].shoyouJikan,
          weeks: [],
          startTime: '',
          endTime: '',
        };
      } else {
        enjoNaiyouList[index] = {
          enjoNaiyouSeq,
          serviceNaiyouSeq,
          ryuuiJikou: enjoNaiyouListData[i].ryuuiJikou,
          weeks: (enjoNaiyouListData[i].isMondayServiceTeikyou ? ['1'] : [])
            .concat(enjoNaiyouListData[i].isTuesdayServiceTeikyou ? ['2'] : [])
            .concat(enjoNaiyouListData[i].isWednesdayServiceTeikyou ? ['3'] : [])
            .concat(enjoNaiyouListData[i].isThursdayServiceTeikyou ? ['4'] : [])
            .concat(enjoNaiyouListData[i].isFridayServiceTeikyou ? ['5'] : [])
            .concat(enjoNaiyouListData[i].isSaturdayServiceTeikyou ? ['6'] : [])
            .concat(enjoNaiyouListData[i].isSundayServiceTeikyou ? ['0'] : []),
          startTime: ToEmptyStringTime(enjoNaiyouListData[i].startTime),
          endTime: ToEmptyStringTime(enjoNaiyouListData[i].endTime),
          serviceItemName: enjoNaiyouListData[i].serviceItemName,
        };
      }
    }
    for (let i = 0; i < 5; i += 1) {
      for (let j = 0, index = 0; j < 7; j += 1) {
        index = i * 7 + j;
        if (!enjoNaiyouList[index]) {
          enjoNaiyouList[index] = { enjoNaiyouSeq: i + 1, serviceNaiyouSeq: j, weeks: [], startTime: '', endTime: '' };
        }
      }
    }
    const shuukanYoteihyouList: ShuukanYoteiColumnType[] = [...Array(5)];
    const shuukanYoteihyouListData = resData.shuukanYoteihyouList || [];
    const shuukanYoteihyouCount = shuukanYoteihyouListData.length;
    for (let i = 0, shuukanYoteihyouSeq = 0, index = 0; i < shuukanYoteihyouCount; i += 1) {
      shuukanYoteihyouSeq = shuukanYoteihyouListData[i].shuukanYoteihyouSeq || 1;
      index = shuukanYoteihyouSeq - 1;
      shuukanYoteihyouList[index] = {
        shuukanYoteihyouSeq,
        startTime: ToEmptyStringTime(shuukanYoteihyouListData[i].startTime),
        endTime: ToEmptyStringTime(shuukanYoteihyouListData[i].endTime),
        goukeiTime: shuukanYoteihyouListData[i].goukeiTime,
        mondayServiceNaiyou: shuukanYoteihyouListData[i].mondayServiceNaiyou,
        tuesdayServiceNaiyou: shuukanYoteihyouListData[i].tuesdayServiceNaiyou,
        wednesdayServiceNaiyou: shuukanYoteihyouListData[i].wednesdayServiceNaiyou,
        thursdayServiceNaiyou: shuukanYoteihyouListData[i].thursdayServiceNaiyou,
        fridayServiceNaiyou: shuukanYoteihyouListData[i].fridayServiceNaiyou,
        saturdayServiceNaiyou: shuukanYoteihyouListData[i].saturdayServiceNaiyou,
        sundayServiceNaiyou: shuukanYoteihyouListData[i].sundayServiceNaiyou,
      };
    }
    for (let i = 0; i < 5; i += 1) {
      if (!shuukanYoteihyouList[i]) {
        shuukanYoteihyouList[i] = { shuukanYoteihyouSeq: i + 1, startTime: '', endTime: '' };
      }
    }
    return {
      sakuseiDate: keikakushoInfo.sakuseiSeq > 0 && resData.keikakuSakuseiDate ? ToNullDate(resData.keikakuSakuseiDate) : ToNullDate(keikakushoInfo.sakuseiDate),
      seidoType: resData.seidoType,
      memo: resData.memo,
      keikakuSakuseiStaffName: resData.keikakuSakuseiStaffName,
      zenkaiKeikakuSakuseiDate: ToNullDate(resData.zenkaiKeikakuSakuseiDate),
      riyoushaName: resData.riyoushaName,
      sexKbn: resData.sexKbn,
      birthDate: resData.birthDate,
      age: resData.age,
      address: resData.address,
      tel1: resData.tel1,
      youkaigoKaigodoNinteiDate: ToNullDate(resData.youkaigoKaigodoNinteiDate),
      youkaigoShougaiShien: resData.youkaigoShougaiShien,
      futangakuJougen: resData.futangakuJougen,
      shuKaigoshaName: resData.shuKaigoshaName,
      shuKaigoshaTsuzukigaraName: resData.shuKaigoshaTsuzukigaraName,
      shuKaigoshaAddress: resData.shuKaigoshaAddress,
      shuKaigoshaTel1: resData.shuKaigoshaTel1,
      shuKaigoshaTel2: resData.shuKaigoshaTel2,
      kyotakuOfficeName: resData.kyotakuOfficeName,
      kyotakuOfficeCode: resData.kyotakuOfficeCode,
      careLicenseStaffName: resData.careLicenseStaffName,
      shintaiKaigoJikan: resData.shintaiKaigoJikan,
      kajiEnjyoJikan: resData.kajiEnjyoJikan,
      jyuudohoumonKaigoJikan: resData.jyuudohoumonKaigoJikan,
      tsuuinJoukouKaijoJikan: resData.tsuuinJoukouKaijoJikan,
      doukouEngoJikan: resData.doukouEngoJikan,
      koudouEngoJikan: resData.koudouEngoJikan,
      riyoushaDescriptionDate: ToNullDate(resData.riyoushaDescriptionDate),
      riyoushaDescriptionStaffName: resData.riyoushaDescriptionStaffName,
      nichijouSeikatsuZenpan: resData.nichijouSeikatsuZenpan,
      enjoMokuhyouList,
      sintaiKaigoNaiyou: resData.sintaiKaigoNaiyou,
      seikatsuEnjoNaiyou: resData.seikatsuEnjoNaiyou,
      tsuuinJoukouKaijoNaiyou: resData.tsuuinJoukouKaijoNaiyou,
      honninFamilyIkou: resData.honninFamilyIkou,
      honninFamilyNegai: resData.honninFamilyNegai,
      enjoNaiyouList,
      shuukanYoteihyouList,
      mokuhyouTasseido: resData.mokuhyouTasseido,
      mokuhyouTasseidoHyoukaDate: ToNullDate(resData.mokuhyouTasseidoHyoukaDate),
      riyoushaManzokudo: resData.riyoushaManzokudo,
      riyoushaManzokudoHyoukaDate: ToNullDate(resData.riyoushaManzokudoHyoukaDate),
      keikakuMinaoshi: resData.keikakuMinaoshi,
      keikakuMinaoshiHyoukaDate: ToNullDate(resData.keikakuMinaoshiHyoukaDate),
      officeName: resData.officeName,
      officeCode: resData.officeCode,
      officeTel1: resData.officeTel1,
    };
  }, [keikakushoInfo, resData]);

  useImperativeHandle(historyRef, () => ({
    handleCalendarChange: async (date: Date | null) => {
      if (date) {
        await fetchKihonInfo(resData.riyoushaSeq, headerTabId, date.getTime());
      }
    },
  }));

  useEffectOnce(() => {
    UseEffectAsync.make(async () => {
      await fetchKhoumonSkyotaku(keikakushoInfo.riyoushaSeq, keikakushoInfo.seidoType || '', keikakushoInfo.sakuseiSeq, keikakushoInfo.sakuseiDate);
    })();
    return () => {
      clearKhoumonSkyotaku();
    };
  });

  if (loadingStatus === 'Error') {
    // KeikakushoCom が GlobalMessagePanel を持っているので、空で返す //
    return <></>;
  }
  if (!(loadingStatus !== 'Loading' && loadingStatus !== 'NotLoad')) {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }
  return <KhoumonSkyotakuEditForm screenId={screenId} headerTabId={headerTabId} defaultValues={formDefaultValues} printRef={printRef} isReadonly={isReadonly} />;
};

export default KhoumonSkyotakuEdit;
