import React, { useEffect, useState, useRef } from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { ScreenID } from '@my/screenIDs';
import yup, { yupDate, yupNumber } from '@my/yup';
import FileUtils from '@my/utils/FileUtils';
import { RootState, useTypedSelector } from '@my/stores';
import { useClearKeikakusho, useDeleteKeikakusho, useSelectedKeikakusho, useChangeEditModeKeikakusho } from '@my/action-hooks/plan/keikakusho';
import { Grid, Badge, Box } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import { useCustomConfirm } from '@my/containers/pages/Common/CustomConfirm';
import messages from '@my/messages';
import PrintPreviewButton from '@my/components/atomic/PrintPreviewButton';
import PrintPdfButton from '@my/components/atomic/PrintPdfButton';
import PrintExcelButton from '@my/components/atomic/PrintExcelButton';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import AlertMessage from '@my/components/atomic/AlertMessage';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import styled from 'styled-components';
import { HistoryDateType, HistoryCalendarChangeType, PrintType } from '@my/containers/pages/Plan/Keikakusho';
import SearchHistoryDialog, { SearchHistoryType } from '@my/containers/pages/Common/SearchHistoryDialog';
import KhoumonSkyotakuEdit from '@my/containers/pages/Plan/Keikakusho/KhoumonSkyotakuEdit';

const PrintButtons = styled.div`
  display: inline-flex;
`;
const Separator = styled.div`
  flex-basis: 10px;
  width: 10px;
`;

type KeikakushoComFormProps = {
  id: string;
  screenId: ScreenID;
  isReadonly: boolean;
  defaultValues: HistoryInfo;
};

type HistoryInfo = {
  riyoushaSeq: number;
  officeSeq: number;
  seidoType?: string;
  sakuseiSeq: number;
  sakuseiDate: number;
  memo?: string;
};

const MESSAGE_0059 = messages.MESSAGE_0059('期間自', '期間至');
// const FormSchema = yup.lazy<{ sakuseiDate: Date | null; seidoType?: string }>(({ seidoType, ...values }) => {
const FormSchema = yup.lazy<{ sakuseiDate: Date | null; seidoType?: string }>(({ seidoType }) => {
  // console.log(values);
  if (!(seidoType !== '1' && seidoType !== '2')) {
    return yup.object().shape({
      sakuseiDate: yupDate().required().label('作成年月日'),
      ...(seidoType === '2' ? { futangakuJougen: yupNumber().min(0).max(99999).label('負担上限額') } : {}),
      enjoMokuhyouList: yup.array().of(
        yup.object().shape({
          startEndDate: yup.object().test('test-start-end-check', MESSAGE_0059, function fn() {
            const { mokuhyouEndDate, mokuhyouStartDate } = this.parent as { mokuhyouEndDate?: Date; mokuhyouStartDate?: Date };
            // console.log(mokuhyouEndDate, mokuhyouStartDate);
            return !(mokuhyouEndDate && mokuhyouStartDate && mokuhyouStartDate.getTime() > mokuhyouEndDate.getTime());
          }),
        })
      ),
    });
  }
  return yup.object().shape({
    sakuseiDate: yupDate().required().label('作成年月日'),
  });
});

