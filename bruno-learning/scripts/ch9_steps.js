// 第9章の詳細手順スライド（1 操作 = 1 スライド）。画像は全画面キャプチャ（3840x2064）、枠はその画素座標×（1/1.92 = 表示座標）で指定
const L = require('./lib');
const { C, F, SHOT } = L;
const K = 1.92;
const fs = require('fs');
const { execSync } = require('child_process');
const ZOOM = require('./ch9_zoom'); // 表示座標（2000 幅）→ 画素
const px = (b) => b.map(v => Math.round(v * K));

// 1 手順スライド：左に画像（大）、右に手順と補足
function stepSlide(p, title, img, frames, steps, opt = {}) {
  const s = L.slide(p, title, { tag: opt.tag });
  const base = require('path').basename(img), Z = ZOOM[base];
  let file = img, fr = frames, off = [0, 0];
  if (Z) {
    const out = 'zoom_' + base;
    const dst = require('path').join(L.ROOT, 'assets', 'screenshots', out);
    const src = require('path').join(L.ROOT, 'assets', 'screenshots', img);
    if (!fs.existsSync(dst) || fs.statSync(dst).mtimeMs < fs.statSync(src).mtimeMs || process.env.REZOOM) {
      const c = Z.crop.map(v => Math.round(v * K));
      execSync('powershell -NoProfile -ExecutionPolicy Bypass -File "' + require('path').join(__dirname, 'crop.ps1') + '" "' + src + '" "' + dst + '" ' + c[0] + ' ' + c[1] + ' ' + (c[2] - c[0]) + ' ' + (c[3] - c[1]) + ' 1');
    }
    file = out; fr = Z.frames; off = Z.crop;
  }
  const R = L.image(s, file, { x: 0.45, y: 1.15, w: 8.4, h: 4.75 }, opt.label || SHOT, { align: 'left', valign: 'top' });
  fr.forEach(([n, b, o]) => L.hl(p, s, R, n, px([b[0] - off[0], b[1] - off[1], b[2] - off[0], b[3] - off[1]]), o));
  L.steps(s, steps, { x: 9.05, y: 1.2, w: 3.85, h: 3.6 }, { fontSize: 14, space: 8 });
  if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: 9.05, y: 4.6, w: 3.85, h: 1.55 }, { fontSize: 12 });
  if (opt.sample) L.sample(p, s, opt.sample);
  return s;
}
const SH = (f) => 'ch9b/' + f;
const SHOT13 = SHOT.replace(/\d{4}-\d{2}-\d{2}/, '2026-10-13'); // 09_Chain・09_TIPS\03 の画面（ch9c）は 2026-10-13 に配布版コレクションで撮り直した
const SAMPLE = (path) => `samples の ${path} を開いて Send`;

// セクション扉（章内の小見出し）
function section(p, no, title, items) {
  const s = L.slide(p, `${no}　${title}`);
  L.text(s, 'この節で行うこと', { x: 0.6, y: 1.3, w: 12, h: 0.45 }, { fontSize: 18, bold: true, color: C.orange });
  L.steps(s, items, { x: 0.6, y: 1.85, w: 12.1, h: 3.6 }, { fontSize: 18, space: 12 });
  return s;
}

