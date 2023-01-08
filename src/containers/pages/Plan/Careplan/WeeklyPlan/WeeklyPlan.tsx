import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';

import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';

import useDocumentTitle from '@my/hooks/useDocumentTitle';
import screenIDs from '@my/screenIDs';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import { RootState, useTypedSelector } from '@my/stores';
import { EditWeeklyServicePlan, filterServiceCodeList, WeeklyServicePlanService } from '@my/stores/plan/careplan/weeklyplan';
import useFetchWeeklyPlan from '@my/action-hooks/plan/careplan/weeklyPlan/useFetchWeeklyPlan';
import useChangeCreateDate from '@my/action-hooks/plan/careplan/weeklyPlan/useChangeCreateDate';

import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import Button from '@my/components/atomic/Button';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import TextInputField from '@my/components/molecules/TextInputField';
import YearMonthInput from '@my/components/molecules/YearMonthInput';
import WeekCalendarTimeGrid, { WeekCalendarTimeGridRefType, WeekCalendarTimeGridRemarksFormType } from '@my/components/organisms/WeekCalendarTimeGrid';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';

import WeeklyPlanServiceEditDialogContent from '@my/containers/pages/Plan/Careplan/WeeklyPlan/WeeklyPlanServiceEditDialogContent';
import { useConfirm } from '@my/components/atomic/ConfirmDialog';
import { useSnackbar } from '@my/components/atomic/Snackbar';

// WeekCalendarTimeGrid に generics を与えて型安全のコンポーネントを取得する
const WeeklyPlanWeekCalendarTimeGrid = WeekCalendarTimeGrid<WeeklyServicePlanService>();

type WeeklyPlanMainProps = {
  /** 1:介護計画書、2:予防計画書 */
  keikakushoStatus: 1 | 2;
  riyoushaSeq: number;
  createDate: number | null;
  data: EditWeeklyServicePlan;
  readonly: boolean;
};

type WeeklyPlanFormType = WeekCalendarTimeGridRemarksFormType & {
  tekiyouStart: Date | null;
  sonotaService?: string;
  fontSize: LabelAndValue;
};

const WeeklyPlanMain: React.FC<WeeklyPlanMainProps> = ({ keikakushoStatus, riyoushaSeq, createDate, data, readonly }: WeeklyPlanMainProps) => {
  const confirm = useConfirm();
  const showSnackbar = useSnackbar(); // サンプルのため登録成功時のsnackbarのみ

  // カレンダーへの ref を作成する
  const weekCalendarTimeGridRef = React.useRef<WeekCalendarTimeGridRefType<WeeklyServicePlanService>>(null);

  // 外部の制御で追加ダイアログを表示する場合は、refを通して表示させる
  const handleClickAdd = () => {
    if (weekCalendarTimeGridRef.current) {
      weekCalendarTimeGridRef.current.showNewEventDialog();
    }
  };

  // テキストエリア部を利用する場合は react-hook-form で control 関係を作成する
  // テキストエリア(12個分)は名称など決まっているので、WeekCalendarTimeGridRemarksFormType を利用する
  const { control, handleSubmit } = useForm<WeeklyPlanFormType>({
    mode: 'onChange',
    defaultValues: {
      wctsT1: data.katsudou1,
      wctsT2: data.katsudou2,
      wctsT3: data.katsudou3,
      wctsT4: data.katsudou4,
      wctsT5: data.katsudou5,
      wctsT6: data.katsudou6,
      wctsT7: data.katsudou7,
      wctsT8: data.katsudou8,
      wctsT9: data.katsudou9,
      wctsT10: data.katsudou10,
      wctsT11: data.katsudou11,
      wctsT12: data.katsudou12,
      tekiyouStart: data.tekiyouStart === undefined ? null : new Date(data.tekiyouStart),
      sonotaService: data.sonotaService,
      fontSize: data.fontSize,
    },
  });

  const handleErrorCheck = (params: { data?: WeeklyServicePlanService; startTime: string; endTime: string }): boolean => {
    const { startTime, endTime } = params;
    const serviceData = params.data;

    if (!serviceData) {
      return true;
    }

    if (serviceData.serviceCodeItem) {
      console.log('時間変更チェック', startTime, endTime);
      const ret = filterServiceCodeList([serviceData.serviceCodeItem], startTime, endTime);
      if (!ret.length) {
        return false;
      }
    }
    return true;
  };

  // 確定時、テキストエリア部のデータは react-hook-form から、カレンダーのイベント情報は ref から取得する
  // イベントデータの id は被らないように、常に max + 1 になっている。削除や追加されていった際に穴あき状態にもなっている。
  // 追加されたイベントは isNew フラグが立っているので、それを参照して判断すること
  const handleClickRegister = handleSubmit(async (values) => {
    if (weekCalendarTimeGridRef.current) {
      const events = weekCalendarTimeGridRef.current.getCurrentEvents();
      console.log(events, values);

      let hasError = false;
      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];
        if (event.hasError) {
          hasError = true;
          break;
        }
      }

      if (hasError) {
        const isOk = await confirm({ message: '時間の変更によってサービスコードが対象外になってしまったものがあります。\n登録を続けますか？' });
        if (!isOk) {
          return;
        }
      }

      showSnackbar({ message: '正常に終了しました。', type: 'success' });
    }
  });

  return (
    <Box mt={1} ml={1} mr={1}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0 30px' }}>
        <div style={{ flexGrow: 1 }}>
          <Button id="weeklyplan-add-button" onClick={handleClickAdd} disabled={readonly}>
            サービス追加
          </Button>
        </div>
        <div>
          {/* phase2 対象外 (画面に表示のみしておく) */}
          <Button id="weeklyplan-load-pattern-button" disabled>
            週間パターン取込
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ width: '140px' }}>
            <YearMonthInput id="weeklyplan-tekiyou-nengetsu" name="tekiyouStart" variant="table" control={control} />
          </div>
          <div style={{ paddingLeft: '5px' }}>分より</div>
        </div>
      </div>

      <WeeklyPlanWeekCalendarTimeGrid
        id="weeklyplan-calendar"
        ref={weekCalendarTimeGridRef} // ref を指定しておく
        data={data.serviceList} // 初期データ (EventType<EditWeeklyServicePlan> 型の配列)
        EditDialogContent={WeeklyPlanServiceEditDialogContent} // 作成しておいたコンポーネントを指定する
        EditDialogContentProps={{
          keikakushoStatus,
          riyoushaSeq,
          createDate,
        }}
        textareaControl={control} // テキストエリア部に使用する react-hook-form の Controller
        visibleRightTextarea
        readonly={readonly}
        onErrorCheck={handleErrorCheck}
      />

      <LayoutItem variant="1-item-full">
        <TextInputField id="weeklyplan-sonota-service" name="sonotaService" type="textarea" label="週単位以外のサービス" labelWidth={200} rowsMin={3} rowsMax={3} control={control} />
      </LayoutItem>

      <GeneralIconFloatingActionButton id="weeklyplan-save-button" icon="register" onClick={handleClickRegister} disabled={readonly}>
        登録
      </GeneralIconFloatingActionButton>
    </Box>
  );
};

