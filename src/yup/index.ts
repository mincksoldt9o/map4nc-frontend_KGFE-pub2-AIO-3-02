import * as yup from 'yup';
import { LocaleObject } from 'yup';
import DateUtils from '@my/utils/DateUtils';
import Messages from '@my/messages';

// Message locale customization.
const locales: LocaleObject = {
  mixed: {
    required: (params) => Messages.MESSAGE_0004(params.label || ''),
    notType: () => `型が一致しません。`,
  },
  string: {
    length: (params) => `正確に ${params.length} 文字である必要があります。`,
    min: (params) => `${params.min} 文字以上にする必要があります。`,
    max: (params) => `${params.max} 文字以下にする必要があります。`,
    // matches: (params) => `次と一致する必要があります： "${params.regex}"`,
    email: () => `有効なメールアドレスである必要があります。`,
    // url: () => `有効なURLである必要があります。`,
    // trim: () => `トリミングされた文字列である必要があります。`,
    // lowercase: () => `小文字の文字列でなければなりません。`,
    // uppercase: () => `大文字の文字列でなければなりません。`,
  },
  number: {
    moreThan: (params) => `${params.more} より大きい値で入力してください。`,
    lessThan: (params) => `${params.less} 未満で入力してください。`,
    min: (params) => `${params.min} 以上で入力してください。`,
    max: (params) => `${params.max} 以下で入力してください。`,
    positive: () => `正の数で入力してください。`,
    negative: () => `負の数で入力してください。`,
    integer: () => `整数で入力してください。`,
  },
  date: {
    min: (params) => `${DateUtils.formatDate(new Date(params.min))} より過去日を入力できません。`,
    max: (params) => `${DateUtils.formatDate(new Date(params.max))} より未来日を入力できません。`,
  },
};

yup.setLocale(locales);

// Append custom validation. and look here -> <root>/types/yup.d.ts
// eslint-disable-next-line no-irregular-whitespace
const KanaRegexp = /^[ァ-ヶー　ｦ-ﾟ ]*$/;

function kana(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `${Messages.MESSAGE_0021()}`) {
  return this.matches(KanaRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'kana', kana);

// eslint-disable-next-line no-irregular-whitespace
const SpaceRegexp = /^(.+?)[ |　]+(.+)$/;

function shimei(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `${Messages.MESSAGE_0022()}`) {
  return this.matches(SpaceRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'shimei', shimei);

const AlphaNumRegexp = /^[0-9a-zA-Z]*$/;

function alphaNum(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `半角英数字で入力してください。`) {
  return this.matches(AlphaNumRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'alphaNum', alphaNum);

const NumRegexp = /^[0-9]*$/;

function number(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `数字で入力してください。`) {
  return this.matches(NumRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'number', number);

const AlphaRegexp = /^[a-zA-Z]*$/;

function alpha(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `半角英字で入力してください。`) {
  return this.matches(AlphaRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'alpha', alpha);

const AlphaNumSignRegexp = /^[0-9a-zA-Z!-/:-@[-`{-~]*$/;

function alphaNumSign(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `半角英数字記号で入力してください。`) {
  return this.matches(AlphaNumSignRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'alphaNumSign', alphaNumSign);

const TimeRegexp = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

function time(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `hh:mm形式で入力してください。`) {
  return this.matches(TimeRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'time', time);

// 口座名義
// 可能文字：全半角カタカナ、全半角英数字、「￥」「，（カンマ）」「．（ピリオド）」「（（開き括弧）」「）（閉じ括弧）」「ー（ハイフン）」「/（スラッシュ）」、促音（ッ）、拗音（ャ、ュ、ョ）
// 不可文字：「・」（中黒）、「ヲ」
// eslint-disable-next-line no-irregular-whitespace
const KouzaMiegiRegexp = /^[ァ-ヱン-ヶｧ-ﾟＡ-Ｚａ-ｚA-Za-z０-９0-9　 ー￥¥，-／,-/（）()‐―]*$/;

function kouzaMeigi(this: yup.StringSchema, message: yup.TestOptionsMessage = () => `カタカナ、英数字、一部記号で入力してください。`) {
  return this.matches(KouzaMiegiRegexp, {
    message,
    excludeEmptyString: true,
  });
}

yup.addMethod<yup.StringSchema>(yup.string, 'kouzaMeigi', kouzaMeigi);

/**
 * コンボボックスの LabelAndValue でやりとりする際の非必須の場合の yup 用 schema を作成する
 */
export const createYupLabelAndValueSchema = (label: string) => {
  return yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string().label(label),
    })
    .default(undefined);
};

/**
 * コンボボックスの LabelAndValue でやりとりする際の必須の場合の yup 用 schema を作成する
 */
export const createYupLabelAndValueRequiredSchema = (label: string) => {
  return yup.object().shape({
    label: yup.string(),
    value: yup.string().required().label(label),
  });
};

/**
 * CalendarInput / CalendarInputField などで Date を使う場合の yup 用 schema を作成する.
 * 中身は yup.date().nullable()
 */
export const yupDate = () => yup.date().nullable();

/**
 * NumberInput / NumberInputField などで number を使う場合の yup 用 schema を作成する.
 * 中身は yup.number().nullable()
 */
export const yupNumber = () => yup.number().nullable();

/**
 * Combobox / ComboboxField などで を使う場合の yup 用 schema を作成する.
 */
export const yupCombobox = () =>
  yup
    .object()
    .default(undefined)
    .transform((currentValue) => currentValue || undefined)
    .shape({
      label: yup.string(),
      value: yup.string(),
    });

export default yup;
