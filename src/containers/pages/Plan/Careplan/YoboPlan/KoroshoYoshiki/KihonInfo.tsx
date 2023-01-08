import React from 'react';
import { Box, Grid, GridDirection, GridJustification, GridWrap, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import OptionButton from '@my/components/atomic/OptionButton';
import CalendarInput from '@my/components/molecules/CalendarInput';
import TextInput from '@my/components/atomic/TextInput';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import Button from '@my/components/atomic/Button';
import BookIconButton from '@my/components/molecules/BunreiIconButton';
import Title from '@my/components/atomic/Title';
import NumberInput from '@my/components/atomic/NumberInput';
import Checkbox from '@my/components/atomic/Checkbox';

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

const KihonInfo: React.FC = () => {
  // 登録
  const handleSubmitForm = () => {
    // TODO
  };

  return (
    <Box m={1} mb={2}>
      <LayoutForm id="kihon-info-form" disableGridLayout>
        <CustomGrid direction="row" justify="flex-end">
          <Box mb={1}>
            <Button id="kaigo-hoken-torikomi">介護保険情報取り込み</Button>
          </Box>
        </CustomGrid>
        {/* テーブルエリア */}
        <TableContainer>
          <Table>
            <TableRow>
              <HeaderCell width={100}>認定年月日</HeaderCell>
              <BodyCell bt br width={200}>
                <Box width={160}>
                  <CalendarInput id="nintei-date" name="ninteiDate" defaultValue={new Date()} variant="table" />
                </Box>
              </BodyCell>
              <HeaderCell width={120}>認定有効期間</HeaderCell>
              <BodyCell bt br width={400}>
                <CustomGrid direction="row" justify="flex-start">
                  <Box width={160}>
                    <CalendarInput id="nintei-start-date" name="ninteiStartDate" defaultValue={new Date()} variant="table" />
                  </Box>
                  <Box mx={1} mt={0.5}>
                    ～
                  </Box>
                  <Box width={160}>
                    <CalendarInput id="nintei-end-date" name="ninteiEndDate" defaultValue={new Date()} variant="table" />
                  </Box>
                </CustomGrid>
              </BodyCell>
            </TableRow>
            <TableRow>
              <HeaderCell>作成状況</HeaderCell>
              <BodyCell bt br>
                <Box width={180}>
                  <OptionButton
                    id="introduction"
                    name="introduction"
                    options={[
                      { label: '初回', value: '1' },
                      { label: '紹介', value: '2' },
                      { label: '継続', value: '3' },
                    ]}
                    size="small"
                  />
                </Box>
              </BodyCell>
              <HeaderCell>認定状況</HeaderCell>
              <BodyCell bt br>
                <Box width={180}>
                  <OptionButton
                    id="nintei-status"
                    name="ninteiStatus"
                    options={[
                      { label: '申請中', value: '1' },
                      { label: '認定済み', value: '2' },
                    ]}
                    size="small"
                  />
                </Box>
              </BodyCell>
            </TableRow>
            <TableRow>
              <HeaderCell>認定情報</HeaderCell>
              <BodyCell bt br>
                <Box width={180}>
                  <OptionButton
                    id="youshien"
                    name="youshien"
                    options={[
                      { label: '要支援1', value: '1' },
                      { label: '要支援2', value: '2' },
                    ]}
                    size="small"
                  />
                </Box>
              </BodyCell>
              <HeaderCell>担当地域包括支援センター</HeaderCell>
              <BodyCell bt br>
                <TextInput
                  id="chiikihoukatsu-shien-center"
                  name="chiikihoukatsuShienCenter"
                  type="text"
                  defaultValue=""
                  fullWidth
                  variant="table"
                  maxLength={30}
                  autoCompleteOptions={['文京区音羽地域包括支援センター', '豊島区中央地域包括支援センター', '港区地域包括支援センター']}
                />
              </BodyCell>
            </TableRow>
            <TableRow>
              <HeaderCell>初回作成年月日</HeaderCell>
              <BodyCell bt br>
                <Box width={160}>
                  <CalendarInput id="shokai-sakusei-date" name="shokaiSakuseiDate" defaultValue={new Date()} variant="table" />
                </Box>
              </BodyCell>
            </TableRow>
          </Table>
        </TableContainer>
        <CustomGrid direction="row">
          <Title id="health-status-title">健康状態について</Title>
        </CustomGrid>
        <Box mx={1}>
          <CustomGrid direction="row" justify="space-between">
            <>主治医意見書、生活機能等を踏まえた留意点</>
            <BookIconButton id="health-status-bunrei-button" />
          </CustomGrid>
          <LayoutItem variant="1-item-full">
            <TextInput id="health-status" name="health" type="textarea" defaultValue="" fullWidth variant="table" />
          </LayoutItem>
        </Box>
        <CustomGrid direction="row">
          <Title id="shiengadekinaibai-title">本来行うべき支援ができない場合</Title>
        </CustomGrid>
        <Box mx={1}>
          <CustomGrid direction="row" justify="space-between">
            <>妥当な支援の実施に向けた方針</>
            <BookIconButton id="datounaShiennozisshinimuketaHoushinBunreiButton" />
          </CustomGrid>
          <LayoutItem variant="1-item-full">
            <TextInput id="datouna-shiennozisshinimuketa-houshin" name="health" type="textarea" defaultValue="" fullWidth variant="table" />
          </LayoutItem>
        </Box>
        <CustomGrid direction="row">
          <Title id="chiikihoukatsu-shien-center-iken-title">地域包括支援センター意見</Title>
        </CustomGrid>
        <Box mx={1}>
          <CustomGrid direction="row" justify="flex-end">
            <BookIconButton id="chiikihoukatsu-shien-center-iken-bunrei-button" />
          </CustomGrid>
          <LayoutItem variant="1-item-full">
            <TextInput id="chiikihoukatsu-shien-center-iken" name="chiikihoukatsuShienCenterIken" type="textarea" defaultValue="" fullWidth variant="table" />
          </LayoutItem>
        </Box>
        <CustomGrid direction="row" justify="space-between">
          <Title id="hitsuyoujigyo-program-title">必要事業プログラム</Title>
          <Box mt={1}>
            <Button id="kihon-checklist-torikomi">基本チェックリスト取り込み</Button>
          </Box>
        </CustomGrid>
        <Box mx={1}>
          <CustomGrid direction="row" justify="flex-start">
            <>基本チェックリストの(該当した項目数)／(質問項目数)が表示されます。</>
          </CustomGrid>
          <CustomGrid direction="row" justify="flex-start">
            <>地域支援事業の場合はチェックを入れてください。</>
          </CustomGrid>
          <CustomGrid direction="row" justify="flex-start">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell align="center" />
                    <HeaderCell colSpan={2} align="center" width={100}>
                      運動不足
                    </HeaderCell>
                    <HeaderCell colSpan={2} align="center" width={100}>
                      栄養改善
                    </HeaderCell>
                    <HeaderCell colSpan={2} align="center" width={100}>
                      口腔内ケア
                    </HeaderCell>
                    <HeaderCell colSpan={2} align="center" width={100}>
                      閉じこもり予防
                    </HeaderCell>
                    <HeaderCell colSpan={2} align="center" width={100}>
                      物忘れ予防
                    </HeaderCell>
                    <HeaderCell colSpan={2} align="center" width={100}>
                      うつ予防
                    </HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <HeaderCell align="center" width={120}>
                      予防給付または地域支援事業
                    </HeaderCell>
                    <BodyCell bl br>
                      <Checkbox id="kikikouzyou-check" name="kikikouzyouCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="kikikouzyou" name="kikikouzyou" variant="grid" />
                        </Box>
                        <>/5</>
                      </CustomGrid>
                    </BodyCell>
                    <BodyCell bl br>
                      <Checkbox id="eiyoukaizen-check" name="eiyoukaizenCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="eiyoukaizen" name="eiyoukaizen" variant="grid" />
                        </Box>
                        <>/2</>
                      </CustomGrid>
                    </BodyCell>
                    <BodyCell bl br>
                      <Checkbox id="koukoukinou-kouzyou-check" name="koukoukinouKouzyouCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="koukoukinou-kouzyou" name="koukoukinouKouzyou" variant="grid" />
                        </Box>
                        <>/3</>
                      </CustomGrid>
                    </BodyCell>
                    <BodyCell bl br>
                      <Checkbox id="tozikomori-yobou-check" name="tozikomoriYobouCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="tozikomori-yobou" name="tozikomoriYobouCheck" variant="grid" />
                        </Box>
                        <>/2</>
                      </CustomGrid>
                    </BodyCell>
                    <BodyCell bl br>
                      <Checkbox id="monowasure-boushi-check" name="monowasureBoushiCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="monowasure-boushi" name="monowasureBoushiCheck" variant="grid" />
                        </Box>
                        <>/3</>
                      </CustomGrid>
                    </BodyCell>
                    <BodyCell bl br>
                      <Checkbox id="utu-boushi-check" name="utuBoushiCheck" size="small" />
                    </BodyCell>
                    <BodyCell>
                      <CustomGrid direction="row" justify="flex-start">
                        <Box maxWidth={30} ml={1}>
                          <NumberInput id="utu-boushi" name="utuBoushiCheck" variant="grid" />
                        </Box>
                        <>/5</>
                      </CustomGrid>
                    </BodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CustomGrid>
        </Box>
        <CustomGrid direction="row">
          <Title id="sougoutekinahoushin-title">総合的な方針：生活不活発病の改善・予防のポイント</Title>
        </CustomGrid>
        <Box mx={1}>
          <CustomGrid direction="row" justify="flex-end">
            <BookIconButton id="sougoutekinahoushin-bunrei-button" />
          </CustomGrid>
          <LayoutItem variant="1-item-full">
            <TextInput id="sougoutekinahoushin" name="sougoutekinahoushin" type="textarea" defaultValue="" fullWidth variant="table" />
          </LayoutItem>
        </Box>
        <GeneralIconFloatingActionButton id="kihon-info-submit-button" icon="register" onClick={handleSubmitForm}>
          登録
        </GeneralIconFloatingActionButton>
      </LayoutForm>
    </Box>
  );
};

export default KihonInfo;
