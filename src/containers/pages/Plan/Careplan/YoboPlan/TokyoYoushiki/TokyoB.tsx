import React, { useState } from 'react';
import { Box, Grid, GridDirection, GridJustification, GridWrap, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import styled from 'styled-components';
import TextInput from '@my/components/atomic/TextInput';
import Button from '@my/components/atomic/Button';
import Checkbox from '@my/components/atomic/Checkbox';
import NumberInput from '@my/components/atomic/NumberInput';
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

const HeaderCell = styled(TableCell)<{ minWidth?: number }>`
  background-color: #a49696;
  min-width: ${({ minWidth }) => `${minWidth}px` || undefined};
  color: white;
  padding: 7px 5px 7px 5px;
  border-right: 1px solid #e8dac3;
  border-left: 1px solid #e8dac3;
  border-bottom: 1px solid #fff;
`;

const BodyCell = styled(TableCell)<{ bt?: boolean; br?: boolean; bl?: boolean; minWidth?: number; thColor?: boolean }>`
  background-color: ${({ thColor }) => (thColor ? `#f0eeee` : undefined)};
  min-width: ${({ minWidth }) => `${minWidth}px` || undefined};
  border-top: ${({ bt }) => (bt ? `1px solid #e8dac3` : undefined)};
  border-right: ${({ br }) => (br ? `1px solid #e8dac3` : undefined)};
  border-left: ${({ bl }) => (bl ? `1px solid #e8dac3` : undefined)};
  padding: 7px 5px 7px 5px;
`;

type RowContentsProps = {
  id: string;
  name: string;
  title: string;
  isFirstRow?: boolean;
};
const RowContents = (props: RowContentsProps) => {
  const { id, name, title, isFirstRow } = props;
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

  return (
    <>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
      <TableRow>
        {/* 現在の状況(タイトル) */}
        <BodyCell bl thColor>
          {title}
        </BodyCell>
        {/* 本人・家族の意欲・意向(テキストエリア)	 */}
        <BodyCell bl rowSpan={2}>
          {/* 現在の状況のテキストエリアと下線をあわせるための調整用div */}
          <div style={{ marginTop: 3.5 }} />
          <BookIconButton id={`${id}-iyoku-ikou-bunrei-button`} />
          <TextInput id={`${id}-iyoku-ikou`} name={`${name}IyokuIkou`} type="textarea" rowsMin={8} defaultValue="" fullWidth variant="grid" />
        </BodyCell>
        {/* 背景・原因(チェックボックス) */}
        <BodyCell bl>
          <CustomGrid direction="row" justify="space-evenly">
            <Box ml={1}>
              <Checkbox id={`${id}-haikei-genin-ari-check`} name={`${name}HaikeiGeninAriCheck`} label="有" size="small" />
            </Box>
            <Checkbox id={`${id}-haikei-genin-nashi-check`} name={`${name}HaikeiGeninNashiCheck`} label="無" size="small" />
          </CustomGrid>
        </BodyCell>
        {!!isFirstRow && (
          <>
            {/* 総合的課題 */}
            <BodyCell bl rowSpan={10}>
              <BookIconButton
                id={`${id}-sougoutekikadai-bunrei-button`}
                onClick={() => {
                  handleBunreiClick(`${name}Sougoutekikadai`, `${name}Sougoutekikadai`);
                }}
              />
              <TextInput id="sougoutekikadai" name="sougoutekikadai" type="textarea" rowsMin={51} defaultValue="" fullWidth variant="grid" />
            </BodyCell>
            {/* 課題に対する目標と具体策の提案 */}
            <BodyCell bl rowSpan={10}>
              <BookIconButton
                id={`${id}-gutaisaku-bunrei-button`}
                onClick={() => {
                  handleBunreiClick(`${name}Gutaisaku`, `${name}Gutaisaku`);
                }}
              />
              <TextInput id="gutaisaku" name="gutaisaku" type="textarea" rowsMin={51} defaultValue="" fullWidth variant="grid" />
            </BodyCell>
            {/* 具体策についての本人・家族の意向 */}
            <BodyCell bl br rowSpan={10}>
              <BookIconButton
                id={`${id}-ikou-bunrei-button`}
                onClick={() => {
                  handleBunreiClick(`${name}Ikou`, `${name}Ikou`);
                }}
              />
              <TextInput id="ikou" name="ikou" type="textarea" rowsMin={51} defaultValue="" fullWidth variant="grid" />
            </BodyCell>
          </>
        )}
      </TableRow>
      <TableRow>
        {/* 現在の状況(テキストエリア)	 */}
        <BodyCell bl>
          <BookIconButton
            id={`${id}-genzainozyokyo-bunrei-button`}
            onClick={() => {
              handleBunreiClick(`${name}Genzainozyokyo`, `${name}Genzainozyokyo`);
            }}
          />
          <TextInput id={`${id}-genzainozyokyo`} name={`${name}Genzainozyokyo`} type="textarea" rowsMin={6} defaultValue="" fullWidth variant="grid" />
        </BodyCell>
        {/* 背景・原因(テキストエリア)	 */}
        <BodyCell bl>
          <BookIconButton id={`${id}-haikei-genin-bunrei-button`} />
          <TextInput id={`${id}-haikei-genin`} name={`${id}HaikeiGenin`} type="textarea" rowsMin={6} defaultValue="" fullWidth variant="grid" />
        </BodyCell>
      </TableRow>
    </>
  );
};

const TokyoB: React.FC = () => {
  // 登録
  const handleSubmitForm = () => {
    // TODO
  };

  return (
    <Box m={1} mb={2}>
      <LayoutForm id="tokyo-b-form" disableGridLayout>
        <CustomGrid direction="row" justify="flex-end">
          <Box minWidth={200}>
            <Button id="check-list-button" variant="outlined">
              基本チェックリスト取り込み
            </Button>
          </Box>
        </CustomGrid>
        <Box mb={1}>
          <CustomGrid direction="row" justify="flex-start">
            <Box flex maxWidth={600}>
              【健康状態について：主治医意見書、生活機能評価等を踏まえた留意点】
              <TextInput id="ryuiten" name="ryuiten" type="textarea" rowsMin={6} imeMode="auto" defaultValue="" fullWidth variant="grid" />
            </Box>
            <Box mx={1} />
            <Box>
              【必要な事業のプログラム】
              <TableContainer>
                <Table className="tokyo-b-table">
                  <TableHead>
                    <TableRow>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        運動器の
                        <br />
                        機能向上
                      </HeaderCell>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        栄養改善
                      </HeaderCell>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        口腔機能の
                        <br />
                        向上
                      </HeaderCell>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        閉じこもり
                        <br />
                        予防
                      </HeaderCell>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        物忘れ防止
                      </HeaderCell>
                      <HeaderCell colSpan={2} align="center" width={100}>
                        うつ防止
                      </HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
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
              ※参加するのが望ましいプログラムにチェックを入れてください
            </Box>
          </CustomGrid>
        </Box>
        {/* テーブルエリア */}
        <TableContainer>
          <Table className="tokyo-b-table">
            <TableHead>
              <TableRow>
                <HeaderCell align="center">現在の状況</HeaderCell>
                <HeaderCell align="center">本人・家族の意欲・意向</HeaderCell>
                <HeaderCell align="center">背景・原因</HeaderCell>
                <HeaderCell align="center">総合的課題</HeaderCell>
                <HeaderCell align="center">課題に対する目標と具体策の提案</HeaderCell>
                <HeaderCell align="center">具体策についての本人・家族の意向</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <RowContents id="undo-idou" name="undoIdo" title="運動・移動について" isFirstRow />
              <RowContents id="nitizyouseikatsu" name="nitizyouseikatsu" title="日常生活（家庭生活）ついて" />
              <RowContents id="communication" name="communication" title="社会参加、対人関係、コミュニケーションについて" />
              <RowContents id="health" name="health" title="健康管理について" />
              <RowContents id="sonota" name="sonota" title="その他の事項について" />
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="tokyo-b-form-submit-button" icon="register" onClick={handleSubmitForm}>
          登録
        </GeneralIconFloatingActionButton>
      </LayoutForm>
    </Box>
  );
};

export default TokyoB;
