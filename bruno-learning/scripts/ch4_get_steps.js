// 第4章 4-3「一覧を取得する」：04_GET フォルダと 01 Get Posts を自分で作る手順（1 操作 = 1 スライド）
// 画像は assets/screenshots/ch4/（2026-10-13 に Bruno v4.2.1 の画面を操作して撮影。Send は JSONPlaceholder へ実際に送信）
// 枠の座標は切り出した画像のピクセル座標
const L = require('./lib');
const SHOT13 = '実画面（Bruno v4.2.1、Windows 11、2026-10-13 撮影）';
const SAMPLE = 'samples の 04_GET\\01 Get Posts.yml を開いて Send';

// 左に画像、右に手順と補足
function stepSlide(p, title, img, frames, steps, opt = {}) {
  const s = L.slide(p, title);
  const box = opt.box || { x: 0.45, y: 1.15, w: 8.4, h: 4.75 };
  const R = L.image(s, 'ch4/' + img, box, opt.label || SHOT13, { align: 'left', valign: 'top' });
  frames.forEach(([n, b, o]) => L.hl(p, s, R, n, b, o));
  const sx = opt.sx || 9.05, sw = 12.9 - sx;
  L.steps(s, steps, { x: sx, y: 1.2, w: sw, h: opt.stepsH || 3.3 }, { fontSize: 14, space: 8 });
  if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: sx, y: opt.noteY || 4.5, w: sw, h: opt.noteH || 1.65 }, { fontSize: 12 });
  L.sample(p, s, opt.sample || SAMPLE);
  return s;
}