const KeikakushoComForm: React.FC<KeikakushoComFormProps> = (props: KeikakushoComFormProps) => {
  const { id, screenId, isReadonly, defaultValues } = props;
  const { riyoushaSeq, seidoType = '', sakuseiSeq, sakuseiDate, memo } = defaultValues;
  const customConfirm = useCustomConfirm();
  const clearKeikakusho = useClearKeikakusho();
  const selectedKeikakusho = useSelectedKeikakusho(screenId.id);
  const deleteKeikakusho = useDeleteKeikakusho(screenId.id);
  const changeEditModeKeikakusho = useChangeEditModeKeikakusho();
  const { deletedStatus, listCount } = useTypedSelector((state: RootState) => state.chouhyouSakuseiDate);
  const { isDirty } = useTypedSelector((state: RootState) => state.keikakusho);
  const isSelectedHistory = sakuseiSeq > -1;
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const printRef = useRef<PrintType>(null);
  const historyRef = useRef<HistoryCalendarChangeType>(null);
  const formMethods = useForm<HistoryDateType>({
    mode: 'onChange',
    // reValidateMode: 'onChange',
    defaultValues: {
      sakuseiDate: new Date(sakuseiDate),
      seidoType,
      memo,
    },
    submitFocusError: false,
    validationSchema: FormSchema,
    // shouldUnregister: false,
    // v5 では、shouldUnregister オプションがないため unmount 時に画面にもっていないフィールドの value は、削除される・・・現状、自力で保持するように行っている //
  });
  const {
    errors,
    control,
    formState: { dirty: formDirty },
    register,
  } = formMethods;
  // const { dirty: formDirty } = formState;
  const handleSearchClick = async () => {
    if (!(!formDirty && !isDirty)) {
      if (!(await customConfirm({ title: '入力内容が登録されていません', message: messages.MESSAGE_0001() }))) {
        return;
      }
    }
    setIsSearchOpen(true);
  };
  const handleSearchClose = () => {
    if (deletedStatus) {
      clearKeikakusho();
    } else {
      setIsSearchOpen(false);
    }
  };
  const handleDeleteClick = (info: SearchHistoryType) => {
    if (defaultValues.riyoushaSeq) {
      return deleteKeikakusho(riyoushaSeq, seidoType, info.sakuseiSeq);
    }
    return Promise.resolve(false);
  };
  const handleSaveClick = (info: SearchHistoryType) => {
    selectedKeikakusho(info, true);
  };
  const handleCreateClick = async () => {
    if (!(!formDirty && !isDirty)) {
      if (!(await customConfirm({ title: '入力内容が登録されていません', message: messages.MESSAGE_0001() }))) {
        return;
      }
    }
    let isCopy = false;
    if (isSelectedHistory) {
      const isOk = await customConfirm({
        confirmType: 'check',
        message: '新規作成を行います。',
        label: '表示されている計画書の内容を引き継ぎする。',
        defaultValue: true,
      });
      if (isOk === undefined) {
        return;
      }
      isCopy = isOk;
    } else {
      const isOk = await customConfirm({
        message: '新規作成を行います。',
      });
      if (!isOk) {
        return;
      }
      isCopy = false;
    }
    changeEditModeKeikakusho(isCopy);
  };
  // プレビューボタン押下時 //
  const handleClickPDFPreview = async () => {
    // console.log(!errors.sakuseiDate, ref.current);
    if (!errors.sakuseiDate && printRef.current) {
      const res = await printRef.current.handleClickPDFPreview();
      FileUtils.openPdfNewWindow(res);
    }
  };
  // PDF押下時 //
  const handleClickPDFDownload = async () => {
    if (!errors.sakuseiDate && printRef.current) {
      const res = await printRef.current.handleClickPDFDownload();
      FileUtils.downloadPdf(res);
    }
  };
  // EXCEL押下時 //
  const handleClickEXCELDownload = async () => {
    if (!errors.sakuseiDate && printRef.current) {
      const res = await printRef.current.handleClickEXCELDownload();
      FileUtils.downloadExcel(res);
    }
  };

  useEffect(() => {
    // 画面の Field に seidoType をもたせてないので register で値が消えないようにする //
    register({ name: 'seidoType' });
  }, [register]);

  return (
    <>
      <FormContext {...formMethods}>
        <LayoutForm disableGridLayout>
          {/* height を固定にしないと画面が揺れる */}
          <Grid container direction="row" justify="flex-start" alignItems="center" style={{ height: '114px' }}>
            <Grid item>
              <CalendarInputField
                id={`${id}-sakusei-date`}
                name="sakuseiDate"
                label="作成年月日"
                onChange={historyRef.current?.handleCalendarChange}
                control={control}
                error={!!errors.sakuseiDate}
                errorMessage={errors.sakuseiDate?.message}
                required
                disabled={!isSelectedHistory}
              />
            </Grid>
            <Grid item>
              <Badge badgeContent={listCount} color="secondary">
                <GeneralIconButton icon="search" id="search-button" onClick={handleSearchClick}>
                  履歴検索
                </GeneralIconButton>
              </Badge>
            </Grid>
            <Grid item xs style={{ textAlign: 'right' }}>
              <GeneralIconButton icon="add" id={`${id}-create-button`} onClick={handleCreateClick} disabled={isReadonly}>
                新規計画書を作成する
              </GeneralIconButton>
            </Grid>
            <Grid container item direction="row" alignItems="center">
              <Grid item xs>
                <Box maxWidth={510}>
                  <TextInputField
                    id={`${id}-memo-txt`}
                    name="memo"
                    type="text"
                    imeMode="auto"
                    label="メモ"
                    control={control}
                    error={!!errors.memo}
                    errorMessage={errors.memo?.message}
                    disabled={!isSelectedHistory}
                    maxLength={20}
                  />
                </Box>
              </Grid>
              <Grid item xs style={{ textAlign: 'right' }}>
                <PrintButtons>
                  <PrintPreviewButton id="print-preview-button" onClick={handleClickPDFPreview} disabled={!isSelectedHistory} />
                  <Separator />
                  <PrintPdfButton id="print-pdf-button" onClick={handleClickPDFDownload} disabled={!isSelectedHistory} />
                  <Separator />
                  <PrintExcelButton id="print-excel-button" onClick={handleClickEXCELDownload} disabled={!isSelectedHistory} />
                </PrintButtons>
              </Grid>
            </Grid>
          </Grid>
          {isSelectedHistory ? (
            <KhoumonSkyotakuEdit screenId={screenId} headerTabId={seidoType} historyRef={historyRef} printRef={printRef} isReadonly={isReadonly} />
          ) : (
            <AlertMessage type="warn" message="履歴が選択されていません。新規計画書を作成してください。" />
          )}
        </LayoutForm>
      </FormContext>
      {isSearchOpen && (
        <SearchHistoryDialog
          riyoushaSeq={defaultValues.riyoushaSeq}
          seidoType={defaultValues.seidoType}
          defaultHistorySeq={defaultValues.sakuseiSeq}
          onReturnClick={handleSearchClose}
          onDeleteClick={handleDeleteClick}
          onSaveClick={handleSaveClick}
          isReadonly={isReadonly}
        />
      )}
    </>
  );
};

export default KeikakushoComForm;
