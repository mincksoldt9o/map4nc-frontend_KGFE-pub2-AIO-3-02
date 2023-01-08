import React from 'react';
import screenIDs from '@my/screenIDs';
import { RootState, useTypedSelector } from '@my/stores';
import styled from 'styled-components';
import { Box, Grid, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import Checkbox from '@my/components/atomic/Checkbox';
import Button from '@my/components/atomic/Button';
import { useForm, useFieldArray, Control, ArrayField, Controller, NestDataObject, FieldError, useFormContext, FieldValues } from 'react-hook-form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import SelectPeriodDialog from '@my/containers/pages/Common/SelectPeriodDialog';
import { BodyCell, HeaderCell, OrderTableRow, OrderTableRowColumn } from '@my/components/layouts/Table';
import BunreiContentsCell from '@my/components/organisms/BunreiContentsCell';
import TermContentsCell from '@my/components/organisms/TermContentsCell';
import OrderUtils from '@my/utils/OrderUtils';
import TextInput from '@my/components/atomic/TextInput';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import { careplanHeaderFormSchemaDef, CareplanHeaderFormType } from '@my/containers/pages/Common/CareplanHeader/CareplanHeaderInputForm';
import yup, { yupDate } from '@my/yup';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';
import OfficeList from '@my/containers/pages/Common/OfficeList';
import { useConfirm } from '@my/components/atomic/ConfirmDialog';
import messages from '@my/messages';
import QuoteDialog from './QuoteDialog/QuoteDialog';

const FindZigyoushoButton = styled(Button)`
  padding: 1px 6px;
  font-size: 6px;
`;

export type Plan2TableRow = OrderTableRowColumn & {
  // pkey
  displayOrder?: number;
  // row datas
  kadai?: string;
  choukiMokuhyou?: string;
  choukiMokuhyouStartDate?: Date;
  choukiMokuhyouEndDate?: Date;
  tankiMokuhyou?: string;
  tankiMokuhyouStartDate?: Date;
  tankiMokuhyouEndDate?: Date;
  enjoServiceNaiyou?: string;
  isHokenkyufutaishou?: boolean;
  enjoServiceShubetsu?: string;
  officeName?: string;
  serviceHindo?: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
};


const convertPlan2TableRow = (data: Partial<ArrayField<Record<string, any>, 'id'>>): Plan2TableRow => {
  return {
    // OrderTableRowColumn
    deleteFlag: data.deleteFlag,
    seq: data.seq,
    isCheck: data.isCheck,
    // row datas
    kadai: data.kadai,
    choukiMokuhyou: data.choukiMokuhyou,
    choukiMokuhyouStartDate: data.choukiMokuhyouStartDate,
    choukiMokuhyouEndDate: data.choukiMokuhyouEndDate,
    tankiMokuhyou: data.tankiMokuhyou,
    tankiMokuhyouStartDate: data.tankiMokuhyouStartDate,
    tankiMokuhyouEndDate: data.tankiMokuhyouEndDate,
    enjoServiceNaiyou: data.enjoServiceNaiyou,
    isHokenkyufutaishou: data.isHokenkyufutaishou,
    enjoServiceShubetsu: data.enjoServiceShubetsu,
    officeName: data.officeName,
    serviceHindo: data.serviceHindo,
    serviceStartDate: data.serviceStartDate,
    serviceEndDate: data.serviceEndDate,
  };
};

// eslint-disable-next-line no-console
console.log('convertPlan2TableRow: ', convertPlan2TableRow);

export type Props = {
  id: string;
  defaultValues?: Plan2InputFormType;
  isReadonly?: boolean;
  onSubmit: (data: Plan2InputFormType) => Promise<void>;
};

const plan2TableRowsSchema = yup.object({
  kadai: yup.string().max(256).label('生活全般の解決すべき課題（ニーズ）'),
  choukiMokuhyou: yup.string().max(256).label('長期目標'),
  tankiMokuhyou: yup.string().max(256).label('短期目標'),
  enjoServiceNaiyou: yup.string().max(256).label('サービス内容'),
  enjoServiceShubetsu: yup.string().max(256).label('サービス種別'),
  officeName: yup.string().max(256).label('事業所'),
  serviceHindo: yup.string().max(256).label('頻度'),
});

export type Plan2InputFormType = {
  minaoshiDate: Date;
  plan2TableRows: Plan2TableRow[];
} & CareplanHeaderFormType;

// バリデーション
export const plan2InputFormSchema = yup.object({
  // ケアプランヘッダのバリデーション↓↓↓↓↓
  ...careplanHeaderFormSchemaDef,
  // ケアプランヘッダのバリデーション↑↑↑↑↑
  minaoshiDate: yupDate().label('見直しアラート'),
  plan2TableRows: yup.array().of(plan2TableRowsSchema),
});

type DraggableRowProps = {
  control: Control<FieldValues>;
  errors: NestDataObject<Plan2InputFormType, FieldError>;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  rowIndex: number;
  firstSeq: number;
  maxSeq: number;
  isDraggingOver?: boolean;
  draggingRow?: Plan2TableRow;
  checkCnt?: number;
  deleteSeq: number[];
  onClickOpenSelectPeriod: (targetIndex: number, targetColumns: string[], _startDate: Date, _endDate: Date) => void;
  onClickCopyPeriod: (_targetIndex: number, _targetColumns: string[]) => void;
  onClickOpenBunreiDialog: (bunreiItemKbn: string, targetIndex: number, targetColumn: string) => void;
  onClickOpenOfficeDialog: (targetIndex: number, targetColumn: string) => void;
};

const tableName = 'plan2TableRows';

const DraggableRow = React.memo(
  ({
    provided,
    snapshot,
    control,
    errors,
    rowIndex,
    firstSeq,
    maxSeq,
    isDraggingOver,
    checkCnt,
    deleteSeq,
    onClickOpenSelectPeriod,
    onClickCopyPeriod,
    onClickOpenBunreiDialog,
    onClickOpenOfficeDialog,
  }: DraggableRowProps) => {
    const { isDragging } = snapshot;

    let seq: number = control.getValues(`${tableName}[${rowIndex}].seq`);
    // 行追加した瞬間のseqが取得出来ない。
    // 苦肉の策として下記 maxSeq を設定
    if (seq === undefined) {
      seq = maxSeq;
    }
    const display = isDragging || deleteSeq.includes(seq) ? 'none' : '';

    const isErrorKadai = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].kadai !== undefined;
    const isErrorChoukiMokuhyou = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].choukiMokuhyou !== undefined;
    const isErrorTankiMokuhyou = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].tankiMokuhyou !== undefined;
    const isErrorEnjoServiceNaiyou = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].enjoServiceNaiyou !== undefined;
    const isErrorOfficeName = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].officeName !== undefined;
    const isErrorEnjoServiceShubetsu = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].enjoServiceShubetsu !== undefined;
    const isErrorServiceHindo = errors.plan2TableRows !== undefined && errors.plan2TableRows[seq] !== undefined && errors.plan2TableRows[seq].serviceHindo !== undefined;

    return (
      <OrderTableRow provided={provided} snapshot={snapshot} control={control} isDraggingOver={isDraggingOver} deleteSeq={deleteSeq} tableName={tableName} rowIndex={rowIndex} checkCnt={checkCnt}>
        {/* 生活全般の解決すべき課題（ニーズ） */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-kadai`}
          name={`${tableName}[${rowIndex}].kadai`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('1', seq, 'kadai');
          }}
          isError={isErrorKadai}
        />
        {/* 長期目標 */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-chouki-mokuhyou`}
          name={`${tableName}[${rowIndex}].choukiMokuhyou`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('2', seq, 'choukiMokuhyou');
          }}
          isError={isErrorChoukiMokuhyou}
        />
        {/* 期間 */}
        <TermContentsCell
          id={`${tableName}-${rowIndex}-chouki-mokuhyou-term`}
          name={`${tableName}[${rowIndex}].choukiMokuhyouTerm`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          disabled={firstSeq === seq}
          display={display}
          onClickCopy={() => {
            onClickCopyPeriod(seq, ['choukiMokuhyouStartDate', 'choukiMokuhyouEndDate']);
          }}
          onClick={() => {
            onClickOpenSelectPeriod(
              seq,
              ['choukiMokuhyouStartDate', 'choukiMokuhyouEndDate'],
              control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouStartDate`),
              control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouEndDate`)
            );
          }}
          startDate={control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouStartDate`)}
          endDate={control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouEndDate`)}
        />
        <Controller
          as="data"
          id={`${tableName}-${rowIndex}-chouki-mokuhyou-start-date`}
          name={`${tableName}[${rowIndex}].choukiMokuhyouStartDate`}
          defaultValue={control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouStartDate`)}
          control={control}
          style={{ display: 'none' }}
        />
        <Controller
          as="data"
          id={`${tableName}-${rowIndex}-chouki-mokuhyou-end-date`}
          name={`${tableName}[${rowIndex}].choukiMokuhyouEndDate`}
          defaultValue={control.getValues(`${tableName}[${rowIndex}].choukiMokuhyouEndDate`)}
          control={control}
          style={{ display: 'none' }}
        />
        {/* 短期目標 */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-tanki-mokuhyou`}
          name={`${tableName}[${rowIndex}].tankiMokuhyou`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('3', seq, 'tankiMokuhyou');
          }}
          isError={isErrorTankiMokuhyou}
        />
        {/* 期間 */}
        <TermContentsCell
          id={`${tableName}-${rowIndex}-tanki-mokuhyou-term`}
          name={`${tableName}[${rowIndex}].tankiMokuhyouTerm`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          disabled={firstSeq === seq}
          display={display}
          onClickCopy={() => {
            onClickCopyPeriod(seq, ['tankiMokuhyouStartDate', 'tankiMokuhyouEndDate']);
          }}
          onClick={() => {
            onClickOpenSelectPeriod(
              seq,
              ['tankiMokuhyouStartDate', 'tankiMokuhyouEndDate'],
              control.getValues(`${tableName}[${rowIndex}].tankiMokuhyouStartDate`),
              control.getValues(`${tableName}[${rowIndex}].tankiMokuhyouEndDate`)
            );
          }}
          startDate={control.getValues(`${tableName}[${rowIndex}].tankiMokuhyouStartDate`)}
          endDate={control.getValues(`${tableName}[${rowIndex}].tankiMokuhyouEndDate`)}
        />
        <Controller as="data" id={`${tableName}-${rowIndex}-tanki-mokuhyou-start-date`} name={`${tableName}[${rowIndex}].tankiMokuhyouStartDate`} control={control} style={{ display: 'none' }} />
        <Controller as="data" id={`${tableName}-${rowIndex}-tanki-mokuhyou-end-date`} name={`${tableName}[${rowIndex}].tankiMokuhyouEndDate`} control={control} style={{ display: 'none' }} />
        {/* サービス内容 */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-enjo-service-naiyou`}
          name={`${tableName}[${rowIndex}].enjoServiceNaiyou`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('4', seq, 'enjoServiceNaiyou');
          }}
          isError={isErrorEnjoServiceNaiyou}
        />
        {/* ※1 */}
        <BodyCell align="center" isDragging={isDragging} isDraggingOver={isDraggingOver} width={30} style={{ display }} bl bt br>
          <Checkbox id={`${tableName}-${rowIndex}-isHokenkyufutaishou`} name={`${tableName}[${rowIndex}].isHokenkyufutaishou`} size="small" control={control} />
        </BodyCell>
        {/* サービス種別 */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-enjo-service-shubetsu`}
          name={`${tableName}[${rowIndex}].enjoServiceShubetsu`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('5', seq, 'enjoServiceShubetsu');
          }}
          isError={isErrorEnjoServiceShubetsu}
        />
        {/* ※2 */}
        <BodyCell isDragging={isDragging} isDraggingOver={isDraggingOver} minWidth={`${Math.floor(100 / 15)}vw`} style={{ display }} bl bt br isError={isErrorOfficeName}>
          <FindZigyoushoButton
            id={`${tableName}-${rowIndex}-office-button`}
            size="small"
            onClick={() => {
              onClickOpenOfficeDialog(seq, 'officeName');
            }}
            variant="text">
            事業所検索
          </FindZigyoushoButton>
          <TextInput id={`${tableName}-${rowIndex}-office-name`} name={`${tableName}[${rowIndex}].officeName`} type="textarea" rowsMin={4} fullWidth variant="grid" control={control} />
        </BodyCell>
        {/* 頻度 */}
        <BunreiContentsCell
          id={`${tableName}-${rowIndex}-service-hindo`}
          name={`${tableName}[${rowIndex}].serviceHindo`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          control={control}
          display={display}
          onClick={() => {
            onClickOpenBunreiDialog('6', seq, 'serviceHindo');
          }}
          isError={isErrorServiceHindo}
        />
        {/* 期間 */}
        <TermContentsCell
          id={`${tableName}-${rowIndex}-service-term`}
          name={`${tableName}[${rowIndex}].serviceTerm`}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          disabled={firstSeq === seq}
          display={display}
          onClickCopy={() => {
            onClickCopyPeriod(seq, ['serviceStartDate', 'serviceEndDate']);
          }}
          onClick={() => {
            onClickOpenSelectPeriod(
              seq,
              ['serviceStartDate', 'serviceEndDate'],
              control.getValues(`${tableName}[${rowIndex}].serviceStartDate`),
              control.getValues(`${tableName}[${rowIndex}].serviceEndDate`)
            );
          }}
          startDate={control.getValues(`${tableName}[${rowIndex}].serviceStartDate`)}
          endDate={control.getValues(`${tableName}[${rowIndex}].serviceEndDate`)}
        />
        <Controller as="data" id={`${tableName}-${rowIndex}-service-start-date`} name={`${tableName}[${rowIndex}].serviceStartDate`} control={control} style={{ display: 'none' }} />
        <Controller as="data" id={`${tableName}-${rowIndex}-service-end-date`} name={`${tableName}[${rowIndex}].serviceEndDate`} control={control} style={{ display: 'block' }} />
      </OrderTableRow>
    );
  }
);

