const MESSAGE_0001 = () => `入力された内容は失われてしまいますが、よろしいですか？`;
const MESSAGE_0002 = () => `利用者が選択されていません。新規利用者を登録するかヘッダー【🔍】にて利用者を選択してください。`;
const MESSAGE_0003 = () => `画面の表示が許可されていません。`;
const MESSAGE_0004 = (arg1: string) => `${arg1}を入力してください。`;
const MESSAGE_0005 = (arg1: string) => `${arg1}文字で入力してください。`;
const MESSAGE_0006 = (arg1: string) => `${arg1}の入力に誤りがあります。`;
const MESSAGE_0007 = (arg1: string) => `${arg1}を削除します。よろしいですか？`;
const MESSAGE_0008 = () => `正しい郵便番号を入力してください。`;
const MESSAGE_0009 = () => `正常に終了しました。`;
const MESSAGE_0010 = () => `処理中にエラーが発生しました。`;
const MESSAGE_0011 = () => `既に入力済みの勤務表は上書きされます。選択したスタッフの週間シフトを取り込みますか？`;
const MESSAGE_0012 = () => `選択したスタッフの勤務表を削除しますか？`;
const MESSAGE_0013 = () => `サービス外予定を削除しますか？`;
const MESSAGE_0014 = (arg1: string) => `${arg1}ため登録できません。`;
const MESSAGE_0015 = () => `選択された履歴を削除します。よろしいですか？`;
const MESSAGE_0016 = () => `削除しました。`;
const MESSAGE_0017 = () => `認定有効期間が重複しています。\n前履歴の認定有効期間の終了日を縮めて登録を続けますか？`;
const MESSAGE_0018 = () => `すでに入力されている履歴と期間が重複しています。`;
const MESSAGE_0019 = () => `画面の表示が許可されていません。`;
const MESSAGE_0020 = () => `選択された画像を削除します。よろしいですか？`;
const MESSAGE_0021 = () => `カタカナで入力してください。`;
const MESSAGE_0022 = () => `１文字以上空白を入力してください。`;
const MESSAGE_0023 = (arg1: string) => `${arg1}のため削除できません。`;
const MESSAGE_0024 = (arg1: string, arg2: string) => `${arg1}が${arg2}より過去に設定されています。`;
const MESSAGE_0025 = (arg1: string) => `${arg1}が選択されていません。`;
const MESSAGE_0026 = (arg1: string) => `${arg1}が削除されます。よろしいですか？`;
const MESSAGE_0027 = () => `期間に誤りがあります。`;
const MESSAGE_0028 = () => `続けて登録しますか？`;
const MESSAGE_0029 = () =>
  `すでに登録されている履歴情報と適用の期間が重複するため、適用の期間を自動調整して登録します。\n（１つ前の履歴情報における適用の期間終了日を、追加登録する情報の認定有効開始日「１日前」に修正します。）`;
