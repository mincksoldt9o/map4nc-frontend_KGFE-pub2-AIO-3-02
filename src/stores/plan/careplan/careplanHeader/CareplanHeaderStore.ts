import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabelAndValue, PlanKeikakushoKanri } from 'maps4nc-frontend-web-api/dist/lib/model';

export type CareplanHeaderLatestKeikakushoKanriType = {
  latestInfo: PlanKeikakushoKanri | undefined;
  latestCount: number;
};

export type CareplanHeaderSelectedKeikakushoKanriType = {
  info: PlanKeikakushoKanri | undefined;
  updated: number;
};

export type CareplanHeaderState = {
  latestPlanKeikakushoKanri?: CareplanHeaderLatestKeikakushoKanriType;
  staffList: Array<LabelAndValue>;
  loadingLatestPlanKeikakushoKanriStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  loadingStaffListStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  openedAddConfirmDialog: boolean;
  /** selectedPlanKeikakushoKanri: 選択中の履歴 */
  selectedPlanKeikakushoKanri?: CareplanHeaderSelectedKeikakushoKanriType;
  /** hikitsugiCheck: 引継ぎチェック状態 */
  hikitsugiCheck: boolean;
  /** mode: モード (add:追加, copy:引継ぎ(追加), edit:編集, none:データなし, undefined) */
  mode: 'add' | 'copy' | 'edit' | 'none' | undefined;
  /** 作成日 */
  sakuseiDate?: number;
};

const initialState = (): CareplanHeaderState => ({
  latestPlanKeikakushoKanri: undefined,
  staffList: [],
  loadingLatestPlanKeikakushoKanriStatus: 'NotLoad',
  loadingStaffListStatus: 'NotLoad',
  openedAddConfirmDialog: false,
  selectedPlanKeikakushoKanri: undefined,
  hikitsugiCheck: false,
  mode: undefined,
  sakuseiDate: undefined,
});

const careplanHeaderStore = createSlice({
  name: 'CareplanHeaderStore',
  initialState: initialState(),
  reducers: {
    loadingLatestPlanKeikakushoKanri: (draftState: CareplanHeaderState) => {
      draftState.loadingLatestPlanKeikakushoKanriStatus = 'Loading';
    },
    loadingStaffList: (draftState: CareplanHeaderState) => {
      draftState.loadingStaffListStatus = 'Loading';
    },
    fetchedLatestPlanKeikakushoKanri: (draftState: CareplanHeaderState, action: PayloadAction<CareplanHeaderLatestKeikakushoKanriType>) => {
      draftState.loadingLatestPlanKeikakushoKanriStatus = 'Loaded';
      draftState.latestPlanKeikakushoKanri = action.payload;
      // 選択中の履歴としても保存
      draftState.selectedPlanKeikakushoKanri = {
        info: action.payload.latestInfo,
        updated: new Date().getTime(),
      };
    },
    fetchedStaffList: (draftState: CareplanHeaderState, action: PayloadAction<Array<LabelAndValue>>) => {
      draftState.loadingStaffListStatus = 'Loaded';
      draftState.staffList = action.payload;
    },
    erroredLodingLatestPlanKeikakushoKanri: (draftState: CareplanHeaderState) => {
      draftState.loadingLatestPlanKeikakushoKanriStatus = 'Error';
    },
    erroredLodingStaffList: (draftState: CareplanHeaderState) => {
      draftState.loadingLatestPlanKeikakushoKanriStatus = 'Error';
    },
    openAddConfirmDialog: (draftState: CareplanHeaderState) => {
      draftState.openedAddConfirmDialog = true;
    },
    closeAddConfirmDialog: (draftState: CareplanHeaderState) => {
      draftState.openedAddConfirmDialog = false;
    },
    setSelectedPlanKeikakushoKanri: (draftState: CareplanHeaderState, action: PayloadAction<CareplanHeaderSelectedKeikakushoKanriType>) => {
      draftState.selectedPlanKeikakushoKanri = action.payload;
    },
    setHikitsugiCheck: (draftState: CareplanHeaderState, action: PayloadAction<boolean>) => {
      draftState.hikitsugiCheck = action.payload;
    },
    setMode: (draftState: CareplanHeaderState, action: PayloadAction<'add' | 'copy' | 'edit' | 'none' | undefined>) => {
      draftState.mode = action.payload;
    },
    setSakuseiDate: (draftState: CareplanHeaderState, action: PayloadAction<number>) => {
      draftState.sakuseiDate = action.payload;
    },
    clearCareplanHeader: (draftState: CareplanHeaderState) => {
      draftState.loadingLatestPlanKeikakushoKanriStatus = 'NotLoad';
      draftState.loadingStaffListStatus = 'NotLoad';
      draftState.openedAddConfirmDialog = false;
      draftState.latestPlanKeikakushoKanri = undefined;
      draftState.staffList = [];
      draftState.selectedPlanKeikakushoKanri = undefined;
      draftState.hikitsugiCheck = false;
      draftState.mode = undefined;
      draftState.sakuseiDate = undefined;
    },
  },
});

export default careplanHeaderStore;
