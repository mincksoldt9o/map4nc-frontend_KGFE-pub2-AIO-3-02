import React, { useState } from 'react';
import styled from 'styled-components';
import Dialog, { DialogContent } from '@my/components/atomic/Dialog';
import { Box, Grid } from '@material-ui/core';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import PrintPreviewButton from '@my/components/atomic/PrintPreviewButton';
import PrintPdfButton from '@my/components/atomic/PrintPdfButton';
import PrintExcelButton from '@my/components/atomic/PrintExcelButton';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import { LayoutItem } from '@my/components/layouts/Form';

const StyledPrintActions = styled.div`
  border-bottom: 1px solid #b9b9b9;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

type PrintProps = {
  id: string;
  setIsOpenModal: any;
};

const ShienkeikaPrint: React.FC<PrintProps> = (props: PrintProps) => {
  const { id, setIsOpenModal } = props;

  // 作成年月日
  const [sakluseiDateValue, setSakuseiDateValue] = useState<Date | null>(new Date(1672475400000));
  const sakuseiDateHandleChange = (value: Date | null) => {
    setSakuseiDateValue(value);
  };

  // 計画作成者プルダウン
  const keikakuSakuseishaOptions: LabelAndValue[] = [
    { value: '1', label: '日本　一郎' },
    { value: '2', label: '日本　二郎' },
  ];
  const [keikakuSakuseishaValue, setKeikakuSakuseishaValue] = useState<LabelAndValue | undefined>({ value: '1', label: '日本　一郎' });
  const keikakuSakuseishaHandleChange = (value?: LabelAndValue | Array<LabelAndValue>) => {
    if (value !== undefined && !Array.isArray(value)) {
      setKeikakuSakuseishaValue(value);
    }
  };

  // 戻るボタン押下時
  const handleClickReturn = () => {
    setIsOpenModal(false);
    console.log('戻るボタン押下');
  };

  // プレビューボタン押下時
  const handleClickPDFPreview = () => {
    console.log('プレビューボタン押下');
  };

  // PDF押下時
  const handleClickPDFDownload = () => {
    console.log('PDFボタン押下');
  };

  // EXCEL押下時
  const handleClickEXCELDownload = () => {
    console.log('EXCELボタン押下');
  };

  return (
    <Dialog open variant="edit-page" title="帳票印刷" onClickReturn={handleClickReturn} selfContentAndActions>
      <DialogContent>
        <Box width={600} mb={2}>
          <StyledPrintActions>
            <Grid container direction="row" justify="flex-end" spacing={1}>
              <Grid item>
                <PrintPreviewButton id={`${id}_print-preview-button`} onClick={handleClickPDFPreview} />
              </Grid>
              <Grid item>
                <PrintPdfButton id={`${id}_print-pdf-button`} onClick={handleClickPDFDownload} />
              </Grid>
              <Grid item>
                <PrintExcelButton id={`${id}_print-excel-button`} onClick={handleClickEXCELDownload} />
              </Grid>
            </Grid>
          </StyledPrintActions>
          <LayoutItem variant="right-margin">
            <CalendarInputField id={`${id}-sakusei-date`} name="sakuseiDate" label="作成年月日" labelWidth={100} value={sakluseiDateValue} onChange={sakuseiDateHandleChange} />
          </LayoutItem>
          <Box mb={1} />
          <LayoutItem variant="right-margin">
            <ComboBoxField
              id={`${id}-keikaku-sakuseisha`}
              name="keikakuSakuseisha"
              label="計画作成者"
              labelWidth={100}
              options={keikakuSakuseishaOptions}
              value={keikakuSakuseishaValue}
              onChange={keikakuSakuseishaHandleChange}
              clearable={false}
            />
          </LayoutItem>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShienkeikaPrint;