type WeeklyPlanProps = {
  /** 1:介護計画書、2:予防計画書 */
  keikakushoStatus: 1 | 2;
  /** 利用者SEQ */
  riyoushaSeq: number;
};

/**
 * プラン立案・評価 ＞ ケアプラン ＞ （介護計画書タブからの） l1230-01 週間サービス計画表
 * プラン立案・評価 ＞ ケアプラン ＞ （予防計画書タブからの） l1340-01 介護予防週間支援計画表
 */
const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ keikakushoStatus, riyoushaSeq }: WeeklyPlanProps) => {
  const screenId = keikakushoStatus === 1 ? screenIDs.L1230_01 : screenIDs.L1340_01;
  useDocumentTitle(screenId);

  // TODO 権限のデータがモックAPIに入ったら制御開始
  // const getLoginKengenInfo = useGetLoginKengenInfo();
  // const kengens = getLoginKengenInfo(['plan', 'careplan', keikakushoStatus === 1 ? 'kaigo' : 'yobou']);
  // const isReadonly = KengenUtils.isReadonly(kengens[screenId.id]);
  // const kinouKengens = getLoginKengenInfo(['plan', 'careplan', keikakushoStatus === 1 ? 'kaigo' : 'yobou', screenId.id]);
  const isReadonly = false;

  const loadingStatus = useTypedSelector((state: RootState) => state.weeklyPlan.loadingStatus);
  const weeklyServicePlan = useTypedSelector((state: RootState) => state.weeklyPlan.weeklyServicePlan);
  const createDate = useTypedSelector((state: RootState) => state.weeklyPlan.createDate); // FIXME: Receipt from plan common

  // debug 
  const rootState = useTypedSelector((state: RootState) => state);
  // eslint-disable-next-line no-console
  console.log('rootState in WeeklyPlan:', rootState);

  const selectedHistorySeq = 1; // FIXME: 計画書共通からの受け取り
  const mode = 'edit'; // FIXME: 計画書共通からの受け取り

  const loading = loadingStatus === 'NotLoad' || loadingStatus === 'Loading';

  
  const changeCreateDate = useChangeCreateDate(screenId.id, keikakushoStatus, riyoushaSeq);
  const fetchWeeklyPlan = useFetchWeeklyPlan(screenId.id, keikakushoStatus, riyoushaSeq);

  React.useEffect(
    UseEffectAsync.make(async () => {
      console.log('useEffect: changeCreateDate');
      await changeCreateDate({ createDate });
    }),
    [changeCreateDate, createDate]
  );

  React.useEffect(
    UseEffectAsync.make(async () => {
      console.log('useEffect: fetchWeeklyPlan');
      await fetchWeeklyPlan({ selectedHistorySeq, mode });
    }),
    [fetchWeeklyPlan, selectedHistorySeq, mode]
  );

  const formMethods = useForm({
    mode: 'onChange',
    // validationSchema: weeklyPlanInputFormSchema, // FIXME: See Plan1.tsx as example.
  });

  return (
    <FormContext {...formMethods}>
      <CareplanHeader id="" screenId={screenIDs.L1230_01.id} screenName="週間サービス計画表" screenKbn="21230" riyoushaSeq={riyoushaSeq}>
        <LayoutForm disableGridLayout>
          {loading && (
            <Box mt={1} ml={1} mr={1}>
              Now Loading...
            </Box>
          )}
          {loadingStatus === 'Loaded' && <WeeklyPlanMain keikakushoStatus={keikakushoStatus} riyoushaSeq={riyoushaSeq} createDate={createDate} data={weeklyServicePlan} readonly={isReadonly} />}
        </LayoutForm>
      </CareplanHeader>
    </FormContext>
  );
};

export default WeeklyPlan;
