import React, { useState } from 'react';
import yup, { yupDate } from '@my/yup';
import { ArrayField, Control, FieldError, NestDataObject, useFieldArray, useForm } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DropResult } from 'react-beautiful-dnd';
import { LayoutForm } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import TextInput from '@my/components/atomic/TextInput';
import CheckboxField from '@my/components/molecules/CheckboxField';
import Button from '@my/components/atomic/Button';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import BookIcon from '@my/components/icon/BookIcon';
import SelectPeriodDialog from '@my/containers/pages/Common/SelectPeriodDialog';
import { BodyCell, HeaderCell, OrderTableRow, OrderTableRowColumn } from '@my/components/layouts/Table';
import BunreiContentsCell from '@my/components/organisms/BunreiContentsCell';
import TermFreeInputContentsCell from '@my/components/organisms/TermFreeInputContentsCell';
import OrderUtils from '@my/utils/OrderUtils';
import BookIconButton from '@my/components/molecules/BunreiIconButton';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import ImportDialog from './ImportDialog/ImportDialog';
import { planStatusCheckboxes } from '../Datas';

type YoboHyokaTableRow = OrderTableRowColumn & {
  target: string;
  periodFrom: Date | null;
  periodTo: Date | null;
  goalAchievementStatus: string;
  goalAchievement: string;
  causeByHimself: string;
  causeByAuthor: string;
  futurePolicy: string;
};

const convertYoboHyokaTableRow = (data: Partial<ArrayField<Record<string, any>, 'id'>>): YoboHyokaTableRow => {
  return {
    deleteFlag: data.deleteFlag,
    seq: data.seq,
    isCheck: data.isCheck,
    target: data.target,
    periodFrom: data.periodFrom,
    periodTo: data.periodTo,
    goalAchievementStatus: data.goalAchievementStatus,
    goalAchievement: data.goalAchievement,
    causeByHimself: data.causeByHimself,
    causeByAuthor: data.causeByAuthor,
    futurePolicy: data.futurePolicy,
  };
};

export type Props = {
  id: string;
  defaultValues?: YoboHyokaInputFormType;
};

export type YoboHyokaInputFormType = {
  yoboHyokaTableRows: YoboHyokaTableRow[];
  totalPolicy: string;
  regionalComprehensiveSupportCenterOpinion: string;
  planStatus: string[];
  preventiveCare: string[];
};

// 表１行分のバリデーションスキーマ
const yoboHyokaTableRowsSchema = yup.lazy<YoboHyokaTableRow>((values) => {
  if (!values.deleteFlag) {
    return yup.object().shape({
      deleteFlag: yup.boolean(),
      seq: yup.number(),
      isCheck: yup.boolean(),
      target: yup.string().required().label('目標'),
      periodFrom: yupDate(),
      periodTo: yupDate(),
      goalAchievementStatus: yup.string().min(2).max(22).label('目標達成状況'),
      goalAchievement: yup.string(),
      causeByHimself: yup.string(),
      causeByAuthor: yup.string(),
      futurePolicy: yup.string(),
    });
  }
  return yup.object();
});

const formSchema = yup.object({
  yoboHyokaTableRows: yup.array().of(yoboHyokaTableRowsSchema),
  totalPolicy: yup.string().label('総合的な方針'),
  regionalComprehensiveSupportCenterOpinion: yup.string().label('地域包括支援センター意見'),
  planStatus: yup.array(),
  preventiveCare: yup.array(),
});

type DraggableRowProps = {
  control: Control<FormValues>;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  rowIndex: number;
  firstSeq: number;
  maxSeq: number;
  isDraggingOver?: boolean;
  draggingRow?: YoboHyokaTableRow;
  checkCnt?: number;
  deleteSeq: number[];
  errors: NestDataObject<YoboHyokaTableRow, FieldError> | undefined;
  onClick?: () => void;
};

const tableName = 'yoboHyokaTableRows';

