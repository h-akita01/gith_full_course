// 分割単位③④：第3章（JSONPlaceholder を使うための準備）＋第4章（GET）＋第5章（POST）
const path = require('path');
const L = require('./lib');
const { C, F, SHOT } = L;

const p = L.newDeck('Bruno ではじめる API 入門（第3〜5章）');
const JP = 'https://jsonplaceholder.typicode.com/（2026-10-09 に確認）';
const JPG = 'https://jsonplaceholder.typicode.com/#guide（2026-10-09 に確認）';
const D = 'https://docs.usebruno.com';
const S3 = require('./ch9_steps')(p); // Secret の手順スライド（旧 9-B）を共用
const S = (f) => 'ch3/../' + f; // 画像はすべて assets/screenshots 直下の crop_*.png

// 2 枚の画像（URL バー＋レスポンス）を縦に並べる共通部品
function urlAndResp(s, urlImg, respImg, box, o = {}) {
  const r1 = L.image(s, urlImg, { x: box.x, y: box.y, w: box.w * 0.62, h: 0.5 }, null, { align: 'left', valign: 'top' });
  const r2 = L.image(s, respImg, { x: box.x, y: box.y + 0.62, w: box.w, h: box.h - 0.9 }, SHOT, { align: 'left', valign: 'top' });
  return [r1, r2];
}

// =========================================================
// 第3章
// =========================================================
L.chapter(p, '第3章', 'JSONPlaceholder を使うための準備', [
  'JSONPlaceholder とは（できること・できないこと）',
  '最初のコレクションとリクエストを作る（演習3-A）',
  '配布コレクションを開く・インポートする（演習3-B・3-C）',
  '環境変数でベース URL を切り替える（演習3-D）・環境と Secret の作り方',
  '共有用ファイルを作る（演習3-E）・つながらないときの対処',
], { time: '50 分', goals: 'B4, B5, B6, B8, A1, A5' });

