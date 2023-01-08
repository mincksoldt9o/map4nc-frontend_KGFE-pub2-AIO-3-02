import React from 'react';
import { Box, Grid, GridDirection, GridJustification, GridWrap, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import TextInput from '@my/components/atomic/TextInput';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import BookIconButton from '@my/components/molecules/BunreiIconButton';
import Title from '@my/components/atomic/Title';
import styled from 'styled-components';
import IconButton from '@my/components/atomic/IconButton';
import SelectPeriodDialog from '@my/containers/pages/Common/SelectPeriodDialog';
import DateUtils from '@my/utils/DateUtils';
import CalendarIcon from '@my/components/icon/CalendarIcon';
import { FormContext, useForm, useFormContext } from 'react-hook-form';

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

type RowContentsProps = {
  id: string;
  name: string;
  title: string;
};
const RowContents = (props: RowContentsProps) => {
  const { id, name, title } = props;
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
        <SelectPeriodDialog screenId={id} startDate={new Date()} endDate={new Date()} handleClickKettei={handleClickKetteiSelectPeriodDialog} handleClickReturn={handleClickReturnSelectPeriodDialog} />
      )}
      <TableRow>
        <HeaderCell align="center" width={90}>
          {title}
        </HeaderCell>
        <BodyCell bl br>
          <BookIconButton id={`${id}-mokuhyonitsuite-no-shienpoint-bunrei-button`} />
          <TextInput id={`${id}-mokuhyonitsuite-no-shienpoint`} name={`${name}MokuhyonitsuiteNoShienpoint`} type="textarea" defaultValue="" fullWidth variant="table" control={control} />
        </BodyCell>
        <BodyCell bl br>
          <BookIconButton id={`${id}-informal-service-bunrei-button`} />
          <TextInput id={`${id}-informal-service`} name={`${name}InformalService`} type="textarea" defaultValue="" fullWidth variant="table" control={control} />
        </BodyCell>
        <BodyCell bl br>
          <BookIconButton id={`${id}-kaigohoken-service-mataha-chiikishienzigyo-bunrei-button`} />
          <TextInput
            id={`${id}-kaigohoken-service-mataha-chiikishienzigyo`}
            name={`${name}KaigohokenServiceMatahaChiikishienzigyo`}
            type="textarea"
            defaultValue=""
            fullWidth
            variant="table"
            control={control}
          />
        </BodyCell>
        <BodyCell bl br>
          <BookIconButton id={`${id}-service-shubetsu-bunrei-button`} />
          <TextInput id={`${id}-service-shubetsu`} name={`${name}ServiceShubetsu`} type="textarea" defaultValue="" fullWidth variant="table" control={control} />
        </BodyCell>
        <BodyCell bl br>
          <TextInput id={`${id}-office`} name={`${name}Office`} type="textarea" defaultValue="" fullWidth variant="table" control={control} />
        </BodyCell>
        <BodyCell bl br>
          <CustomGrid justify="flex-start" wrap="nowrap">
            <CalendarIconButton id={`${id}-kikan-button`} name={`${name}KikanButton`} variant="grid" onClick={() => setSelectPeriodDialogSetting({ isOpenDialog: true, target: `${name}Kikan` })}>
              <CalendarIcon />
            </CalendarIconButton>
          </CustomGrid>
          <TextInput id={`${id}-kikan`} name={`${name}Kikan`} type="textarea" defaultValue="" fullWidth variant="table" control={control} />
        </BodyCell>
      </TableRow>
    </>
  );
};

type ShienkeikakuFormType = {
  undoIdonichizyouSeikatsuKikan?: string;
  communicationKikan?: string;
  kenkouKanriKikan?: string;
};

const Shienkeikaku: React.FC = () => {
  const formMethods = useForm<ShienkeikakuFormType>({
    mode: 'onChange',
  });

  // 登録
  const handleSubmitForm = () => {
    // TODO
  };

  return (
    <Box m={1} mb={2}>
      <LayoutForm id="shienkeikaku-form" disableGridLayout>
        <CustomGrid direction="row" justify="flex-start">
          <Title id="shienkeikaku-title">支援計画</Title>
        </CustomGrid>
        <FormContext {...formMethods}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell align="center" width={130}>
                    アセスメント領域
                  </HeaderCell>
                  <HeaderCell align="center">目標についての支援のポイント</HeaderCell>
                  <HeaderCell align="center">本人等のセルフケアや家族の支援、インフォーマルサービス</HeaderCell>
                  <HeaderCell align="center">介護保険サービスまたは、地域支援事業</HeaderCell>
                  <HeaderCell align="center">サービス種別</HeaderCell>
                  <HeaderCell align="center">事業所</HeaderCell>
                  <HeaderCell align="center">期間</HeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <RowContents id="undo-ido-nichizyou-seikatsu" name="undoIdonichizyouSeikatsu" title="運動・移動、日常生活(家庭生活)について" />
                <RowContents id="communication" name="communication" title="社会参加、対人関係・コミュニケーションについて" />
                <RowContents id="kenkou-kanri" name="kenkouKanri" title="健康管理について" />
              </TableBody>
            </Table>
          </TableContainer>
        </FormContext>
        <GeneralIconFloatingActionButton id="shienkeikaku-submit-button" icon="register" onClick={handleSubmitForm}>
          登録
        </GeneralIconFloatingActionButton>
      </LayoutForm>
    </Box>
  );
};

export default Shienkeikaku;