const DraggableRow = React.memo(({ provided, snapshot, control, rowIndex, firstSeq, maxSeq, isDraggingOver, checkCnt, deleteSeq, errors, onClick }: DraggableRowProps) => {
  const { isDragging } = snapshot;

  let seq: number | undefined = control.getValues(`${tableName}[${rowIndex}].seq`);
  // 行追加した瞬間のseqが取得出来ない。
  // 苦肉の策として下記 maxSeq を設定
  if (seq === undefined) {
    seq = maxSeq;
  }
  const display = isDragging || deleteSeq.includes(seq) ? 'none' : '';

  return (
    <OrderTableRow provided={provided} snapshot={snapshot} control={control} isDraggingOver={isDraggingOver} deleteSeq={deleteSeq} tableName={tableName} rowIndex={rowIndex} checkCnt={checkCnt}>
      {/* 目標 */}
      <BunreiContentsCell
        id={`${tableName}-${rowIndex}-target`}
        name={`${tableName}[${rowIndex}].target`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        control={control}
        display={display}
        isError={errors?.target !== undefined}
      />
      {/* 期間 */}
      <TermFreeInputContentsCell
        id={`${tableName}-${rowIndex}-period`}
        name={`${tableName}[${rowIndex}].period`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        disabled={firstSeq === seq}
        display={display}
        onClick={onClick}
        isError={errors?.periodFrom !== undefined || errors?.periodTo !== undefined}
        control={control}
      />
      {/* 目標達成状況 */}
      <BunreiContentsCell
        id={`${tableName}-${rowIndex}-goal-achievement-status`}
        name={`${tableName}[${rowIndex}].goalAchievementStatus`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        control={control}
        display={display}
        isError={errors?.goalAchievementStatus !== undefined}
      />
      {/* 目標達成／未達成 */}
      <BodyCell align="center" isDragging={isDragging} isDraggingOver={isDraggingOver} style={{ display, width: '100px' }} bl bt br isError={errors?.goalAchievement !== undefined}>
        <TextInput
          type="text"
          id={`${tableName}-${rowIndex}-goal-achievement`}
          name={`${tableName}[${rowIndex}].goalAchievement`}
          variant="table"
          control={control}
          autoCompleteOptions={['〇', '✕']}
        />
      </BodyCell>
      {/* 目標達成しない原因(本人・家族の意見) */}
      <BunreiContentsCell
        id={`${tableName}-${rowIndex}-cause-by-himself`}
        name={`${tableName}[${rowIndex}].causeByHimself`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        control={control}
        display={display}
        isError={errors?.causeByHimself !== undefined}
      />
      {/* 目標達成しない原因(計画作成者の評価) */}
      <BunreiContentsCell
        id={`${tableName}-${rowIndex}-cause-by-author`}
        name={`${tableName}[${rowIndex}].causeByAuthor`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        control={control}
        display={display}
        isError={errors?.causeByAuthor !== undefined}
      />
      {/* 今後の方針 */}
      <BunreiContentsCell
        id={`${tableName}-${rowIndex}-future-policy`}
        name={`${tableName}[${rowIndex}].futurePolicy`}
        isDragging={isDragging}
        isDraggingOver={isDraggingOver}
        control={control}
        display={display}
        minWidth={`${Math.floor(100 / 6)}vw`}
        isError={errors?.futurePolicy !== undefined}
      />
    </OrderTableRow>
  );
});

type FormValues = {
  yoboHyokaTableRows: YoboHyokaTableRow[];
};

export const getDefaultValue = (): YoboHyokaTableRow[] => {
  return [...Array(10)].map((_, index) => {
    return {
      deleteFlag: false,
      isCheck: false,
      // ここからはstoreのデータ
      seq: index,
      target: `target${index}`,
      periodFrom: new Date(),
      periodTo: new Date(),
      goalAchievementStatus: `goalAchievementStatus${index}`,
      goalAchievement: ``,
      causeByHimself: `causeByHimself${index}`,
      causeByAuthor: `causeByAuthor${index}`,
      futurePolicy: `futurePolicy${index}`,
    };
  });
};

// 全行の現在のデータを取得する
const getAllRowData = (orders: number[], deleteSeq: number[], getValues: (arg: string) => any): YoboHyokaTableRow[] => {
  const result: YoboHyokaTableRow[] = orders.map((rowIndex) => {
    const seq: number = getValues(`${tableName}[${rowIndex}].seq`);
    return {
      deleteFlag: deleteSeq.includes(seq),
      seq,
      isCheck: getValues(`${tableName}[${rowIndex}].isCheck`),
      target: getValues(`${tableName}[${rowIndex}].target`),
      periodFrom: getValues(`${tableName}[${rowIndex}].periodFrom`),
      periodTo: getValues(`${tableName}[${rowIndex}].periodTo`),
      goalAchievementStatus: getValues(`${tableName}[${rowIndex}].goalAchievementStatus`),
      goalAchievement: getValues(`${tableName}[${rowIndex}].goalAchievement`),
      causeByHimself: getValues(`${tableName}[${rowIndex}].causeByHimself`),
      causeByAuthor: getValues(`${tableName}[${rowIndex}].causeByAuthor`),
      futurePolicy: getValues(`${tableName}[${rowIndex}].futurePolicy`),
    };
  });
  return result;
};

const setRowData = (setValue: (name: any, value: any) => any, index: number, row: YoboHyokaTableRow) => {
  setValue(`${tableName}[${index}].deleteFlag`, row.deleteFlag);
  setValue(`${tableName}[${index}].seq`, row.seq);
  setValue(`${tableName}[${index}].isCheck`, row.isCheck);
  setValue(`${tableName}[${index}].target`, row.target);
  setValue(`${tableName}[${index}].periodFrom`, row.periodFrom);
  setValue(`${tableName}[${index}].periodTo`, row.periodTo);
  setValue(`${tableName}[${index}].goalAchievementStatus`, row.goalAchievementStatus);
  setValue(`${tableName}[${index}].goalAchievement`, row.goalAchievement);
  setValue(`${tableName}[${index}].causeByHimself`, row.causeByHimself);
  setValue(`${tableName}[${index}].causeByAuthor`, row.causeByAuthor);
  setValue(`${tableName}[${index}].futurePolicy`, row.futurePolicy);
};

// *************************************************************************************
// ********** データ
// 定数

// 単一チェックボックスに指定する名前
// プラン状況
const planStatusName = 'planStatus';

const YoboHyokaInputForm: React.FC<Props> = (props: Props) => {
  const { id, defaultValues } = props;

  const [isSelectPeriodDialogOpen, setIsSelectPeriodDialogOpen] = React.useState(false);
  const handleClickSelectPeriod = () => {
    setIsSelectPeriodDialogOpen(true);
  };
  const handleClickReturnSelectPeriodDialog = () => {
    setIsSelectPeriodDialogOpen(false);
  };
  const handleClickKetteiSelectPeriodDialog = (period: { startDate: Date | null; endDate: Date | null }) => {
    console.log(period);
    setIsSelectPeriodDialogOpen(false);
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleClickImport = () => {
    setIsDialogOpen(true);
  };

  const formMethods = useForm<YoboHyokaInputFormType>({
    mode: 'onChange',
    defaultValues,
    validationSchema: formSchema,
  });

  const { errors, handleSubmit, control, getValues, setValue } = formMethods;
  console.log('errors', errors);

  const yoboHyokaTableRows = defaultValues?.yoboHyokaTableRows || [];

  const [renderCount, setRenderCount] = useState<number>(0);
  // 並び順制御用の配列
  const [orders, setOrders] = useState<number[]>(yoboHyokaTableRows.map((row) => row.seq));
  // 削除制御用の配列
  const [deleteSeq, setDeleteSeq] = useState<number[]>([]);
  // チェックされている行数
  const [checkCnt, setCheckCnt] = React.useState<number>(0);
  // 一番上の行のseq
  const [firstSeq, setFirstSeq] = React.useState<number>(0);

  // fields は、行追加の時にappendで増やす。
  // 行削除の時にremoveはしない。deleteSeqで制御する。
  const { fields, append } = useFieldArray({
    control,
    name: 'yoboHyokaTableRows',
  });

  const [maxSeq, setMaxSeq] = React.useState<number>(fields.length - 1);

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
    const row: YoboHyokaTableRow = {
      deleteFlag: false,
      seq: newMaxSeq,
      isCheck: false,
      target: '',
      periodFrom: new Date(),
      periodTo: new Date(),
      goalAchievementStatus: '',
      goalAchievement: '',
      causeByHimself: '',
      causeByAuthor: '',
      futurePolicy: '',
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
  };

  // 行削除
  const handleClickDelete = () => {
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const checkedRows = rows.filter((row) => row.deleteFlag || row.isCheck);
    setDeleteSeq(checkedRows.map((v) => v.seq));
    checkedRows.forEach((row) => {
      setValue(`${tableName}[${row.seq}].deleteFlag`, true);
    });
    const validRows = rows.filter((row) => !(row.deleteFlag || row.isCheck));
    setFirstSeq(validRows.length > 0 ? validRows[0].seq : 0);
  };

  // 登録
  const handleSubmitForm = (submited: FormValues) => {
    // TODO
    const rows = getAllRowData(orders, deleteSeq, getValues);
    const validRows = rows.filter((row) => !row.deleteFlag);
    console.log('validRows', validRows);
    console.log('submited', submited);
  };

  // 行追加／行削除でレンダリングさせる。
  // 行のマウントで control に行データを作成させる為
  React.useEffect(() => {
    setRenderCount(renderCount + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  // control に行データが作成された後、setValueで値を設定する。
  // 行データは useFieldArray で管理しているので、controlとの同期が必要。
  React.useEffect(() => {
    setRowData(setValue, fields.length - 1, convertYoboHyokaTableRow(fields[fields.length - 1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCount]);

  return (
    <LayoutForm id={`${id}-form`} disableGridLayout>
      {/* ボディー部 */}
      {isSelectPeriodDialogOpen && (
        <SelectPeriodDialog screenId={id} startDate={new Date()} endDate={new Date()} handleClickKettei={handleClickKetteiSelectPeriodDialog} handleClickReturn={handleClickReturnSelectPeriodDialog} />
      )}
      {isDialogOpen && <ImportDialog setIsDialogOpen={setIsDialogOpen} />}
      <Box m={1}>
        <Box mb={1}>
          <Grid container direction="row" justify="space-between">
            <Button id="add-button" onClick={handleClickImport}>
              支援計画書取り込み
            </Button>
            <Grid item>
              <Grid container direction="row" justify="flex-start">
                <Grid item>
                  <Box maxWidth={280} mr={1}>
                    {/* TODO 作成年月日の翌月（＋1ヶ月）を初期値として表示 */}
                    <CalendarInputField
                      id="minaoshi-alert"
                      name="minaoshiAlert"
                      label="見直しアラート"
                      labelWidth={120}
                      variant="table"
                      defaultValue={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <GeneralIconButton icon="add" id="add-button" onClick={handleClickAdd}>
                    行追加
                  </GeneralIconButton>
                </Grid>
                <Grid item>
                  <GeneralIconButton icon="delete" id="delete-button" onClick={handleClickDelete}>
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
                <HeaderCell />
                <HeaderCell />
                <HeaderCell>目標</HeaderCell>
                <HeaderCell>評価期間</HeaderCell>
                <HeaderCell>目標達成状況</HeaderCell>
                <HeaderCell>
                  目標
                  <br />
                  達成／未達成
                </HeaderCell>
                <HeaderCell>
                  目標達成しない原因
                  <br />
                  (本人・家族の意見)
                </HeaderCell>
                <HeaderCell>
                  目標達成しない原因
                  <br />
                  (計画作成者の評価)
                </HeaderCell>
                <HeaderCell>今後の方針</HeaderCell>
              </TableRow>
            </TableHead>
            <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="dndTableBody">
                {(provided, snapshot) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {orders.map((rowIndex, index) => {
                      const row = fields[rowIndex];
                      const fieldError = errors.yoboHyokaTableRows ? errors.yoboHyokaTableRows[rowIndex] : undefined;
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
                              isDraggingOver={snapshot.isDraggingOver}
                              checkCnt={checkCnt}
                              deleteSeq={deleteSeq}
                              errors={fieldError}
                              onClick={handleClickSelectPeriod}
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
      </Box>

      <Box mt={1} ml={1} mr={1}>
        <TableContainer>
          <Table aria-label={`${id}-table`}>
            <TableBody>
              <TableRow>
                <BodyCell style={{ borderBottom: 'none' }}>
                  <Grid container direction="row" justify="flex-start">
                    <Grid item>総合的な方針&nbsp;&nbsp;</Grid>
                    <Grid item>
                      <BookIconButton id={id}>
                        <BookIcon />
                      </BookIconButton>
                    </Grid>
                  </Grid>
                </BodyCell>
                <BodyCell style={{ borderBottom: 'none' }}>
                  <Grid container direction="row" justify="flex-start">
                    <Grid item>地域包括支援センター意見&nbsp;&nbsp;</Grid>
                    <Grid item>
                      <BookIconButton id={id}>
                        <BookIcon />
                      </BookIconButton>
                    </Grid>
                  </Grid>
                </BodyCell>
                <BodyCell rowSpan={2} width="150px" style={{ verticalAlign: 'top', borderBottom: 'none' }}>
                  <Box padding={1} border="1px solid #e8dac3">
                    <Box ml={1}>
                      <CheckboxField
                        id={`${id}-plan-status`}
                        name={planStatusName}
                        label=""
                        labelWidth={0}
                        checkboxes={planStatusCheckboxes}
                        size="small"
                        orientation="vertical"
                        singleCheck
                        control={control}
                      />
                    </Box>
                  </Box>
                </BodyCell>
                <BodyCell rowSpan={2} width="150px" style={{ verticalAlign: 'top', borderBottom: 'none' }}>
                  <Box padding={1} border="1px solid #e8dac3">
                    <Box ml={1}>
                      <CheckboxField
                        id="preventive-care"
                        name="preventiveCare"
                        label=""
                        labelWidth={0}
                        checkboxes={[
                          { label: '介護給付', value: '1' },
                          { label: '予防給付', value: '2' },
                          { label: '二次予防事業', value: '3' },
                          { label: '一次予防事業', value: '4' },
                          { label: '終了', value: '5' },
                        ]}
                        size="small"
                        orientation="vertical"
                        control={control}
                      />
                    </Box>
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <BodyCell style={{ verticalAlign: 'top', borderBottom: 'none' }}>
                  <TextInput id="total-policy" name="totalPolicy" type="textarea" rowsMin={4} imeMode="auto" defaultValue="" fullWidth variant="table" control={control} />
                </BodyCell>
                <BodyCell style={{ verticalAlign: 'top', borderBottom: 'none' }}>
                  <TextInput
                    id="regional-comprehensive-support-center-opinion"
                    name="regionalComprehensiveSupportCenterOpinion"
                    type="textarea"
                    rowsMin={4}
                    imeMode="auto"
                    defaultValue=""
                    fullWidth
                    variant="table"
                    control={control}
                  />
                </BodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="form-submit-button" icon="register" onClick={handleSubmit(handleSubmitForm)}>
          登録
        </GeneralIconFloatingActionButton>
      </Box>
    </LayoutForm>
  );
};

export default YoboHyokaInputForm;
