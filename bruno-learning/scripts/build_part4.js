// 分割単位⑥：第9章（Bruno の便利機能と効率化＋TIPS）
const path = require('path');
const L = require('./lib');
const { C, F, SHOT } = L;

const p = L.newDeck('Bruno ではじめる API 入門（第9章）');
const D = 'https://docs.usebruno.com';
const S9 = require('./ch9_steps')(p);
const CLIV = 'Bruno CLI 4.2.1（@usebruno/cli）で 2026-10-09 に実行して確認（answers/cli-results/）';

L.chapter(p, '第9章', 'Bruno の便利機能と効率化', [
  'フォルダでの整理',
  'アサーション（Assert）とテスト（Tests）',
  'Collection Runner と CLI でまとめて実行する',
  'Git で管理する意味、スクリプトの安全性',
  'TIPS：外部ファイルの値・値の受け渡し・ランダムな値',
], { time: '約 100 分', goals: 'A2, A3, A4, B2' });

{ // 9-2
  const s = L.slide(p, 'この章で扱う機能とエディション条件', { source: 'https://www.usebruno.com/pricing ／ ' + D + '/get-started/bruno-basics/run-a-collection（2026-10-09 確認）と画面表示' });
  L.table(s, [
    ['機能', '無料版', '本教材での扱い'],
    ['フォルダ、Assert、Tests、Script', '使える', '画面で操作'],
    ['Collection Runner（まとめて実行）', '使える', '画面で操作'],
    ['Runner で CSV・JSON ファイルの値を使う（Run with Parameters）', '使えない（画面に UPGRADE と表示）', 'CLI で実行（TIPS）'],
    ['Runner の結果の Download Report', '公式の料金表では Ultimate の機能', '紹介しない（CLI の HTML レポートを使う）'],
    ['CLI（bru コマンド）', '使える（MIT ライセンス）', 'コマンドで操作'],
    ['画面からの Git コミット・履歴（History タブ）', '使えない', '扱わない'],
  ], { x: 0.6, y: 1.25, w: 12.1 }, { colW: [5.4, 3.6, 3.1], fontSize: 13, rowH: 0.6 });
  L.text(s, '※ CLI でのデータファイル実行が無料版で使えることは作成環境で確認しましたが、公式資料での明記は確認できていません。', { x: 0.6, y: 5.6, w: 12.1, h: 0.5 }, { fontSize: 12, color: C.sub });
}
{ // 9-3
  const s = L.slide(p, 'フォルダでリクエストを整理する');
  { const R = L.image(s, 'crop_ch9_folder_menu.png', { x: 0.6, y: 1.2, w: 3.6, h: 4.2 }, SHOT + '　フォルダの右クリックメニュー', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [50,860,500,915]); L.hl(p, s, R, 1, [445,48,790,94]); L.hl(p, s, R, 2, [445,272,790,318]); }
  L.steps(s, ['コレクションを右クリック →「New Folder」で作る', 'フォルダを右クリック →「New Request」で中に作る'], { x: 4.5, y: 1.2, w: 8.2, h: 1.8 }, { fontSize: 16, space: 8 });
  L.bullets(s, ['名前の先頭に番号を付けると、並び順が分かりやすい（例：04_GET、01 Get Posts）', 'フォルダ単位でまとめて実行できる（9-12）', 'フォルダはディスク上でもフォルダになる（フォルダの設定は folder.yml に保存される：公式ドキュメント）'], { x: 4.5, y: 3.2, w: 8.2, h: 2.0 }, { fontSize: 15 });
}
S9.folder();
{ // 9-8
  const s = L.slide(p, 'アサーション（Assert）とは');
  L.text(s, 'アサーションは「レスポンスがこうなっているはず」という条件です。送信するたびに Bruno が自動でチェックします。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 17 });
  L.table(s, [['確認したいこと（第1章 1-16）', 'Assert の書き方の例'], ['ステータスコードが 200', { text: 'res.status   equals   200', code: true }], ['ボディの id が 1', { text: 'res.body.id   equals   1', code: true }], ['title がある', { text: 'res.body.title   isDefined', code: true }]], { x: 0.6, y: 2.1, w: 12.1 }, { colW: [5.0, 7.1], fontSize: 15, rowH: 0.6 });
  L.bullets(s, ['コードを書かずに、表に入力するだけで設定できる', 'res は「レスポンス」、res.body はボディ、res.status はステータスコード'], { x: 0.6, y: 4.75, w: 12.1, h: 1.2 }, { fontSize: 15 });
}
{ // 9-9
  const s = L.slide(p, '【操作】アサーションを確認する（09_Features/01 Assert Example）');
  L.sample(p, s, "samples の 09_Features\\01 Assert Example.yml を開いて Send");
  { const R = L.image(s, 'crop_ch9_assert_tab.png', { x: 0.6, y: 1.2, w: 7.0, h: 2.05 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [648,115,740,172]); L.hl(p, s, R, 2, [10,268,340,338]); L.hl(p, s, R, 3, [340,268,580,338]); L.hl(p, s, R, 4, [580,268,997,338]); }
  L.steps(s, ['09_Features → 01 Assert Example を開き「Assert」タブ（配布済みで 3 行入っている）', 'Expr：調べる場所（res.status・res.body.id・res.body.title）', 'Operator：比べ方（equals・isDefined）', 'Value：期待する値（200・1。isDefined は空）', '9-8 の表と同じ 3 行であることを確かめて Send'], { x: 7.9, y: 1.2, w: 4.8, h: 3.6 }, { fontSize: 14, space: 8 });
  L.callout(p, s, 'hint', null, 'Operator には equals 以外に、contains（含む）、isDefined（ある）、gt（より大きい）などがあります。ファイル上では equals は eq と保存されます。', { x: 0.6, y: 3.6, w: 7.0, h: 1.1 }, { fontSize: 13 });
}
S9.assert();
{ // 9-10
  const s = L.slide(p, '結果を確認する（成功と失敗）');
  L.text(s, 'レスポンス側の「Tests」タブに結果が表示されます。', { x: 0.6, y: 1.15, w: 12.1, h: 0.4 }, { fontSize: 16 });
  { const R = L.image(s, 'crop_ch9_assert_pass.png', { x: 0.6, y: 1.7, w: 6.0, h: 1.4 }, 'すべて成功（Passed: 3）', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [445,5,530,66]); L.hl(p, s, R, null, [5,105,520,160]); }
  { const R = L.image(s, 'crop_ch9_assert_fail.png', { x: 6.8, y: 1.7, w: 5.9, h: 1.4 }, 'わざと Value を 2 に変えた例（Failed: 1）', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [445,5,530,66]); L.hl(p, s, R, null, [40,228,380,305]); }
  L.text(s, SHOT, { x: 0.6, y: 3.45, w: 8, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'ok', '練習', '値をわざと間違えて、失敗の表示を確かめてみましょう。確かめたら元に戻して保存します。', { x: 0.6, y: 3.9, w: 12.1, h: 0.85 }, { fontSize: 15 });
}
{ // 9-11
  const s = L.slide(p, 'テストスクリプト（Tests タブ）', { source: D + '/testing/tests/introduction' });
  L.sample(p, s, "samples の 09_Features\\02 Test Script Example.yml を開いて Send");
  L.code(s, 'test("ステータスコードが 200 である", function () {\n  expect(res.getStatus()).to.equal(200);\n});\n\ntest("id が 1 である", function () {\n  const data = res.getBody();\n  expect(data.id).to.equal(1);\n});', { x: 0.6, y: 1.3, w: 6.9, h: 3.0 }, { fontSize: 14, label: '09_Features/02 Test Script Example の Tests タブ' });
  L.table(s, [['書き方', '意味'], ['test("名前", function () { … })', 'テストを 1 つ定義する'], ['res.getStatus()', 'ステータスコードを取り出す'], ['res.getBody()', 'ボディを取り出す'], ['expect(A).to.equal(B)', 'A が B と等しいことを確かめる']], { x: 7.8, y: 1.3, w: 4.9 }, { colW: [2.6, 2.3], fontSize: 12, rowH: 0.55 });
  { const R = L.image(s, 'crop_ch9_tests_results.png', { x: 0.6, y: 4.65, w: 6.9, h: 1.3 }, SHOT + '　結果（Passed: 2）', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [445,5,530,66]); }
}
S9.tests();
{ // 9-12
  const s = L.slide(p, '【操作】Collection Runner でまとめて実行する', { source: D + '/get-started/bruno-basics/run-a-collection' });
  L.sample(p, s, "samples の 09_Features フォルダを右クリック → Run");
  L.steps(s, ['フォルダ（例：09_Features）を右クリック →「Run」', 'Collection Runner の画面で「Run」をクリック'], { x: 0.6, y: 1.2, w: 5.2, h: 1.2 }, { fontSize: 15 });
  { const R = L.image(s, 'crop_ch9_runner_dialog.png', { x: 6.0, y: 1.2, w: 4.0, h: 4.7 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [854,1160,966,1220]); L.hl(p, s, R, null, [30,762,450,805]); }
  L.table(s, [['項目', '意味'], ['Run', 'このフォルダ内のリクエストだけ'], ['Recursive Run', 'サブフォルダも含めて全部'], ['Delay', 'リクエストの間の待ち時間'], ['Run with Parameters', '🔒 無料版では使えない（UPGRADE）']], { x: 0.6, y: 2.6, w: 5.2 }, { colW: [2.0, 3.2], fontSize: 12, rowH: 0.5 });
  L.callout(p, s, 'hint', null, 'コレクションを右クリック →「Run」なら、コレクション全体を実行できます。', { x: 0.6, y: 5.4, w: 5.2, h: 0.8 }, { fontSize: 12 });
}
{ // 9-13
  const s = L.slide(p, 'Runner の結果を見る');
  L.image(s, 'crop_ch9_runner_result.png', { x: 0.6, y: 1.2, w: 12.1, h: 2.65 }, SHOT, { align: 'left', valign: 'top' });
  L.bullets(s, ['上部の Filter：All・Passed・Failed・Skipped の件数', '各リクエストのステータスと、アサーション・テストの結果', 'ステータスコード（200 - OK など）をクリックするとレスポンスを確認できる', '「Run Again」で再実行。実行順はサイドバーの並び順（作成環境で確認）'], { x: 0.6, y: 4.15, w: 12.1, h: 2.0 }, { fontSize: 15 });
}
S9.runner();
{ // 9-14
  const s = L.slide(p, 'CLI（コマンドでの実行）とは・インストール', { source: D + '/bru-cli/installation ／ ' + D + '/bru-cli/overview' });
  L.text(s, 'CLI（Command Line Interface）は、画面を使わずにコマンドで操作する方法です。Bruno CLI を使うと、コレクションを bru コマンドで実行できます。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 16 });
  L.steps(s, ['Node.js（LTS 版）を https://nodejs.org/ からインストールする', 'ターミナルで次のコマンドを実行する', 'bru --version でバージョン（4.2.1）が表示されれば完了'], { x: 0.6, y: 2.1, w: 12.1, h: 1.4 }, { fontSize: 15 });
  L.code(s, 'npm install -g @usebruno/cli\nbru --version', { x: 0.6, y: 3.6, w: 6.5, h: 0.95 }, { fontSize: 16 });
  L.callout(p, s, 'warn', '検証状況', '作成環境では、PC 全体へのインストール（-g）は行わず、作業用フォルダにインストールして bru 4.2.1 の動作を確認しました。会社の PC ではインストールの可否を確認してください。', { x: 0.6, y: 4.8, w: 12.1, h: 1.1 }, { fontSize: 13 });
}
S9.cli();
{ // 9-15
  const s = L.slide(p, '【操作】CLI でフォルダを実行する', { source: CLIV });
  L.sample(p, s, "samples フォルダで bru run 09_Features --env JSONPlaceholder を実行しても同じ結果になります");
  L.steps(s, ['ターミナルで bruno-hands-on フォルダに移動する（opencollection.yml がある場所）', '次のコマンドを実行する'], { x: 0.6, y: 1.2, w: 12.1, h: 0.9 }, { fontSize: 15 });
  L.code(s, 'cd $env:USERPROFILE\\Documents\\bruno-learning\\exercises\\bruno-hands-on\nbru run 09_Features --env JSONPlaceholder', { x: 0.6, y: 2.15, w: 7.5, h: 0.85 }, { fontSize: 14 });
  L.code(s, '09_Features\\01 Assert Example (200 OK) - 83 ms\nAssertions\n   ✓ res.status: eq 200\n   ✓ res.body.id: eq 1\n   ✓ res.body.title: isDefined\n09_Features\\02 Test Script Example (200 OK) - 47 ms\nTests\n   ✓ ステータスコードが 200 である\n   ✓ id が 1 である\n…\nStatus    ✓ PASS   Requests 4 (4 Passed)', { x: 0.6, y: 3.25, w: 7.5, h: 3.0 }, { fontSize: 12, label: '実行結果（一部。2026-10-09 実行）' });
  L.table(s, [['オプション', '意味'], ['--env 名前', '使う環境'], ['-r', 'サブフォルダも実行'], ['フォルダ名を省略', 'コレクション全体']], { x: 8.4, y: 2.15, w: 4.3 }, { colW: [1.9, 2.4], fontSize: 13, rowH: 0.5 });
  L.text(s, '※ cd の行は PowerShell（Windows のターミナルの初期設定）の書き方で、配布フォルダを「ドキュメント」に置いた場合の例です。置き場所が違うときはパスを合わせてください。', { x: 8.4, y: 4.4, w: 4.3, h: 1.4 }, { fontSize: 12, color: C.sub });
}
{ // 9-16
  const s = L.slide(p, 'CLI のレポート出力（HTML）', { source: CLIV + ' ／ ' + D + '/bru-cli/run/options' });
  L.code(s, 'bru run -r --env JSONPlaceholder --reporter-html report.html', { x: 0.6, y: 1.25, w: 12.1, h: 0.6 }, { fontSize: 15, valign: 'middle' });
  L.image(s, 'ch9/report_html.png', { x: 0.6, y: 2.05, w: 7.2, h: 4.3 }, 'できた report.html をブラウザで開いたところ（2026-10-09 撮影）', { align: 'left', valign: 'top' });
  L.bullets(s, ['実行日時・環境・件数・成功／失敗がまとめて見られる', 'Requests タブで 1 件ずつの結果を確認できる', 'ファイルなので、結果の記録や共有に使える', '--reporter-json、--reporter-junit も使える'], { x: 8.1, y: 2.05, w: 4.6, h: 3.5 }, { fontSize: 14 });
}
{ // 9-17
  const s = L.slide(p, 'Git で管理する意味（考え方）', { source: D + '/git-integration/overview' });
  L.text(s, 'Bruno のコレクションはテキストファイルの集まりなので、Git（ファイルの変更履歴を記録・共有するツール）で管理しやすくなっています。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 16 });
  L.table(s, [['できること', '例'], ['変更履歴が残る', '「いつ、誰が、どのリクエストを変えたか」が分かる'], ['差分（変更点）が読める', 'リクエストの YAML を比べて、URL やボディの変更が分かる'], ['チームで共有できる', '同じリポジトリから同じコレクションを使える']], { x: 0.6, y: 2.1, w: 12.1 }, { colW: [3.6, 8.5], fontSize: 15, rowH: 0.6 });
  L.callout(p, s, 'warn', null, 'Secret の値はファイルに保存されないため Git には入りません。コレクション作成時に .gitignore（Git で管理しないファイルの一覧）も自動で作られます。この研修では Git の操作は行いません。', { x: 0.6, y: 4.75, w: 12.1, h: 1.1 }, { fontSize: 14 });
}
{ // 9-18
  const s = L.slide(p, 'スクリプト実行の安全性（JavaScript Sandbox）', { source: D + '/get-started/configure/javascript-sandbox' });
  L.image(s, 'crop_ch9_sandbox.png', { x: 0.6, y: 1.2, w: 5.6, h: 3.0 }, SHOT + '　画面右上の盾のアイコン', { align: 'left', valign: 'top' });
  L.table(s, [['モード', '内容'], ['Safe Mode（Recommended、初期値）', 'スクリプトは安全な環境で動き、PC のファイルやコマンドにはアクセスできない'], ['Developer Mode', 'ファイルやコマンドにアクセスできる。作成者を信頼できるコレクションだけで使う']], { x: 6.5, y: 1.2, w: 6.2 }, { colW: [2.3, 3.9], fontSize: 13, rowH: 0.9 });
  L.callout(p, s, 'ok', null, 'この教材のスクリプトは、すべて Safe Mode のままで動きます（作成環境で確認）。', { x: 0.6, y: 4.6, w: 12.1, h: 0.75 }, { fontSize: 15 });
}

// ---------------- TIPS ----------------
{ // 9-T1
  const s = L.slide(p, 'TIPS：4 つの便利な使い方', { tag: 'TIPS' });
  L.table(s, [['TIPS', '内容', '無料版での方法', '確認状況'], ['T2', '外部の CSV ファイルの値で繰り返し実行', 'CLI', 'CLI で実行して確認'], ['T3', '外部の JSON ファイルの値で繰り返し実行', 'CLI', 'CLI で実行して確認'], ['T4', '取得した値を、次のリクエストで送信', '画面・CLI', '画面と CLI で確認'], ['T5', 'ランダムな値を作って送信', '画面・CLI', '画面と CLI で確認']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 5.6, 2.2, 3.3], fontSize: 15, rowH: 0.6 });
  L.callout(p, s, 'paid', null, '画面の Collection Runner で CSV・JSON を使う機能（Run with Parameters）は Pro / Ultimate 版の機能です。この教材では CLI の --csv-file-path / --json-file-path を使います。', { x: 0.6, y: 4.6, w: 12.1, h: 1.0 }, { fontSize: 14 });
}
S9.tipsUi();
{ // 9-T2
  const s = L.slide(p, 'TIPS：外部の CSV ファイルの値で繰り返し実行する', { tag: 'TIPS', source: CLIV + ' ／ ' + D + '/testing/automate-test/data-driven-testing' });
  L.sample(p, s, "samples の 09_TIPS\\01 Create Post from Data File.yml を CLI で実行（次のスライドからの手順）");
  L.code(s, 'title,body,userId\nCSV から作成 1,CSV の 1 行目,1\nCSV から作成 2,CSV の 2 行目,2\nCSV から作成 3,CSV の 3 行目,3', { x: 0.6, y: 1.5, w: 5.6, h: 1.4 }, { fontSize: 13, label: 'exercises\\tips\\tips-posts.csv（1 行目が列名）' });
  L.code(s, '{\n  "title": "{{title}}",\n  "body": "{{body}}",\n  "userId": {{userId}}\n}', { x: 6.5, y: 1.5, w: 6.2, h: 1.4 }, { fontSize: 13, label: '09_TIPS/01 Create Post from Data File の Body' });
  L.code(s, 'bru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --csv-file-path ../tips/tips-posts.csv', { x: 0.6, y: 3.3, w: 12.1, h: 0.6 }, { fontSize: 12, valign: 'middle', label: 'bruno-hands-on フォルダで実行' });
  L.code(s, 'Iteration: 1 … (201 Created)  ✓ res.status: eq 201  ✓ res.body.title: eq {{title}}\nIteration: 2 … (201 Created)  ✓ …\nIteration: 3 … (201 Created)  ✓ …', { x: 0.6, y: 4.3, w: 12.1, h: 1.0 }, { fontSize: 12, label: '結果（要約）：3 行分、3 回実行された' });
  L.text(s, '列名（title など）を {{列名}} と書くと、1 回ごとにその行の値に置き換わります。', { x: 0.6, y: 5.5, w: 12.1, h: 0.45 }, { fontSize: 14 });
}
S9.tipsCsv();
{ // 9-T3
  const s = L.slide(p, 'TIPS：外部の JSON ファイルの値で繰り返し実行する', { tag: 'TIPS', source: CLIV });
  L.sample(p, s, "samples の 09_TIPS\\01 Create Post from Data File.yml を --json-file-path 付きで実行");
  L.code(s, '[\n  { "title": "JSON から作成 1", "body": "JSON の 1 件目", "userId": 1 },\n  { "title": "JSON から作成 2", "body": "JSON の 2 件目", "userId": 2 }\n]', { x: 0.6, y: 1.5, w: 12.1, h: 1.4 }, { fontSize: 13, label: 'exercises\\tips\\tips-posts.json（配列の 1 要素 = 1 回分）' });
  L.code(s, 'bru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --json-file-path ../tips/tips-posts.json', { x: 0.6, y: 3.3, w: 12.1, h: 0.6 }, { fontSize: 12, valign: 'middle', label: 'リクエストは T2 と同じものを使う' });
  L.table(s, [['Iteration', 'Status', 'Assertions'], ['#1', '✓ PASS', '2/2'], ['#2', '✓ PASS', '2/2'], ['TOTAL', '✓ PASS', '4/4']], { x: 0.6, y: 4.3, w: 6.0 }, { colW: [2.0, 2.0, 2.0], fontSize: 13, rowH: 0.4 });
  L.callout(p, s, 'hint', 'CSV と JSON の使い分け', 'CSV は表計算ソフトで作りやすい。JSON は数値・真偽値・入れ子などの型をそのまま書ける。', { x: 6.9, y: 4.3, w: 5.8, h: 1.4 }, { fontSize: 13 });
}
S9.tipsJson();
{ // 9-T4
  const s = L.slide(p, 'TIPS：取得した値を、次のリクエストで送信する', { tag: 'TIPS', source: D + '/variables/runtime-variables ／ 画面と CLI で 2026-10-09 に確認' });
  L.sample(p, s, "samples の 09_Features\\03 → 04 の順に開いて Send");
  { const R = L.image(s, 'crop_ch9_script_tab.png', { x: 0.6, y: 1.2, w: 6.8, h: 1.9 }, '① 09_Features/03 Save First Post Id の Script > Post Response', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [558,115,654,172]); L.hl(p, s, R, null, [190,207,418,270]); L.hl(p, s, R, 1, [85,335,750,375]); }
  { const R = L.image(s, 'crop_ch9_use_saved_url.png', { x: 0.6, y: 3.6, w: 5.0, h: 0.5 }, '② 04 Use Saved Id の URL', { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [318,25,500,68]); }
  { const R = L.image(s, 'crop_ch9_use_saved_timeline.png', { x: 0.6, y: 4.6, w: 6.8, h: 0.8 }, '③ Timeline：実際には /posts/11 に送られた', { align: 'left', valign: 'top' }); L.hl(p, s, R, 3, [265,105,840,165]); }
  L.steps(s, ['1 つ目のレスポンスを受け取った後（Post Response）に、bru.setVar("firstPostId", res.body[0].id); で値を保存', '2 つ目の URL で {{firstPostId}} を使う', '1 つ目 → 2 つ目の順に送る（または Runner で 09_Features を実行）'], { x: 7.7, y: 1.2, w: 5.0, h: 3.6 }, { fontSize: 13, space: 8 });
  L.callout(p, s, 'warn', null, 'bru.setVar の値（Runtime 変数）はアプリを閉じると消えます。2 つ目だけを先に送ると {{firstPostId}} が置き換わりません。', { x: 7.7, y: 4.9, w: 5.0, h: 1.2 }, { fontSize: 12 });
}
S9.tipsChain();
S9.tipsChain2();
{ // 9-T5
  const s = L.slide(p, 'TIPS：ランダムな値を作って送信する', { tag: 'TIPS', source: D + '/testing/script/dynamic-variables ／ 画面と CLI で 2026-10-09 に確認' });
  L.sample(p, s, "samples の 09_TIPS\\02 Create Post with Random Values.yml を開いて Send");
  { const R = L.image(s, 'crop_ch9_random_body.png', { x: 0.6, y: 1.2, w: 6.4, h: 1.6 }, '09_TIPS/02 Create Post with Random Values の Body', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [120,255,990,335]); }
  L.image(s, 'crop_ch9_random_resp.png', { x: 0.6, y: 3.15, w: 6.4, h: 1.3 }, '1 回目の送信結果', { align: 'left', valign: 'top' });
  L.image(s, 'crop_ch9_random_resp2.png', { x: 0.6, y: 4.75, w: 6.4, h: 1.2 }, '2 回目の送信結果（値が変わる）', { align: 'left', valign: 'top' });
  L.table(s, [['書き方（動的変数）', '生成される値の例'], [{ text: '{{$randomFirstName}}', code: true }, '名（英語）'], [{ text: '{{$randomEmail}}', code: true }, 'メールアドレス'], [{ text: '{{$randomInt}}', code: true }, '整数'], [{ text: '{{$randomUUID}}', code: true }, 'UUID（一意な ID）'], [{ text: '{{$timestamp}}', code: true }, '現在時刻（秒）']], { x: 7.3, y: 1.2, w: 5.4 }, { colW: [2.9, 2.5], fontSize: 12, rowH: 0.45 });
  L.text(s, '大文字・小文字を区別します。スクリプトの中では bru.interpolate("{{$randomEmail}}") で使えます（公式ドキュメント）。', { x: 7.3, y: 4.2, w: 5.4, h: 1.0 }, { fontSize: 13 });
}
S9.tipsRandom();
S9.tipsRandom3();
{ // 9-T6
  const s = L.slide(p, 'TIPS を使うときの注意', { tag: 'TIPS' });
  L.bullets(s, ['JSONPlaceholder では、繰り返し POST してもデータは保存されない（確認できるのはレスポンスだけ）', '練習用 API に大量の繰り返し実行をしない（必要な回数だけにする）', 'ランダムな値は毎回変わるため、テストが失敗したときは送った値を記録しておく（Timeline で確認できる）', 'CSV・JSON の列名（キー名）と {{ }} の名前は、大文字・小文字まで一致させる', 'データファイルのパスは、コマンドを実行するフォルダからの相対パスで指定する'], { x: 0.6, y: 1.3, w: 12.1, h: 4.5 }, { fontSize: 16, space: 12 });
}
{ // 9-まとめ
  const s = L.slide(p, '第9章のまとめ');
  L.bullets(s, ['フォルダと名前の番号でリクエストを整理する', 'Assert（表で設定）と Tests（コード）で結果を自動チェックする', 'Collection Runner（画面）と bru run（CLI）でまとめて実行する', 'CSV・JSON ファイルの値で実行するなら、無料版は CLI を使う', 'bru.setVar で値を受け渡し、{{$randomEmail}} などでランダムな値を送れる'], { x: 0.6, y: 1.3, w: 12.1, h: 4.2 }, { fontSize: 18, space: 12 });
}

const out = path.join(L.ROOT, 'slides', process.env.OUT_NAME || 'part04_ch09.pptx');
console.log('fit:', L.fitSamples(p).join(' '));
p.writeFile({ fileName: out }).then(f => console.log('wrote', f));
