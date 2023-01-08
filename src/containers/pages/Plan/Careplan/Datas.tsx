import { SingleCheckboxLabelAndValue } from '@my/hooks/useSingleCheckbox';

// ***********************************************************************************
// Options データ
// ***********************************************************************************

// ***********************************************************************************
// 共通
export const sexOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
];

// ***********************************************************************************
// Checkbox データ
// ***********************************************************************************

// ***********************************************************************************
// 全体共通
export const ariNashiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: 'あり', value: '1' },
  { label: 'なし', value: '2' },
];
export const umuCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '有', value: 'ari' },
  { label: '無', value: 'nashi' },
];
export const mondaiAriNashiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '問題あり', value: 'ari' },
  { label: '問題なし', value: 'nashi' },
];
export const jisshiAriNashiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '', value: 'jisshi' },
  { label: '', value: 'sometimes' },
];
export const jiritsu1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.自立', value: '1' },
  { label: '2.見守り等', value: '2' },
  { label: '3.一部介助', value: '3' },
  { label: '4.全介助', value: '4' },
];
export const jiritsu2Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.自立', value: '1' },
  { label: '2.一部介助', value: '2' },
  { label: '3.全介助', value: '3' },
];

// ***********************************************************************************
// アセスメント１
// 共通
export const sameHonninOptions: SingleCheckboxLabelAndValue[] = [{ label: '本人に同じ', value: '1' }];

// 個別
// 受付区分
export const uketsukeCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '訪問', value: '1' },
  { label: '電話', value: '2' },
  { label: '来所', value: '3' },
  { label: 'その他', value: '9' },
];
// 介護保険 利用者負担割合
export const kaigoRiyoushaFutanWariaiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1割', value: '1' },
  { label: '2割', value: '2' },
  { label: '3割', value: '3' },
];

// 後期高齢者医療保険(75歳以上)
export const koukiKoureishaIryouHokenCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1割負担', value: '1' },
  { label: '2割負担', value: '2' },
  { label: '3割負担', value: '3' },
];

// 高額介護サービス費該当
export const kougakuKaigoServicehiGaitouCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '第5段階', value: '5' },
  { label: '第4段階', value: '4' },
  { label: '第3段階', value: '3' },
  { label: '第2段階', value: '2' },
  { label: '第1段階', value: '1' },
];

// 要介護認定 済 未
export const youkaigoNinteiNaiyouCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '非該当', value: '9' },
  { label: '要支援1', value: 'shien1' },
  { label: '要支援2', value: 'shien2' },
  { label: '要介護1', value: 'kaigo1' },
  { label: '要介護2', value: 'kaigo2' },
  { label: '要介護3', value: 'kaigo3' },
  { label: '要介護4', value: 'kaigo4' },
  { label: '要介護5', value: 'kaigo5' },
];
// 障害高齢者
export const shougaiKoureishaCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立', value: '0' },
  { label: 'J1', value: 'j1' },
  { label: 'J2', value: 'j2' },
  { label: 'A1', value: 'a1' },
  { label: 'A2', value: 'a2' },
  { label: 'B1', value: 'b1' },
  { label: 'B2', value: 'b2' },
  { label: 'C1', value: 'c1' },
  { label: 'C2', value: 'c2' },
];

// 認知症
export const ninchishouCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立', value: '0' },
  { label: 'Ⅰ', value: '1' },
  { label: 'Ⅱa', value: '2a' },
  { label: 'Ⅱb', value: '2b' },
  { label: 'Ⅲa', value: '3a' },
  { label: 'Ⅲb', value: '3b' },
  { label: 'Ⅳ', value: '4' },
  { label: 'M', value: 'm' },
];
// 要介護認定
export const youkaigoNinteiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '済', value: 'sumi' },
  { label: '未(見込み)', value: 'misumi' },
];