// export const getDefaulRowtValues = (): Plan2TableRow[] => {
//   return [...Array(4)].map((_, index) => {
//     return {
//       deleteFlag: false,
//       isCheck: false,
//       // ここからはstoreのデータ
//       seq: index,
//       kadai: `kadai${index}`,
//       choukiMokuhyou: `choukiMokuhyou${index}`,
//       choukiMokuhyouStartDate: new Date(),
//       choukiMokuhyouEndDate: new Date(),
//       tankiMokuhyou: `tankiMokuhyou${index}`,
//       tankiMokuhyouStartDate: new Date(),
//       tankiMokuhyouEndDate: new Date(),
//       enjoServiceNaiyou: `enjoServiceNaiyou${index}`,
//       isHokenkyufutaishou: index % 2 === 0,
//       enjoServiceShubetsu: `enjoServiceShubetsu${index}`,
//       officeName: `officeName${index}`,
//       serviceHindo: `serviceHindo${index}`,
//       serviceStartDate: new Date(),
//       serviceEndDate: new Date(),
//     };
//   });
// };

// 全行の現在のデータを取得する
const getAllRowData = (orders: number[], deleteSeq: number[], getValues: (arg: string) => any): Plan2TableRow[] => {
  const result: Plan2TableRow[] = orders.map((rowIndex) => {
    const seq: number = getValues(`${tableName}[${rowIndex}].seq`);
    return {
      // OrderTableRowColumn
      deleteFlag: deleteSeq.includes(seq),
      seq,
      isCheck: getValues(`${tableName}[${rowIndex}].isCheck`),
      // row datas
      kadai: getValues(`${tableName}[${rowIndex}].kadai`),
      choukiMokuhyou: getValues(`${tableName}[${rowIndex}].choukiMokuhyou`),
      choukiMokuhyouStartDate: getValues(`${tableName}[${rowIndex}].choukiMokuhyouStartDate`),
      choukiMokuhyouEndDate: getValues(`${tableName}[${rowIndex}].choukiMokuhyouEndDate`),
      tankiMokuhyou: getValues(`${tableName}[${rowIndex}].tankiMokuhyou`),
      tankiMokuhyouStartDate: getValues(`${tableName}[${rowIndex}].tankiMokuhyouStartDate`),
      tankiMokuhyouEndDate: getValues(`${tableName}[${rowIndex}].tankiMokuhyouEndDate`),
      enjoServiceNaiyou: getValues(`${tableName}[${rowIndex}].enjoServiceNaiyou`),
      isHokenkyufutaishou: getValues(`${tableName}[${rowIndex}].isHokenkyufutaishou`),
      enjoServiceShubetsu: getValues(`${tableName}[${rowIndex}].enjoServiceShubetsu`),
      officeName: getValues(`${tableName}[${rowIndex}].officeName`),
      serviceHindo: getValues(`${tableName}[${rowIndex}].serviceHindo`),
      serviceStartDate: getValues(`${tableName}[${rowIndex}].serviceStartDate`),
      serviceEndDate: getValues(`${tableName}[${rowIndex}].serviceEndDate`),
    } as Plan2TableRow;
  });
  return result;
};

