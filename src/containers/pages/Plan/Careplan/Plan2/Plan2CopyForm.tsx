import React from 'react';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import { useTypedSelector, RootState } from '@my/stores';
import screenIDs from '@my/screenIDs';
import { usePostPlan2 } from '@my/action-hooks/plan/careplan/plan2';
import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho2, PlanKyotakuServiceKeikakusho2RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import Plan2InputForm, { Plan2InputFormType, Plan2TableRow } from './Plan2InputForm';

type Props = {
  id: string;
  screenKbn: string;
  riyoushaSeq: number;
  isReadonly: boolean;
};

const Plan2CopyForm: React.FC<Props> = (props: Props) => {
  const { id, screenKbn, riyoushaSeq, isReadonly } = props;

  const clearCareplanHeader = useClearCareplanHeader();
  const postPlan2 = usePostPlan2(screenIDs.L1220_01.id);
  const selectedPlanKeikakushoKanri = useTypedSelector((state: RootState) => state.careplanHeader.selectedPlanKeikakushoKanri);
  const plan2Data = useTypedSelector((state: RootState) => state.plan2.plan2);

  // (引継ぎ追加用) 登録ボタン押下時
  const onSubmit = async (data: Plan2InputFormType) => {
    // eslint-disable-next-line no-console
    console.log('***** data -> ', data);

    const officeSeq = -1; // API側で設定するため、無視される
    const officeServiceKindSeq = -1; // API側で設定するため、無視される
    const keikakushoShubetsu = screenKbn; // API側で設定するため、無視される
    const keikakushoSeq = -1; // API側で設定するため、無視される
    const updateAt = new Date().getTime(); // API側で設定するため、無視される

    const planKeikakushoKanri = {
      // primary keys
      officeSeq,
      officeServiceKindSeq,
      keikakushoShubetsu,
      keikakushoSeq,
      riyoushaSeq,
      updateAt,
      // data
      keikakuSakuseiDate: data.careplanHeaderSakuseiDate !== undefined ? data.careplanHeaderSakuseiDate.getTime() : new Date().getTime(),
      keikakuSakuseiStaffName: data.careplanHeaderSakuseiName,
      memo: data.careplanHeaderMemo,
      minaoshiDate: data.minaoshiDate ? data.minaoshiDate.getTime() : undefined,
    } as PlanKeikakushoKanri;

    const planKyotakuServiceKeikakusho2 = [] as PlanKyotakuServiceKeikakusho2[];
    data.plan2TableRows.forEach((row) => {
      const plan2Row = {
        // primary keys
        officeSeq,
        officeServiceKindSeq,
        keikakushoShubetsu,
        keikakushoSeq,
        riyoushaSeq,
        displayOrder: row.displayOrder,
        updateAt,
        // data
        kadai: row.kadai,
        choukiMokuhyou: row.choukiMokuhyou,
        choukiMokuhyouStartDate: row.choukiMokuhyouStartDate,
        choukiMokuhyouEndDate: row.choukiMokuhyouEndDate,
        tankiMokuhyou: row.tankiMokuhyou,
        tankiMokuhyouStartDate: row.tankiMokuhyouStartDate,
        tankiMokuhyouEndDate: row.tankiMokuhyouEndDate,
        enjoServiceNaiyou: row.enjoServiceNaiyou,
        isHokenkyufutaishou: row.isHokenkyufutaishou,
        enjoServiceShubetsu: row.enjoServiceShubetsu,
        officeName: row.officeName,
        serviceHindo: row.serviceHindo,
        serviceStartDate: row.serviceStartDate,
        serviceEndDate: row.serviceEndDate,
      } as PlanKyotakuServiceKeikakusho2;

      planKyotakuServiceKeikakusho2.push(plan2Row);
    });
    const registerData = {
      planKeikakushoKanri,
      planKyotakuServiceKeikakusho2,
    } as PlanKyotakuServiceKeikakusho2RegisterData;

    // 追加API (第2引数 計画書Seq が undefined なので追加扱い。)
    await postPlan2(riyoushaSeq, undefined, registerData);

    // 更新後、state を全てクリアし、再読み込み
    clearCareplanHeader();
  };

  const rows: Plan2TableRow[] = [];
  plan2Data.forEach((data, index) => {
    const row: Plan2TableRow = {
      deleteFlag: false,
      seq: index,
      isCheck: false,
    };
    row.kadai = data.kadai;
    row.choukiMokuhyou = data.choukiMokuhyou;
    row.choukiMokuhyouStartDate = data.choukiMokuhyouStartDate !== undefined ? new Date(data.choukiMokuhyouStartDate) : undefined;
    row.choukiMokuhyouEndDate = data.choukiMokuhyouEndDate !== undefined ? new Date(data.choukiMokuhyouEndDate) : undefined;
    row.tankiMokuhyou = data.tankiMokuhyou;
    row.tankiMokuhyouStartDate = data.tankiMokuhyouStartDate !== undefined ? new Date(data.tankiMokuhyouStartDate) : undefined;
    row.tankiMokuhyouEndDate = data.tankiMokuhyouEndDate !== undefined ? new Date(data.tankiMokuhyouEndDate) : undefined;
    row.enjoServiceNaiyou = data.enjoServiceNaiyou;
    row.isHokenkyufutaishou = data.isHokenkyufutaishou;
    row.enjoServiceShubetsu = data.enjoServiceShubetsu;
    row.officeName = data.officeName;
    row.serviceHindo = data.serviceHindo;
    row.serviceStartDate = data.serviceStartDate !== undefined ? new Date(data.serviceStartDate) : undefined;
    row.serviceEndDate = data.serviceEndDate !== undefined ? new Date(data.serviceEndDate) : undefined;

    rows.push(row);
  });
  const defaultValues: Plan2InputFormType = {
    minaoshiDate: selectedPlanKeikakushoKanri?.info?.minaoshiDate !== undefined ? new Date(selectedPlanKeikakushoKanri?.info?.minaoshiDate) : new Date(),
    plan2TableRows: rows,
  };

  // eslint-disable-next-line no-console
  console.log('Plan2CopyForm render');

  return <Plan2InputForm id={`${id}-edit`} defaultValues={defaultValues} isReadonly={isReadonly} onSubmit={onSubmit} />;
};

export default Plan2CopyForm;