// ***********************************************************************************
// アセスメント３
// 個別
// 直近の入所・入院
export const chokkinNyuushoNyuuinCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '介護老人福祉施設', value: 'fukushi' },
  { label: '介護老人保健施設', value: 'hoken' },
  { label: '介護療養型医療施設(介護医療院)', value: 'iryou' },
  { label: '認知症対応型共同生活介護適用施設(グループホーム)', value: 'group' },
  { label: '特定施設入居者生活介護適用施設(ケアハウス等)', value: 'care' },
  { label: '医療機関(医療保険適用療養病床)', value: 'iryouByoushou' },
  { label: '医療機関(療養病床以外)', value: 'iryouOther' },
  { label: 'その他の施設', value: 'other' },
];

// ***********************************************************************************
// アセスメント４
// 個別
export const zyukyoTypeCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '１戸建て', value: '1' },
  { label: '集合住宅', value: '2' },
];
export const keiyakuTypeCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '賃貸', value: '1' },
  { label: '所有', value: '2' },
  { label: '給与住宅', value: '3' },
  { label: '公営住宅', value: '4' },
  { label: 'その他', value: '9' },
];
export const kyoshitsuACheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '専用居室あり', value: '1' },
  { label: '専用居室なし', value: '2' },
];
export const kyoshitsuICheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1階', value: '1' },
  { label: '2階', value: '2' },
  { label: 'その他', value: '9' },
];
export const kyoshitsuIElevatorCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '有', value: '1' },
  { label: '無', value: '0' },
];
export const kyoshitsuUCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '布団', value: 'futon' },
  { label: 'ベッド', value: 'bed' },
  { label: 'その他', value: 'other' },
];
export const kyoshitsuUDetailCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '固定式', value: '1' },
  { label: 'ギャッチ', value: '2' },
  { label: '電動', value: '3' },
];
export const kyoshitsuECheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '良', value: '1' },
  { label: '普通', value: '2' },
  { label: '悪', value: '3' },
];
export const toiletACheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '和式', value: 'washiki' },
  { label: '洋式', value: 'youshiki' },
  { label: 'その他', value: 'other' },
];
export const yokusouACheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自宅にあり', value: '1' },
  { label: '自宅になし', value: '2' },
];
export const shosetsubiChouriCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: 'ガス', value: '1' },
  { label: 'IH', value: '2' },
];
export const shosetsubiDanbouCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: 'ガス', value: '1' },
  { label: '電気', value: '2' },
  { label: '灯油', value: '3' },
  { label: 'その他', value: '9' },
];
export const idouShudanFukushiKikiShiyouCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '使用している', value: '1' },
  { label: '使用していない', value: '2' },
];
export const idouShudanFukushiKikiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '車いす', value: 'kurumaisu' },
  { label: '電動車いす', value: 'dendouisu' },
  { label: '杖', value: 'tsue' },
  { label: '歩行器', value: 'hokouki' },
  { label: 'その他', value: 'other' },
];

// ***********************************************************************************
// アセスメント５
// 個別
// 受診頻度
export const jushinHindoCheckboxes = [
  { label: '定期', value: 'teiki' },
  { label: '不定期', value: 'futeiki' },
];
export const jushinHindoDetailCheckboxes = [
  { label: '週', value: '1' },
  { label: '月', value: '2' },
];
// 受診状況
export const jushinStateCheckboxes = [
  { label: '通院', value: 'tsuuin' },
  { label: '往診', value: 'oushin' },
];
export const teethCheckboxes = [
  { label: '歯あり', value: '1' },
  { label: '歯なし', value: '0' },
];
export const teethTypeCheckboxes = [
  { label: '総入れ歯', value: '1' },
  { label: '局部義歯', value: '2' },
];

