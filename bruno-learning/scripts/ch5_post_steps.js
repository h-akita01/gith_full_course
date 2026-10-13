// 第5章 5-5「POST リクエストを作る」：05_POST フォルダと 01 Create Post を自分で作る手順（1 操作 = 1 スライド）
// 画像は assets/screenshots/ch5/n*.png（2026-10-13 に Bruno v4.2.1 の画面を操作して撮影。Send は JSONPlaceholder へ実際に送信）
// 枠の座標は切り出した画像のピクセル座標
const L = require('./lib');
const SHOT13 = '実画面（Bruno v4.2.1、Windows 11、2026-10-13 撮影）';
const SAMPLE = 'samples の 05_POST\\01 Create Post.yml を開いて Send';
const BODY = '{\n  "title": "Bruno 入門",\n  "body": "はじめての POST",\n  "userId": 1\n}';

// 左に画像、右に手順と補足
function stepSlide(p, title, img, frames, steps, opt = {}) {
  const s = L.slide(p, title);
  const box = opt.box || { x: 0.45, y: 1.15, w: 8.4, h: 4.75 };
  const R = L.image(s, 'ch5/' + img, box, opt.label || SHOT13, { align: 'left', valign: 'top' });
  frames.forEach(([n, b, o]) => L.hl(p, s, R, n, b, o));
  const sx = opt.sx || 9.05, sw = 12.9 - sx;
  L.steps(s, steps, { x: sx, y: 1.2, w: sw, h: opt.stepsH || 3.3 }, { fontSize: 14, space: 8 });
  if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: sx, y: opt.noteY || 4.5, w: sw, h: opt.noteH || 1.65 }, { fontSize: 12 });
  L.sample(p, s, opt.sample || SAMPLE);
  return s;
}

