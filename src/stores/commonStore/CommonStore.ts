import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// OpenAPI Generator によって自動生成された型を使う
import { LoginUserInfo } from 'maps4nc-frontend-web-api/dist/lib/model/login-user-info';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';

export type CommonState = {
  initializing: boolean;
  initialized: boolean;
  loginTimeout: boolean;
  loginUser: LoginUserInfo;
  prefectureList: Array<LabelAndValue>;
  /** ヘッダのユーザ情報ポップアップから、マスタ管理のスタッフ編集を開くかどうか */
  showLoginUserInfoMasterUserEditDialog: boolean;
  /* サイドメニュー最上部のコンボボックスで選択されているシステムモード */
  systemMode: LabelAndValue;
};

const initialUserData: LoginUserInfo = {
  customerSeq: -1,
  customerName: '',
  userSeq: -1,
  userDisplayName: undefined,
  userImageFile: undefined,
  userKanaName: undefined,
  loginId: '',
  staffSeq: undefined,
  staffCode: undefined,
  officeSeq: -1,
  officeName: '',
  version: '',
  kengen: {},
};

const initialPrefectureList: Array<LabelAndValue> = [
  { value: '01', label: '北海道' },
  { value: '02', label: '青森県' },
  { value: '03', label: '岩手県' },
  { value: '04', label: '宮城県' },
  { value: '05', label: '秋田県' },
  { value: '06', label: '山形県' },
  { value: '07', label: '福島県' },
  { value: '08', label: '茨城県' },
  { value: '09', label: '栃木県' },
  { value: '10', label: '群馬県' },
  { value: '11', label: '埼玉県' },
  { value: '12', label: '千葉県' },
  { value: '13', label: '東京都' },
  { value: '14', label: '神奈川県' },
  { value: '15', label: '新潟県' },
  { value: '16', label: '富山県' },
  { value: '17', label: '石川県' },
  { value: '18', label: '福井県' },
  { value: '19', label: '山梨県' },
  { value: '20', label: '長野県' },
  { value: '21', label: '岐阜県' },
  { value: '22', label: '静岡県' },
  { value: '23', label: '愛知県' },
  { value: '24', label: '三重県' },
  { value: '25', label: '滋賀県' },
  { value: '26', label: '京都府' },
  { value: '27', label: '大阪府' },
  { value: '28', label: '兵庫県' },
  { value: '29', label: '奈良県' },
  { value: '30', label: '和歌山県' },
  { value: '31', label: '鳥取県' },
  { value: '32', label: '島根県' },
  { value: '33', label: '岡山県' },
  { value: '34', label: '広島県' },
  { value: '35', label: '山口県' },
  { value: '36', label: '徳島県' },
  { value: '37', label: '香川県' },
  { value: '38', label: '愛媛県' },
  { value: '39', label: '高知県' },
  { value: '40', label: '福岡県' },
  { value: '41', label: '佐賀県' },
  { value: '42', label: '長崎県' },
  { value: '43', label: '熊本県' },
  { value: '44', label: '大分県' },
  { value: '45', label: '宮崎県' },
  { value: '46', label: '鹿児島県' },
  { value: '47', label: '沖縄県' },
];

const initialState: CommonState = {
  initializing: false,
  initialized: false,
  loginTimeout: false,
  loginUser: initialUserData,
  prefectureList: initialPrefectureList,
  showLoginUserInfoMasterUserEditDialog: false,
  systemMode: { label: '居宅介護支援', value: 'KYOTAKU_KAIGO_SHIEN' },
};

const commonStore = createSlice({
  name: 'common',
  initialState: initialState as CommonState,
  reducers: {
    initializing: (draftState: CommonState): void => {
      draftState.initializing = true;
    },
    loggedIn: (draftState: CommonState, action: PayloadAction<{ prefectureList: Array<LabelAndValue>; loginUser: LoginUserInfo }>): void => {
      draftState.initialized = true;
      draftState.loginUser = action.payload.loginUser;
      draftState.prefectureList = action.payload.prefectureList;
    },
    notLoggedIn: (draftState: CommonState): void => {
      draftState.initialized = true;
      draftState.loginTimeout = true;
    },
    showLoginUserInfoMasterUserEditDialog: (draftState: CommonState, action: PayloadAction<boolean>) => {
      draftState.showLoginUserInfoMasterUserEditDialog = action.payload;
    },
    loginTimeout: (draftState: CommonState): void => {
      draftState.loginTimeout = true;
    },
    setSystemMode: (draftState: CommonState, action: PayloadAction<LabelAndValue>) => {
      draftState.systemMode = action.payload;
    },
  },
});

export default commonStore;