// ***********************************************************************************
// アセスメント６の１
// 共通
export const canGrabCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: 'can' },
  { label: '2.何かにつかまればできる', value: 'canGrabSomething' },
  { label: '3.できない', value: 'cannot' },
];
export const canSupportCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: 'can' },
  { label: '2.何か支えがあればできる', value: 'canSupportSomething' },
  { label: '3.できない', value: 'cannot' },
];
export const jisshiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '', value: 'jisshi' },
  { label: '', value: 'sometimes' },
];
// 個別
// 1-1 痔瘻等
export const youkaigo1Of1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: 'nothing', subGroupName: '1' },
  { label: '2.左上肢', value: 'leftUp', subGroupName: '2' },
  { label: '3.右上肢', value: 'rightUp', subGroupName: '2' },
  { label: '4.左下肢', value: 'leftLow', subGroupName: '2' },
  { label: '5.右下肢', value: 'rightLow', subGroupName: '2' },
  { label: '6.その他(四肢の欠損)', value: 'other', subGroupName: '2' },
];
// 1-2 拘縮
export const youkaigo1Of2Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: 'nothing', subGroupName: '1' },
  { label: '2.肩関節', value: 'kata', subGroupName: '2' },
  { label: '3.股関節', value: 'mata', subGroupName: '2' },
  { label: '4.膝関節', value: 'hiza', subGroupName: '2' },
  { label: '5.その他(四肢の欠損)', value: 'other', subGroupName: '2' },
];
// 1-5 座位保持
export const youkaigo1Of5Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: 'can' },
  { label: '2.自分の手で支えればできる', value: 'canOwnHands' },
  { label: '3.支えてもらえばできる', value: 'canSupport' },
  { label: '4.できない', value: 'cannot' },
];
// 1-10 洗身
export const youkaigo1Of10Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.自立', value: 'jiritsu' },
  { label: '2.一部介助', value: 'ichibuKaijo' },
  { label: '3.全介助', value: 'allKaijo' },
  { label: '4.行っていない', value: 'donot' },
];
// 1-11 つめ切り
export const youkaigo1Of11Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.自立', value: 'jiritsu' },
  { label: '2.一部介助', value: 'ichibuKaijo' },
  { label: '3.全介助', value: 'allKaijo' },
];
// 1-12 視力
export const youkaigo1Of12Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.普通', value: 'usually' },
  { label: '2.約1m離れた視力確認表の図が見える', value: 'goodEyes' },
  { label: '3.目の前に置いた視力確認表の図が見える', value: 'littleGoodEyes' },
  { label: '4.ほとんど見えない', value: 'badEyes' },
  { label: '5.見えているのか判断不能', value: 'undecidable' },
];
// 1-13 聴力
export const youkaigo1Of13Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.普通', value: 'usually' },
  { label: '2.普通の声がやっと聞き取れる', value: 'goodEar' },
  { label: '3.かなり大きな声なら何とか聞き取れる', value: 'littleGoodEar' },
  { label: '4.ほとんど聞こえない', value: 'badEar' },
  { label: '5.聞こえているのか判断不能', value: 'undecidable' },
];
// 1-14 聴力 関節の動き
export const youkaigo1Of14Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: 'nothing', subGroupName: '1' },
  { label: '2.肩関節', value: 'kata', subGroupName: '2' },
  { label: '3.肘関節', value: 'hiji', subGroupName: '2' },
  { label: '4.股関節', value: 'mata', subGroupName: '2' },
  { label: '5.膝関節', value: 'hiza', subGroupName: '2' },
  { label: '6.足関節', value: 'ashi', subGroupName: '2' },
  { label: '7.その他', value: 'other', subGroupName: '2' },
];

// ***********************************************************************************
// アセスメント６の２
// 共通
export const kaijoGenjoCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '見守りのみ', value: 'mimamori' },
  { label: '介助あり', value: 'kaijo' },
];
export const kaijoKeikakuCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '見守り必要', value: 'mimamori' },
  { label: '介助必要', value: 'kaijo' },
];