module.exports = (p) => {
  { // 5-5 全体の流れ
    const s = L.slide(p, '【操作】POST リクエストを作る：全体の流れ');
    L.text(s, '第4章と同じように、05_POST フォルダとリクエストを自分で作ります（配布時点では 05_POST フォルダはありません）。GET との違いは「メソッドを POST にする」「Body に JSON を入れる」の 2 つです。', { x: 0.6, y: 1.15, w: 12.1, h: 0.8 }, { fontSize: 15 });
    L.steps(s, [
      'bruno-hands-on を右クリック →「New Folder」（手順 1/8）',
      'フォルダ名 05_POST を入力して Create（手順 2/8）',
      '05_POST を右クリック →「New Request」（手順 3/8）',
      'リクエスト名を入力し、メソッドを POST に変える（手順 4/8）',
      'URL を入力して Create（手順 5/8）',
      'Body タブで種類を JSON にする（手順 6/8）',
      'JSON を入力する（手順 7/8）',
      'Send → 201 Created を確認 → Ctrl + S で保存（手順 8/8）',
    ], { x: 0.6, y: 2.05, w: 6.6, h: 3.6 }, { fontSize: 14, space: 6 });
    L.table(s, [
      ['入力する場所', '入力する値'],
      ['Folder Name', { text: '05_POST', code: true }],
      ['Request Name', { text: '01 Create Post', code: true }],
      ['メソッド', { text: 'POST', code: true }],
      ['URL', { text: '{{baseUrl}}/posts', code: true }],
      ['Body の種類', 'JSON'],
    ], { x: 7.5, y: 2.05, w: 5.2 }, { colW: [1.9, 3.3], fontSize: 13, rowH: 0.48 });
    L.callout(p, s, 'warn', '始める前に', '画面右上の環境が JSONPlaceholder になっていることを確認します（演習3-D）。', { x: 7.5, y: 5.1, w: 5.2, h: 0.95 }, { fontSize: 12 });
    L.sample(p, s, SAMPLE);
  }
  stepSlide(p, '【手順 1/8】コレクションを右クリック → New Folder', 'n01_col_menu.png',
    [[1, [0, 66, 500, 118]], [2, [444, 200, 784, 256]]],
    ['サイドバーで bruno-hands-on（コレクション名）を右クリック', 'メニューの「New Folder」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 5.6, h: 4.95 }, sx: 6.4, stepsH: 1.5, note: '04_GET を作ったときと同じ操作です（4-3 の手順 1/5）。04_GET を右クリックすると、04_GET の中にフォルダができてしまうので注意します。', noteY: 2.9, noteH: 1.2 });
  stepSlide(p, '【手順 2/8】フォルダ名 05_POST を入力して Create', 'n02_folder_filled.png',
    [[1, [54, 190, 986, 258]], [2, [842, 322, 986, 382], { pos: 'r' }]],
    ['Folder Name に 05_POST と入力（半角。0 は数字のゼロ、_ はアンダースコア）', '「Create」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 7.6, h: 3.2 }, sx: 8.35, stepsH: 2.0, note: '先頭の 05 は「第5章」の意味です。', noteY: 3.4, noteH: 0.9,
      label: SHOT13 + '（後ろの画面は暗く表示される）' });
  stepSlide(p, '【手順 3/8】05_POST を右クリック → New Request', 'n03_folder_menu.png',
    [[1, [0, 784, 500, 828]], [2, [446, 860, 782, 914]]],
    ['サイドバーに 05_POST が追加されたことを確認し、05_POST を右クリック', 'メニューの「New Request」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 4.6, h: 4.75 }, sx: 5.0, stepsH: 1.5, noteKind: 'warn', noteTitle: '05_POST の位置に注意', noteY: 2.9, noteH: 1.35,
      note: '05_POST は一番上ではなく、09_Chain の下（10_LocalMock の上）に追加されました（作成環境で確認）。見つからないときは、サイドバーを下まで見てください。並び順はこのままで演習に影響はありません。',
      label: '実画面（2026-10-13 撮影）' });
  stepSlide(p, '【手順 4/8】リクエスト名を入力し、メソッドを POST に変える', 'n04_method_menu.png',
    [[1, [54, 370, 986, 438]], [2, [60, 530, 184, 586]], [3, [68, 658, 270, 704], { pos: 'r' }]],
    ['Request Name：01 Create Post', 'URL の左の「GET ▼」をクリック（最初は GET になっている）', '一覧から「POST」をクリック → 左の表示が POST に変わる'],
    { box: { x: 0.45, y: 1.15, w: 5.4, h: 4.75 }, sx: 6.2, stepsH: 2.4, note: 'メソッドは、リクエストを作った後でも、URL の左の表示をクリックして変えられます。', noteY: 3.8, noteH: 1.0 });
  stepSlide(p, '【手順 5/8】URL を入力して Create', 'n05_dialog_filled.png',
    [[1, [54, 524, 986, 596]], [2, [842, 656, 986, 716], { pos: 'r' }]],
    ['URL：{{baseUrl}}/posts（左が POST になっていることを確認）', '「Create」をクリック → 05_POST の中に 01 Create Post ができ、タブで開く'],
    { box: { x: 0.45, y: 1.15, w: 6.9, h: 4.75 }, sx: 7.65, stepsH: 2.0, note: 'URL は 01 Get Posts と同じ /posts です。同じ URL でも、メソッドが GET なら「一覧の取得」、POST なら「新しい投稿の作成」になります。', noteY: 3.4, noteH: 1.5 });
  stepSlide(p, '【手順 6/8】Body タブを開き、種類を JSON にする', 'n07_body_mode_menu.png',
    [[1, [640, 272, 730, 352]], [2, [1830, 282, 1990, 336]], [3, [1646, 592, 1978, 646], { pos: 'l' }]],
    ['リクエスト側の「Body」タブをクリック（最初は No Body ＝ ボディなし）', '右上の「No Body ▼」をクリック', 'RAW の下の「JSON」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 7.9, h: 4.9 }, sx: 8.6, stepsH: 2.6, note: 'GET ではボディを使わなかったので No Body のままでした。POST では作りたいデータをボディに入れて送ります。', noteY: 4.0, noteH: 1.3 });
  {
    const s = L.slide(p, '【手順 7/8】JSON を入力する');
    const R = L.image(s, 'ch5/n08_json_filled.png', { x: 0.45, y: 1.15, w: 7.6, h: 2.4 }, SHOT13, { align: 'left', valign: 'top' });
    L.hl(p, s, R, 1, [1760, 282, 1890, 336]); L.hl(p, s, R, 2, [530, 380, 1300, 590]);
    L.steps(s, ['右上の表示が JSON に変わったことを確認', '下の入力欄に、右の JSON を入力（コピーして貼り付けてもよい）'], { x: 0.6, y: 4.0, w: 7.4, h: 1.0 }, { fontSize: 14, space: 6 });
    L.code(s, BODY, { x: 8.35, y: 1.55, w: 4.5, h: 2.0 }, { fontSize: 15, label: 'コピー用' });
    L.callout(p, s, 'warn', '入力するときの注意', '入力後、最初の { と最後の } がそれぞれ 1 つずつか確認します。キーと文字は "（半角のダブルクォート）で囲み、最後の項目の後ろにカンマを付けません（5-3）。', { x: 8.35, y: 3.85, w: 4.5, h: 1.6 }, { fontSize: 12 });
    L.sample(p, s, SAMPLE);
  }
  {
    const s = L.slide(p, '【手順 8/8】Send → 201 Created を確認 → Ctrl + S で保存');
    const R = L.image(s, 'ch5/n09_sent.png', { x: 0.45, y: 1.15, w: 12.4, h: 2.3 }, SHOT13, { align: 'left', valign: 'top' });
    L.hl(p, s, R, 1, [3670, 176, 3812, 250]); L.hl(p, s, R, 2, [3226, 288, 3524, 338]); L.hl(p, s, R, 3, [2074, 384, 2600, 624]); L.hl(p, s, R, null, [0, 522, 500, 580]);
    L.steps(s, ['「Send」をクリック（または Ctrl + Enter）', '右側に 201 Created（作成された）が出る', '送った内容に "id": 101 が付いて返ってくる → Ctrl + S で保存'], { x: 0.6, y: 3.95, w: 7.4, h: 1.5 }, { fontSize: 14, space: 6 });
    L.callout(p, s, 'ok', '確認', 'サイドバーの 05_POST の中に「POST 01 Create Post」があれば完成です。作ったファイル：bruno-hands-on\\05_POST\\01 Create Post.yml', { x: 8.2, y: 3.9, w: 4.65, h: 1.4 }, { fontSize: 12 });
    L.sample(p, s, SAMPLE);
  }
};
