import React from 'react';
import { Control } from 'react-hook-form';
import useSingleCheckbox, { SingleCheckboxLabelAndValue } from '@my/hooks/useSingleCheckbox';
import Checkbox from '@my/components/atomic/Checkbox';

export type SingleCheckboxProps<T extends object = {}> = {
  value: string;
  control: Control<T>;
  setValue: any;
  disabled?: boolean;
};

export type SimpleSingleCheckboxProps = {
  checkboxes: SingleCheckboxLabelAndValue[];
  name: string;
} & SingleCheckboxProps;

// チェックボックスの右側に表示するラベルを取得する
export const getSingleCheckboxLabel = (labelAndValues: SingleCheckboxLabelAndValue[], value: string): string => {
  const matchLabelAndValues = labelAndValues.filter((d) => d.value === value);
  if (!matchLabelAndValues) {
    return '';
  }
  const { label } = matchLabelAndValues[0];
  return label || '';
};

// 活性非活性制御 非活性 -> 活性
export const changeAble = (checkedValues: Array<string>, setDisableState: (isDisabled: boolean) => void, compValue: string) => {
  setDisableState(true);
  if (checkedValues && checkedValues.length) {
    if (checkedValues[0] === compValue) {
      setDisableState(false);
    }
  }
};

// 活性非活性制御 活性 -> 非活性
export const changeDisable = (checkedValues: Array<string>, setDisableState: (isDisabled: boolean) => void, compValue: string) => {
  setDisableState(false);
  if (checkedValues && checkedValues.length) {
    if (checkedValues[0] === compValue) {
      setDisableState(true);
    }
  }
};

// 単一チェックボックスコンポーネント
// checkboxes に subGroupName を
//   設定した場合、サブグループ間の単一チェックボックスの動作をします。
//   設定しなかった場合、シンプルな単一チェックボックスの動作をします。
//   ※詳しくは useSingleCheckbox をご参照ください
export const SingleCheckbox: React.FC<SimpleSingleCheckboxProps> = (props: SimpleSingleCheckboxProps) => {
  const { value, control, setValue, disabled, checkboxes, name } = props;

  const label = getSingleCheckboxLabel(checkboxes, value);
  const keyNames = checkboxes.map((d) => d.value);

  // 単一チェックボックス化hooks
  const handleChange = useSingleCheckbox(name, keyNames, setValue, checkboxes);

  return <Checkbox id={`${name}-${value}`} name={`${name}.${value}`} label={label} value={value} onChange={handleChange} size="small" control={control} disabled={disabled} />;
};