// 個別
// 2-3 えん下
export const youkaigo2Of3Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: '1' },
  { label: '2.見守り等', value: '2' },
  { label: '3.できない', value: '3' },
];
// 2-12 外出頻度
export const youkaigo2Of12Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.週1回以上', value: '1' },
  { label: '2.月1回以上', value: '2' },
  { label: '3.月1回未満', value: '3' },
];
// その他の食事の現状（６ー２ ２－４関係）
// ア 食事場所
export const youkaigo2Of24Other1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '食堂', value: 'shokudou' },
  { label: '居室ベッド上', value: 'kyoshitsuBed' },
  { label: '布団上', value: 'futon' },
  { label: 'その他居室内', value: 'otherKyoshitsu' },
  { label: 'その他', value: 'other' },
];
// ウ 咀嚼の状況
export const youkaigo2Of24Other3Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '噛みにくい', value: 'hardChewLevel1' },
  { label: '時々噛みにくい', value: 'hardChewLevel2' },
  { label: 'とても噛みにくい', value: 'hardChewLevel3' },
];
// その他排泄の状況（６－２ ２－５、２－６関係）
export const youkaigo2Of256OtherCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: 'ある', value: 'ari' },
  { label: 'ときどきある', value: 'ariSometines' },
  { label: 'ない', value: 'nashi' },
];
// ６－２ ２－１～２－４関係
// 主食
export const youkaigo2Of1234ShushokuCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '普通食', value: 'hutsuu' },
  { label: '粥食', value: 'kayu' },
  { label: '経口栄養', value: 'keikou' },
  { label: '経管栄養', value: 'keikan' },
  { label: 'その他', value: 'other' },
];
// 副食
export const youkaigo2Of1234FukushokuCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '普通食', value: 'hutsuu' },
  { label: '刻み食', value: 'kizami' },
  { label: 'ミキサー食', value: 'mixer' },
  { label: 'その他', value: 'other' },
];

// ***********************************************************************************
// アセスメント６の３と４
// 共通
export const youkaigoCanCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: 'can' },
  { label: '2.できない', value: 'cannot' },
];
export const youkaigoAriNashiCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: 'nashi' },
  { label: '2.時々ある', value: 'ariSometines' },
  { label: '3.ある', value: 'ari' },
];

// 個別
export const youkaigo3Of1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: 'can' },
  { label: '2.時々できる', value: 'canSometines' },
  { label: '3.ほとんどできない', value: 'canAlmost' },
  { label: '4.できない', value: 'cannot' },
];
export const youkaigo3Of10Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.通じる', value: 'understand' },
  { label: '2.時々通じる', value: 'understandSometimes' },
  { label: '3.通じない', value: 'understandnot' },
];

// ***********************************************************************************
// アセスメント６の５
// 個別
export const youkaigo5Of3Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.できる', value: '1' },
  { label: '2.特別な場合を除いてできる', value: '2' },
  { label: '3.日常的に困難', value: '3' },
  { label: '4.できない', value: '4' },
];
export const youkaigo5Of4Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: '1' },
  { label: '2.時々ある', value: '2' },
  { label: '3.ある', value: '3' },
];
export const youkaigo5Of8Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.よく動いている', value: '1' },
  { label: '2.座っていることが多い', value: '2' },
  { label: '3.横になっていることが多い', value: '3' },
];
export const youkaigo5Of9Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.ない', value: '1' },
  { label: '2.ある', value: '2' },
];

// ***********************************************************************************
// アセスメント６の６
// 個別
export const youkaigo6Of11Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立', value: '1' },
  { label: '介助があればしている', value: '2' },
  { label: 'していない', value: '3' },
];
export const youkaigo6Of12Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '用いていない', value: '1' },
  { label: '主に自分で操作している', value: '2' },
  { label: '主に他人が操作している', value: '3' },
];
export const youkaigo6Of21Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立ないし何とか自分で食べられる', value: '1' },
  { label: '全面介助', value: '2' },
];
export const youkaigo6Of22Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '良好', value: '1' },
  { label: '不良', value: '2' },
];
export const youkaigo6Of41Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '期待できる', value: '1' },
  { label: '期待できない', value: '2' },
  { label: '不明', value: '3' },
];
export const youkaigo6Of6Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '特になし', value: 'nashi' },
  { label: 'あり', value: 'ari' },
];
export const youkaigo6Of71Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '無', value: 'nashi' },
  { label: '有', value: 'ari' },
  { label: '不明', value: 'fumei' },
];

// ***********************************************************************************
// 居宅サービス計画書(1)
// 共通
// 個別
export const sakuseiKbnCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '初回', value: '0' },
  { label: '紹介', value: '1' },
  { label: '継続', value: '2' },
];
export const saniteReasonTypeCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '0.算定理由なし', value: '0' },
  { label: '1.一人暮らし', value: '1' },
  { label: '2.家族等が障害疾病等', value: '2' },
  { label: '3.その他', value: '9' },
];