module.exports = (p) => ({
  folder: () => {
    section(p, '9-A', 'フォルダでリクエストを整理する（手順）', ['コレクションにフォルダを作る', 'フォルダの中にリクエストを作る', '作ったリクエストを送信して確認する']);
    stepSlide(p, '【手順 1/3】フォルダを作る：右クリック → New Folder', SH('f01_col_menu.png'),
      [[1, [0, 744, 258, 768]], [2, [240, 262, 436, 282]]],
      ['サイドバーで bruno-hands-on（コレクション名）を右クリック', 'メニューから「New Folder」をクリック'],
      { note: 'メニューの「New Request」はコレクション直下にリクエストを作ります。整理したいときは先にフォルダを作ります。', label: SHOT + '（右クリックメニュー）' });
    stepSlide(p, '【手順 2/3】フォルダ名を入力して Create', SH('f03_folder_filled.png'),
      [[1, [757, 140, 1243, 176]], [2, [1167, 209, 1243, 240]]],
      ['Folder Name に 10_MyFolder と入力', '「Create」をクリック → サイドバーに 10_MyFolder が追加される'],
      { note: '名前の先頭に番号を付けると、並び順が分かりやすくなります。', sample: 'samples の 10_MyFolder フォルダで完成形を確認できます' });
    stepSlide(p, '【手順 3/3】フォルダの中にリクエストを作って送信する', SH('f05_new_request_in_folder.png'),
      [[1, [757, 160, 1243, 190]], [2, [757, 225, 1243, 255]], [3, [1167, 280, 1243, 310]]],
      ['10_MyFolder を右クリック →「New Request」', 'Request Name：My Request', 'URL：{{baseUrl}}/users/1', '「Create」→ 開いたリクエストで Send → 200 OK'],
      { sample: SAMPLE('10_MyFolder\\My Request.yml'), note: '作られたファイル：bruno-hands-on\\10_MyFolder\\My Request.yml（作成環境で確認）' });
  },
  secrets: (no) => {
    section(p, no, '秘密の値（Secret）を登録する（手順）', ['環境の設定画面を開く', 'Secrets タブで名前と値を入力して保存する', 'ファイルに値が書かれないことを確認する']);
    stepSlide(p, '【手順 1/3】環境の設定画面を開く（Ctrl + E）', SH('e01_env_settings.png'),
      [[1, [1833, 48, 1983, 76]], [2, [400, 88, 527, 116]], [3, [530, 168, 596, 195]]],
      ['画面右上の環境名（JSONPlaceholder）を確認', 'Ctrl + E を押す → 「Environments」タブが開く', '左の一覧で JSONPlaceholder を選ぶ。Variables タブに baseUrl がある'],
      { note: '環境の選択メニューの「Configure」からも開けます。' });
    stepSlide(p, '【手順 2/3】Secrets タブで値を入力して Save', SH('e03_secrets_filled.png'),
      [[1, [612, 168, 668, 195]], [2, [560, 252, 840, 282]], [3, [848, 252, 1310, 282]], [4, [533, 332, 596, 363]]],
      ['「Secrets」タブをクリック', 'Name：apiKey（例）', 'Value：dummy-12345（例。本物のキーは使わない）', '「Save」をクリック'],
      { note: '目のアイコンで値の表示・非表示を切り替えられます。', noteKind: 'warn', noteTitle: '練習用の値' });
    {
      const s = L.slide(p, '【手順 3/3】ファイルには値が書かれないことを確認する');
      L.code(s, 'name: JSONPlaceholder\nvariables:\n  - name: baseUrl\n    value: https://jsonplaceholder.typicode.com\n    description: 練習用 API（JSONPlaceholder）の共通部分\n  - secret: true\n    name: apiKey', { x: 0.6, y: 1.55, w: 7.4, h: 2.6 }, { fontSize: 14, label: 'Save 後の environments\\JSONPlaceholder.yml（作成環境で確認）' });
      L.steps(s, ['エクスプローラーで bruno-hands-on\\environments\\JSONPlaceholder.yml をメモ帳で開く', 'apiKey には secret: true と名前だけが書かれ、値（dummy-12345）は書かれていない'], { x: 8.3, y: 1.55, w: 4.4, h: 2.6 }, { fontSize: 14, space: 10 });
      L.callout(p, s, 'ok', null, 'Secret の値は PC の中に暗号化して保存され、コレクションのファイル・エクスポート・Git には入りません（公式ドキュメント：https://docs.usebruno.com/secrets-management/secret-variables）。', { x: 0.6, y: 4.45, w: 12.1, h: 0.95 }, { fontSize: 14 });
      L.callout(p, s, 'warn', '練習のあとは', '登録した apiKey は、Secrets タブの行のごみ箱アイコン → Save で削除しておきましょう。', { x: 0.6, y: 5.5, w: 12.1, h: 0.75 }, { fontSize: 13 });
    }
  },
  assert: () => {
    section(p, '9-B', 'アサーションを自分で作る（手順）', ['Assert タブを開く', 'Expr・Operator・Value を入力する', '保存して送信し、結果を確認する']);
    stepSlide(p, '【手順 1/4】Assert タブを開く', SH('a01_assert_empty.png'),
      [[1, [0, 290, 258, 315]], [2, [608, 192, 660, 214]]],
      ['10_MyFolder → My Request を開く（9-A で作ったもの）', 'リクエスト側の「Assert」タブをクリック → 空の行が 1 行ある'],
      { sample: 'samples の 10_MyFolder\\My Request.yml を開く（アサーション入りの完成形）' });
    stepSlide(p, '【手順 2/4】Expr に res.status と入力', SH('a02_assert_expr.png'),
      [[1, [280, 250, 560, 285]]],
      ['Expr の欄をクリックし、res.status と入力', '入力すると、下に次の空の行が追加される'],
      { note: 'res.status ＝ レスポンスのステータスコード。res.body.name のように書くとボディの値を確認できます。' });
    {
      const s = stepSlide(p, '【手順 3/4】Operator を選び、Value を入力', SH('a03_assert_value.png'), [], [], {});
      L.steps(s, ['Operator は初期値の equals（等しい）のまま', 'Value に 200 と入力', 'Ctrl + S で保存'], { x: 9.05, y: 1.2, w: 3.85, h: 1.8 }, { fontSize: 14, space: 8 });
      L.table(s, [['Operator（画面の表示）', '意味'], ['equals / notEquals', '等しい／等しくない'], ['gt / lt', 'より大きい／小さい'], ['contains', '含む'], ['isDefined', '値がある'], ['isArray', '配列である']], { x: 9.05, y: 3.1, w: 3.85 }, { colW: [1.95, 1.9], fontSize: 11, rowH: 0.42 });
      L.text(s, '一覧は作成環境の画面で確認（全 28 種類）', { x: 9.05, y: 5.7, w: 3.85, h: 0.3 }, { fontSize: 10, color: C.sub });
    }
    stepSlide(p, '【手順 4/4】Send して結果を確認する', SH('a04_assert_result.png'),
      [[1, [1913, 134, 1984, 171]], [2, [1312, 190, 1352, 214]], [3, [1080, 245, 1400, 300]]],
      ['「Send」をクリック', 'レスポンス側の「Tests」タブを開く', '「Assertions (1), Passed: 1」と res.status: eq 200 が緑で表示されれば成功'],
      { sample: SAMPLE('10_MyFolder\\My Request.yml') });
  },
  tests: () => {
    section(p, '9-C', 'テストスクリプトを自分で書く（手順）', ['Tests タブにコードを書く', '保存して送信する', '結果を確認する（失敗も試す）']);
    stepSlide(p, '【手順 1/3】Tests タブにコードを書く', SH('t02_tests_written.png'),
      [[1, [676, 192, 724, 216]], [2, [280, 242, 1040, 322]]],
      ['リクエスト側の「Tests」タブをクリック', '右のコードを入力（コピーして貼り付けてよい）', 'Ctrl + S で保存'],
      { note: 'test("name が Leanne Graham である", function () {\n  const data = res.getBody();\n  expect(data.name).to.equal("Leanne Graham");\n});', noteTitle: '入力するコード' });
    stepSlide(p, '【手順 2/3】Send して結果を確認する', SH('t03_tests_result.png'),
      [[1, [1913, 134, 1984, 171]], [2, [1312, 190, 1352, 214]], [3, [1080, 245, 1500, 300]]],
      ['「Send」をクリック', 'レスポンス側の「Tests」タブを開く', '「Tests (1), Passed: 1」と、テスト名が緑で表示されれば成功'],
      { sample: SAMPLE('10_MyFolder\\My Request.yml') });
    {
      const s = L.slide(p, '【手順 3/3】わざと失敗させて、表示を確かめる');
      L.steps(s, ['コードの "Leanne Graham" を "Taro" に書き換える', 'Send → Tests タブで Failed: 1、テスト名が赤で表示される', '確かめたら "Leanne Graham" に戻して Ctrl + S'], { x: 0.6, y: 1.3, w: 12.1, h: 1.8 }, { fontSize: 16, space: 10 });
      L.image(s, 'crop_ch9_assert_fail.png', { x: 0.6, y: 3.3, w: 6.5, h: 1.6 }, '失敗したときの表示の例（アサーションの場合。テストも同じく赤で表示される）', { align: 'left', valign: 'top' });
      L.callout(p, s, 'hint', null, 'テストが失敗しても、リクエスト自体は送信されています。「期待どおりの結果だったか」を Bruno が判定している、という点がポイントです。', { x: 7.4, y: 3.3, w: 5.3, h: 1.6 }, { fontSize: 13 });
      L.text(s, '※ テストを失敗させた画面は撮影していません（アサーションの失敗画面で代用）。', { x: 0.6, y: 5.5, w: 12, h: 0.4 }, { fontSize: 11, color: C.sub });
    }
  },
  runner: () => {
    section(p, '9-D', 'Collection Runner でまとめて実行する（手順）', ['フォルダを右クリックして Run を選ぶ', 'Runner の設定を確認して実行する', '結果の一覧と、1 件ずつの詳細を確認する']);
    stepSlide(p, '【手順 1/3】フォルダを右クリック → Run', SH('../ch9/r00_folder_menu.png'),
      [[1, [22, 716, 258, 741]], [2, [232, 405, 408, 432]]],
      ['サイドバーで 09_Features を右クリック', 'メニューの「Run」をクリック → Runner タブが開く'],
      { label: SHOT, sample: 'samples の 09_Features フォルダを右クリック → Run でも同じ結果になります' });
    stepSlide(p, '【手順 2/3】設定を確認して Run', SH('../ch9/r01_runner.png'),
      [[1, [752, 110, 1245, 215]], [2, [752, 448, 980, 516]], [3, [1182, 655, 1245, 689]]],
      ['Run（このフォルダだけ）／Recursive Run（サブフォルダも）を確認', 'Run with Parameters は UPGRADE 表示（無料版では使えない）', '一番下の「Run」をクリック'],
      { note: 'Delay は、リクエストとリクエストの間に入れる待ち時間（ミリ秒）です。練習用 API に負荷をかけないよう、必要なら設定します。' });
    stepSlide(p, '【手順 3/3】結果を確認し、1 件ずつ開く', SH('r02_runner_detail.png'),
      [[1, [277, 156, 697, 189]], [2, [510, 225, 568, 242]], [3, [1146, 215, 1984, 300]]],
      ['上の Filter で All・Passed・Failed の件数を確認', '各リクエストの「200 - OK」をクリック', '右側にレスポンス・ヘッダー・Timeline・Tests が表示される'],
      { note: 'Run Again で再実行、Reset で結果を消去します。Download Report は有料版の機能です（公式料金表）。' });
  },
  tipsCsv: () => {
    {
      const s = L.slide(p, '【CSV 手順 1/3】CSV ファイルを用意する', { tag: 'TIPS' });
      L.steps(s, ['メモ帳（または Excel）で、1 行目に列名、2 行目以降に値を書く', '文字コード UTF-8 の CSV として保存（例：exercises\\tips\\tips-posts.csv）'], { x: 0.6, y: 1.3, w: 12.1, h: 1.3 }, { fontSize: 16, space: 10 });
      L.code(s, 'title,body,userId\nCSV から作成 1,CSV の 1 行目,1\nCSV から作成 2,CSV の 2 行目,2\nCSV から作成 3,CSV の 3 行目,3', { x: 0.6, y: 2.9, w: 7.0, h: 1.6 }, { fontSize: 15, label: 'tips-posts.csv（配布ファイル）' });
      L.callout(p, s, 'hint', null, '1 行目の列名（title・body・userId）が、リクエストの中で {{title}} などの変数名になります。値の行の数だけ、リクエストが繰り返し送られます。', { x: 7.9, y: 2.9, w: 4.8, h: 1.6 }, { fontSize: 13 });
      L.sample(p, s, '配布ファイル exercises\\tips\\tips-posts.csv をそのまま使えます');
    }
    {
      const s = L.slide(p, '【CSV 手順 2/3】リクエストのボディで列名を使う', { tag: 'TIPS' });
      L.steps(s, ['09_TIPS → 01 Create Post from Data File を開く', 'Body タブ（JSON）で、値の部分を {{列名}} にする', '数値の列（userId）は " で囲まない'], { x: 0.6, y: 1.3, w: 5.6, h: 2.0 }, { fontSize: 15, space: 9 });
      L.code(s, '{\n  "title": "{{title}}",\n  "body": "{{body}}",\n  "userId": {{userId}}\n}', { x: 6.5, y: 1.3, w: 6.2, h: 2.0 }, { fontSize: 16, label: 'Body（JSON）' });
      L.callout(p, s, 'warn', null, '画面で Send すると、CSV の値がないため {{title}} などは置き換わりません。CSV の値を使う実行は、次の手順の CLI で行います。', { x: 0.6, y: 3.8, w: 12.1, h: 0.9 }, { fontSize: 13 });
      L.sample(p, s, 'samples の 09_TIPS\\01 Create Post from Data File.yml（このボディが入った完成形）');
    }
    {
      const s = L.slide(p, '【CSV 手順 3/3】CLI で CSV を指定して実行する', { tag: 'TIPS' });
      L.steps(s, ['ターミナルで bruno-hands-on フォルダに移動', '次のコマンドを実行（1 行で入力）', '「Iteration: 1〜3」と、それぞれ 201 Created・✓ が表示されれば成功'], { x: 0.6, y: 1.3, w: 12.1, h: 1.5 }, { fontSize: 15, space: 8 });
      L.code(s, 'cd $env:USERPROFILE\\Documents\\bruno-learning\\exercises\\bruno-hands-on\nbru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --csv-file-path ../tips/tips-posts.csv', { x: 0.6, y: 3.0, w: 12.1, h: 0.95 }, { fontSize: 12 });
      L.code(s, 'Iteration: 1\n09_TIPS\\01 Create Post from Data File (201 Created)\n   ✓ res.status: eq 201\n   ✓ res.body.title: eq {{title}}\nIteration: 2 …（同様）\nIteration: 3 …（同様）', { x: 0.6, y: 4.2, w: 7.5, h: 1.9 }, { fontSize: 12, label: '実行結果（2026-10-09、作成環境）' });
      L.text(s, '--csv-file-path の後ろは、コマンドを実行しているフォルダから見た CSV の場所です（../ は 1 つ上のフォルダ）。', { x: 8.4, y: 4.2, w: 4.3, h: 1.6 }, { fontSize: 13 });
      L.sample(p, s, 'samples フォルダで同じコマンドを実行しても同じ結果になります（ログ：answers\\cli-results\\run_tips_csv.txt）');
    }
  },
  tipsJson: () => {
    {
      const s = L.slide(p, '【JSON 手順 1/2】JSON ファイルを用意する', { tag: 'TIPS' });
      L.steps(s, ['[ ] の配列の中に、1 回分ずつ { } を並べる', 'キー名（title など）が {{キー名}} の変数名になる', 'UTF-8 で保存（例：exercises\\tips\\tips-posts.json）'], { x: 0.6, y: 1.3, w: 12.1, h: 1.6 }, { fontSize: 16, space: 8 });
      L.code(s, '[\n  { "title": "JSON から作成 1", "body": "JSON の 1 件目", "userId": 1 },\n  { "title": "JSON から作成 2", "body": "JSON の 2 件目", "userId": 2 }\n]', { x: 0.6, y: 3.1, w: 12.1, h: 1.5 }, { fontSize: 14, label: 'tips-posts.json（配布ファイル）' });
      L.text(s, 'リクエストは CSV と同じ 01 Create Post from Data File を使います（ボディの {{title}} などはそのまま）。', { x: 0.6, y: 4.9, w: 12.1, h: 0.5 }, { fontSize: 14 });
      L.sample(p, s, '配布ファイル exercises\\tips\\tips-posts.json をそのまま使えます');
    }
    {
      const s = L.slide(p, '【JSON 手順 2/2】CLI で JSON を指定して実行する', { tag: 'TIPS' });
      L.code(s, 'bru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --json-file-path ../tips/tips-posts.json', { x: 0.6, y: 1.4, w: 12.1, h: 0.6 }, { fontSize: 12, valign: 'middle', label: 'bruno-hands-on フォルダで実行（CSV との違いは --json-file-path だけ）' });
      L.table(s, [['Iteration', 'Status', 'Assertions'], ['#1', '✓ PASS', '2/2'], ['#2', '✓ PASS', '2/2'], ['TOTAL', '✓ PASS', '4/4']], { x: 0.6, y: 2.4, w: 6.0 }, { colW: [2.0, 2.0, 2.0], fontSize: 14, rowH: 0.45 });
      L.text(s, '実行結果の要約（2026-10-09、作成環境）。配列の要素が 2 つなので 2 回実行された', { x: 0.6, y: 4.3, w: 6.0, h: 0.6 }, { fontSize: 12, color: C.sub });
      L.callout(p, s, 'hint', 'CSV と JSON の使い分け', 'CSV は表計算ソフトで作りやすい。JSON は数値・真偽値・入れ子を型のまま書ける。', { x: 6.9, y: 2.4, w: 5.8, h: 1.4 }, { fontSize: 13 });
      L.sample(p, s, 'samples フォルダで同じコマンドを実行しても同じ結果になります（ログ：answers\\cli-results\\run_tips_json.txt）');
    }
  },
  tipsChain: () => {
    stepSlide(p, '【受け渡し 手順 1/3】1 つ目のリクエストで値を保存する', SH('../ch9/c01_script_tab.png'),
      [[1, [554, 192, 600, 214]], [2, [358, 236, 498, 262]], [3, [280, 262, 1040, 300]]],
      ['09_Features → 03 Save First Post Id（URL：{{baseUrl}}/posts?userId=2）を開き「Script」タブ', '「Post Response」（レスポンスを受け取った後に動く）を選ぶ', 'bru.setVar("firstPostId", res.body[0].id); と書いて Ctrl + S（画面の 1 行目の // で始まる行はメモ（コメント）。書かなくても動く）'],
      { tag: 'TIPS', note: 'res.body[0].id ＝ レスポンスの配列の 1 件目の id。bru.setVar で firstPostId という名前の変数に保存します。', sample: SAMPLE('09_Features\\03 Save First Post Id.yml') });
    stepSlide(p, '【受け渡し 手順 2/3】2 つ目のリクエストで変数を使う', SH('../ch9/c02_use_saved.png'),
      [[1, [278, 135, 600, 172]]],
      ['09_Features → 04 Use Saved Id を開く', 'URL に {{firstPostId}} と書く（{{baseUrl}}/posts/{{firstPostId}}）', 'Ctrl + S で保存'],
      { tag: 'TIPS', note: '変数が赤字の場合は、まだ値が保存されていません（1 つ目を先に送る）。', sample: SAMPLE('09_Features\\04 Use Saved Id.yml') });
    stepSlide(p, '【受け渡し 手順 3/3】1 つ目 → 2 つ目の順に送って確認する', SH('../ch9/c03_use_saved_timeline.png'),
      [[1, [1243, 192, 1300, 214]], [2, [1080, 240, 1530, 270]]],
      ['03 Save First Post Id を Send', '04 Use Saved Id を Send', 'レスポンス側の「Timeline」で、実際の URL が /posts/11 になっていることを確認'],
      { tag: 'TIPS', note: '9-D の Runner で 09_Features を実行すれば、順番どおりに自動で送られます。', sample: 'samples の 09_Features\\03 → 04 の順に開いて Send' });
  },
  tipsChain2: () => {
    {
      const s = L.slide(p, '値の受け渡し：保存の方法と送り先の一覧', { tag: 'TIPS' });
      L.table(s, [['', '方法', '書き方', 'スライド'],
        ['保存', 'Script（Post Response）', 'bru.setVar("userId", res.body.id);', '保存方法1（09_Chain\\01）'],
        ['保存', 'Vars タブ（Post Response）※コード不要', 'Name：postTitle／Expr：res.body.title', '保存方法2（09_Chain\\02）'],
        ['送り先', 'URL のパス', '{{baseUrl}}/users/{{userId}}', '送り先1（09_Chain\\03）'],
        ['送り先', 'Query Parameter', 'userId = {{userId}}', '送り先2（09_Chain\\04）'],
        ['送り先', 'ヘッダー', 'X-User-Name = {{userName}}', '送り先3（09_Chain\\05）'],
        ['送り先', 'Body（JSON）', '"title": "{{postTitle}}"', '送り先4（09_Chain\\06）']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 3.5, 4.3, 3.3], fontSize: 13, rowH: 0.5 });
      L.text(s, '練習用リクエスト：09_Chain フォルダ（01 → 06 の順に送る。01 で userId・userName、02 で postTitle を保存）', { x: 0.6, y: 5.0, w: 12.1, h: 0.45 }, { fontSize: 14 });
      L.text(s, '出典：https://docs.usebruno.com/variables/runtime-variables（"you can use it in headers, query parameters, body, or URL"）／2026-10-09 に画面・CLI で確認', { x: 0.6, y: 5.55, w: 12.1, h: 0.45 }, { fontSize: 11, color: C.sub });
      L.sample(p, s, 'samples の 09_Chain フォルダを右クリック → Run（01〜06 を順番に実行）');
    }
    stepSlide(p, '【保存方法1】Script で値を保存する', SH('../ch9c/c01_save_script.png'), [],
      ['09_Chain → 01 Save by Script（URL：{{baseUrl}}/users/2）を開き「Script」タブ', '「Post Response」（レスポンスを受け取った後に動く）を選ぶ', 'bru.setVar("userId", res.body.id); と bru.setVar("userName", res.body.name); の 2 行を書いて Ctrl + S → Send'],
      { tag: 'TIPS', label: SHOT13, note: 'Send すると、userId に 2、userName に Ervin Howell が保存されます。受け渡し 手順 1/3 の firstPostId と同じ書き方です。', sample: 'samples の 09_Chain\\01 Save by Script.yml を開いて Send' });
    stepSlide(p, '【保存方法2】Vars タブで値を保存する（コード不要）', SH('../ch9c/v02_vars_filled.png'), [],
      ['09_Chain → 02 Save by Vars Tab（URL：{{baseUrl}}/posts/5）を開き「Vars」タブ', '「Post Response」の表で Name：postTitle、Expr：res.body.title と入力して Ctrl + S', 'Send → レスポンスの title（nesciunt quas odio）が postTitle に保存される'],
      { tag: 'TIPS', label: SHOT13, note: 'Script で bru.setVar と書くのと同じ働きを、表への入力だけで行えます。Expr には res.body.〇〇 の形で取り出したい場所を書きます。', sample: 'samples の 09_Chain\\02 Save by Vars Tab.yml を開いて Send' });
    stepSlide(p, '【送り先1】URL のパスに入れて送る', SH('../ch9c/c03_url.png'), [],
      ['09_Chain → 03 Use in URL Path を開く', 'URL に {{userId}} を書く（{{baseUrl}}/users/{{userId}}）', 'Send → userId が 2 なので /users/2 に送られ、id 2（Ervin Howell）が返る'],
      { tag: 'TIPS', label: SHOT13, note: '先に 01 を送って userId を保存しておきます。受け渡し 手順 2/3 の {{firstPostId}} と同じ使い方です。', sample: 'samples の 09_Chain\\01 → 03 の順に .yml を開いて Send' });
    stepSlide(p, '【送り先2】Query Parameter に入れて送る', SH('../ch9c/c04_query.png'), [],
      ['09_Chain → 04 Use in Query を開き「Params」タブ', 'Query の Value に {{userId}} と書く', 'URL が ?userId={{userId}} になる → Send → userId が 2 の投稿（10 件）が返る'],
      { tag: 'TIPS', label: SHOT13, sample: 'samples の 09_Chain\\01 → 04 の順に .yml を開いて Send' });
    stepSlide(p, '【送り先3】ヘッダーに入れて送る', SH('../ch9c/c05_header.png'), [],
      ['09_Chain → 05 Use in Header を開き「Headers」タブ', 'Name：X-User-Name、Value：{{userName}} を入力', 'Send → 実際に送ったヘッダーはレスポンス側の Timeline で確認できる'],
      { tag: 'TIPS', label: SHOT13, note: '作成環境で、X-User-Name: Ervin Howell が送信されたことを確認しました（CLI のテストで確認）。認証トークンを送る Authorization ヘッダーも同じ考え方です。', sample: 'samples の 09_Chain\\01 → 05 の順に .yml を開いて Send' });
    stepSlide(p, '【送り先4】Body（JSON）に入れて送る', SH('../ch9c/c06_body.png'), [],
      ['09_Chain → 06 Use in Body を開き「Body」タブ', '値の部分に {{postTitle}}・{{userName}}・{{userId}} を書く（数値の userId は " で囲まない）', 'Send → レスポンスに保存した値が入って返る（title：nesciunt quas odio、userId：2）'],
      { tag: 'TIPS', label: SHOT13, note: '先に 01・02 を送って値を保存しておきます。変数名が赤字なら、まだ保存されていません。', sample: 'samples の 09_Chain\\01 → 02 → 06 の順に .yml を開いて Send' });
  },
  tipsRandom: () => {
    stepSlide(p, '【ランダム値 手順 1/2】ボディに動的変数を書く', SH('../ch9/t01_random.png'),
      [[1, [278, 135, 1040, 172]], [2, [340, 192, 380, 214]], [3, [280, 236, 1040, 300]]],
      ['09_TIPS → 02 Create Post with Random Values を開く', '「Body」タブ（JSON）を開く', '値に {{$randomFirstName}}・{{$randomEmail}}・{{$randomInt}} などを書いて Ctrl + S'],
      { tag: 'TIPS', note: '$ で始まる名前は Bruno が用意している「動的変数」です。大文字・小文字を区別します。', sample: SAMPLE('09_TIPS\\02 Create Post with Random Values.yml') });
    stepSlide(p, '【ランダム値 手順 2/2】Send を 2 回押して、値が変わることを確認', SH('../ch9/t02_random_again.png'),
      [[1, [1913, 134, 1984, 171]], [2, [1080, 240, 1984, 330]]],
      ['「Send」をクリック', 'レスポンスに、ランダムな名前・メール・番号が入っている', 'もう一度 Send すると、別の値になる'],
      { tag: 'TIPS', note: '送った値は Timeline でも確認できます。テストが失敗したときは送った値を記録しておきましょう。', sample: SAMPLE('09_TIPS\\02 Create Post with Random Values.yml') });
  },
  tipsRandom3: () => {
    stepSlide(p, '【固定＋3桁 1/2】Pre Request で 3 桁の数字を作る', SH('../ch9c/r01_script.png'),
      [],
      ['09_TIPS → 03 Create Post with Fixed Text and 3 Digits を開き「Script」タブ', '「Pre Request」（送信する前に動く）を選ぶ', '次の 1 行を書いて Ctrl + S：bru.setVar("rand3", Math.floor(Math.random() * 900) + 100);（画面の 1 行目の // で始まる行はメモ（コメント）。書かなくても動く）'],
      { tag: 'TIPS', label: SHOT13, note: '{{$randomInt}} は 0〜1000 のため、3 桁にならないことがあります（公式ドキュメント）。必ず 3 桁にしたいときはスクリプトで 100〜999 を作ります。', noteKind: 'warn', noteTitle: 'なぜスクリプト？', sample: 'samples の 09_TIPS\\03 Create Post with Fixed Text and 3 Digits.yml を開いて Send' });
    stepSlide(p, '【固定＋3桁 2/2】固定テキスト＋{{rand3}} を送る', SH('../ch9c/r02_sent.png'),
      [],
      ['「Body」タブ（JSON）を開く', '"title": "テスト投稿-{{rand3}}" のように、固定の文字の後ろに {{rand3}} を書く', 'Send → レスポンスが「テスト投稿-301」のようになる。もう一度 Send すると数字が変わる'],
      { tag: 'TIPS', label: SHOT13, note: '作成環境で 2 回送信：881 → 301（毎回 100〜999 の 3 桁。2026-10-13 撮影）。0 埋めの 000〜999 にしたい場合は String(Math.floor(Math.random() * 1000)).padStart(3, "0") を使います。', sample: 'samples の 09_TIPS\\03 Create Post with Fixed Text and 3 Digits.yml を開いて Send' });
  },
  tipsUi: () => {
    {
      const s = L.slide(p, 'CSV・JSON ファイルの値での実行は、画面（UI）からもできる？', { tag: 'TIPS' });
      const R = L.image(s, SH('../ch9/r01_runner.png'), { x: 0.45, y: 1.15, w: 7.6, h: 4.3 }, SHOT + '　無料版の Collection Runner', { align: 'left', valign: 'top' });
      L.hl(p, s, R, 1, px([752, 448, 980, 472])); L.hl(p, s, R, 2, px([757, 484, 945, 514])); L.hl(p, s, R, 3, px([757, 552, 928, 586]));
      L.table(s, [['', '画面（Runner）', 'CLI（bru run）'], ['無料版', '× ①に UPGRADE と表示され、②のファイル選択は使えない', '○ --csv-file-path / --json-file-path'], ['Pro / Ultimate', '○ ②で CSV・JSON を選んで実行', '○']], { x: 8.3, y: 1.15, w: 4.6 }, { colW: [1.2, 1.9, 1.5], fontSize: 11, rowH: 0.75 });
      L.bullets(s, ['① Run with Parameters：画面からデータファイルを使う設定（有料版）', '② Select CSV or JSON file：ファイルの選択', '③ Iterations：繰り返し回数（作成環境では入力欄も無効表示）'], { x: 8.3, y: 3.7, w: 4.6, h: 1.8 }, { fontSize: 11, space: 4 });
      L.callout(p, s, 'paid', '結論', '画面（UI）からも実行できる機能はありますが、Pro / Ultimate 版の機能です（公式：https://docs.usebruno.com/get-started/bruno-basics/run-a-collection）。無料版では、次のスライドからの CLI の手順で実行します。', { x: 0.45, y: 5.6, w: 12.45, h: 0.85 }, { fontSize: 12 });
    }
  },
  cli: () => {
    section(p, '9-E', 'CLI（コマンド）で実行する（手順）', ['Node.js を用意する', 'Bruno CLI をインストールする', 'ターミナルでコレクションのフォルダに移動して実行する', 'HTML レポートを作る']);
    {
      const s = L.slide(p, '【手順 1/4】Node.js を用意する');
      L.steps(s, ['ブラウザで https://nodejs.org/ を開き、LTS（推奨版）をダウンロードしてインストール', 'スタートボタンを右クリック →「ターミナル」を開く', '次のコマンドで、バージョンが表示されることを確認'], { x: 0.6, y: 1.3, w: 12.1, h: 1.9 }, { fontSize: 16, space: 10 });
      L.code(s, 'node -v\nnpm -v', { x: 0.6, y: 3.4, w: 5.0, h: 0.95 }, { fontSize: 18 });
      L.code(s, 'v24.21.0\n12.2.0', { x: 6.0, y: 3.4, w: 5.0, h: 0.95 }, { fontSize: 18, label: '作成環境での表示（2026-10-09）' });
      L.callout(p, s, 'warn', '検証状況', 'Node.js のインストール手順そのものは、作成環境では実行していません（作成環境には既にインストール済み）。会社の PC ではインストールの可否を確認してください。', { x: 0.6, y: 4.75, w: 12.1, h: 1.0 }, { fontSize: 13 });
      L.sample(p, s, 'CLI を使えない場合は、9-D の Collection Runner（画面）で同じ実行ができます');
    }
    {
      const s = L.slide(p, '【手順 2/4】Bruno CLI をインストールする');
      L.steps(s, ['ターミナルで次のコマンドを実行', '終わったら bru --version を実行し、4.2.1 などのバージョンが表示されれば完了'], { x: 0.6, y: 1.3, w: 12.1, h: 1.2 }, { fontSize: 16, space: 10 });
      L.code(s, 'npm install -g @usebruno/cli\nbru --version', { x: 0.6, y: 2.7, w: 7.0, h: 0.95 }, { fontSize: 18 });
      L.callout(p, s, 'warn', '検証状況', '作成環境では PC 全体へのインストール（-g）は行わず、作業用フォルダにインストールして bru 4.2.1 の動作を確認しました。', { x: 0.6, y: 4.0, w: 12.1, h: 0.9 }, { fontSize: 13 });
      L.text(s, '出典：https://docs.usebruno.com/bru-cli/installation', { x: 0.6, y: 5.1, w: 12, h: 0.4 }, { fontSize: 11, color: C.sub });
      L.sample(p, s, 'CLI を使えない場合は、9-D の Collection Runner（画面）で同じ実行ができます');
    }
  },
});
module.exports.stepSlide = stepSlide;
