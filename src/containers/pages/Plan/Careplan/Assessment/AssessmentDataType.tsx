/* アセスメントの全タブのデータ */
export type CarePlanAssessment = {
  assessment1?: Assessment1;
  assessment2?: Assessment2;
  assessment3?: Assessment3;
  assessment4?: Assessment4;
  assessment5?: Assessment5;
  assessment61?: Assessment61;
  assessment62?: Assessment62;
  assessment63?: Assessment63;
  assessment64?: Assessment64;
  assessment65?: Assessment65;
  assessment66?: Assessment66;
  assessment7?: Assessment7;
  assessmentSchedule?: AssessmentSchedule;
};

export type Assessment1 = {
  uketsukeCheck?: string[];
  kinkyuuSameHonninCheck?: string[];
  soudanSameHonninCheck?: string[];
  zipCode?: string;
  youkaigoNinteiCheck?: { sumi: boolean; misumi: boolean };
  shinshouTechouCheck?: string[];
  ryouikuTechouCheck?: string[];
  seishinShougaishaHokenFukushiTechouCheck?: string[];
  jiritsushienIryouJukyuushaUmuCheck?: string[];
};

export type Assessment2 = {
  /** 家族構成図 */
  imageFile?: string;
  /** 家族の介護の状況・問題点 */
  joukyouMondaiten?: string;

  isKazoku1Shutarukaigosha?: boolean;
  kazoku1Name?: string;
  kazoku1SexKbn?: string;
  kazoku1Tsuzukigara?: string;
  kazoku1DoubekkyoType?: string;
  kazoku1ShokuUmuType?: string;
  kazoku1KenkouJoutai?: string;
  kazoku1Tokkijikou?: string;
  isKazoku2Shutarukaigosha?: boolean;
  kazoku2Name?: string;
  kazoku2SexKbn?: string;
  kazoku2Tsuzukigara?: string;
  kazoku2DoubekkyoType?: string;
  kazoku2ShokuUmuType?: string;
  kazoku2KenkouJoutai?: string;
  kazoku2Tokkijikou?: string;
  isKazoku3Shutarukaigosha?: boolean;
  kazoku3Name?: string;
  kazoku3SexKbn?: string;
  kazoku3Tsuzukigara?: string;
  kazoku3DoubekkyoType?: string;
  kazoku3ShokuUmuType?: string;
  kazoku3KenkouJoutai?: string;
  kazoku3Tokkijikou?: string;
  isKazoku4Shutarukaigosha?: boolean;
  kazoku4Name?: string;
  kazoku4SexKbn?: string;
  kazoku4Tsuzukigara?: string;
  kazoku4DoubekkyoType?: string;
  kazoku4ShokuUmuType?: string;
  kazoku4KenkouJoutai?: string;
  kazoku4Tokkijikou?: string;
  isKazoku5Shutarukaigosha?: boolean;
  kazoku5Name?: string;
  kazoku5SexKbn?: string;
  kazoku5Tsuzukigara?: string;
  kazoku5DoubekkyoType?: string;
  kazoku5ShokuUmuType?: string;
  kazoku5KenkouJoutai?: string;
  kazoku5Tokkijikou?: string;

  shien1ShienteikyoushaName?: string;
  shienNaiyou?: string;
  shien1Tokkijikou?: string;

  shienKibou?: string;
  shien2ShienteikyoushaName?: string;
  shien2Tokkijikou?: string;
};

export type Assessment3 = {
  id?: string;
  chokkinNyuushoNyuuinCheck?: { fukushi: boolean; hoken: boolean; iryou: boolean; group: boolean; care: boolean; iryouByoushou: boolean; iryouOther: boolean; other: boolean };
};

export type Assessment4 = {
  id?: string;
};

export type Assessment5 = {
  id?: string;
};

export type Assessment61 = {
  id?: string;
};

export type Assessment62 = {
  id?: string;
};

export type Assessment63 = {
  id?: string;
};

export type Assessment64 = {
  id?: string;
};

export type Assessment65 = {
  id?: string;
};

export type Assessment66 = {
  id?: string;
};

export type Assessment7 = {
  id?: string;
};

export type AssessmentSchedule = {
  id?: string;
};
