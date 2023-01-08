import React, { useEffect, useState, useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import { useFormContext } from 'react-hook-form';
import { LayoutItem } from '@my/components/layouts/Form';
import { EditableCellProps, EditableGridData, useDataGrid } from '@my/components/molecules/DataGrid';
import DateUtils from '@my/utils/DateUtils';
import { DataGrid, DataGridColumn } from '@my/components/molecules/DataGrid/DataGrid';
import DataDisplay from '@my/components/atomic/DataDisplay';
import TimeInput from '@my/components/atomic/TimeInput';
import TextInput from '@my/components/atomic/TextInput';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import { EditTabProps, HistoryDateType, StartEndTimeType } from '@my/containers/pages/Plan/Keikakusho';
import moment from 'moment';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

export type ShuukanYoteiColumnType = {
  shuukanYoteihyouSeq: number;
  startTime: string;
  endTime: string;
  startEndTime?: StartEndTimeType;
  goukeiTime?: number;
} & WeekType;

type WeekType = {
  [key in 'mondayServiceNaiyou' | 'tuesdayServiceNaiyou' | 'wednesdayServiceNaiyou' | 'thursdayServiceNaiyou' | 'fridayServiceNaiyou' | 'saturdayServiceNaiyou' | 'sundayServiceNaiyou']?: string;
};
/** DataGridのカラム情報 */
type ColumnDataType = ShuukanYoteiColumnType & EditableGridData;

type WeekInfoType = {
  weekName: keyof WeekType;
  weekShortName: string;
  weekDisplay: string;
};

const WeekInfos: WeekInfoType[] = [
  { weekName: 'mondayServiceNaiyou', weekShortName: 'monday', weekDisplay: '月曜日' },
  { weekName: 'tuesdayServiceNaiyou', weekShortName: 'tuesday', weekDisplay: '火曜日' },
  { weekName: 'wednesdayServiceNaiyou', weekShortName: 'wednesday', weekDisplay: '水曜日' },
  { weekName: 'thursdayServiceNaiyou', weekShortName: 'thursday', weekDisplay: '木曜日' },
  { weekName: 'fridayServiceNaiyou', weekShortName: 'friday', weekDisplay: '金曜日' },
  { weekName: 'saturdayServiceNaiyou', weekShortName: 'saturday', weekDisplay: '土曜日' },
  { weekName: 'sundayServiceNaiyou', weekShortName: 'sunday', weekDisplay: '日曜日' },
];

const ShuukanYoteiForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  // ※ 作成年月日などの yup で必須入力にしている項目が空白の状態だと grid 内の入力項目で入力するとフォーカスが別の場所に飛んでいく・・・ //
  const { id } = props;
  const [{ isBunreiOpen, formName, rowIndex, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; rowIndex?: number; formName?: keyof WeekType; maxLength?: number }>({
    isBunreiOpen: false,
  });
  const {
    getValues,
    register,
    unregister,
    reset,
    setValue,
    formState: { dirty: formDirty },
  } = useFormContext<HistoryDateType & { shuukanYoteihyouList: ShuukanYoteiColumnType[] }>();
  // const { dirty: formDirty } = formState;
  const defaultSelectedRows = undefined;
  // console.log(watch({ nest: true }));
  // console.log(getValues({ nest: true }));
  const defaultValues = getValues('shuukanYoteihyouList') || [];
  const defaultData = useMemo(() => defaultValues.map((value): ColumnDataType => ({ ...value, startEndTime: { startTime: value.startTime, endTime: value.endTime } })), [defaultValues]);
  const dataGridValues = useDataGrid<ColumnDataType>({
    defaultSelectedRows,
    sortable: false,
    rowSelect: undefined,
  });
  const handleBunreiClick = (name: keyof WeekType, index: number, maxLength?: number) => {
    if (name) {
      setBunreiOption({ isBunreiOpen: true, formName: name, rowIndex: index, maxLength });
    }
  };
  const handleBunreiClose = () => {
    setBunreiOption({ isBunreiOpen: false, formName: undefined, rowIndex: undefined });
  };
  const handleBunreiSaveClick = (item: BunreiType) => {
    if (formName && rowIndex !== undefined && rowIndex > -1) {
      const bunrei = defaultValues[rowIndex][formName] || '';
      if (!formDirty) {
        // 無理やり dirty event 発生させる用 //
        setValue('isDirty', true, false);
      }
      reset(
        { shuukanYoteihyouList: defaultValues.map((value, defIndex): ShuukanYoteiColumnType => (rowIndex === defIndex ? { ...value, [formName]: bunrei + item.bunrei } : value)) },
        { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false }
      );
      setBunreiOption({ isBunreiOpen: false, formName: undefined, rowIndex: undefined });
    }
  };
  /** DataGridのカラム情報 */
  const columns = useMemo(() => {
    const result: DataGridColumn<ColumnDataType>[] = [
      {
        Header: '実施時刻',
        accessor: 'startEndTime',
        alignCell: 'center',
        fixed: true,
        wrap: true,
        width: 95,
        Cell: ({ row: { index }, value: cellVal }: EditableCellProps<ColumnDataType, StartEndTimeType | undefined>) => {
          const [startTime, setStartTime] = useState<string>(cellVal?.startTime || '');
          const [endTime, setEndTime] = useState<string>(cellVal?.endTime || '');
          useEffectOnce(() => {
            setStartTime(cellVal?.startTime || '');
            setEndTime(cellVal?.endTime || '');
          });
          const handleStartTimeChange = (time: string) => {
            setStartTime(time);
          };
          const handleEndTimeChange = (time: string) => {
            setEndTime(time);
          };
          const handleChangeTimeBlur = () => {
            if (!((cellVal?.startTime || '') === startTime && (cellVal?.endTime || '') === endTime)) {
              const numStartTime = DateUtils.convertTime(startTime) || 0;
              const numEndTime = DateUtils.convertTime(endTime) || 0;
              const startEndTime = (numStartTime && numEndTime && (numEndTime <= numStartTime ? moment(numEndTime).add(1, 'd').valueOf() : numEndTime) - numStartTime) || 0;
              const goukeiTime = (startEndTime && startEndTime / (60 * 1000)) || undefined;
              if (!formDirty) {
                // 無理やり dirty event 発生させる用 //
                setValue('isDirty', true, false);
              }
              reset(
                {
                  shuukanYoteihyouList: defaultValues.map((value, defIndex): ShuukanYoteiColumnType => (index === defIndex ? { ...value, startTime, endTime, goukeiTime } : value)),
                },
                { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false }
              );
            }
          };
          return (
            <>
              <TimeInput
                id={`${id}-startTime-${index}`}
                name={`shuukanYoteihyouList[${index}].startTime`}
                variant="grid"
                onChange={handleStartTimeChange}
                onBlur={handleChangeTimeBlur}
                value={startTime}
              />
              〜
              <TimeInput id={`${id}-endTime-${index}`} name={`shuukanYoteihyouList[${index}].endTime`} variant="grid" onChange={handleEndTimeChange} onBlur={handleChangeTimeBlur} value={endTime} />
            </>
          );
        },
      },
      {
        Header: '時間',
        accessor: 'goukeiTime',
        alignCell: 'right',
        width: 65,
        fixed: true,
        Cell: ({ row: { index }, value: cellVal }: EditableCellProps<ColumnDataType, number>) => {
          return <DataDisplay id={`${id}-goukeiTime-${index}`} suffix="分" value={cellVal} />;
        },
      },
      ...WeekInfos.map(
        (week): DataGridColumn<ColumnDataType> => ({
          Header: week.weekDisplay,
          accessor: week.weekName,
          alignCell: 'left',
          width: 1,
          wrap: true,
          Cell: ({ row: { index }, value: cellVal }: EditableCellProps<ColumnDataType, string>) => {
            const [weekVal, setWeekVal] = useState(cellVal);
            useEffectOnce(() => {
              setWeekVal(cellVal);
            });
            const handleWeekChange = (value: string) => {
              setWeekVal(value);
            };
            const handleWeekBlur = (text: string) => {
              if (cellVal !== text) {
                if (!formDirty) {
                  // 無理やり dirty event 発生させる用 //
                  setValue('isDirty', true, false);
                }
                reset(
                  { shuukanYoteihyouList: defaultValues.map((value, defIndex): ShuukanYoteiColumnType => (index === defIndex ? { ...value, [week.weekName]: text } : value)) },
                  { errors: true, dirtyFields: true, dirty: true, isSubmitted: false, touched: false, isValid: false, submitCount: false }
                );
              }
            };
            return (
              <>
                <GeneralIconButton
                  icon="book"
                  id={`${id}-${week.weekShortName}-${index}-btn`}
                  onClick={() => {
                    handleBunreiClick(week.weekName, index, 22);
                  }}>
                  文例
                </GeneralIconButton>
                <TextInput
                  id={`${id}-${week.weekShortName}-${index}`}
                  type="textarea"
                  variant="grid"
                  name={`shuukanYoteihyouList[${index}].${week.weekName}`}
                  rowsMin={3}
                  rowsMax={3}
                  fullWidth
                  maxLength={22}
                  value={weekVal}
                  onChange={handleWeekChange}
                  onBlur={handleWeekBlur}
                />
              </>
            );
          },
        })
      ),
    ];
    return result;
  }, [id, reset, setValue, formDirty, defaultValues]);

  useEffect(() => {
    register({ name: 'isDirty' });
    return () => {
      unregister('isDirty');
    };
  }, [register, unregister]);

  return (
    <>
      <LayoutItem variant="1-item-full">
        <DataGrid id={`${id}-list`} heightOffset={430} columns={columns} data={defaultData} {...dataGridValues} />
      </LayoutItem>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn="13" maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default ShuukanYoteiForm;