const MESSAGE_0030 = (arg1: string, arg2: string) => `${arg1}\n１つ以上${arg2}が必要です。`;
const MESSAGE_0031 = () => `すでに同じ時間のサービスが登録されています`;
const MESSAGE_0032 = () => `時間が重複するスタッフが存在します`;
const MESSAGE_0033 = () => `3つ以上サービスが重複する時間帯があります。`;
const MESSAGE_0034 = (arg1: string) => `${arg1}を追加します。よろしいですか？`;
const MESSAGE_0035 = (arg1: string) => `${arg1}様式と不一致があります。`;
const MESSAGE_0036 = () => `サービスコードを選択してください`;
const MESSAGE_0037 = () => `登録しました。`;
const MESSAGE_0038 = () => `選択した利用者にスタッフを一括割り当てしますか？`;
const MESSAGE_0039 = () => `選択した利用者からスタッフ割り当てをクリアしますか？`;
const MESSAGE_0040 = () => `選択したスタッフのサービスから割り当てをクリアしますか？`;
const MESSAGE_0041 = () => `選択した利用者は既にスタッフ割当済みです。上書きして割り当てますか？`;
const MESSAGE_0042 = (arg1: string) => `${arg1}コピーします。よろしいですか？`;
const MESSAGE_0043 = (arg1: string) => `${arg1}保存します。よろしいですか？`;
const MESSAGE_0044 = () => `すでに別のスタッフが指名されています。このスタッフに指名を変更しますか？`;
const MESSAGE_0045 = () => `事業所にサービス種類が設定されていません。`;
const MESSAGE_0046 = () => `契約支給量を超過しています。`;
const MESSAGE_0047 = () => `既存の情報をすべて削除してコピーを行います。よろしいですか？`;
const MESSAGE_0048 = () => `登録対象がありません。`;
const MESSAGE_0049 = () => `別のスタッフに指名が登録されています。指名の変更を行いますか？`;
const MESSAGE_0050 = () => `登録してもよろしいですか？`;
const MESSAGE_0051 = () => `既に登録されている期間と重複します。`;
const MESSAGE_0052 = () => `選択した利用者を次月に繰り越しますか？`;
const MESSAGE_0053 = () => `選択した利用者の繰り越しを解除しますか？`;
const MESSAGE_0054 = () => `利用者が重複しています。`;
const MESSAGE_0055 = () => `総費用額と利用者負担額の整合を取ってください。`;
const MESSAGE_0056 = () => `請求確定済または上限額管理済の利用者がいます。`;
const MESSAGE_0057 = (arg1: string) => `既に同じ${arg1}が登録されています。`;
const MESSAGE_0058 = () => `編集中の内容が存在します。登録しますか？`;
const MESSAGE_0059 = (arg1: string, arg2: string) => `${arg1}が${arg2}を超えています`;
const MESSAGE_0060 = (arg1: string) => `該当する${arg1}がありません`;
const MESSAGE_0061 = (arg1: string, arg2: string) => `${arg1}が${arg2}と一致しません`;
const MESSAGE_0062 = () => `請求確定および上限額管理の情報がクリアされますが登録しますか？`;
const MESSAGE_0063 = () => `入力に誤りがあります`;
const MESSAGE_0064 = (arg1: string) => `選択された${arg1}は使用されています。削除しますか？`;
const MESSAGE_0065 = () => `口座情報が1件も登録されていません。マスター管理>口座情報画面にて口座情報を登録してください。`;
const MESSAGE_0066 = (arg1: string) => `${arg1}を指定してください。`;
const MESSAGE_0067 = () => `適用先を指定している場合は曜日も指定してください。`;
const MESSAGE_0068 = () => `生活援助時間がサービス提供時間を超えています。`;
const MESSAGE_0069 = () => `選択した勤怠報告を承認します。よろしいですか？`;
const MESSAGE_0070 = () => `選択したサービスの実績を登録済みにしますか？`;
const MESSAGE_0071 = (arg1: string) => `${arg1}を選択してください。`;
const MESSAGE_0072 = () => `時間が一致しない内容があります。登録しますか？`;
const MESSAGE_0073 = () => `基本項目の設定されていない単独の加算項目があります。このまま登録してもよろしいですか？`;
const MESSAGE_0074 = () => `表示された内容は失われてしまいますが、よろしいですか？`;
const MESSAGE_0075 = () => `ログインユーザー情報が変更されています。再ログインする必要があります。`;
const MESSAGE_0076 = () => `ログアウトします。よろしいですか？`;
const MESSAGE_0077 = (arg1: string) => `${arg1}します。よろしいですか？`;
const MESSAGE_0078 = (arg1: string) => `${arg1}が入力されていません。`;
const MESSAGE_0079 = (arg1: string) => `${arg1}が選択されていません。`;
const MESSAGE_0080 = () => `請求確定が解除されますがよろしいですか？`;
const MESSAGE_0081 = () => `請求確定している利用者がいますが削除してもよろしいですか？`;
const MESSAGE_0082 = () => `対象となるデータが存在しません。`;
const MESSAGE_0083 = (arg1: string, arg2: string) => `${arg1}を${arg2}しますか？`;
const MESSAGE_0084 = () => `選択された履歴を削除しますか？`;
const MESSAGE_0085 = () => `出力対象データがありません。`;
const MESSAGE_0086 = () => `小数部は0.00、0.25、0.50、0.75のどれかで入力してください。`;
const MESSAGE_0087 = () => `開始（終了）時間を入力してください`;
const MESSAGE_0088 = () => `新規作成を行います。表示されている計画書の内容を引継ぎますか？`;
const MESSAGE_0089 = (arg1: string, arg2: string, arg3: string) => `${arg1}は、${arg2}以上${arg3}以内で入力してください。`;
const MESSAGE_0090 = (arg1: string) => `${arg1}が登録されていません。`;
const MESSAGE_0091 = () => `制度またはサービス種類が未選択の場合は検索できません。`;
const MESSAGE_0092 = (arg1: string | number) => `${arg1}名を利用者リストに追加しました。`;
const MESSAGE_0093 = () => `入力した実績はすべて削除した後、予定を実績にコピーします。よろしいですか？`;
const MESSAGE_0094 = () => `利用者リストに選択済みの利用者をクリアしますか？`;
const MESSAGE_0095 = (arg1: string) => `${arg1}を出力できませんでした。`;
const MESSAGE_0096 = (arg1: string, arg2: string) => `${arg1}は${arg2}までです。`;
const MESSAGE_0097 = (arg1: string, arg2: string) => `${arg1}が${arg2}を超えていますがよろしいですか？`;
const MESSAGE_0098 = (arg1: string, arg2: string) => `${arg1}が${arg2}をはみだしています`;
const MESSAGE_0099 = (arg1: string, arg2: string) => `${arg1}が${arg2}です。`;
const MESSAGE_0100 = (arg1: string) => `${arg1}が重複しています。`;
const MESSAGE_0102 = () => `所属が未登録です。所属を登録する場合、所属の内容を確認し再度登録してください。`;