const setRowData = (setValue: (name: any, value: any) => any, index: number, row: Plan2TableRow) => {
  // OrderTableRowColumn
  setValue(`${tableName}[${index}].deleteFlag`, row.deleteFlag);
  setValue(`${tableName}[${index}].seq`, row.seq);
  setValue(`${tableName}[${index}].isCheck`, row.isCheck);
  // row datas
  setValue(`${tableName}[${index}].kadai`, row.kadai);
  setValue(`${tableName}[${index}].choukiMokuhyou`, row.choukiMokuhyou);
  setValue(`${tableName}[${index}].choukiMokuhyouStartDate`, row.choukiMokuhyouStartDate);
  setValue(`${tableName}[${index}].choukiMokuhyouEndDate`, row.choukiMokuhyouEndDate);
  setValue(`${tableName}[${index}].tankiMokuhyou`, row.tankiMokuhyou);
  setValue(`${tableName}[${index}].tankiMokuhyouStartDate`, row.tankiMokuhyouStartDate);
  setValue(`${tableName}[${index}].tankiMokuhyouEndDate`, row.tankiMokuhyouEndDate);
  setValue(`${tableName}[${index}].enjoServiceNaiyou`, row.enjoServiceNaiyou);
  setValue(`${tableName}[${index}].isHokenkyufutaishou`, row.isHokenkyufutaishou);
  setValue(`${tableName}[${index}].enjoServiceShubetsu`, row.enjoServiceShubetsu);
  setValue(`${tableName}[${index}].officeName`, row.officeName);
  setValue(`${tableName}[${index}].serviceHindo`, row.serviceHindo);
  setValue(`${tableName}[${index}].serviceEndDate`, row.serviceEndDate);
  setValue(`${tableName}[${index}].serviceStartDate`, row.serviceStartDate);
};

