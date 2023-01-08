import React from 'react';
import { Box, Grid, GridDirection, GridJustification, GridWrap, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import TextInput from '@my/components/atomic/TextInput';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import Checkbox from '@my/components/atomic/Checkbox';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DropResult } from 'react-beautiful-dnd';
import OrderUtils from '@my/utils/OrderUtils';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import { Controller, useFieldArray, useForm, FormContext, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import SelectPeriodDialog from '@my/containers/pages/Common/SelectPeriodDialog';
import IconButton from '@my/components/atomic/IconButton';
import CalendarIcon from '@my/components/icon/CalendarIcon';
import DateUtils from '@my/utils/DateUtils';
import BookIconButton from '@my/components/molecules/BunreiIconButton';
import TextInputField from '@my/components/molecules/TextInputField';

const StyledBodyCell = styled(BodyCell)<{ $isShow?: boolean; $maxWidth?: number }>`
  display: ${({ $isShow }) => ($isShow ? '' : 'none')};
  max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '')};
`;
const CalendarIconButton = styled(IconButton)<{ variant?: 'normal' | 'grid' | 'table' }>`
  padding: ${({ variant }) => (variant === 'normal' ? '12px' : '0')};
`;

type CustomGridProps = {
  children: React.ReactNode | React.ReactNode[];
  direction?: GridDirection;
  justify?: GridJustification;
  wrap?: GridWrap;
};
const CustomGrid: React.FC<CustomGridProps> = (props: CustomGridProps) => {
  const { children, direction, justify = 'flex-start', wrap } = props;
  return (
    <Grid container direction={direction} justify={justify} wrap={wrap}>
      {Array.isArray(children) ? children.map((child) => <Grid item>{child}</Grid>) : <Grid item>{children}</Grid>}
    </Grid>
  );
};

const tableName = 'tokyoCTableRows';

type DraggableRowProps = {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  rowIndex: number;
  isDraggingOver?: boolean;
};
const DraggableRow = React.memo(({ provided, snapshot, rowIndex, isDraggingOver }: DraggableRowProps) => {
  const { isDragging } = snapshot;
  const [selectPeriodDialogSetting, setSelectPeriodDialogSetting] = React.useState({ isOpenDialog: false, target: '' });
  const { control, setValue } = useFormContext();

  // TODO 文例

  /* 期間選択ダイアログの戻る処理 */
  const handleClickReturnSelectPeriodDialog = () => {
    setSelectPeriodDialogSetting({ isOpenDialog: false, target: '' });
  };
  /* 期間選択ダイアログの決定処理 */
  const handleClickKetteiSelectPeriodDialog = (period: { startDate: Date | null; endDate: Date | null }) => {
    const startDate = period.startDate !== null ? `${DateUtils.formatDate(period.startDate)}\r\n` : '';
    const endDate = period.endDate !== null ? `\r\n${DateUtils.formatDate(period.endDate)}` : '';
    setValue(selectPeriodDialogSetting.target, `${startDate}～${endDate}`);
    setSelectPeriodDialogSetting({ isOpenDialog: false, target: '' });
  };

  return (
    <>
      {selectPeriodDialogSetting.isOpenDialog && (
        <SelectPeriodDialog
          screenId="dummyId"
          startDate={new Date()}
          endDate={new Date()}
          handleClickKettei={handleClickKetteiSelectPeriodDialog}
          handleClickReturn={handleClickReturnSelectPeriodDialog}
        />
      )}
      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
        {/* ドラッグ中に描画されるセル */}
        <StyledBodyCell
          align="center"
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          style={{ height: 400 }}
          minWidth={`${Math.floor(100 / 5)}vw`}
          $isShow={isDragging}
          {...provided.dragHandleProps}
          bl
          bt
          br>
          <LineWeightIcon />
        </StyledBodyCell>
        {/* ドラッグアイコン */}
        <StyledBodyCell bl rowSpan={3} isDragging={isDragging} style={{ height: 400 }} isDraggingOver={isDraggingOver} {...provided.dragHandleProps} $isShow={!isDragging}>
          <Controller id={`${tableName}-${rowIndex}-display-order`} name={`${tableName}[${rowIndex}].displayOrder`} as={<input type="hidden" />} control={control} />
          <DragIndicatorIcon />
        </StyledBodyCell>
        {/* 目標について支援のポイント */}
        <StyledBodyCell bl rowSpan={3} isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-shien-point-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-shien-point`} name={`${tableName}[${rowIndex}].shienPoint`} type="textarea" rowsMin={26} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* 具体的な支援内容 */}
        {/* <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          本人の取り組み
        </StyledBodyCell> */}
        <StyledBodyCell colSpan={2} bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Box marginLeft={16}>
            <BookIconButton id={`${tableName}-${rowIndex}-shien-naiyou1-bunrei-button`} />
          </Box>
          <TextInputField
            id={`${tableName}-${rowIndex}-shien-naiyou1`}
            name={`${tableName}[${rowIndex}].shienNaiyou1`}
            type="textarea"
            rowsMin={7}
            fullWidth
            variant="grid"
            control={control}
            label="本人の取り組み"
          />
        </StyledBodyCell>
        {/* ※1 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Checkbox id={`${tableName}-${rowIndex}-is-yobou1`} name={`${tableName}[${rowIndex}].isYobou1`} size="small" control={control} />
        </StyledBodyCell>
        {/* サービス種類 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-service-kind1-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-service-kind1`} name={`${tableName}[${rowIndex}].serviceKind1`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* サービス提供者(事業所) */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <TextInput
            id={`${tableName}-${rowIndex}-service-teikyou1`}
            name={`${tableName}[${rowIndex}].serviceTeikyou1`}
            type="text"
            fullWidth
            variant="grid"
            control={control}
            autoCompleteOptions={['テスト事業所', 'テスト事業所2', 'テスト事業所3']}
          />
        </StyledBodyCell>
        {/* 頻度 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-hindo1-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-hindo1`} name={`${tableName}[${rowIndex}].hindo1`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* 期間 */}
        <StyledBodyCell bl br isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <CustomGrid justify="flex-start" wrap="nowrap">
            <CalendarIconButton
              id={`${tableName}-${rowIndex}-kikan-date1-button`}
              name={`${tableName}[${rowIndex}].kikanDate1Button`}
              variant="grid"
              onClick={() => setSelectPeriodDialogSetting({ isOpenDialog: true, target: `${tableName}[${rowIndex}].kikanDate1` })}>
              <CalendarIcon />
            </CalendarIconButton>
          </CustomGrid>
          <TextInput id={`${tableName}-${rowIndex}-kikan-date1`} name={`${tableName}[${rowIndex}].kikanDate1`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
      </TableRow>
      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
        {/* <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          家族・地域の支援、民間サービス等
        </StyledBodyCell> */}
        {/* 具体的な支援内容 */}
        <StyledBodyCell colSpan={2} bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Box marginLeft={16}>
            <BookIconButton id={`${tableName}-${rowIndex}-shien-naiyou2-bunrei-button`} />
          </Box>
          <TextInputField
            id={`${tableName}-${rowIndex}-shien-naiyou2`}
            name={`${tableName}[${rowIndex}].shienNaiyou2`}
            type="textarea"
            rowsMin={7}
            fullWidth
            variant="grid"
            control={control}
            label="家族・地域の支援、民間サービス等"
          />
        </StyledBodyCell>
        {/* ※1 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Checkbox id={`${tableName}-${rowIndex}-is-yobou2`} name={`${tableName}[${rowIndex}].isYobou2`} size="small" control={control} />
        </StyledBodyCell>
        {/* サービス種類 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-service-kind2-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-service-kind2`} name={`${tableName}[${rowIndex}].serviceKind2`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* サービス提供者(事業所) */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <TextInput
            id={`${tableName}-${rowIndex}-service-teikyou2`}
            name={`${tableName}[${rowIndex}].serviceTeikyou2`}
            type="text"
            fullWidth
            variant="grid"
            control={control}
            autoCompleteOptions={['テスト事業所', 'テスト事業所2', 'テスト事業所3']}
          />
        </StyledBodyCell>
        {/* 頻度 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-hindo2-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-hindo2`} name={`${tableName}[${rowIndex}].hindo2`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* 期間 */}
        <StyledBodyCell bl br isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <CustomGrid justify="flex-start" wrap="nowrap">
            <CalendarIconButton
              id={`${tableName}-${rowIndex}-kikan-date2-button`}
              name={`${tableName}[${rowIndex}].kikanDate2Button`}
              variant="grid"
              onClick={() => setSelectPeriodDialogSetting({ isOpenDialog: true, target: `${tableName}[${rowIndex}].kikanDate2` })}>
              <CalendarIcon />
            </CalendarIconButton>
          </CustomGrid>
          <TextInput id={`${tableName}-${rowIndex}-kikanDate2`} name={`${tableName}[${rowIndex}].kikanDate2`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
      </TableRow>
      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
        {/* <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          介護保険サービス地域支援事業区市町村サービス
        </StyledBodyCell> */}
        {/* 具体的な支援内容 */}
        <StyledBodyCell colSpan={2} bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Box marginLeft={16}>
            <BookIconButton id={`${tableName}-${rowIndex}-shien-naiyou3-bunrei-button`} />
          </Box>
          <TextInputField
            id={`${tableName}-${rowIndex}-shien-naiyou3`}
            name={`${tableName}[${rowIndex}].shienNaiyou3`}
            type="textarea"
            rowsMin={7}
            fullWidth
            variant="grid"
            control={control}
            label={`介護保険サービス\r\n地域支援事業\r\n区市町村サービス`}
          />
        </StyledBodyCell>
        {/* ※1 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <Checkbox id={`${tableName}-${rowIndex}-is-yobou3`} name={`${tableName}[${rowIndex}].isYobou3`} size="small" control={control} />
        </StyledBodyCell>
        {/* サービス種類 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-service-kind3-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-service-kind3`} name={`${tableName}[${rowIndex}].serviceKind3`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* サービス提供者(事業所) */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <TextInput
            id={`${tableName}-${rowIndex}-service-teikyou3`}
            name={`${tableName}[${rowIndex}].serviceTeikyou3`}
            type="text"
            fullWidth
            variant="grid"
            control={control}
            autoCompleteOptions={['テスト事業所', 'テスト事業所2', 'テスト事業所3']}
          />
        </StyledBodyCell>
        {/* 頻度 */}
        <StyledBodyCell bl isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <BookIconButton id={`${tableName}-${rowIndex}-hindo3-bunrei-button`} />
          <TextInput id={`${tableName}-${rowIndex}-hindo3`} name={`${tableName}[${rowIndex}].hindo3`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
        {/* 期間 */}
        <StyledBodyCell bl br isDragging={isDragging} isDraggingOver={isDraggingOver} $isShow={!isDragging}>
          <CustomGrid justify="flex-start" wrap="nowrap">
            <CalendarIconButton
              id={`${tableName}-${rowIndex}-kikan-date3-button`}
              name={`${tableName}[${rowIndex}].kikanDate3Button`}
              variant="grid"
              onClick={() => setSelectPeriodDialogSetting({ isOpenDialog: true, target: `${tableName}[${rowIndex}].kikanDate3` })}>
              <CalendarIcon />
            </CalendarIconButton>
          </CustomGrid>
          <TextInput id={`${tableName}-${rowIndex}-kikanDate3`} name={`${tableName}[${rowIndex}].kikanDate3`} type="textarea" rowsMin={7} fullWidth variant="grid" control={control} />
        </StyledBodyCell>
      </TableRow>
    </>
  );
});

const getAllRowData = (orders: number[], getValues: (arg: string) => any): TokyoCTableRow[] => {
  const result: TokyoCTableRow[] = orders.map((rowIndex) => {
    return {
      displayOrder: getValues(`${tableName}[${rowIndex}].displayOrder`),
      shienPoint: getValues(`${tableName}[${rowIndex}].shienPoint`),
      shienNaiyou1: getValues(`${tableName}[${rowIndex}].shienNaiyou1`),
      isYobou1: getValues(`${tableName}[${rowIndex}].isYobou1`),
      serviceKind1: getValues(`${tableName}[${rowIndex}].serviceKind1`),
      serviceTeikyou1: getValues(`${tableName}[${rowIndex}].serviceTeikyou1`),
      hindo1: getValues(`${tableName}[${rowIndex}].hindo1`),
      kikanDate1: getValues(`${tableName}[${rowIndex}].kikanDate1`),
      shienNaiyou2: getValues(`${tableName}[${rowIndex}].shienNaiyou2`),
      isYobou2: getValues(`${tableName}[${rowIndex}].isYobou2`),
      serviceKind2: getValues(`${tableName}[${rowIndex}].serviceKind2`),
      serviceTeikyou2: getValues(`${tableName}[${rowIndex}].serviceTeikyou2`),
      hindo2: getValues(`${tableName}[${rowIndex}].hindo2`),
      kikanDate2: getValues(`${tableName}[${rowIndex}].kikanDate2`),
      shienNaiyou3: getValues(`${tableName}[${rowIndex}].shienNaiyou3`),
      isYobou3: getValues(`${tableName}[${rowIndex}].isYobou3`),
      serviceKind3: getValues(`${tableName}[${rowIndex}].serviceKind3`),
      serviceTeikyou3: getValues(`${tableName}[${rowIndex}].serviceTeikyou3`),
      hindo3: getValues(`${tableName}[${rowIndex}].hindo3`),
      kikanDate3: getValues(`${tableName}[${rowIndex}].kikanDate3`),
    };
  });
  return result;
};

type TokyoCTableRow = {
  shienPoint?: string;
  shienNaiyou1?: string;
  isYobou1: boolean;
  serviceKind1?: string;
  serviceTeikyou1?: string;
  hindo1?: string;
  kikanDate1?: string;
  shienNaiyou2?: string;
  isYobou2: boolean;
  serviceKind2?: string;
  serviceTeikyou2?: string;
  hindo2?: string;
  kikanDate2?: string;
  shienNaiyou3?: string;
  isYobou3: boolean;
  serviceKind3?: string;
  serviceTeikyou3?: string;
  hindo3?: string;
  kikanDate3?: string;
  displayOrder: number;
};
type TokyoCFormType = {
  mokuhyou?: string;
  housihn?: string;
  tokyoCTableRows: TokyoCTableRow[];
};
const defaultValues: TokyoCFormType = {
  mokuhyou: '目標',
  housihn: '方針',
  tokyoCTableRows: [
    {
      displayOrder: 0,
      isYobou1: true,
      isYobou2: false,
      isYobou3: false,
      shienPoint: 'テストデータ１',
    },
    {
      displayOrder: 1,
      isYobou1: true,
      isYobou2: true,
      isYobou3: false,
      shienPoint: 'テストデータ２',
    },
    {
      displayOrder: 2,
      isYobou1: true,
      isYobou2: true,
      isYobou3: true,
      shienPoint: 'テストデータ３',
    },
  ],
};

const TokyoC: React.FC = () => {
  const formMethods = useForm<TokyoCFormType>({
    mode: 'onChange',
    defaultValues,
  });
  const { control, handleSubmit, getValues } = formMethods;
  const { fields } = useFieldArray({
    control,
    name: tableName,
  });

  const [orders, setOrders] = React.useState<number[]>(defaultValues.tokyoCTableRows.map((row) => row.displayOrder));
  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      const update = OrderUtils.sort(getAllRowData(orders, getValues), source.index, destination.index);
      setOrders(update.map((data) => data.displayOrder));
    },
    [getValues, orders]
  );

  // 登録
  const handleSubmitForm = (submited: TokyoCFormType) => {
    // TODO
    console.log('submited', submited);
  };

  return (
    <Box m={1} mb={2}>
      <LayoutForm id="tokyo-c-form" disableGridLayout>
        <TableContainer>
          <Table>
            <CustomGrid direction="row">
              {/* テーブルエリア */}
              <TableContainer>
                <Table className="tokyo-c-table">
                  <TableHead>
                    <HeaderCell align="center" rowSpan={2}>
                      目標
                    </HeaderCell>
                    <HeaderCell align="center" colSpan={9}>
                      現在の状況
                    </HeaderCell>
                    <TableRow>
                      <HeaderCell align="center" width={10}>
                        移動
                      </HeaderCell>
                      <HeaderCell align="center" minWidth={200}>
                        目標について支援のポイント
                      </HeaderCell>
                      <HeaderCell align="center" colSpan={2}>
                        具体的な支援内容
                      </HeaderCell>
                      <HeaderCell align="center">※1</HeaderCell>
                      <HeaderCell align="center">サービス種類</HeaderCell>
                      <HeaderCell align="center">サービス提供者(事業所)</HeaderCell>
                      <HeaderCell align="center">頻度</HeaderCell>
                      <HeaderCell align="center">期間</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <FormContext {...formMethods}>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="dndTableBody">
                        {(provided, snapshot) => (
                          <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                            <BodyCell bl rowSpan={10}>
                              <BookIconButton id="mokuhyou-bunrei-button" />
                              <TextInput id="mokuhyou" name="mokuhyou" type="textarea" rowsMin={84} fullWidth variant="grid" control={control} />
                            </BodyCell>
                            {orders.map((rowIndex, index) => {
                              const row = fields[rowIndex];
                              return (
                                <Draggable draggableId={`${row.id}`} index={index} key={`${row.id}`}>
                                  {(innerProvided: DraggableProvided, innerSnapshot: DraggableStateSnapshot) => (
                                    <DraggableRow rowIndex={rowIndex} provided={innerProvided} snapshot={innerSnapshot} isDraggingOver={snapshot.isDraggingOver} />
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </FormContext>
                </Table>
              </TableContainer>
            </CustomGrid>
          </Table>
        </TableContainer>
        <LayoutItem variant="1-item-full">
          <div style={{ fontSize: '12px' }}>※1 予防給付の対象サービス又は二次予防事業の場合、○をつける。</div>
        </LayoutItem>
        <Box m={4} />
        <CustomGrid direction="row" justify="flex-start">
          <>【本来行うべき支援が実施できない場合：当面の方針】</>
          <Box mt={-0.5}>
            <BookIconButton id="housihn-bunrei-button" />
          </Box>
        </CustomGrid>
        <LayoutItem variant="1-item-full">
          <TextInput id="housihn" name="housihn" type="textarea" rowsMin={6} fullWidth variant="grid" control={control} />
        </LayoutItem>
        <GeneralIconFloatingActionButton id="tokyo-c-form-submit-button" icon="register" onClick={handleSubmit(handleSubmitForm)}>
          登録
        </GeneralIconFloatingActionButton>
      </LayoutForm>
    </Box>
  );
};

export default TokyoC;