export default {
  /** `入力された内容は失われてしまいますが、よろしいですか？`; */
  MESSAGE_0001,
  /** `利用者が選択されていません。新規利用者を登録するかヘッダー【🔍】にて利用者を選択してください。`; */
  MESSAGE_0002,
  /** `画面の表示が許可されていません。`; */
  MESSAGE_0003,
  /** `${arg1}を入力してください。`; */
  MESSAGE_0004,
  /** `${arg1}文字で入力してください。`; */
  MESSAGE_0005,
  /** `${arg1}の入力に誤りがあります。`; */
  MESSAGE_0006,
  /** `${arg1}を削除します。よろしいですか？`; */
  MESSAGE_0007,
  /** `正しい郵便番号を入力してください。`; */
  MESSAGE_0008,
  /** `正常に終了しました。`; */
  MESSAGE_0009,
  /** `処理中にエラーが発生しました。`; */
  MESSAGE_0010,
  /** `既に入力済みの勤務表は上書きされます。選択したスタッフの週間シフトを取り込みますか？`; */
  MESSAGE_0011,
  /** `選択したスタッフの勤務表を削除しますか？`; */
  MESSAGE_0012,
  /** `サービス外予定を削除しますか？`; */
  MESSAGE_0013,
  /** `${arg1}ため登録できません。`; */
  MESSAGE_0014,
  /** `選択された履歴を削除します。よろしいですか？`; */
  MESSAGE_0015,
  /** `削除しました。`; */
  MESSAGE_0016,
  /** `認定有効期間が重複しています。\n前履歴の認定有効期間の終了日を縮めて登録を続けますか？`; */
  MESSAGE_0017,
  /** `すでに入力されている履歴と期間が重複しています。`; */
  MESSAGE_0018,
  /** `画面の表示が許可されていません。`; */
  MESSAGE_0019,
  /** `選択された画像を削除します。よろしいですか？`; */
  MESSAGE_0020,
  /** `カタカナで入力してください。`; */
  MESSAGE_0021,
  /** `1文字以上空白を入力してください。`; */
  MESSAGE_0022,
  /** `${arg1}のため削除できません。`; */
  MESSAGE_0023,
  /** `${arg1}が${arg2}より過去に設定されています。`; */
  MESSAGE_0024,
  /** `${arg1}が選択されていません。`; */
  MESSAGE_0025,
  /** `${arg1}が削除されます。よろしいですか？`; */
  MESSAGE_0026,
  /** `期間に誤りがあります。`; */
  MESSAGE_0027,
  /** `続けて登録しますか？`; */
  MESSAGE_0028,
  /** `すでに登録されている履歴情報と適用の期間が重複するため、適用の期間を自動調整して登録します。\n（１つ前の履歴情報における適用の期間終了日を、追加登録する情報の認定有効開始日「１日前」に修正します。）`; */
  MESSAGE_0029,
  /** `${arg1}\n１つ以上${arg2}が必要です。`; */
  MESSAGE_0030,
  /** `すでに同じ時間のサービスが登録されています`; */
  MESSAGE_0031,
  /** `時間が重複するスタッフが存在します`; */
  MESSAGE_0032,
  /** `3つ以上サービスが重複する時間帯があります。`; */
  MESSAGE_0033,
  /** `${arg1}を追加します。よろしいですか？`; */
  MESSAGE_0034,
  /** `${arg1}様式と不一致があります。`; */
  MESSAGE_0035,
  /** `サービスコードを選択してください`; */
  MESSAGE_0036,
  /** `登録しました。`; */
  MESSAGE_0037,
  /** `選択した利用者にスタッフを一括割り当てしますか？`; */
  MESSAGE_0038,
  /** `選択した利用者からスタッフ割り当てをクリアしますか？`; */
  MESSAGE_0039,
  /** `選択したスタッフのサービスから割り当てをクリアしますか？`; */
  MESSAGE_0040,
  /** `選択した利用者は既にスタッフ割当済みです。上書きして割り当てますか？`; */
  MESSAGE_0041,
  /** `${arg1}コピーします。よろしいですか？`; */
  MESSAGE_0042,
  /** `${arg1}保存します。よろしいですか？`; */
  MESSAGE_0043,
  /** `すでに別のスタッフが指名されています。このスタッフに指名を変更しますか？`; */
  MESSAGE_0044,
  /** `事業所にサービス種類が設定されていません。`; */
  MESSAGE_0045,
  /** `契約支給量を超過しています。`; */
  MESSAGE_0046,
  /** `既存の情報をすべて削除してコピーを行います。よろしいですか？`; */
  MESSAGE_0047,
  /** `登録対象がありません。`; */
  MESSAGE_0048,
  /** `別のスタッフに指名が登録されています。指名の変更を行いますか？`; */
  MESSAGE_0049,
  /** `登録してもよろしいですか？`; */
  MESSAGE_0050,
  /** `既に登録されている期間と重複します。`; */
  MESSAGE_0051,
  /** `選択した利用者を次月に繰り越しますか？`; */
  MESSAGE_0052,
  /** `選択した利用者の繰り越しを解除しますか？ */
  MESSAGE_0053,
  /** 利用者が重複しています。 */
  MESSAGE_0054,
  /** 総費用額と利用者負担額の整合を取ってください。 */
  MESSAGE_0055,
  /** 請求確定済または上限額管理済の利用者がいます。 */
  MESSAGE_0056,
  /** 既に同じ${arg1}が登録されています。 */
  MESSAGE_0057,
  /** 編集中の内容が存在します。登録しますか？ */
  MESSAGE_0058,
  /** ${arg1}が${arg2}を超えています */
  MESSAGE_0059,
  /** 該当する${arg1}がありません */
  MESSAGE_0060,
  /** ${arg1}が${arg2}と一致しません */
  MESSAGE_0061,
  /** 請求確定および上限額管理の情報がクリアされますが登録しますか？ */
  MESSAGE_0062,
  /** 入力に誤りがあります */
  MESSAGE_0063,
  /** 選択された${arg1}は使用されています。削除しますか？ */
  MESSAGE_0064,
  /** 口座情報が1件も登録されていません。マスター管理>口座情報画面にて口座情報を登録してください。 */
  MESSAGE_0065,
  /** ${arg1}を指定してください。 */
  MESSAGE_0066,
  /** 適用先を指定している場合は曜日も指定してください。 */
  MESSAGE_0067,
  /** 生活援助時間がサービス提供時間を超えています。 */
  MESSAGE_0068,
  /** 選択した勤怠報告を承認します。よろしいですか？ */
  MESSAGE_0069,
  /** 選択したサービスの実績を登録済みしますか？ */
  MESSAGE_0070,
  /** ○○○を選択してください。 */
  MESSAGE_0071,
  /** 時間が一致しない内容があります。登録しますか？ */
  MESSAGE_0072,
  /** 基本項目の設定されていない単独の加算項目があります。このまま登録してもよろしいですか？ */
  MESSAGE_0073,
  /** 表示された内容は失われてしまいますが、よろしいですか？ */
  MESSAGE_0074,
  /** ログインユーザー情報が変更されています。再ログインする必要があります。 */
  MESSAGE_0075,
  /** ログアウトします。よろしいですか？ */
  MESSAGE_0076,
  /** ○○○します。よろしいですか？ */
  MESSAGE_0077,
  /** ○○○が入力されていません。 */
  MESSAGE_0078,
  /** ○○○が選択されていません。 */
  MESSAGE_0079,
  /** 請求確定が解除されますがよろしいですか？ */
  MESSAGE_0080,
  /** 請求確定している利用者がいますが削除してもよろしいですか？ */
  MESSAGE_0081,
  /** 対象となるデータが存在しません。 */
  MESSAGE_0082,
  /** `${arg1}を${arg2}しますか？` */
  MESSAGE_0083,
  /** 選択された履歴を削除しますか？ */
  MESSAGE_0084,
  /** 出力対象データがありません。 */
  MESSAGE_0085,
  /** 小数部は0.00、0.25、0.50、0.75のどれかで入力してください。 */
  MESSAGE_0086,
  /** 開始（終了）時間を入力してください */
  MESSAGE_0087,
  /** 新規作成を行います。表示されている計画書の内容を引継ぎますか？ */
  MESSAGE_0088,
  /** ○○は、○○以上○○以内で入力してください。 */
  MESSAGE_0089,
  /** ○○○が登録されていません。 */
  MESSAGE_0090,
  /** 制度またはサービス種類が未選択の場合は検索できません。 */
  MESSAGE_0091,
  /** ○○名を利用者リストに追加しました。 */
  MESSAGE_0092,
  /** 入力した実績はすべて削除した後、予定を実績にコピーします。よろしいですか？ */
  MESSAGE_0093,
  /** 利用者リストに選択済みの利用者をクリアしますか？ */
  MESSAGE_0094,
  /** ○○○を出力できませんでした。 */
  MESSAGE_0095,
  /** ${arg1}は${arg2}までです。 */
  MESSAGE_0096,
  /** ${arg1}が${arg2}を超えていますがよろしいですか？） */
  MESSAGE_0097,
  /** ${arg1}が${arg2}をはみだしています */
  MESSAGE_0098,
  /** ${arg1}が${arg2}です。 */
  MESSAGE_0099,
  /** ${arg1}が重複しています。 */
  MESSAGE_0100,
  /** 所属が未登録です。所属を登録する場合、所属の内容を確認し再度登録してください。 */
  MESSAGE_0102,
};