{ // 3-2
  const s = L.slide(p, 'JSONPlaceholder とは', { source: JPG });
  L.text(s, '練習用に公開されている、無料・登録不要の API です。ブログの投稿・コメント・ユーザーなどのダミーデータを返します。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 18 });
  L.text(s, '"Free for everyone, and it stays that way. No signup, no API key."（公式サイトより）', { x: 0.6, y: 2.0, w: 12.1, h: 0.45 }, { fontSize: 14, italic: true, color: C.sub });
  L.callout(p, s, 'warn', '最重要：書き込みは保存されない', '公式の説明（POST の例）：\n"The resource is not really created on the server, but the response is faked as if."\n＝「サーバー上に本当に作られるのではなく、作られたかのようなレスポンスが返る」\nPUT・PATCH・DELETE も同様に、本当には更新・削除されません。', { x: 0.6, y: 2.65, w: 12.1, h: 1.9 }, { fontSize: 15 });
  L.table(s, [
    ['この教材の演習で確認できること', '確認できないこと'],
    ['リクエストの送り方、レスポンスの読み方、ステータスコード', 'データが本当に保存・変更・削除されること'],
    ['PUT と PATCH のレスポンスの違い', '認証エラー（401）や入力チェックのエラー（400）'],
  ], { x: 0.6, y: 4.75, w: 12.1 }, { colW: [6.05, 6.05], fontSize: 14, rowH: 0.5 });
}
// 3-3 エンドポイントの調べ方（10 枚：scripts/ch3_endpoint.js）
require('./ch3_endpoint')(p);
{ // 3-4
  const s = L.slide(p, 'この教材で使うエンドポイント', { source: JP + '　件数・結果は 2026-10-09 に curl と Bruno で確認' });
  L.table(s, [
    ['メソッドと URL（ホスト部分は省略）', '内容', '使う章'],
    [{ text: 'GET /posts', code: true }, '投稿の一覧（100 件）', '第4章'],
    [{ text: 'GET /posts/1', code: true }, '投稿 1 件（id が 1）', '第4章'],
    [{ text: 'GET /posts?userId=1&id=3', code: true }, '条件で絞り込み（1 件）', '第4章'],
    [{ text: 'GET /posts/1/comments', code: true }, '投稿 1 のコメント（5 件）', '第4章'],
    [{ text: 'POST /posts', code: true }, '投稿の作成（のふり）', '第5章'],
    [{ text: 'PATCH・PUT・DELETE /posts/1', code: true }, '投稿の変更・置き換え・削除（のふり）', '第6〜8章'],
    [{ text: '/users・/todos・/comments', code: true }, '演習問題で使う', '第4〜8章'],
  ], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [5.0, 5.0, 2.1], fontSize: 15, rowH: 0.56 });
}
{ // 3-5
  const s = L.slide(p, '【演習3-A ①】最初のコレクションを作る');
  L.sample(p, s, "samples コレクション（exercises\\samples）を Open Collection で開き、03_Setup\\01 Get Post 1.yml（演習で作る Get Post 1 の完成形）を使って先へ進めます");
  L.steps(s, [
    'サイドバー上部の「＋」（Add new collection）→「Create collection」',
    '名前の入力欄が出たら、右端の歯車（Advanced options）をクリック',
    'Name：My-First-Collection と入力',
    'Location の下の「Browse」で保存先フォルダを選ぶ（例：ドキュメントの bruno-learning）',
    '「Create」をクリック → サイドバーに My-First-Collection が表示される',
  ], { x: 0.6, y: 1.2, w: 5.6, h: 4.6 }, { fontSize: 15, space: 9 });
  { const R = L.image(s, 'crop_ch3_add_menu.png', { x: 6.4, y: 1.2, w: 2.6, h: 1.1 }, '①「＋」のメニュー', { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [398,22,440,62]); L.hl(p, s, R, null, [125,100,440,145]); }
  const r = L.image(s, 'crop_ch3_create_dialog.png', { x: 6.4, y: 2.75, w: 6.3, h: 3.15 }, SHOT + '（保存先のパスはマスク）', { align: 'left', valign: 'top' }); { const R = r; L.hl(p, s, R, 3, [35,171,965,237]); L.hl(p, s, R, 4, [33,398,128,432]); L.hl(p, s, R, 5, [822,660,966,720]); }
  L.mask(s, r, 20, 162, 478, 190, '（選んだ保存先のパスが表示される）', 9);
  L.callout(p, s, 'hint', null, 'Location は直接入力できません。Browse で選びます。File Format は初期値の OpenCollection (YAML) のままで構いません。', { x: 0.6, y: 5.05, w: 5.6, h: 0.9 }, { fontSize: 12 });
}
{ // 3-6
  const s = L.slide(p, '【演習3-A ②】リクエストを作る');
  L.sample(p, s, "samples の 03_Setup\\01 Get Post 1.yml（演習で作る Get Post 1 の完成形）を開いて Send");
  L.steps(s, [
    'サイドバーの My-First-Collection を右クリック →「New Request」',
    'Type：HTTP（初期値のまま）',
    'Request Name：Get Post 1',
    'URL：https://jsonplaceholder.typicode.com/posts/1（左のメソッドは GET のまま）',
    '「Create」をクリック → サイドバーにリクエストが追加される',
  ], { x: 0.6, y: 1.2, w: 5.4, h: 4.3 }, { fontSize: 15, space: 9 });
  { const R = L.image(s, 'crop_ch3_ctx_menu.png', { x: 6.2, y: 1.2, w: 2.4, h: 3.0 }, '① 右クリックメニュー', { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [0,88,498,136]); L.hl(p, s, R, null, [440,170,840,215]); }
  { const R = L.image(s, 'crop_ch3_new_request.png', { x: 8.8, y: 1.2, w: 3.9, h: 2.85 }, '②〜⑤ New Request', { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [33,172,160,206]); L.hl(p, s, R, 3, [35,351,965,416]); L.hl(p, s, R, 4, [35,505,965,571]); L.hl(p, s, R, 5, [822,636,966,695]); }
  L.callout(p, s, 'ok', '確認', 'この方法で作ると、リクエストのファイル（Get Post 1.yml）がすぐにコレクションのフォルダに作られます（作成環境で確認）。', { x: 0.6, y: 5.6, w: 12.1, h: 0.8 }, { fontSize: 14 });
  L.text(s, SHOT, { x: 6.2, y: 4.5, w: 6.5, h: 0.3 }, { fontSize: 10, color: C.sub });
}
{ // 3-7
  const s = L.slide(p, '【演習3-A ③】送信して結果を確認する');
  L.sample(p, s, "samples の 03_Setup\\01 Get Post 1.yml（演習で作る Get Post 1 の完成形）を開いて Send");
  L.steps(s, ['Get Post 1 を開いた状態で「Send」をクリック（または Ctrl + Enter）', '右側のレスポンスで次を確認する'], { x: 0.6, y: 1.2, w: 12.1, h: 0.9 }, { fontSize: 16 });
  L.image(s, 'crop_ch3_sent_url.png', { x: 0.6, y: 2.1, w: 5.6, h: 0.8 }, null, { align: 'left', valign: 'top' }); { const R = L.image(s, 'crop_ch3_sent_send.png', { x: 6.4, y: 2.15, w: 1.7, h: 0.5 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [275,10,408,78]); }
  { const R = L.image(s, 'crop_ch3_sent_resp.png', { x: 0.6, y: 3.05, w: 7.5, h: 2.3 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [1200,12,1455,52]); L.hl(p, s, R, null, [0,100,1740,375]); }
  L.table(s, [['確認する場所', '期待する結果'], ['ステータス', '200 OK（緑色）'], ['ボディ', '"id": 1 の投稿 1 件'], ['応答時間・サイズ', '毎回変わる（292B 前後）']], { x: 8.4, y: 2.1, w: 4.3 }, { colW: [1.8, 2.5], fontSize: 13, rowH: 0.5 });
  L.callout(p, s, 'warn', null, 'エラーが表示されたら、URL の入力ミスとインターネット接続を確認します（3-17）。', { x: 0.6, y: 5.75, w: 12.1, h: 0.7 }, { fontSize: 14 });
}
{ // 3-8
  const s = L.slide(p, '変更の保存（Ctrl + S）と、保存されるファイル');
  L.text(s, '保存していない変更があると、タブにオレンジの点が付き、保存アイコンが色付きになります。', { x: 0.6, y: 1.2, w: 12.1, h: 0.5 }, { fontSize: 16 });
  { const R = L.image(s, 'crop_ch3_unsaved_tab.png', { x: 0.6, y: 1.8, w: 5.2, h: 0.95 }, '未保存の状態（URL を変更した直後）', { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [160,15,200,55]); }
  { const R = L.image(s, 'crop_ch3_unsaved_icons.png', { x: 6.1, y: 1.8, w: 2.4, h: 0.6 }, '右端の保存アイコン', { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [200,25,245,65]); }
  L.steps(s, ['Ctrl + S を押す（または保存アイコンをクリック）', 'オレンジの点が消えれば保存完了'], { x: 0.6, y: 3.15, w: 6.0, h: 1.0 }, { fontSize: 15 });
  L.code(s, 'My-First-Collection\n├─ opencollection.yml   … コレクションの設定\n├─ .gitignore\n└─ Get Post 1.yml       … リクエスト（1 件 = 1 ファイル）', { x: 6.9, y: 3.15, w: 5.8, h: 1.55 }, { fontSize: 13, label: '保存先フォルダの中身（作成環境で確認）' });
  L.callout(p, s, 'hint', null, 'サイドバーの右クリック →「Remove」は、Bruno の一覧から外すだけです。ファイルは削除されず、あとで Open Collection で開き直せます（確認ダイアログに表示されます）。', { x: 0.6, y: 5.0, w: 12.1, h: 1.0 }, { fontSize: 14 });
  L.text(s, SHOT, { x: 0.6, y: 6.15, w: 8, h: 0.3 }, { fontSize: 10, color: C.sub });
}
{ // 3-9
  const s = L.slide(p, '配布ファイルの配置');
  L.steps(s, ['講師から受け取った配布ファイル（zip）を展開する', '展開した bruno-learning フォルダを「ドキュメント」の中に置く'], { x: 0.6, y: 1.2, w: 12.1, h: 0.95 }, { fontSize: 16 });
  L.code(s, 'ドキュメント\\bruno-learning\\\n  exercises\\\n    bruno-hands-on\\       … 第3〜9章の演習用コレクション（演習3-B で開く）\n      environments\\        … 環境 JSONPlaceholder・Local-Mock\n      05_POST\\ 09_Features\\ 09_TIPS\\ …（04_GET・06_PATCH・07_PUT・08_DELETE は各章で自分で作る）\n    import-practice\\\n      import-practice.postman_collection.json   … 演習3-C でインポートする\n    tips\\                   … 第9章 TIPS 用のデータファイル（CSV・JSON）\n    samples\\                … できなかった場合の完成済みリクエスト（次のスライド）', { x: 0.6, y: 2.25, w: 12.1, h: 2.6 }, { fontSize: 13 });
  L.callout(p, s, 'warn', null, 'zip のままでは開けません。必ず展開してから使います。', { x: 0.6, y: 5.05, w: 12.1, h: 0.7 }, { fontSize: 15 });
}
{ // 3-9b
  const s = L.slide(p, '手順どおりにできなかった場合（samples コレクション）');
  L.text(s, '自分でリクエストを作れなかった・設定がうまくいかなかったときは、完成済みのリクエスト（.yml ファイル）を集めた samples コレクションを開いて、そのまま Send すれば先へ進めます。', { x: 0.6, y: 1.15, w: 12.1, h: 0.75 }, { fontSize: 15 });
  L.steps(s, [
    'サイドバー上部の「＋」→「Open collection」→ exercises の中の samples フォルダを選ぶ',
    'サイドバーに samples が表示される。章のフォルダ（04_GET など）を開き、スライドの緑の帯に書かれた .yml（リクエスト）をクリック',
    '画面右上の環境で JSONPlaceholder を選ぶ',
    '「Send」をクリックして結果を確認する',
  ], { x: 0.6, y: 2.0, w: 4.9, h: 4.0 }, { fontSize: 14, space: 9 });
  { const R = L.image(s, 'ch9b/s03_samples_sent.png', { x: 5.7, y: 2.0, w: 7.0, h: 3.8 }, SHOT + '　samples の 04_GET > 01 Get Posts を Send したところ', { align: 'left', valign: 'top' });
    L.hl(p, s, R, null, [0,144,495,1114]); L.hl(p, s, R, 2, [77,303,495,346]); L.hl(p, s, R, 3, [3519,92,3807,146]); L.hl(p, s, R, 4, [3673,257,3809,328]); L.hl(p, s, R, null, [3214,367,3529,413]); }
  L.text(s, 'フォルダ構成：03_Setup（第3章）／04_GET〜08_DELETE（第4〜8章。演習問題の解答 Q1〜 を含む）／09_Features・09_TIPS・09_Chain・10_MyFolder（第9章）／10_Final・10_LocalMock（第10章）', { x: 0.6, y: 6.1, w: 12.1, h: 0.4 }, { fontSize: 12, color: C.sub });
}
{ // 3-10
  const s = L.slide(p, '【演習3-B】配布コレクションを開く（Open Collection）');
  L.sample(p, s, "samples コレクション（exercises\\samples）を開くと、各章のフォルダ（04_GET など）に同じリクエストの .yml があります");
  L.steps(s, [
    'サイドバー上部の「＋」→「Open collection」',
    'フォルダーの選択画面で exercises フォルダを選ぶ',
    '見つかったコレクションの一覧で bruno-hands-on にチェック →「Open」',
    'サイドバーに bruno-hands-on と 05_POST などのフォルダが表示されれば完了（04_GET は第4章で自分で作るので、まだありません）',
  ], { x: 0.6, y: 1.2, w: 5.0, h: 4.4 }, { fontSize: 15, space: 10 });
  { const R = L.image(s, 'crop_ch3_open_dialog.png', { x: 5.8, y: 1.2, w: 4.6, h: 2.2 }, '③ Open Collection', { align: 'left', valign: 'top' }); L.hl(p, s, R, 3, [55,345,330,415]); L.hl(p, s, R, null, [1104,494,1234,554]); }
  { const R = L.image(s, 'ch4/g00_opened_tree.png', { x: 10.6, y: 1.2, w: 2.1, h: 2.7 }, '④（2026-10-13 撮影）', { align: 'left', valign: 'top' }); L.hl(p, s, R, 4, [20,66,498,530]); }
  L.text(s, SHOT, { x: 5.8, y: 4.0, w: 6.9, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'hint', null, 'exercises フォルダを選ぶと、その中にあるコレクションが一覧に表示されます（作成環境で確認）。複数あるときは開きたいものだけチェックします。', { x: 5.8, y: 4.4, w: 6.9, h: 1.2 }, { fontSize: 13 });
}
{ // 3-11
  const s = L.slide(p, '【演習3-C】コレクションをインポートする（Import Collection）');
  L.sample(p, s, "samples の 04_GET\\02 Get Post by ID.yml を開き、環境 JSONPlaceholder を選んで Send（インポートした 02 Get Post by ID と同じリクエスト）");
  L.steps(s, [
    'サイドバー上部の「＋」→「Import collection」',
    'File タブの「choose file(s)」→ exercises\\import-practice\\import-practice.postman_collection.json を選ぶ',
    'Name を確認し、Location の「Browse」で保存先を選ぶ →「Import」',
    'import-practice の Import Practice → 02 Get Post by ID を開いて Send → 200 OK を確認',
  ], { x: 0.6, y: 1.2, w: 5.4, h: 4.4 }, { fontSize: 14, space: 9 });
  { const R = L.image(s, 'crop_ch3_import_dialog.png', { x: 6.2, y: 1.2, w: 3.3, h: 1.6 }, '①② File タブ', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [30,125,132,180]); L.hl(p, s, R, 2, [700,365,885,400]); }
  const r = L.image(s, 'crop_ch3_import_settings.png', { x: 9.7, y: 1.2, w: 3.0, h: 1.75 }, '③（ユーザー名はマスク）', { align: 'left', valign: 'top', pxPerCss: 2 }); { const R = r; L.hl(p, s, R, 3, [33,375,128,407]); L.hl(p, s, R, null, [824,476,966,536]); }
  L.mask(s, r, 20, 152, 478, 178, 'C:\\Users\\<ユーザー名>\\Documents\\bruno', 6);
  { const R = L.image(s, 'crop_ch3_imported_resp.png', { x: 6.2, y: 3.45, w: 6.5, h: 1.55 }, '④ 送信結果', { align: 'left', valign: 'top' }); L.hl(p, s, R, 4, [1190,12,1455,52]); }
  L.text(s, SHOT, { x: 6.2, y: 5.35, w: 6.5, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'hint', null, 'Import Collection は、Postman・Insomnia・OpenAPI などの形式のファイルを、Bruno のコレクション（YAML のファイル群）に変換して保存します。', { x: 0.6, y: 5.75, w: 12.1, h: 0.75 }, { fontSize: 13 });
}
{ // 3-12
  const s = L.slide(p, 'インポートの注意点（作成環境で確認した結果）');
  L.table(s, [
    ['ファイルの種類', 'Import Collection（無料版）での結果', 'どうするか'],
    ['Postman 形式（.json）', 'インポートできた', 'そのまま使える'],
    ['Bruno の ZIP（Share で作ったもの）', '有料版の案内画面（Premium Feature）が表示された', 'ZIP を展開して Open Collection で開く'],
  ], { x: 0.6, y: 1.25, w: 7.6 }, { colW: [2.4, 2.9, 2.3], fontSize: 13, rowH: 0.75 });
  L.image(s, 'crop_ch3_premium_zip.png', { x: 8.5, y: 1.25, w: 4.2, h: 2.1 }, 'ZIP を指定したときの表示（実画面）', { align: 'left', valign: 'top' });
  L.callout(p, s, 'warn', '環境は引き継がれない', 'Postman 形式のファイルには Bruno の環境（Environments）は含まれません。インポート後に必要なら環境を作り直します。\n（練習用ファイルでは、ベース URL をコレクションの変数として入れてあるため、そのまま送信できます）', { x: 0.6, y: 3.9, w: 12.1, h: 1.35 }, { fontSize: 14 });
  L.text(s, '※ ZIP の動作は Bruno v4.2.1 無料版での確認結果です。表示の理由（有料版の機能の判定）は公式資料では確認できていません。', { x: 0.6, y: 5.45, w: 12.1, h: 0.6 }, { fontSize: 12, color: C.sub });
}
{ // 3-13
  const s = L.slide(p, 'ベース URL と環境変数の考え方', { source: D + '/variables/environment-variables' });
  L.text(s, '多くのリクエストで共通する部分（ベース URL）を変数にしておくと、接続先をまとめて切り替えられます。', { x: 0.6, y: 1.2, w: 12.1, h: 0.7 }, { fontSize: 17 });
  s.addText([{ text: '{{baseUrl}}', options: { color: C.orange, bold: true } }, { text: '/posts/1', options: { color: '111827' } }], { x: 0.9, y: 2.2, w: 5.0, h: 0.7, fontSize: 22, fontFace: F.code, fill: { color: C.codeBg }, align: 'center', valign: 'middle' });
  L.arrow(p, s, { x: 6.0, y: 2.55 }, { x: 7.2, y: 2.55 }, { label: '送信時に置き換え' });
  L.code(s, 'https://jsonplaceholder.typicode.com/posts/1', { x: 7.3, y: 2.2, w: 5.4, h: 0.7 }, { fontSize: 15, valign: 'middle' });
  L.table(s, [['環境（Environment）の名前', '変数 baseUrl の値'], ['JSONPlaceholder', 'https://jsonplaceholder.typicode.com'], ['Local-Mock（第10章の発展課題）', 'http://localhost:3000']], { x: 0.6, y: 3.4, w: 12.1 }, { colW: [4.6, 7.5], fontSize: 15, rowH: 0.55 });
  L.bullets(s, ['変数は {{ }}（二重の波かっこ）で囲んで書きます', 'リクエストを書き換えずに接続先を切り替えられ、値の変更も 1 か所で済みます', '環境は environments フォルダの YAML ファイルとして保存されます（作り方は演習3-D のあと）'], { x: 0.6, y: 5.15, w: 12.1, h: 1.35 }, { fontSize: 15 });
}
{ // 3-14
  const s = L.slide(p, '【演習3-D】環境を選んでから送信する');
  L.sample(p, s, "samples の 03_Setup\\02 Get Posts with baseUrl.yml（演習で作る Get Posts with baseUrl の完成形）を開き、環境 JSONPlaceholder を選んで Send");
  L.steps(s, ['bruno-hands-on を右クリック →「New Request」（3-6 と同じ）。Request Name：Get Posts with baseUrl、URL：{{baseUrl}}/posts →「Create」→ 環境を選ばずに Send'], { x: 0.6, y: 1.1, w: 12.1, h: 0.55 }, { fontSize: 14 });
  { const R = L.image(s, 'crop_ch3_noenv_url.png', { x: 0.6, y: 1.65, w: 5.6, h: 0.55 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [95,20,240,62]); }
  { const R = L.image(s, 'crop_ch3_noenv_resp.png', { x: 6.4, y: 1.65, w: 6.3, h: 0.75 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [0,95,470,140]); }
  L.text(s, '→ {{baseUrl}} が赤字になり、送信に失敗する（getaddrinfo ENOTFOUND {{baseurl}}）', { x: 0.6, y: 2.45, w: 12.1, h: 0.4 }, { fontSize: 14, color: C.warn, bold: true });
  s.addText([{ text: '② ', options: { bold: true, color: C.orange } }, { text: '画面右上の「No Environment」をクリック →「JSONPlaceholder」を選ぶ　', options: {} }, { text: '③ ', options: { bold: true, color: C.orange } }, { text: 'もう一度 Send', options: {} }], { x: 0.6, y: 2.95, w: 12.1, h: 0.45, fontSize: 15, fontFace: F.body, color: C.text });
  { const R = L.image(s, 'crop_ch3_env_list.png', { x: 0.6, y: 3.5, w: 3.0, h: 2.15 }, '② 環境の一覧', { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [565,15,808,62]); L.hl(p, s, R, null, [432,315,800,360]); }
  { const R = L.image(s, 'crop_ch3_env_url.png', { x: 3.9, y: 3.5, w: 5.6, h: 0.55 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [95,20,240,62]); }
  { const R = L.image(s, 'crop_ch3_env_top.png', { x: 3.9, y: 4.2, w: 6.0, h: 1.5 }, '③ {{baseUrl}} が緑になり、200 OK', { align: 'left', valign: 'top' }); L.hl(p, s, R, 3, [1556,180,1688,247]); L.hl(p, s, R, null, [1398,15,1688,62]); L.hl(p, s, R, null, [1100,290,1400,330]); }
  L.text(s, SHOT, { x: 0.6, y: 5.95, w: 8, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'hint', null, '変数名が赤なら「値が見つからない」、緑なら「値がある」状態です。', { x: 10.1, y: 3.5, w: 2.6, h: 2.0 }, { fontSize: 13 });
}
{ // 3-14b（旧 9-5）
  const s = L.slide(p, '【操作】環境と変数を作る');
  L.sample(p, s, "samples コレクションには環境 JSONPlaceholder・Local-Mock が入っています（environments フォルダの .yml）");
  L.steps(s, ['画面右上の環境の選択（No Environment など）をクリック', 'Collection タブの「Create」をクリック', 'Environment Name を入力して「Create」', 'Variables タブで Name・Value を入力 →「Save」'], { x: 0.6, y: 1.2, w: 5.0, h: 3.8 }, { fontSize: 15, space: 10 });
  { const R = L.image(s, 'crop_ch9_env_create.png', { x: 5.9, y: 1.2, w: 3.6, h: 1.75 }, '③', { align: 'left', valign: 'top' }); L.hl(p, s, R, 3, [35,171,965,237]); L.hl(p, s, R, null, [822,302,966,362]); }
  { const R = L.image(s, 'crop_ch9_env_secrets.png', { x: 5.9, y: 3.3, w: 6.8, h: 1.7 }, '④ Environments タブ', { align: 'left', valign: 'top' }); L.hl(p, s, R, 4, [510,160,635,222]); L.hl(p, s, R, null, [512,318,1920,386]); }
  L.text(s, SHOT, { x: 5.9, y: 5.35, w: 6.8, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'hint', null, 'Ctrl + E でも環境の設定を開けます。保存すると environments\\<環境名>.yml が作られます（作成環境で確認）。', { x: 0.6, y: 5.75, w: 12.1, h: 0.75 }, { fontSize: 13 });
}
{ // 3-14c（旧 9-6）
  const s = L.slide(p, '【操作】環境を切り替える');
  { const R = L.image(s, 'crop_ch9_env_two.png', { x: 0.6, y: 1.2, w: 3.8, h: 2.7 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [518,15,808,62]); L.hl(p, s, R, 2, [432,370,800,418]); }
  L.steps(s, ['画面右上の環境名をクリック', '使いたい環境を選ぶ（例：JSONPlaceholder ⇔ Local-Mock）', '同じリクエストを Send すると、選んだ環境の baseUrl に送られる'], { x: 4.7, y: 1.2, w: 8.0, h: 2.2 }, { fontSize: 16, space: 10 });
  L.callout(p, s, 'warn', null, 'Local-Mock は第10章の発展課題で、自分の PC で模擬 API を起動したときに使います。起動していないときに選ぶと接続エラーになります。', { x: 4.7, y: 3.6, w: 8.0, h: 1.1 }, { fontSize: 14 });
}
{ // 3-14d（旧 9-7）
  const s = L.slide(p, '変数の種類と Secret（秘密の値）', { source: D + '/variables/overview ／ ' + D + '/secrets-management/secret-variables' });
  L.text(s, '変数はいくつかの場所に置けます。同じ名前があるときは、上のものが優先されます（公式ドキュメントより）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.5 }, { fontSize: 15 });
  L.table(s, [['優先', '種類', '置き場所・作り方'], ['高', 'Runtime', 'スクリプトの bru.setVar() で作る（第9章。アプリを閉じると消える）'], ['', 'Request', 'リクエストの Vars タブ'], ['', 'Folder', 'フォルダの設定'], ['', 'Environment', '環境（この章で作ったもの）'], ['', 'Collection', 'コレクションの設定'], ['低', 'Global', 'Workspace 全体の環境']], { x: 0.6, y: 1.8, w: 7.3 }, { colW: [0.8, 1.9, 4.6], fontSize: 13, rowH: 0.48 });
  L.callout(p, s, 'warn', 'Secret', 'API キーやパスワードは、環境の「Secrets」タブ（または Secret の指定）に入れます。値はファイルに書き込まれず、エクスポートにも含まれません。この教材のサンプルには秘密の値は入っていません。', { x: 8.2, y: 1.8, w: 4.5, h: 2.6 }, { fontSize: 13 });
}
S3.secrets('3-F'); // 旧 9-B
{ // 3-15
  const s = L.slide(p, '【演習3-E】共有用ファイルを作る（Share → Export）');
  L.steps(s, [
    'サイドバーの bruno-hands-on を右クリック →「Share」',
    '「Export」タブを選ぶ',
    '「Bruno Collection (ZIP)」（Recommended）を選び「Proceed」',
    '保存画面で保存先を選んで保存（ファイル名の初期値は bruno-hands-on.zip、保存先の初期値はドキュメント）',
  ], { x: 0.6, y: 1.2, w: 5.2, h: 4.2 }, { fontSize: 14, space: 9 });
  { const R = L.image(s, 'crop_ch3_share_export.png', { x: 6.0, y: 1.2, w: 6.7, h: 4.25 }, SHOT + '　Share Collection > Export', { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [155,125,292,182]); L.hl(p, s, R, 3, [35,363,783,757]); L.hl(p, s, R, null, [1404,1082,1566,1142]); }
  L.callout(p, s, 'hint', null, '受け取った人は ZIP を展開して Open Collection で開きます（3-10・3-12）。Postman 形式・OpenAPI 形式でも出力できます。', { x: 0.6, y: 5.5, w: 5.2, h: 1.0 }, { fontSize: 12 });
  L.text(s, '※ Share の「Git」タブは Git での共有の案内です（この研修では扱いません）。Secret（秘密の値）はエクスポートに含まれません（公式ドキュメント）。', { x: 6.0, y: 5.88, w: 6.7, h: 0.42 }, { fontSize: 10, color: C.sub });
}
{ // 3-16
  const s = L.slide(p, '演習を始める前のチェックリスト');
  L.table(s, [
    ['確認すること', '確認方法'],
    ['Bruno v4.2.1 が起動する', '画面右下に v4.2.1 と表示される'],
    ['インターネットにつながる', 'ブラウザで https://jsonplaceholder.typicode.com/posts/1 が開ける'],
    ['bruno-hands-on が開いている', 'サイドバーに 05_POST〜10_LocalMock が表示される'],
    ['環境 JSONPlaceholder を選んでいる', '画面右上に JSONPlaceholder と表示される'],
    ['Get Posts with baseUrl が 200 OK になる', '演習3-D の結果'],
  ], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [4.6, 7.5], fontSize: 16, rowH: 0.62 });
}
{ // 3-17
  const s = L.slide(p, 'レスポンスが返らないときの対処');
  L.image(s, 'crop_ch3_typo_url.png', { x: 0.6, y: 1.2, w: 5.4, h: 0.45 }, null, { align: 'left', valign: 'top' });
  { const R = L.image(s, 'crop_ch3_typo_resp.png', { x: 6.3, y: 1.2, w: 6.4, h: 0.6 }, SHOT + '　ホスト名を打ち間違えた例', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [0,95,690,140]); }
  L.table(s, [
    ['表示・症状', '考えられる原因', '対処'],
    ['getaddrinfo ENOTFOUND <ホスト名>', 'URL のホスト名の打ち間違い', 'URL を見直す'],
    ['getaddrinfo ENOTFOUND {{baseurl}}', '環境を選んでいない', '画面右上で環境を選ぶ（演習3-D）'],
    ['いつまでも応答がない・接続できない', '会社のネットワークの制限（プロキシなど）', 'Preferences > Proxy の設定を、社内のルールに従って確認する'],
    ['404 Not Found', 'パスの打ち間違い（例：/post）', 'パスを見直す（第4章）'],
  ], { x: 0.6, y: 2.25, w: 12.1 }, { colW: [4.0, 4.0, 4.1], fontSize: 13, rowH: 0.62 });
  L.text(s, '※ プロキシ環境での動作は作成環境では検証していません。社内の情報システム担当者に確認してください。', { x: 0.6, y: 5.6, w: 12.1, h: 0.5 }, { fontSize: 12, color: C.sub });
}
{ // 3-18
  const s = L.slide(p, '第3章のまとめ');
  L.bullets(s, [
    'JSONPlaceholder は練習用 API。書き込みは「成功したふり」で、データは保存されない',
    'コレクションは「＋」→ Create collection、リクエストは右クリック → New Request',
    '変更は Ctrl + S で保存する（タブのオレンジの点が目印）',
    '配布フォルダは Open Collection、Postman 形式のファイルは Import Collection',
    '{{baseUrl}} を使うリクエストは、環境を選んでから送信する。API キーなどは環境の Secrets に入れる',
  ], { x: 0.6, y: 1.3, w: 12.1, h: 4.0 }, { fontSize: 18, space: 12 });
}

// =========================================================
// 第4章 GET
// =========================================================
L.chapter(p, '第4章', 'GET の基本演習', [
  'GET で一覧と 1 件を取得する',
  'レスポンスのボディ・ヘッダー・ステータスを読む',
  'Query Parameter（userId=1&id=3）で絞り込む',
  'パスパラメータ、関連データ、404',
  '演習問題とよくある間違い',
], { time: '55 分', goals: 'B1, B5, B6' });

{ // 4-2
  const s = L.slide(p, 'GET とは');
  L.box(p, s, 'Bruno', { x: 0.8, y: 1.6, w: 2.6, h: 1.1 }, { fill: C.hintBg, line: C.hint, bold: true });
  L.box(p, s, 'JSONPlaceholder', { x: 9.9, y: 1.6, w: 2.8, h: 1.1 }, { fill: 'FEF3C7', line: C.orange, bold: true });
  L.arrow(p, s, { x: 3.5, y: 1.9 }, { x: 9.8, y: 1.9 }, { label: 'GET /posts/1（投稿 1 をください）' });
  L.arrow(p, s, { x: 9.8, y: 2.45 }, { x: 3.5, y: 2.45 }, { label: '200 OK ＋ 投稿 1 の JSON', labelUp: -0.1 });
  L.bullets(s, ['データを「取得する」ためのメソッド', 'リクエストにボディは付けない（URL だけで何が欲しいかを伝える）', '何回送っても、サーバーのデータは変わらない（一般的な意味）'], { x: 0.6, y: 3.3, w: 12.1, h: 2.0 }, { fontSize: 18 });
}
// 4-3 一覧を取得する：04_GET フォルダと 01 Get Posts を自分で作る（6 枚：scripts/ch4_get_steps.js）
require('./ch4_get_steps')(p);
{ // 4-4
  const s = L.slide(p, 'レスポンスを読む（ボディ）');
  L.code(s, '[                       ← 配列の始まり\n  {                     ← 1 件目\n    "userId": 1,\n    "id": 1,\n    "title": "sunt aut facere ...",\n    "body": "quia et suscipit ..."\n  },\n  { … 2 件目 … },\n  …（全部で 100 件）\n]                       ← 配列の終わり', { x: 0.6, y: 1.25, w: 6.8, h: 4.2 }, { fontSize: 15 });
  L.bullets(s, ['一覧は配列 [ ] で返る', '1 件ずつが { } のオブジェクト', '/posts は 100 件（公式サイトの表記と、2026-10-09 の取得結果で確認）', 'ボディ右上の表示形式（JSON）で見やすく整形されている'], { x: 7.7, y: 1.25, w: 5.0, h: 3.6 }, { fontSize: 15 });
}
{ // 4-5
  const s = L.slide(p, 'レスポンスを読む（ヘッダー）');
  L.steps(s, ['レスポンス側の「Headers」タブをクリック', 'content-type の値を確認する'], { x: 0.6, y: 1.2, w: 5.0, h: 1.2 }, { fontSize: 15 });
  L.image(s, 'crop_ch2_resp_headers.png', { x: 5.8, y: 1.2, w: 6.9, h: 2.7 }, SHOT, { align: 'left', valign: 'top' });
  L.table(s, [['ヘッダー', '意味'], ['content-type: application/json; charset=utf-8', 'ボディは JSON（文字コード UTF-8）'], ['date', 'レスポンスが作られた日時']], { x: 0.6, y: 4.3, w: 12.1 }, { colW: [6.0, 6.1], fontSize: 14, rowH: 0.5 });
  L.text(s, 'Headers の右の数字（例：22）は、ヘッダーの件数です。', { x: 0.6, y: 5.95, w: 12, h: 0.4 }, { fontSize: 13, color: C.sub });
}
{ // 4-6
  const s = L.slide(p, '【操作】ID を指定して 1 件取得する');
  L.sample(p, s, "samples の 04_GET\\02 Get Post by ID.yml を開いて Send");
  L.steps(s, ['04_GET を右クリック →「New Request」（4-3 の手順 3/5 と同じ）', 'Request Name：02 Get Post by ID、URL：{{baseUrl}}/posts/1 →「Create」', 'Send → 結果を確認したら Ctrl + S で保存'], { x: 0.6, y: 1.15, w: 12.1, h: 1.35 }, { fontSize: 15, space: 4 });
  { const R = L.image(s, 'crop_ch4_g02_url.png', { x: 0.6, y: 2.6, w: 5.0, h: 0.5 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [8,10,1040,78]); }
  L.image(s, 'crop_ch4_g02_resp.png', { x: 0.6, y: 3.25, w: 7.2, h: 2.1 }, SHOT, { align: 'left', valign: 'top' });
  L.callout(p, s, 'ok', '一覧との違い', '/posts は配列 [ ]（100 件）、/posts/1 はオブジェクト { } が 1 つだけ返ります。', { x: 8.1, y: 3.25, w: 4.6, h: 1.4 }, { fontSize: 14 });
}
{ // 4-7
  const s = L.slide(p, 'JSON を読む練習');
  L.code(s, '{\n  "userId": 1,\n  "id": 1,\n  "title": "sunt aut facere repellat ...",\n  "body": "quia et suscipit\\nsuscipit ..."\n}', { x: 0.6, y: 1.25, w: 6.3, h: 2.4 }, { fontSize: 15 });
  L.table(s, [['キー', '意味（JSONPlaceholder の posts）'], ['userId', '投稿したユーザーの番号'], ['id', '投稿の番号'], ['title', 'タイトル'], ['body', '本文']], { x: 7.2, y: 1.25, w: 5.5 }, { colW: [1.5, 4.0], fontSize: 14, rowH: 0.48 });
  L.callout(p, s, 'hint', null, '"\\n" は「改行」を表す記号です。文字列の中で改行を表すときに使われます。', { x: 0.6, y: 4.0, w: 12.1, h: 0.75 }, { fontSize: 14 });
  L.text(s, '※ 投稿の文章はダミーのラテン語風の文字列です（意味はありません）。', { x: 0.6, y: 5.0, w: 12, h: 0.4 }, { fontSize: 13, color: C.sub });
}
{ // 4-8
  const s = L.slide(p, '【操作】Query Parameter で絞り込む（userId=1&id=3）', { source: '結果は 2026-10-09 に Bruno v4.2.1 と curl で確認' });
  L.sample(p, s, "samples の 04_GET\\03 Get Posts by Query.yml を開いて Send");
  L.steps(s, ['04_GET を右クリック →「New Request」。Request Name：03 Get Posts by Query、URL：{{baseUrl}}/posts →「Create」', 'リクエスト側の「Params」タブを開く', 'Query の表の 1 行目に Name：userId／Value：1、自動で増えた 2 行目に Name：id／Value：3 と入力', 'URL の末尾が自動で ?userId=1&id=3 になったことを確認', 'Send → 1 件（id が 3 の投稿）だけが返る → Ctrl + S'], { x: 0.6, y: 1.2, w: 4.8, h: 4.2 }, { fontSize: 13, space: 6 });
  const r = L.image(s, 'crop_ch4_g03_left.png', { x: 5.6, y: 1.2, w: 7.1, h: 2.7 }, null, { align: 'left', valign: 'top', pxPerCss: 2 }); { const R = r; L.hl(p, s, R, 2, [8,115,112,172]); L.hl(p, s, R, 3, [10,325,1460,467]); L.hl(p, s, R, 4, [95,15,510,72]); }
  { const R = L.image(s, 'crop_ch4_g03_resp.png', { x: 5.6, y: 4.05, w: 7.1, h: 1.9 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 5, [0,95,1770,520]); }
  L.callout(p, s, 'hint', null, '& でつないだ 2 つの条件の両方に合うデータが返ります（JSONPlaceholder の場合）。', { x: 0.6, y: 5.5, w: 4.8, h: 0.95 }, { fontSize: 13 });
}
{ // 4-9
  const s = L.slide(p, 'Query Parameter の表と URL は連動する');
  L.text(s, 'Params タブの表と URL は自動で連動します（作成環境で確認）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.table(s, [['操作', '結果'], ['表に Name と Value を入力する', 'URL に ?名前=値 が付く'], ['行の左のチェックを外す', 'その条件が URL から消える（行は残る）'], ['チェックを付け直す', 'URL に戻る'], ['行のごみ箱アイコン', '行を削除する']], { x: 0.6, y: 1.75, w: 5.6 }, { colW: [2.6, 3.0], fontSize: 13, rowH: 0.55 });
  { const R = L.image(s, 'crop_ch4_g03u_left.png', { x: 6.5, y: 1.75, w: 6.2, h: 2.35 }, '「id」のチェックを外した状態（URL は ?userId=1）', { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [28,415,62,449]); L.hl(p, s, R, 2, [95,15,420,72]); }
  L.image(s, 'crop_ch4_g03u_status.png', { x: 6.5, y: 4.5, w: 6.2, h: 0.45 }, null, { align: 'left', valign: 'top' });
  L.text(s, '→ userId=1 だけの条件になり、10 件が返った', { x: 6.5, y: 5.0, w: 6.2, h: 0.4 }, { fontSize: 14, color: C.ok, bold: true });
  L.text(s, SHOT, { x: 0.6, y: 6.15, w: 8, h: 0.3 }, { fontSize: 10, color: C.sub });
  L.callout(p, s, 'warn', null, 'チェックを外して試したあとは、元に戻してから保存しましょう。', { x: 0.6, y: 4.75, w: 5.6, h: 0.75 }, { fontSize: 13 });
}
{ // 4-10
  const s = L.slide(p, 'パスパラメータ（:id）を使う');
  L.sample(p, s, "samples の 04_GET\\04 Get Post by Path Param.yml を開いて Send");
  L.text(s, 'URL の中の「:名前」の部分は、Params タブの Path で値を指定できます。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  { const R = L.image(s, 'crop_ch4_g04_left.png', { x: 0.6, y: 1.8, w: 6.6, h: 3.0 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [235,20,360,70]); L.hl(p, s, R, 2, [8,590,1460,658]); }
  L.steps(s, ['04_GET を右クリック →「New Request」。Request Name：04 Get Post by Path Param、URL：{{baseUrl}}/posts/:id →「Create」', 'Params タブの下の「Path」に id の行が自動で出る。Value に 1 と入力', 'Send → /posts/1 として送られ、投稿 1 が返る → Ctrl + S'], { x: 7.5, y: 1.8, w: 5.2, h: 2.9 }, { fontSize: 13, space: 6 });
  L.text(s, 'Value を 2 に変えると /posts/2 になります。', { x: 7.5, y: 4.7, w: 5.2, h: 0.35 }, { fontSize: 13, color: C.sub });
  L.callout(p, s, 'hint', null, 'Query Parameter（? の後ろ）は「条件」、パスパラメータは「どのデータか」を指定するときによく使われます（一般的な使い分け）。', { x: 0.6, y: 5.1, w: 12.1, h: 0.9 }, { fontSize: 14 });
}
{ // 4-11
  const s = L.slide(p, '関連するデータを取得する');
  L.sample(p, s, "samples の 04_GET\\05 Get Comments of Post.yml を開いて Send");
  L.steps(s, ['04_GET を右クリック →「New Request」。Request Name：05 Get Comments of Post、URL：{{baseUrl}}/posts/1/comments →「Create」', 'Send → 投稿 1 に付いたコメント 5 件が返る → Ctrl + S'], { x: 0.6, y: 1.15, w: 12.1, h: 1.0 }, { fontSize: 15, space: 4 });
  { const R = L.image(s, 'crop_ch4_g05_resp.png', { x: 0.6, y: 2.3, w: 7.5, h: 2.65 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [1180,10,1470,54]); }
  L.callout(p, s, 'hint', null, '各コメントの postId が 1 になっていることを確認しましょう。同じ結果は /comments?postId=1 でも得られます（公式サイトの例）。', { x: 8.4, y: 2.3, w: 4.3, h: 1.6 }, { fontSize: 13 });
}
{ // 4-12
  const s = L.slide(p, '存在しないデータを指定すると 404');
  L.sample(p, s, "samples の 04_GET\\06 Get Missing Post.yml を開いて Send");
  L.steps(s, ['04_GET を右クリック →「New Request」', 'Request Name：06 Get Missing Post、URL：{{baseUrl}}/posts/999 →「Create」→ Send → Ctrl + S'], { x: 0.6, y: 1.15, w: 12.1, h: 0.95 }, { fontSize: 15, space: 4 });
  L.image(s, 'crop_ch4_g06_url.png', { x: 0.6, y: 2.15, w: 5.0, h: 0.5 }, null, { align: 'left', valign: 'top' });
  { const R = L.image(s, 'crop_ch4_g06_resp.png', { x: 0.6, y: 2.8, w: 7.5, h: 0.9 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [1180,10,1490,54]); }
  L.bullets(s, ['ステータス：404 Not Found', 'ボディ：{}（空のオブジェクト）'], { x: 0.6, y: 4.0, w: 12.1, h: 1.0 }, { fontSize: 16 });
  L.callout(p, s, 'warn', null, 'エラーのときに何を返すかは API ごとに違います。JSONPlaceholder は 404 のとき {} を返します。', { x: 0.6, y: 5.15, w: 12.1, h: 0.8 }, { fontSize: 14 });
}
{ // 4-13
  const s = L.slide(p, '演習問題4');
  L.sample(p, s, "samples の 04_GET\\Q1〜Q4 の .yml（問題①〜④の解答）を開いて Send");
  L.text(s, '04_GET フォルダを右クリック → New Request で新しいリクエストを作り、次の答えを調べましょう（URL は {{baseUrl}} を使う）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 16 });
  L.steps(s, ['/users は何件ありますか？', 'id が 3 のユーザー（/users/3）の name は何ですか？', 'userId が 2 の投稿は何件ありますか？（Query Parameter を使う）', 'id が 1 の todo（/todos/1）の completed の値は何ですか？'], { x: 0.6, y: 2.1, w: 12.1, h: 2.8 }, { fontSize: 18, space: 14 });
  L.callout(p, s, 'hint', null, '件数は、配列の最後の要素の id や、レスポンスを下までスクロールして確かめます。', { x: 0.6, y: 5.2, w: 12.1, h: 0.75 }, { fontSize: 14 });
}
{ // 4-14
  const s = L.slide(p, '演習問題4：期待する結果と解答', { source: '2026-10-09 に curl と Bruno CLI 4.2.1 で確認（answers/bruno-hands-on-answers/Ex04_GET）' });
  L.table(s, [['問題', 'リクエスト', '答え'], ['①', { text: 'GET {{baseUrl}}/users', code: true }, '10 件'], ['②', { text: 'GET {{baseUrl}}/users/3', code: true }, '"Clementine Bauch"'], ['③', { text: 'GET {{baseUrl}}/posts?userId=2', code: true }, '10 件'], ['④', { text: 'GET {{baseUrl}}/todos/1', code: true }, 'false']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 7.0, 4.1], fontSize: 16, rowH: 0.62 });
  L.text(s, 'いずれもステータスは 200 OK です。', { x: 0.6, y: 4.6, w: 12, h: 0.4 }, { fontSize: 15 });
}
{ // 4-15
  const s = L.slide(p, 'よくある間違いと対処（GET）', { source: '2026-10-09 に curl・Bruno で確認' });
  L.table(s, [
    ['間違い', '起きること', '対処'],
    [{ text: '?userid=1（大文字小文字の違い）', code: false }, 'エラーにならず、条件が無視されて 100 件すべてが返る', 'キー名は大文字小文字まで正確に（userId）'],
    ['/post（s を忘れる）', '404 Not Found、ボディは {}', 'パスを見直す'],
    ['環境を選んでいない', 'getaddrinfo ENOTFOUND {{baseurl}}', '画面右上で JSONPlaceholder を選ぶ'],
    ['チェックを外したまま保存', '次に開いたとき条件が効かない', 'Params の表のチェックを確認する'],
  ], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [3.6, 4.6, 3.9], fontSize: 14, rowH: 0.8 });
  L.callout(p, s, 'warn', null, '「エラーにならない＝正しい」ではありません。件数や値が期待どおりかを必ず確認しましょう。', { x: 0.6, y: 5.55, w: 12.1, h: 0.75 }, { fontSize: 14 });
}
{ // 4-16
  const s = L.slide(p, '第4章のまとめ');
  L.bullets(s, ['GET はデータの取得。ボディは送らない', '一覧は配列 [ ]、1 件はオブジェクト { }', 'Query Parameter は ? の後ろに「名前=値」、複数は & でつなぐ（例：userId=1&id=3）', 'Params タブの表と URL は連動する。チェックで一時的に外せる', '存在しないデータは 404（JSONPlaceholder ではボディ {}）'], { x: 0.6, y: 1.3, w: 12.1, h: 4.2 }, { fontSize: 18, space: 12 });
}

// =========================================================
// 第5章 POST
// =========================================================
L.chapter(p, '第5章', 'POST の基本演習', [
  'POST でデータを作成する（JSON のボディ）',
  'Body の種類と Content-Type（Timeline で確認）',
  '201 Created とレスポンスの読み方',
  'JSONPlaceholder ではデータが保存されないことを確かめる',
  'よくある間違い、演習問題',
], { time: '45 分', goals: 'B1, B5, B6, A5' });

{ // 5-2
  const s = L.slide(p, 'POST とは');
  L.box(p, s, 'Bruno', { x: 0.8, y: 1.6, w: 2.6, h: 1.1 }, { fill: C.hintBg, line: C.hint, bold: true });
  L.box(p, s, 'JSONPlaceholder', { x: 9.9, y: 1.6, w: 2.8, h: 1.1 }, { fill: 'FEF3C7', line: C.orange, bold: true });
  L.arrow(p, s, { x: 3.5, y: 1.9 }, { x: 9.8, y: 1.9 }, { label: 'POST /posts ＋ ボディ（新しい投稿の JSON）' });
  L.arrow(p, s, { x: 9.8, y: 2.45 }, { x: 3.5, y: 2.45 }, { label: '201 Created ＋ 作られた投稿（id 付き）', labelUp: -0.1 });
  L.bullets(s, ['新しいデータを「作成する」ためのメソッド（一般的な意味）', '作りたいデータの中身はボディに入れて送る', 'URL は「どこに作るか」（例：/posts ＝ 投稿の集まり）'], { x: 0.6, y: 3.3, w: 12.1, h: 2.0 }, { fontSize: 18 });
}
{ // 5-3
  const s = L.slide(p, 'JSON の書き方のルール（送る側になるとき）');
  L.code(s, '{\n  "title": "Bruno 入門",\n  "body": "はじめての POST",\n  "userId": 1\n}', { x: 0.6, y: 1.55, w: 5.6, h: 2.0 }, { fontSize: 16, label: '正しい例' });
  L.code(s, "{\n  title: 'Bruno 入門',   ← ①\n  \"body\": \"はじめての POST\",\n  \"userId\": 1,         ← ②\n}", { x: 6.6, y: 1.55, w: 6.1, h: 2.0 }, { fontSize: 16, label: '間違いの例' });
  L.bullets(s, ['キーも文字列の値も "（ダブルクォート）で囲む（① はキーに " がなく、値に \' を使っている）', '最後の項目の後ろにカンマを付けない（② は最後の項目の後ろにカンマがある）', '数値（1）は " で囲まない'], { x: 0.6, y: 3.9, w: 12.1, h: 1.5 }, { fontSize: 16 });
  L.callout(p, s, 'hint', null, 'Body の右上の「Prettify」で、JSON を見やすく整形できます。', { x: 0.6, y: 5.5, w: 12.1, h: 0.7 }, { fontSize: 14 });
}
{ // 5-4
  const s = L.slide(p, 'Body の種類（JSON を選ぶ）');
  { const R = L.image(s, 'crop_ch5_body_modes.png', { x: 0.6, y: 1.2, w: 3.3, h: 3.8 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [370,8,480,52]); L.hl(p, s, R, 3, [140,315,475,370]); }
  L.steps(s, ['リクエスト側の「Body」タブを開く', '右上の種類の表示（例：JSON ▼）をクリック', '「JSON」を選ぶ', '下の入力欄に JSON を書く'], { x: 4.2, y: 1.2, w: 8.5, h: 2.4 }, { fontSize: 16, space: 8 });
  L.table(s, [['分類', '種類'], ['FORM', 'Multipart Form、Form URL Encoded'], ['RAW', 'JSON、XML、TEXT、SPARQL'], ['OTHER', 'File / Binary、No Body']], { x: 4.2, y: 3.75, w: 8.5 }, { colW: [1.6, 6.9], fontSize: 14, rowH: 0.45 });
}
{ // 5-5
  const s = L.slide(p, '【操作】POST リクエストを作る（05_POST/01 Create Post）');
  L.sample(p, s, "samples の 05_POST\\01 Create Post.yml を開いて Send");
  { const R = L.image(s, 'crop_ch5_body_left.png', { x: 0.6, y: 1.2, w: 6.6, h: 1.95 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, 2, [8,10,700,78]); L.hl(p, s, R, 3, [130,115,220,172]); L.hl(p, s, R, null, [1245,118,1360,162]); L.hl(p, s, R, null, [60,215,520,405]); }
  L.table(s, [['設定', '値'], ['メソッド', 'POST'], ['URL', '{{baseUrl}}/posts'], ['Body の種類', 'JSON'], ['Body', '{ "title": "Bruno 入門", "body": "はじめての POST", "userId": 1 }']], { x: 7.5, y: 1.2, w: 5.2 }, { colW: [1.4, 3.8], fontSize: 12, rowH: 0.45 });
  L.text(s, '自分で作るときの手順', { x: 0.6, y: 3.55, w: 6, h: 0.4 }, { fontSize: 16, bold: true, color: C.navy });
  L.steps(s, ['05_POST を右クリック → New Request', 'URL の左のメソッドで POST を選び、URL に {{baseUrl}}/posts', 'Create → Body タブ → JSON を選んで内容を入力', 'Ctrl + S で保存'], { x: 0.6, y: 3.95, w: 12.1, h: 2.2 }, { fontSize: 15 });
}
{ // 5-6
  const s = L.slide(p, '送信してレスポンスを確認する');
  L.sample(p, s, "samples の 05_POST\\01 Create Post.yml を開いて Send");
  { const R = L.image(s, 'crop_ch5_201_resp.png', { x: 0.6, y: 1.2, w: 6.4, h: 1.5 }, SHOT + '　Response', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [1180,10,1470,54]); }
  L.image(s, 'crop_ch5_resp_headers.png', { x: 7.3, y: 1.2, w: 5.4, h: 3.5 }, 'Headers（location: …/posts/101 がある）', { align: 'left', valign: 'top' });
  L.table(s, [['確認する場所', '結果'], ['ステータス', '201 Created（作成された）'], ['ボディ', '送った内容 ＋ "id": 101'], ['ヘッダー location', 'https://jsonplaceholder.typicode.com/posts/101']], { x: 0.6, y: 3.1, w: 6.4 }, { colW: [2.0, 4.4], fontSize: 13, rowH: 0.5 });
  L.callout(p, s, 'hint', null, 'id 101 はサーバーが付けた番号です（既存の投稿が 100 件のため）。', { x: 0.6, y: 5.2, w: 6.4, h: 0.75 }, { fontSize: 13 });
}
{ // 5-7
  const s = L.slide(p, 'Content-Type は自動で付く（Timeline で確認）');
  L.text(s, 'Body の種類で JSON を選ぶと、Content-Type: application/json が自動で付けられて送信されます。', { x: 0.6, y: 1.2, w: 12.1, h: 0.5 }, { fontSize: 16 });
  { const R = L.image(s, 'crop_ch5_add_headers.png', { x: 0.6, y: 1.85, w: 5.6, h: 2.35 }, 'Headers タブ → Show Additional Headers', { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [255,8,352,64]); }
  { const R = L.image(s, 'crop_ch5_timeline.png', { x: 6.5, y: 1.85, w: 6.2, h: 4.0 }, 'Timeline で行を開いたところ（実際に送ったヘッダー）', { align: 'left', valign: 'top' }); L.hl(p, s, R, 1, [318,8,416,64]); L.hl(p, s, R, 2, [4,98,1708,162]); L.hl(p, s, R, 3, [60,480,1684,535]); }
  L.steps(s, ['レスポンス側の「Timeline」タブ', '一番上の行の「>」をクリックして開く', 'Request のヘッダーに Content-Type: application/json があることを確認'], { x: 0.6, y: 4.45, w: 5.6, h: 1.6 }, { fontSize: 13 });
  L.text(s, SHOT + '　※ Headers タブの一覧（Runtime Headers）には Content-Type は表示されません。実際に送ったものは Timeline で確認します。', { x: 0.6, y: 6.15, w: 12.1, h: 0.45 }, { fontSize: 10, color: C.sub });
}
{ // 5-8
  const s = L.slide(p, '⚠ JSONPlaceholder の制約：作成は「ふり」', { source: JPG });
  L.text(s, '公式の説明（POST）', { x: 0.6, y: 1.2, w: 12, h: 0.35 }, { fontSize: 14, color: C.sub });
  L.text(s, '"The resource is not really created on the server, but the response is faked as if."', { x: 0.6, y: 1.55, w: 12.1, h: 0.6 }, { fontSize: 18, italic: true, fill: C.pale });
  L.text(s, '＝ サーバー上に本当に作られるのではなく、作られたかのようなレスポンスが返る', { x: 0.6, y: 2.25, w: 12.1, h: 0.5 }, { fontSize: 17, bold: true });
  L.table(s, [['', '一般的な API（本物のサーバー）', 'JSONPlaceholder'], ['201 が返ったら', 'データが保存されている', '保存されていない'], ['もう一度 POST すると', '別の id で 2 件目ができる', '毎回 id 101 が返る'], ['作ったデータを GET すると', '取得できる', '404（見つからない）']], { x: 0.6, y: 3.0, w: 12.1 }, { colW: [3.4, 4.35, 4.35], fontSize: 15, rowH: 0.55 });
}
{ // 5-9
  const s = L.slide(p, '確かめよう：作ったはずのデータを GET する');
  L.sample(p, s, "samples の 05_POST\\02 Check Created Post.yml を開いて Send");
  L.steps(s, ['05_POST → 02 Check Created Post を開く（URL：{{baseUrl}}/posts/101）', 'Send'], { x: 0.6, y: 1.2, w: 12.1, h: 0.9 }, { fontSize: 15 });
  L.image(s, 'crop_ch5_404_url.png', { x: 0.6, y: 2.15, w: 5.0, h: 0.5 }, null, { align: 'left', valign: 'top' });
  { const R = L.image(s, 'crop_ch5_404_resp.png', { x: 0.6, y: 2.8, w: 7.5, h: 0.9 }, SHOT, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [1180,10,1490,54]); }
  L.callout(p, s, 'warn', '結果：404 Not Found', '201 Created が返っても、データは保存されていません。「レスポンスが返った」ことと「データが保存された」ことは別です。', { x: 0.6, y: 4.0, w: 12.1, h: 1.2 }, { fontSize: 15 });
  L.text(s, '本当に保存される様子は、第10章の発展課題（自分の PC で動かす模擬 API）で確かめられます。', { x: 0.6, y: 5.45, w: 12.1, h: 0.45 }, { fontSize: 14, color: C.sub });
}
{ // 5-10
  const s = L.slide(p, 'よくある間違い（POST）', { source: '2026-10-09 に Bruno v4.2.1 で確認' });
  L.sample(p, s, "samples の 05_POST\\03 Mistake Text Body.yml を開いて Send");
  L.text(s, '① Body の種類を TEXT にしてしまう（05_POST/03 Mistake Text Body）', { x: 0.6, y: 1.15, w: 12.1, h: 0.4 }, { fontSize: 16, bold: true, color: C.navy });
  { const R = L.image(s, 'crop_ch5_text_resp.png', { x: 0.6, y: 1.6, w: 5.6, h: 0.8 }, null, { align: 'left', valign: 'top' }); L.hl(p, s, R, null, [0,95,600,240]); }
  L.bullets(s, ['201 Created なのに、ボディは { "id": 101 } だけ（送った title などが無視された）', 'Timeline の Content-Type は text/plain になっていた'], { x: 6.4, y: 1.6, w: 6.3, h: 1.3 }, { fontSize: 13 });
  L.text(s, '② JSON の書き方を間違える（最後にカンマを付けた）', { x: 0.6, y: 3.15, w: 12.1, h: 0.4 }, { fontSize: 16, bold: true, color: C.navy });
  L.image(s, 'crop_ch5_invalid_resp.png', { x: 0.6, y: 3.6, w: 5.6, h: 1.75 }, SHOT, { align: 'left', valign: 'top' });
  L.bullets(s, ['500 Internal Server Error（サーバー側のエラーとして返る）', 'ボディは HTML のエラーメッセージ'], { x: 6.4, y: 3.6, w: 6.3, h: 1.0 }, { fontSize: 13 });
  L.callout(p, s, 'warn', null, '「エラーにならない＝正しく送れた」ではありません。レスポンスのボディに送った値が入っているかを確認しましょう。', { x: 0.6, y: 5.7, w: 12.1, h: 0.75 }, { fontSize: 13 });
}
{ // 5-11
  const s = L.slide(p, '演習問題5');
  L.sample(p, s, "samples の 05_POST\\Q1 Create Comment.yml → Q2 Check Created Comment.yml の順に開いて Send（問題①②の解答）");
  L.text(s, '05_POST に新しいリクエストを作りましょう。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.steps(s, ['/comments に、次の JSON を POST してください。ステータスと、返ってきた id は何ですか？', '①で返ってきた id のコメントを GET すると、何が返りますか？ 理由も説明してください。'], { x: 0.6, y: 1.8, w: 12.1, h: 1.6 }, { fontSize: 17, space: 12 });
  L.code(s, '{\n  "postId": 1,\n  "name": "test",\n  "email": "test@example.com",\n  "body": "hello"\n}', { x: 0.6, y: 3.6, w: 6.0, h: 2.3 }, { fontSize: 16 });
}
{ // 5-12
  const s = L.slide(p, '演習問題5：期待する結果と解答', { source: '2026-10-09 に curl と Bruno CLI 4.2.1 で確認（answers/bruno-hands-on-answers/Ex05_POST）' });
  L.table(s, [['問題', 'リクエスト', '結果'], ['①', { text: 'POST {{baseUrl}}/comments（Body：JSON）', code: true }, '201 Created、"id": 501'], ['②', { text: 'GET {{baseUrl}}/comments/501', code: true }, '404 Not Found、ボディ {}']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 6.8, 4.3], fontSize: 15, rowH: 0.65 });
  L.callout(p, s, 'ok', '② の理由', 'JSONPlaceholder は作成したふりをするだけで、データを保存しないからです（コメントは 500 件のまま）。', { x: 0.6, y: 3.6, w: 12.1, h: 1.0 }, { fontSize: 15 });
}
{ // 5-13
  const s = L.slide(p, '第5章のまとめ');
  L.bullets(s, ['POST は新しいデータの作成。送る中身はボディに入れる', 'JSON を送るときは Body の種類で JSON を選ぶ（Content-Type が自動で付く）', '実際に送った内容は Timeline で確認できる', '作成の成功は 201 Created（一般的な意味）', 'JSONPlaceholder では保存されない。GET すると 404 になる'], { x: 0.6, y: 1.3, w: 12.1, h: 4.2 }, { fontSize: 18, space: 12 });
}

const out = path.join(L.ROOT, 'slides', process.env.OUT_NAME || 'part02_ch03-05.pptx');
console.log('fit:', L.fitSamples(p).join(' '));
p.writeFile({ fileName: out }).then(f => console.log('wrote', f));