const Plan2InputForm: React.FC<Props> = (props: Props) => {
  const { id, defaultValues, isReadonly, onSubmit } = props;

  const sakuseiDate = useTypedSelector((state: RootState) => state.careplanHeader.sakuseiDate);
  const confirm = useConfirm();

  const { control, setValue, getValues, errors } = useForm<Plan2InputFormType>({
    mode: 'onChange',
    defaultValues,
    validationSchema: plan2InputFormSchema,
  });

  const formMethods = useFormContext();
  const { handleSubmit } = formMethods;

  const plan2TableRows = defaultValues?.plan2TableRows || [];

  const [renderCount, setRenderCount] = React.useState<number>(0);
  // 並び順制御用の配列
  const [orders, setOrders] = React.useState<number[]>(plan2TableRows.map((row) => row.seq));
  // 削除制御用の配列
  const [deleteSeq, setDeleteSeq] = React.useState<number[]>([]);
  // チェックされている行数
  const [checkCnt, setCheckCnt] = React.useState<number>(0);
  // 一番上の行のseq
  const [firstSeq, setFirstSeq] = React.useState<number>(0);

  // fields は、行追加の時にappendで増やす。
  // 行削除の時にremoveはしない。deleteSeqで制御する。
  const { fields, append, insert } = useFieldArray({
    control,
    name: 'plan2TableRows',
  });

  const [maxSeq, setMaxSeq] = React.useState<number>(fields.length - 1);

  const [targetIndex, setTargetIndex] = React.useState<number | undefined>();
  const [targetColumn, setTargetColumn] = React.useState<string | string[] | undefined>();

  // 期間選択ダイアログ
  const [isSelectPeriodDialogOpen, setIsSelectPeriodDialogOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const handleClickSelectPeriod = (_targetIndex: number, _targetColumns: string[], _startDate: Date, _endDate: Date) => {
    setTargetIndex(_targetIndex);
    setTargetColumn(_targetColumns);
    setStartDate(_startDate);
    setEndDate(_endDate);
    setIsSelectPeriodDialogOpen(true);
  };
  const handleClickReturnSelectPeriodDialog = () => {
    setIsSelectPeriodDialogOpen(false);
  };
  const handleClickKetteiSelectPeriodDialog = (period: { startDate: Date | null; endDate: Date | null }) => {
    // eslint-disable-next-line no-console
    console.log(period);

    setValue(`${tableName}[${targetIndex}].${targetColumn ? targetColumn[0] : ''}`, period.startDate);
    setValue(`${tableName}[${targetIndex}].${targetColumn ? targetColumn[1] : ''}`, period.endDate);
    fields[targetIndex || 0][`${targetColumn ? targetColumn[0] : ''}`] = period.startDate;
    fields[targetIndex || 0][`${targetColumn ? targetColumn[1] : ''}`] = period.endDate;

    // 再レンダリング
    setRenderCount(renderCount + 1);

    setIsSelectPeriodDialogOpen(false);
  };

  // 期間コピーハンドラ
  const handleClickCopyPeriod = (_targetIndex: number, _targetColumns: string[]) => {
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const validRows = rows.filter((row) => !row.deleteFlag);
    // 対象(コピー元)のデータを取得
    const srcSeq = getValues(`${tableName}[${_targetIndex}].seq`);
    const srcStartDate = getValues(`${tableName}[${_targetIndex}].${_targetColumns[0]}`);
    const srcEndDate = getValues(`${tableName}[${_targetIndex}].${_targetColumns[1]}`);
    let srcIndex = -1;
    validRows.forEach((v, i) => {
      if (v.seq === srcSeq) {
        srcIndex = i;
      }
    });
    const dstIndex = srcIndex - 1;
    let dstSeq = -1;
    validRows.forEach((v, i) => {
      if (i === dstIndex) {
        dstSeq = v.seq;
      }
    });
    // コピー先にデータ反映
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orders.forEach((order, i) => {
      if (getValues(`${tableName}[${order}].seq`) === dstSeq) {
        setValue(`${tableName}[${order}].${_targetColumns[0]}`, srcStartDate);
        setValue(`${tableName}[${order}].${_targetColumns[1]}`, srcEndDate);
      }
    });
    for (let i = 0; i < fields.length; i += 1) {
      if (fields[i].seq === dstSeq) {
        fields[i][`${_targetColumns[0]}`] = srcStartDate;
        fields[i][`${_targetColumns[1]}`] = srcEndDate;
      }
    }
    // 再レンダリング
    setRenderCount(renderCount + 1);
  };

  // 文例ダイアログ
  const [isBunreiDialogOpen, setIsBunreiDialogOpen] = React.useState(false);
  const [gyoumuBunreiSeq] = React.useState(21220);
  const [bunreiItemKbn, setBunreiItemKbn] = React.useState<string | undefined>();
  const handleClickOpenBunreiDialog = (_bunreiItemKbn: string, _targetIndex: number, _targetColumn: string) => {
    setBunreiItemKbn(_bunreiItemKbn);
    setTargetIndex(_targetIndex);
    setTargetColumn(_targetColumn);
    setIsBunreiDialogOpen(true);
  };
  const handleClickReturnBunreiDialog = () => {
    setIsBunreiDialogOpen(false);
  };
  const handleClickKetteiBunreiDialog = (item: BunreiType) => {
    // eslint-disable-next-line no-console
    console.log('item ->', item);
    setValue(`${tableName}[${targetIndex}].${targetColumn}`, item.bunrei);
    fields[targetIndex || 0][`${targetColumn}`] = item.bunrei;

    // 再レンダリング
    setRenderCount(renderCount + 1);

    setIsBunreiDialogOpen(false);
  };

  // 施設事業所ダイアログ
  const [isOfficeDialogOpen, setIsOfficeDialogOpen] = React.useState(false);
  const handleClickOpenOfficeDialog = (_targetIndex: number, _targetColumn: string) => {
    setTargetIndex(_targetIndex);
    setTargetColumn(_targetColumn);
    setIsOfficeDialogOpen(true);
  };
  const handleClickReturnOfficeDialog = () => {
    setIsOfficeDialogOpen(false);
  };
  const handleClickKetteiOfficeDialog = (officeName: string, officeSeq: number) => {
    // eslint-disable-next-line no-console
    console.log('officeName = %o, officeSeq = %o', officeName, officeSeq);
    setValue(`${tableName}[${targetIndex}].${targetColumn}`, officeName);
    fields[targetIndex || 0][`${targetColumn}`] = officeName;

    // 再レンダリング
    setRenderCount(renderCount + 1);

    setIsOfficeDialogOpen(false);
  };

  // 過去内容引用ダイアログ
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = React.useState(false);
  const handleClickQuote = () => {
    setIsQuoteDialogOpen(true);
  };
  const handleClickReturnQuoteDialog = () => {
    // do nothing
  };
  const handleClickKetteiQuoteDialog = (selectedRows: Plan2TableRow[]) => {
    // eslint-disable-next-line no-console
    console.log('selectedData = %o', selectedRows);
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const validRows = rows.filter((innerRow) => !innerRow.deleteFlag);
    const checkedRows = validRows.filter((v) => v.isCheck === true);

    let newMaxSeq = maxSeq;
    const newMaxSeqs: number[] = [];
    const copySelectedRows = [...selectedRows];
    copySelectedRows.forEach((selectRow: Plan2TableRow, i: number) => {
      newMaxSeq += 1;
      copySelectedRows[i].seq = newMaxSeq;
      newMaxSeqs.push(newMaxSeq);
    });

    setMaxSeq(newMaxSeq);

    const newOrders = orders.map((v) => v);
    if (checkedRows.length > 0) {
      const index = newOrders.findIndex((v) => v === checkedRows[0].seq);
      newMaxSeqs.forEach((sq, i) => {
        newOrders.splice(index + i, 0, sq);
      });
    } else {
      newOrders.push(...newMaxSeqs);
    }
    setOrders(newOrders);
    if (validRows.length === 0) {
      setFirstSeq(newMaxSeq);
    }

    // 複数行を追加
    insert(rows.length, copySelectedRows);

    setRenderCount(renderCount + 1);
  };

  // ソースで行データを見る場合は以下のようにする。
  // 削除行も含む全行の取得
  // const rows = getAllRowData(orders, deleteSeq, getValues);
  // 削除行の除外
  // const validRows = rows.filter((row) => !row.deleteFlag);

  // console.log('fields', fields);
  // console.log('getValues', getValues());
  // console.log('deleteSeq', deleteSeq);

  const onBeforeDragStart = React.useCallback(() => {
    const result = getAllRowData(orders, deleteSeq, getValues);
    const target = result.filter((row) => !row.deleteFlag && row.isCheck);
    setCheckCnt(target.length);
  }, [deleteSeq, getValues, orders]);

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      const update = OrderUtils.sort(getAllRowData(orders, deleteSeq, getValues), source.index, destination.index);
      setOrders(update.map((data) => data.seq));
      const validRows = update.filter((row) => !row.deleteFlag);
      setFirstSeq(validRows.length > 0 ? validRows[0].seq : 0);
    },
    [deleteSeq, getValues, orders]
  );

  // 行追加
  const handleClickAdd = () => {
    const rows = getAllRowData(orders, deleteSeq, getValues);
    // const maxSeq = Math.max(...rows.map((v) => v.seq));
    const newMaxSeq = maxSeq + 1;
    setMaxSeq(newMaxSeq);
    const row: Plan2TableRow = {
      // OrderTableRowColumn
      deleteFlag: false,
      seq: newMaxSeq,
      isCheck: false,
      // row datas
      kadai: '',
      choukiMokuhyou: '',
      choukiMokuhyouStartDate: new Date(),
      choukiMokuhyouEndDate: new Date(),
      tankiMokuhyou: '',
      tankiMokuhyouStartDate: new Date(),
      tankiMokuhyouEndDate: new Date(),
      enjoServiceNaiyou: '',
      isHokenkyufutaishou: false,
      enjoServiceShubetsu: '',
      officeName: '',
      serviceHindo: '',
      serviceStartDate: new Date(),
      serviceEndDate: new Date(),
    };
    append(row);
    const validRows = rows.filter((innerRow) => !innerRow.deleteFlag);
    const checkedRows = validRows.filter((v) => v.isCheck === true);
    const newOrders = orders.map((v) => v);
    if (checkedRows.length > 0) {
      const index = newOrders.findIndex((v) => v === checkedRows[0].seq);
      newOrders.splice(index, 0, newMaxSeq);
    } else {
      newOrders.push(newMaxSeq);
    }
    setOrders(newOrders);
    if (validRows.length === 0) {
      setFirstSeq(newMaxSeq);
    }
    setRenderCount(renderCount + 1);
  };

  // 行削除
  const handleClickDelete = async () => {
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const checkedRows = rows.filter((row) => row.deleteFlag || row.isCheck);

    if (checkedRows.length === 0) {
      return;
    }

    // 確認ダイアログ
    if (!(await confirm({ title: '選択行削除', message: messages.MESSAGE_0007('選択行') }))) {
      return;
    }

    // 選択行の削除
    setDeleteSeq(checkedRows.map((v) => v.seq));
    const validRows = rows.filter((row) => !(row.deleteFlag || row.isCheck));
    setFirstSeq(validRows.length > 0 ? validRows[0].seq : 0);
  };

  // 登録
  const handleSubmitForm = async (submited: FieldValues) => {
    // eslint-disable-next-line no-console
    console.log('errors -> ', errors);
    if (errors?.plan2TableRows !== undefined && errors.plan2TableRows?.length > 0) {
      // エラーがある場合はリターン
      return;
    }
    // eslint-disable-next-line no-console
    console.log('submited', submited);

    // コンテンツ情報取得
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const validRows = rows.filter((row) => !row.deleteFlag);
    // コンテンツ情報に表示順をセット
    validRows.forEach((row, i) => {
      // eslint-disable-next-line no-param-reassign
      row.displayOrder = i + 1;
    });

    // 送信データ生成
    const data: Plan2InputFormType = {
      careplanHeaderSakuseiDate: submited.careplanHeaderSakuseiDate,
      careplanHeaderSakuseiName: submited.careplanHeaderSakuseiName,
      careplanHeaderMemo: submited.careplanHeaderMemo,
      minaoshiDate: getValues('minaoshiDate'),
      plan2TableRows: validRows,
    };

    // 送信処理
    await onSubmit(data);
  };

  // 行追加／行削除でレンダリングさせる。
  // 行のマウントで control に行データを作成させる為
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('setRenderCount event length -> ', fields.length);
    setRenderCount(renderCount + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  // control に行データが作成された後、setValueで値を設定する。
  // 行データは useFieldArray で管理しているので、controlとの同期が必要。
  React.useEffect(() => {
    if (fields === undefined) {
      return;
    }
    // 全行 (fields) を setValue でセットし直し
    for (let i = 0; i < fields.length; i += 1) {
      setRowData(setValue, i, convertPlan2TableRow(fields[i]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCount]);

  // eslint-disable-next-line no-console
  console.log('Plan2InputForm render');

  return (
    <>
      {/* 期間選択ダイアログ */}
      {isSelectPeriodDialogOpen && (
        <SelectPeriodDialog
          screenId={screenIDs.L1220_01.id}
          startDate={startDate}
          endDate={endDate}
          handleClickKettei={handleClickKetteiSelectPeriodDialog}
          handleClickReturn={handleClickReturnSelectPeriodDialog}
        />
      )}
      {/* 文例ダイアログ */}
      {isBunreiDialogOpen && (
        <BunreiDialog gyoumuBunreiSeq={gyoumuBunreiSeq} itemKbn={bunreiItemKbn || ''} maxLength={8} onReturnClick={handleClickReturnBunreiDialog} onSaveClick={handleClickKetteiBunreiDialog} />
      )}
      {/* 施設事業所ダイアログ */}
      {isOfficeDialogOpen && <OfficeList type="all" onClickReturn={handleClickReturnOfficeDialog} onClickSave={handleClickKetteiOfficeDialog} />}
      {/* 過去内容引用ダイアログ */}
      {isQuoteDialogOpen && (
        <QuoteDialog
          screenId={screenIDs.L1220_01.id}
          sakuseiDate={sakuseiDate}
          setIsDialogOpen={setIsQuoteDialogOpen}
          onClickReturn={handleClickReturnQuoteDialog}
          onClickSave={handleClickKetteiQuoteDialog}
        />
      )}

      {/* ボディー部 */}
      <Box m={1}>
        <Box mb={1}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Button id="add-button" onClick={handleClickQuote}>
                過去内容引用
              </Button>
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="flex-start">
                <Grid item>
                  <Box maxWidth={280} mr={1}>
                    <CalendarInputField
                      id={`${id}-minaoshi-date`}
                      name="minaoshiDate"
                      label="見直しアラート"
                      labelWidth={120}
                      variant="table"
                      control={control}
                      error={!!errors.minaoshiDate}
                      errorMessage={errors.minaoshiDate?.message}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <GeneralIconButton icon="add" id={`${id}-add-button`} onClick={handleClickAdd}>
                    行追加
                  </GeneralIconButton>
                </Grid>
                <Grid item>
                  <GeneralIconButton icon="delete" id={`${id}-delete-button`} onClick={handleClickDelete}>
                    行削除
                  </GeneralIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell rowSpan={2} />
                <HeaderCell rowSpan={2} />
                <HeaderCell rowSpan={2}>生活全般の解決すべき課題（ニーズ）</HeaderCell>
                <HeaderCell colSpan={4}>目標</HeaderCell>
                <HeaderCell colSpan={6}>援助内容</HeaderCell>
              </TableRow>
              <TableRow>
                <HeaderCell>長期目標</HeaderCell>
                <HeaderCell>(期間)</HeaderCell>
                <HeaderCell>短期目標</HeaderCell>
                <HeaderCell>(期間)</HeaderCell>
                <HeaderCell>サービス内容</HeaderCell>
                <HeaderCell>※1</HeaderCell>
                <HeaderCell>サービス種別</HeaderCell>
                <HeaderCell>※2</HeaderCell>
                <HeaderCell>頻度</HeaderCell>
                <HeaderCell>(期間)</HeaderCell>
              </TableRow>
            </TableHead>
            <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="dndTableBody">
                {(provided, snapshot) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {orders.map((rowIndex, index) => {
                      const row = fields[rowIndex];
                      if (row === undefined || fields.length === 0) {
                        return <></>;
                      }
                      return (
                        <Draggable draggableId={`${row.id}`} index={index} key={`${row.id}`}>
                          {(innerProvided: DraggableProvided, innerSnapshot: DraggableStateSnapshot) => (
                            <DraggableRow
                              rowIndex={rowIndex}
                              firstSeq={firstSeq}
                              maxSeq={maxSeq}
                              provided={innerProvided}
                              snapshot={innerSnapshot}
                              control={control}
                              errors={errors}
                              isDraggingOver={snapshot.isDraggingOver}
                              checkCnt={checkCnt}
                              deleteSeq={deleteSeq}
                              onClickOpenSelectPeriod={handleClickSelectPeriod}
                              onClickCopyPeriod={handleClickCopyPeriod}
                              onClickOpenBunreiDialog={handleClickOpenBunreiDialog}
                              onClickOpenOfficeDialog={handleClickOpenOfficeDialog}
                            />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="plan2-form-submit-button" icon="register" onClick={handleSubmit(handleSubmitForm)} disabled={isReadonly}>
          登録
        </GeneralIconFloatingActionButton>
      </Box>
    </>
  );
};

export default Plan2InputForm;
