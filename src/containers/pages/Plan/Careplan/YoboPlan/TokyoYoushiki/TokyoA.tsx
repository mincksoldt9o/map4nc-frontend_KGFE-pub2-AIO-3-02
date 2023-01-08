import React, { useState } from 'react';
import { Box, Grid, GridDirection, GridJustification, GridWrap, Table, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import CheckboxField from '@my/components/molecules/CheckboxField';
import OptionButton from '@my/components/atomic/OptionButton';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import CalendarInput from '@my/components/molecules/CalendarInput';
import TextInput from '@my/components/atomic/TextInput';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import Button from '@my/components/atomic/Button';
import TextInputField from '@my/components/molecules/TextInputField';
import BookIconButton from '@my/components/molecules/BunreiIconButton';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

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

const TokyoA: React.FC = () => {
  const [{ isBunreiOpen, formName, itemKbn, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; formName: string; itemKbn: string; maxLength?: number }>({
    isBunreiOpen: false,
    formName: '',
    itemKbn: '',
  });

  const handleBunreiClick = (clickedFormName: string, itemCode: string, maxLength?: number) => {
    if (formName && itemCode) {
      setBunreiOption({ isBunreiOpen: true, formName: clickedFormName, itemKbn: itemCode, maxLength });
    }
  };

  const handleBunreiClose = () => {
    setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
  };

  const handleBunreiSaveClick = (item: BunreiType) => {
    if (formName) {
      // const bunrei = getValues(formName) || ''; TODO
      // setValue(formName, bunrei + item.bunrei, false); TODO
      console.debug(item);
      setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
    }
  };

  // 登録
  const handleSubmitForm = () => {
    // TODO
  };

  return (
    <Box m={1} mb={2}>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
      <LayoutForm id="tokyo-a-form" disableGridLayout>
        <CustomGrid direction="row" justify="space-between">
          <CustomGrid direction="row" justify="flex-start">
            <Box mr={1} mt={0.5}>
              <CheckboxField
                id="introduction"
                name="introduction"
                checkboxes={[
                  { label: '初回', value: '1' },
                  { label: '紹介', value: '2' },
                  { label: '継続', value: '3' },
                ]}
                size="small"
                labelWidth={10}
              />
            </Box>
            <Box minWidth={150} mr={1} mt={0.5}>
              <OptionButton
                id="status"
                name="status"
                options={[
                  { label: '認定済み', value: '1' },
                  { label: '申請中', value: '2' },
                ]}
                size="small"
              />
            </Box>
            <Box minWidth={300}>
              <ComboBoxField
                id="nintei"
                name="nintei"
                label="認定情報"
                labelWidth={80}
                options={[
                  { label: '要支援１', value: '1' },
                  { label: '要支援２', value: '2' },
                  { label: '地域支援事業', value: '3' },
                ]}
                variant="grid"
              />
            </Box>
          </CustomGrid>
          <Button id="kaigo-hoken-torikomi">介護保険情報取り込み</Button>
        </CustomGrid>
        <CustomGrid direction="row" justify="flex-start">
          <Box minWidth={150} maxWidth={300} mr={9} my={1} style={{ borderBottom: '1px solid #e8dac3' }}>
            <CalendarInputField id="nintei-date" name="ninteiDate" label="認定年月日" defaultValue={new Date()} variant="grid" />
          </Box>
          <Box style={{ borderBottom: '1px solid #e8dac3' }} my={1}>
            <CustomGrid direction="row" justify="flex-start">
              <Box minWidth={150} maxWidth={300}>
                <CalendarInputField id="nintei-start-date" name="ninteiStartDate" label="認定の有効期間" defaultValue={new Date()} variant="grid" />
              </Box>
              <Box mx={3} mt={0.5}>
                ～
              </Box>
              <Box minWidth={150} maxWidth={170}>
                <CalendarInput id="nintei-end-date" name="ninteiEndDate" defaultValue={new Date()} variant="grid" />
              </Box>
            </CustomGrid>
          </Box>
        </CustomGrid>
        <CustomGrid direction="row" justify="flex-start">
          <Box minWidth={350} maxWidth={500} mr={3} my={1} style={{ borderBottom: '1px solid #e8dac3' }}>
            <ComboBoxField
              id="plan-creater"
              name="planCreater"
              label="計画作成者氏名"
              options={[
                { label: 'テスト', value: '1' },
                { label: 'テスト２', value: '2' },
                { label: 'テスト３', value: '3' },
              ]}
              variant="grid"
            />
          </Box>
          <CustomGrid direction="column" justify="flex-start">
            <Box minWidth={720} mt={1} style={{ borderBottom: '1px solid #e8dac3' }}>
              <TextInputField
                id="chiikihoukatsu-shien-center"
                name="chiikihoukatsuShienCenter"
                label="担当地域包括支援センター"
                labelWidth={200}
                type="text"
                defaultValue=""
                fullWidth
                variant="grid"
                maxLength={30}
                autoCompleteOptions={['文京区音羽地域包括支援センター', '豊島区中央地域包括支援センター', '港区地域包括支援センター']}
              />
            </Box>
          </CustomGrid>
        </CustomGrid>
        <CustomGrid direction="row" justify="flex-start">
          <Box my={1} style={{ borderBottom: '1px solid #e8dac3' }}>
            <CustomGrid direction="row" justify="flex-start">
              <Box minWidth={150} maxWidth={300} mr={2}>
                <CalendarInputField id="create-plan-date" name="createPlanDate" label="計画作成（変更）日" defaultValue={new Date()} variant="grid" />
              </Box>
              <Box minWidth={150} maxWidth={250}>
                <CalendarInputField id="create-plan-first-date" name="createPlanFirstDate" label="(初回作成日" labelWidth={80} defaultValue={new Date()} variant="grid" />
              </Box>
              <div style={{ color: '#828282', marginLeft: '2px', marginTop: '4px' }}>)</div>
            </CustomGrid>
          </Box>
        </CustomGrid>
        {/* テーブルエリア */}
        <TableContainer>
          <Table className="tokyo-a-table">
            <TableRow>
              <HeaderCell rowSpan={2} width={90}>
                目標とする生活
              </HeaderCell>
              <BodyCell align="center" bt br width={100}>
                1日、1週間、
                <br />
                または1月
              </BodyCell>
              <BodyCell bt br minWidth={100}>
                <BookIconButton
                  id="day-week-month-bunrei-button"
                  onClick={() => {
                    handleBunreiClick('dayWeekMonth', 'dayWeekMonth');
                  }}
                />
                <TextInput id="day-week-month" name="dayWeekMonth" type="textarea" rowsMin={3} rowsMax={3} imeMode="auto" defaultValue="" fullWidth variant="grid" />
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell align="center" bt br minWidth={100}>
                1年
              </BodyCell>
              <BodyCell bt br minWidth={100}>
                <BookIconButton
                  id="year-bunrei-button"
                  onClick={() => {
                    handleBunreiClick('year', 'year');
                  }}
                />
                <TextInput id="year" name="year" type="textarea" rowsMin={3} rowsMax={3} imeMode="auto" defaultValue="" fullWidth variant="grid" />
              </BodyCell>
            </TableRow>
            <TableRow>
              <HeaderCell colSpan={2}>
                総合的な方針
                <br />
                (生活の不活発化の改善
                <br />
                ・予防ポイント)
              </HeaderCell>
              <BodyCell bt br minWidth={100}>
                <BookIconButton
                  id="houshin-bunrei-button"
                  onClick={() => {
                    handleBunreiClick('houshin', 'houshin');
                  }}
                />
                <TextInput id="houshin" name="houshin" type="textarea" rowsMin={3} rowsMax={3} imeMode="auto" defaultValue="" fullWidth variant="grid" />
              </BodyCell>
            </TableRow>
          </Table>
        </TableContainer>
        <CustomGrid direction="row" justify="flex-start">
          <>【地域包括支援センター記入欄】</>
        </CustomGrid>
        <TableContainer>
          <Table>
            <TableRow>
              <HeaderCell rowSpan={2} width={100}>
                担当地域包括支援センター
              </HeaderCell>
              <BodyCell bt br minWidth={100}>
                <Box maxWidth={720}>
                  <TextInputField
                    id="meisho"
                    name="meisho"
                    label="名称"
                    labelWidth={50}
                    type="text"
                    defaultValue=""
                    fullWidth
                    variant="grid"
                    maxLength={30}
                    autoCompleteOptions={['文京区音羽地域包括支援センター', '豊島区中央地域包括支援センター', '港区地域包括支援センター']}
                  />
                </Box>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell bt br minWidth={100}>
                <TextInputField id="iken" name="iken" label={<Box mb={5}>意見</Box>} labelWidth={50} type="textarea" rowsMin={3} rowsMax={3} defaultValue="" fullWidth variant="grid" />
              </BodyCell>
            </TableRow>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="tokyo-a-form-submit-button" icon="register" onClick={handleSubmitForm}>
          登録
        </GeneralIconFloatingActionButton>
      </LayoutForm>
    </Box>
  );
};

export default TokyoA;