// ***********************************************************************************
// 居宅サービス計画書(2)
// 共通
// 個別

// ***********************************************************************************
// 利用者基本情報
// 共通
export const visitCategory1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '来所', value: '1' },
  { label: '電話', value: '2' },
  { label: 'その他', value: '3' },
];
export const visitCategory2Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '初回', value: '1' },
  { label: '再来', value: '2' },
];
export const personalSituationCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '在宅', value: '1' },
  { label: '入院中または入所中', value: '2' },
];
export const elderlyWithDisabilitiesCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立', value: '1' },
  { label: 'J1', value: '2' },
  { label: 'J2', value: '3' },
  { label: 'A1', value: '4' },
  { label: 'A2', value: '5' },
  { label: 'B1', value: '6' },
  { label: 'B2', value: '7' },
  { label: 'C1', value: '8' },
  { label: 'C2', value: '9' },
];
export const elderlyPeopleWithDementiaCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自立', value: '1' },
  { label: 'Ⅰ', value: '2' },
  { label: 'Ⅱa', value: '3' },
  { label: 'Ⅱb', value: '4' },
  { label: 'Ⅲa', value: '5' },
  { label: 'Ⅲb', value: '6' },
  { label: 'Ⅳ', value: '7' },
  { label: 'M', value: '8' },
];
export const disabilityCertificationShinsyouCheckboxes: SingleCheckboxLabelAndValue[] = [{ label: '身障', value: '1' }];
export const disabilityCertificationRyouikuCheckboxes: SingleCheckboxLabelAndValue[] = [{ label: '療育', value: '1' }];
export const disabilityCertificationSeishinCheckboxes: SingleCheckboxLabelAndValue[] = [{ label: '精神', value: '1' }];
export const disabilityCertificationNanbyouCheckboxes: SingleCheckboxLabelAndValue[] = [{ label: '難病', value: '1' }];
export const disabilityCertificationSonotaCheckboxes: SingleCheckboxLabelAndValue[] = [{ label: 'その他', value: '1' }];
export const livingEnvironmentCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '自宅', value: '1' },
  { label: '借家', value: '2' },
  { label: '一戸建て', value: '3' },
  { label: '集合住宅', value: '4' },
];
export const economyStatusCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: '国民年金', value: '1' },
  { label: '厚生年金', value: '2' },
  { label: '障害年金', value: '3' },
  { label: '生活保護', value: '4' },
  { label: 'その他', value: '5' },
];
// 個別

// ***********************************************************************************
// 基本チェックリスト
// 共通
export const checklist1Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '0.はい', value: '0' },
  { label: '1.いいえ', value: '1' },
];
export const checklist2Checkboxes: SingleCheckboxLabelAndValue[] = [
  { label: '1.はい', value: '1' },
  { label: '0.いいえ', value: '0' },
];

// 個別

// ***********************************************************************************
// 介護予防支援・サービス評価表
// 共通
// 個別
export const planStatusCheckboxes: SingleCheckboxLabelAndValue[] = [
  { label: 'プラン継続', value: '1' },
  { label: 'プラン変更', value: '2' },
  { label: '終了', value: '3' },
];

export const youkaigoOptions = [
  { value: '1', label: '要支援１' },
  { value: '2', label: '要支援２' },
  { value: '3', label: '要介護１' },
  { value: '4', label: '要介護２' },
  { value: '5', label: '要介護３' },
  { value: '6', label: '要介護４' },
  { value: '7', label: '要介護５' },
  { value: '8', label: '総合事業' },
  { value: '9', label: 'その他' },
  { value: '0', label: '非該当' },
];

export const zenkaiYoukaigoOptions = [
  { value: '1', label: '要支援１' },
  { value: '2', label: '要支援２' },
  { value: '3', label: '要介護１' },
  { value: '4', label: '要介護２' },
  { value: '5', label: '要介護３' },
  { value: '6', label: '要介護４' },
  { value: '7', label: '要介護５' },
  { value: '8', label: '総合事業' },
  { value: '9', label: 'その他' },
  { value: '0', label: '非該当' },
];
