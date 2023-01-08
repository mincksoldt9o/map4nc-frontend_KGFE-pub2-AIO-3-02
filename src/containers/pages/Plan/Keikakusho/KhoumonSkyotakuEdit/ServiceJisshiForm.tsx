import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TableContainer, Table, TableBody, TableRow, Grid, Box } from '@material-ui/core';
import { LayoutItem } from '@my/components/layouts/Form';
import Title from '@my/components/atomic/Title';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import Label from '@my/components/atomic/Label';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import { EditTabProps, CustomTbCell } from '@my/containers/pages/Plan/Keikakusho';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

export type ServiceJisshiType = {
  mokuhyouTasseido?: string;
  mokuhyouTasseidoHyoukaDate: Date | null;
  riyoushaManzokudo?: string;
  riyoushaManzokudoHyoukaDate: Date | null;
  keikakuMinaoshi?: string;
  keikakuMinaoshiHyoukaDate: Date | null;
};

const ServiceJisshiForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  const { id } = props;
  const [{ isBunreiOpen, formName, itemKbn, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; formName: string; itemKbn: string; maxLength?: number }>({
    isBunreiOpen: false,
    formName: '',
    itemKbn: '',
  });
  const { control, getValues, setValue } = useFormContext();
  const handleBunreiClick = (name: string, itemCode: string, maxLength?: number) => {
    if (name && itemCode) {
      setBunreiOption({ isBunreiOpen: true, formName: name, itemKbn: itemCode, maxLength });
    }
  };
  const handleBunreiClose = () => {
    setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
  };
  const handleBunreiSaveClick = (item: BunreiType) => {
    if (formName) {
      const bunrei = getValues(formName) || '';
      setValue(formName, bunrei + item.bunrei, false);
      setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
    }
  };
  return (
    <>
      <LayoutItem variant="1-item-full">
        <Title id={`${id}-title`}>サービス実施評価</Title>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <CustomTbCell>
                  <Box pb={1}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item xs={6}>
                        <Box pb={1}>
                          <Label id={`${id}-mokuhyou-lbl`} focused={false}>
                            （目標達成度）
                          </Label>
                        </Box>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Box pb={1}>
                          <GeneralIconButton
                            icon="book"
                            id={`${id}-mokuhyou-btn`}
                            onClick={() => {
                              handleBunreiClick('mokuhyouTasseido', '14', 130);
                            }}>
                            文例
                          </GeneralIconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <TextInputField id={`${id}-mokuhyou-input`} name="mokuhyouTasseido" type="textarea" labelWidth={0} control={control} maxLength={130} />
                      </Grid>
                    </Grid>
                  </Box>
                </CustomTbCell>
                <CustomTbCell style={{ verticalAlign: 'top' }} width={230}>
                  <Box pt={1} pb="11px">
                    <Label id={`${id}-mokuhyou-hyouka-lbl`} focused={false}>
                      （評価を行った日）
                    </Label>
                  </Box>
                  <CalendarInputField id={`${id}-mokuhyou-hyouka-dt`} name="mokuhyouTasseidoHyoukaDate" labelWidth={0} control={control} />
                </CustomTbCell>
              </TableRow>
              <TableRow>
                <CustomTbCell>
                  <Box pt={1} pb={1}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item xs={6}>
                        <Box pb={1}>
                          <Label id={`${id}-manzokudo-lbl`} focused={false}>
                            （利用者満足度）
                          </Label>
                        </Box>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Box pb={1}>
                          <GeneralIconButton
                            icon="book"
                            id={`${id}-manzokudo-btn`}
                            onClick={() => {
                              handleBunreiClick('riyoushaManzokudo', '15', 130);
                            }}>
                            文例
                          </GeneralIconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <TextInputField id={`${id}-manzokudo-input`} name="riyoushaManzokudo" type="textarea" labelWidth={0} control={control} maxLength={130} />
                      </Grid>
                    </Grid>
                  </Box>
                </CustomTbCell>
                <CustomTbCell style={{ verticalAlign: 'top' }}>
                  <Box pt={2} pb="11px">
                    <Label id={`${id}-manzokudo-hyouka-lbl`} focused={false}>
                      （評価を行った日）
                    </Label>
                  </Box>
                  <CalendarInputField id={`${id}-manzokudo-hyouka-dt`} name="riyoushaManzokudoHyoukaDate" labelWidth={0} control={control} />
                </CustomTbCell>
              </TableRow>
              <TableRow>
                <CustomTbCell>
                  <Box pt={1}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item xs={6}>
                        <Box pb={1}>
                          <Label id={`${id}-minaoshi-lbl`} focused={false}>
                            （計画見直しの必要性）
                          </Label>
                        </Box>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Box pb={1}>
                          <GeneralIconButton
                            icon="book"
                            id={`${id}-minaoshi-btn`}
                            onClick={() => {
                              handleBunreiClick('keikakuMinaoshi', '16', 130);
                            }}>
                            文例
                          </GeneralIconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <TextInputField id={`${id}-minaoshi-input`} name="keikakuMinaoshi" type="textarea" labelWidth={0} control={control} maxLength={130} />
                      </Grid>
                    </Grid>
                  </Box>
                </CustomTbCell>
                <CustomTbCell style={{ verticalAlign: 'top' }}>
                  <Box pt={2} pb="11px">
                    <Label id={`${id}-minaoshi-hyouka-lbl`} focused={false}>
                      （評価を行った日）
                    </Label>
                  </Box>
                  <CalendarInputField id={`${id}-minaoshi-hyouka-dt`} name="keikakuMinaoshiHyoukaDate" labelWidth={0} control={control} />
                </CustomTbCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </LayoutItem>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default ServiceJisshiForm;