module.exports = (p) => {
  { // 4-3 全体の流れ
    const s = L.slide(p, '【操作】一覧を取得する：まずリクエストを自分で作る');
    L.text(s, '第4章のリクエストは、配布コレクション bruno-hands-on の中に自分で作ります（配布時点では 04_GET フォルダはありません）。最初の 1 本は、次の 5 枚の手順で作ります。', { x: 0.6, y: 1.15, w: 12.1, h: 0.8 }, { fontSize: 15 });
    L.steps(s, [
      'フォルダを作る：bruno-hands-on を右クリック →「New Folder」（手順 1/5）',
      'フォルダ名 04_GET を入力して Create（手順 2/5）',
      '04_GET を右クリック →「New Request」（手順 3/5）',
      'リクエスト名と URL を入力して Create（手順 4/5）',
      'Send して結果を確認し、Ctrl + S で保存（手順 5/5）',
    ], { x: 0.6, y: 2.05, w: 6.6, h: 3.1 }, { fontSize: 14, space: 9 });
    L.table(s, [
      ['入力する場所', '入力する値'],
      ['Folder Name', { text: '04_GET', code: true }],
      ['Request Name', { text: '01 Get Posts', code: true }],
      ['URL', { text: '{{baseUrl}}/posts', code: true }],
      ['メソッド', 'GET（初期値のまま）'],
    ], { x: 7.5, y: 2.05, w: 5.2 }, { colW: [1.9, 3.3], fontSize: 13, rowH: 0.5 });
    L.callout(p, s, 'warn', '始める前に', '画面右上の環境が JSONPlaceholder になっていることを確認します（演習3-D）。No Environment のままだと {{baseUrl}} が赤字になり、送信に失敗します。', { x: 0.6, y: 5.3, w: 12.1, h: 0.85 }, { fontSize: 13 });
    L.sample(p, s, SAMPLE);
  }
  stepSlide(p, '【手順 1/5】コレクションを右クリック → New Folder', 'g01_col_menu.png',
    [[1, [0, 66, 498, 118]], [2, [444, 202, 832, 256]]],
    ['サイドバーで bruno-hands-on（コレクション名）を右クリック', 'メニューの「New Folder」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 5.6, h: 4.95 }, sx: 6.4, stepsH: 1.5, note: 'すぐ上の「New Request」を押すと、フォルダの外（コレクションの直下）にリクエストができてしまいます。今回は先にフォルダを作ります。', noteY: 2.9, noteH: 1.2 });
  stepSlide(p, '【手順 2/5】フォルダ名 04_GET を入力して Create', 'g02_folder_filled.png',
    [[1, [54, 190, 986, 258]], [2, [842, 322, 986, 382], { pos: 'r' }]],
    ['「New Folder」の画面が開く。Folder Name に 04_GET と入力（半角。0 は数字のゼロ、_ はアンダースコア）', '「Create」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 7.6, h: 3.0 }, sx: 8.35, stepsH: 2.0, note: '名前の先頭の番号（04）は「第4章」の意味です。番号を付けておくと、どの章の演習か分かりやすくなります。', noteY: 3.4, noteH: 1.3,
      label: SHOT13 + '（後ろの画面は暗く表示される）' });
  stepSlide(p, '【手順 3/5】04_GET ができたことを確認 → 右クリック → New Request', 'g04_folder_menu.png',
    [[1, [0, 374, 498, 422]], [2, [444, 452, 782, 506]]],
    ['サイドバーに 04_GET が追加されたことを確認し、04_GET を右クリック', 'メニューの「New Request」をクリック'],
    { box: { x: 0.45, y: 1.15, w: 4.2, h: 4.95 }, sx: 5.0, stepsH: 1.5, noteKind: 'warn', noteTitle: '04_GET の位置に注意', noteY: 2.9, noteH: 1.35,
      note: '04_GET は一番上ではなく、09_TIPS の下（09_Chain の上）に追加されます（作成環境で確認）。見つからないときは、サイドバーを下まで見てください。並び順はこのままで演習に影響はありません。',
      label: '実画面（2026-10-13 撮影、保存場所は隠した）' });
  stepSlide(p, '【手順 4/5】リクエスト名と URL を入力して Create', 'g05_request_filled.png',
    [[1, [54, 370, 986, 438]], [2, [206, 528, 968, 596]], [3, [842, 656, 986, 716], { pos: 'r' }]],
    ['Request Name：01 Get Posts', 'URL：{{baseUrl}}/posts（左のメソッドは GET のまま。Type も HTTP のまま）', '「Create」をクリック → 04_GET の中に 01 Get Posts ができ、タブで開く'],
    { box: { x: 0.45, y: 1.15, w: 6.9, h: 4.85 }, sx: 7.65, stepsH: 2.6, note: '{{baseUrl}} が緑色なら、環境の値が見つかっています。赤色のときは、画面右上で環境 JSONPlaceholder を選びます。{{ }} は半角の波かっこ 2 つずつです。', noteY: 3.95, noteH: 1.55 });
  {
    const s = L.slide(p, '【手順 5/5】Send して結果を確認し、Ctrl + S で保存');
    const R = L.image(s, 'ch4/g06_sent.png', { x: 0.45, y: 1.15, w: 12.4, h: 3.62 }, SHOT13, { align: 'left', valign: 'top' });
    L.hl(p, s, R, 1, [0, 422, 500, 476]); L.hl(p, s, R, 2, [3676, 180, 3808, 248]); L.hl(p, s, R, 3, [3210, 280, 3530, 344]);
    L.steps(s, ['サイドバーの 04_GET の中に 01 Get Posts があることを確認', '「Send」をクリック（または Ctrl + Enter）', '右側に 200 OK と、[ で始まる投稿の一覧が表示される → Ctrl + S で保存'], { x: 0.6, y: 5.1, w: 7.4, h: 1.15 }, { fontSize: 13, space: 4 });
    L.callout(p, s, 'ok', '確認', '200 OK、ボディが [ で始まり { … } が並んでいれば成功です。作ったファイル：bruno-hands-on\\04_GET\\01 Get Posts.yml', { x: 8.2, y: 5.05, w: 4.65, h: 1.2 }, { fontSize: 12 });
    L.sample(p, s, SAMPLE);
  }
};
