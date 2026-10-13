// 分割単位⑦：第10章（応用演習・Mambu API 机上演習・発展課題・修了確認）
const path = require('path');
const L = require('./lib');
const { C, F } = L;

const p = L.newDeck('Bruno ではじめる API 入門（第10章）');
const BS = String.fromCharCode(92);
const MD = 'https://docs.mambu.com/api/（2026-10-09 確認。API は未実行）';
const NOTRUN = { tag: '未実行' };

// 演習スライド（目的・事前準備・手順・期待する結果）
function exercise(no, title, goal, prep, steps, expect, sample) {
  const s = L.slide(p, `【演習${no}】${title}`);
  L.table(s, [['目的', goal], ['事前準備', prep]], { x: 0.6, y: 1.2, w: 12.1 }, { colW: [1.6, 10.5], fontSize: 13, rowH: 0.45 });
  L.text(s, '手順', { x: 0.6, y: 2.25, w: 3, h: 0.35 }, { fontSize: 15, bold: true, color: C.navy });
  L.steps(s, steps, { x: 0.6, y: 2.6, w: 7.4, h: 3.5 }, { fontSize: 13, space: 6 });
  L.callout(p, s, 'ok', '期待する結果', expect, { x: 8.2, y: 2.6, w: 4.5, h: 3.3 }, { fontSize: 13, valign: 'top' });
  if (sample) L.sample(p, s, sample);
  return s;
}

L.chapter(p, '第10章', '応用演習と修了確認', [
  '応用演習：整理・環境変数・テスト・まとめて実行・CLI',
  '業務 API の例：Mambu で法人の口座を開設する',
  '発展課題：データが保存される模擬 API を自分の PC で動かす',
  '理解度チェック（15 問）と修了課題（実技）',
], { time: '約 90 分', goals: 'B1〜B8, A1〜A5' });

{ // 10-2
  const s = L.slide(p, '応用演習の全体像');
  L.table(s, [['演習', '内容', '使う章', '目安'],
    ['10-1', '新しいコレクションに Posts／Comments フォルダを作り、5 つのメソッドのリクエストを整理する', '第3・9章', '15 分'],
    ['10-2', 'ベース URL を環境変数 {{baseUrl}} で管理する', '第3・9章', '10 分'],
    ['10-3', 'ステータスコードと JSON の値を確認するアサーション・テストを作る', '第9章', '15 分'],
    ['10-4', 'Collection Runner で順番に実行し、全件成功を確認する', '第9章', '10 分'],
    ['10-5', 'CLI で実行し、HTML レポートを作る（任意）', '第9章', '10 分']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 7.4, 1.9, 1.8], fontSize: 14, rowH: 0.6 });
  L.callout(p, s, 'hint', null, '完成形は samples の 10_Final フォルダにあります。うまくいかないときは開いて比べましょう。', { x: 0.6, y: 5.25, w: 12.1, h: 0.75 }, { fontSize: 14 });
}
exercise('10-1', 'リクエストをフォルダで整理する', '1 つのコレクションの中で、目的ごとにリクエストを整理できるようになる', '第3章の手順でコレクションを作れること',
  ['「＋」→ Create collection → Name：Blog-API-Test', 'コレクションを右クリック → New Folder → Posts、もう一度 → Comments', 'Posts に 5 つのリクエストを作る：GET /posts/1、POST /posts、PATCH /posts/1、PUT /posts/1、DELETE /posts/1', 'Comments に GET /posts/1/comments を作る', '名前の先頭に 01〜05 の番号を付けて並べる'],
  'サイドバーに Blog-API-Test ＞ Posts（5 件）・Comments（1 件）が表示される。フォルダの中に .yml ファイルができている',
  'samples の 10_Final フォルダ（Posts・Comments）を開いて完成形と比べる');
exercise('10-2', 'ベース URL を環境で管理する', 'URL の共通部分を環境変数にして、接続先を切り替えられるようにする', '演習10-1 が終わっていること',
  ['画面右上の環境 → Create → Environment Name：JSONPlaceholder', 'Variables に baseUrl ＝ https://jsonplaceholder.typicode.com を入れて Save', '演習10-1 の全リクエストの URL を {{baseUrl}}/posts/1 のように書き換えて保存', '画面右上で JSONPlaceholder を選び、1 件 Send'],
  '{{baseUrl}} が緑で表示され、200 OK などが返る。環境を No Environment に戻すと赤字になり送信に失敗する',
  'samples の 10_Final を開き、環境 JSONPlaceholder を選んで Send');
exercise('10-3', 'アサーションとテストを作る', 'レスポンスが期待どおりかを自動で確認できるようにする', '演習10-2 が終わっていること',
  ['01 Get Post の Assert タブ：res.status equals 200、res.body.userId equals 1', '02 Create Post の Assert タブ：res.status equals 201', '01 Get Post の Tests タブに、title が文字列であることを確かめるテストを書く', '保存して Send → レスポンス側の Tests で Passed を確認'],
  'すべて Passed。テストの例：\ntest("title は文字列", function () {\n  expect(res.getBody().title).to.be.a("string");\n});',
  'samples の 10_Final\\Posts の各 .yml（アサーション・テスト入り）を開いて Send');
exercise('10-4', 'まとめて順番に実行する', '複数のリクエストを 1 回の操作で実行し、結果を一覧で確認する', '演習10-3 が終わっていること',
  ['Blog-API-Test を右クリック → Run', '「Recursive Run」でフォルダの中も含めて実行', 'Filter の Passed・Failed の件数を確認', '失敗があれば、その行のステータスをクリックしてレスポンスを確認し、直して Run Again'],
  'All 6、Passed 6、Failed 0（10_Final の場合）。JSONPlaceholder は保存しないため、POST の後に GET しても新しいデータは取れない点に注意',
  'samples の 10_Final を右クリック → Run → Recursive Run');
exercise('10-5', 'CLI で実行してレポートを作る（任意）', 'コマンドで同じテストを実行し、結果をファイルに残す', 'Node.js と Bruno CLI が使えること（第9章 9-E）',
  ['ターミナルで Blog-API-Test のフォルダに移動', 'bru run -r --env JSONPlaceholder --reporter-html report.html を実行', 'できた report.html をブラウザで開く'],
  'ターミナルに Status ✓ PASS、Requests 6 (6 Passed)。report.html に件数と結果が表示される',
  'CLI を使えない場合は演習10-4（画面の Runner）で代わりにします');
{ // 10-8
  const s = L.slide(p, '応用演習のよくある失敗と対処');
  L.table(s, [['症状', '原因', '対処'],
    ['getaddrinfo ENOTFOUND {{baseurl}}', '環境を選んでいない、または変数名の大文字小文字が違う', '画面右上で環境を選ぶ。baseUrl の綴りを確認'],
    ['アサーションが Failed', 'Value の値や型の違い（"1" と 1 など）', 'レスポンスの実際の値を見て Value を直す'],
    ['Runner の順番が想定と違う', 'サイドバーの並び順で実行される', '名前の番号で並べ替える'],
    ['bru: command not found', 'CLI が入っていない、ターミナルを開き直していない', 'npm install -g @usebruno/cli の後、ターミナルを開き直す'],
    ['bru run で何も実行されない', 'コレクションのフォルダ以外で実行している', 'opencollection.yml があるフォルダに cd する']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [3.7, 4.4, 4.0], fontSize: 13, rowH: 0.72 });
}

// ---------------- Mambu（詳細版：scripts/mambu_slides.js） ----------------
require('./mambu_slides')(p);

// ---------------- 発展課題 ----------------
{ // D1
  const s = L.slide(p, '【発展課題】データが保存される模擬 API で確かめる', { source: 'https://github.com/typicode/json-server ／ npm json-server 1.0.0-beta.15（2026-10-09 確認）' });
  L.callout(p, s, 'warn', '基本演習とは別の任意課題', 'Node.js 22.12 以上と、json-server（npm のパッケージ）のインストールが必要です。json-server の現在の版（1.0.0-beta.15）はベータ版です。', { x: 0.6, y: 1.3, w: 12.1, h: 1.0 }, { fontSize: 14 });
  L.table(s, [['', 'JSONPlaceholder', 'json-server（自分の PC）'], ['POST の後に GET', '404（保存されない）', '200（保存されている）'], ['DELETE の後に GET', '200（残っている）', '404（削除されている）'], ['データの保存先', 'なし', 'db.json ファイル'], ['id', '数値（作成は常に 101）', '文字列（作成時にランダム）']], { x: 0.6, y: 2.6, w: 12.1 }, { colW: [3.2, 4.4, 4.5], fontSize: 14, rowH: 0.55 });
  L.text(s, '※ 作成環境で 2026-10-09 に実行して確認した結果です。', { x: 0.6, y: 5.5, w: 12, h: 0.4 }, { fontSize: 12, color: C.sub });
}
{ // D2
  const s = L.slide(p, '【発展課題】手順');
  L.steps(s, ['ターミナルで exercises\\local-mock フォルダに移動し、npm install（初回のみ）', 'npm start で起動（http://localhost:3000 で待ち受ける）。ターミナルは開いたままにする', 'Bruno で bruno-hands-on を開き、画面右上の環境を Local-Mock に切り替える', '10_LocalMock の 01 → 02 → 03 → 04 の順に Send', '終わったらターミナルで Ctrl + C を押して止める'], { x: 0.6, y: 1.3, w: 7.0, h: 4.2 }, { fontSize: 14, space: 8 });
  L.code(s, 'cd $env:USERPROFILE\\Documents\\bruno-learning\\exercises\\local-mock\nnpm install\nnpm start', { x: 7.9, y: 1.3, w: 4.8, h: 1.2 }, { fontSize: 12 });
  L.table(s, [['リクエスト', '結果（作成環境）'], ['01 Create Post', '201、id が保存される'], ['02 Get Created Post', '200（保存された）'], ['03 Delete Created Post', '200'], ['04 Get After Delete', '404（削除された）']], { x: 7.9, y: 2.8, w: 4.8 }, { colW: [2.6, 2.2], fontSize: 12, rowH: 0.45 });
  L.text(s, '元のデータに戻すときは、db.template.json を db.json にコピーします。', { x: 0.6, y: 5.6, w: 12, h: 0.4 }, { fontSize: 13 });
  L.sample(p, s, 'samples の 10_LocalMock の .yml を、環境 Local-Mock を選んで順に Send（json-server の起動は必要）');
}

// ---------------- 修了確認 ----------------
const Q = [
  ['Q1', 'API とは何ですか。一言で説明してください。', 'ソフトウェア同士がやり取りするための窓口と約束事'],
  ['Q2', 'クライアントとサーバーのうち、Bruno はどちらですか。', 'クライアント'],
  ['Q3', 'URL https://jsonplaceholder.typicode.com/posts?userId=1&id=3 のパスとクエリはどこですか。', 'パス：/posts、クエリ：userId=1&id=3'],
  ['Q4', 'JSON で文字列と数値の書き方の違いは何ですか。', '文字列は " で囲む、数値は囲まない'],
  ['Q5', 'ステータスコード 201 と 404 の意味は何ですか。', '201：作成された／404：見つからない'],
  ['Q6', 'API をテストする目的を 1 つ挙げてください。', '例：画面がなくても動作を確認できる、変更で壊れていないか確かめられる'],
  ['Q7', 'レスポンスの Content-Type はどこで確認しますか。', 'レスポンス側の Headers タブ'],
  ['Q8', 'JSON を POST するとき、Body の種類は何を選びますか。', 'JSON（Content-Type: application/json が自動で付く）'],
  ['Q9', 'PUT と PATCH の違いは何ですか（一般的な意味）。', 'PUT は全体を置き換える、PATCH は一部を変更する'],
  ['Q10', 'PUT /posts/1 に title だけを送ると、JSONPlaceholder のレスポンスはどうなりますか。', 'title と id だけが返る（body・userId がなくなる）'],
  ['Q11', 'ステータスコードが 200 であることを確かめるアサーションを書いてください。', 'Expr：res.status、Operator：equals、Value：200'],
  ['Q12', 'Bruno のコレクションが Git で管理しやすい理由は何ですか。', 'リクエストが 1 件ずつテキスト（YAML）ファイルで保存されるから'],
  ['Q13', 'API キーなどの秘密の値は、環境のどこに入れますか。', 'Secrets（値はファイルやエクスポートに含まれない）'],
  ['Q14', 'JSONPlaceholder に POST して 201 が返った後、そのデータを GET すると何が返りますか。', '404（データは保存されていない）'],
  ['Q15', '「レスポンスが返ったこと」と「データが保存されたこと」が違う理由を説明してください。', 'JSONPlaceholder は成功したふりのレスポンスを返すだけで、サーバーにデータを保存しないから'],
];
[[0, 5, '理解度チェック（1/3）：API の基礎'], [5, 10, '理解度チェック（2/3）：Bruno の操作とメソッド'], [10, 15, '理解度チェック（3/3）：テスト・管理・制約']].forEach(([a, b, t]) => {
  const s = L.slide(p, t);
  L.table(s, [['No', '問題'], ...Q.slice(a, b).map(q => [q[0], q[1]])], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.0, 11.1], fontSize: 16, rowH: 0.75 });
  L.text(s, '合格の目安：15 問中 12 問以上（80% 以上）。答えは最後のスライドにあります。', { x: 0.6, y: 6.3, w: 12, h: 0.4 }, { fontSize: 13, color: C.sub });
});
{ // 修了課題
  const s = L.slide(p, '修了課題（実技）');
  L.text(s, '次の内容を、資料を見ながら自分で行ってください（目安 30 分）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.steps(s, ['新しいコレクション Final-Test を作る', '環境 JSONPlaceholder（baseUrl）を作って選ぶ', 'GET・POST・PATCH・PUT・DELETE の 5 つのリクエストを {{baseUrl}} を使って作り、保存する', '各リクエストに、ステータスコードを確認するアサーションを 1 つ以上付ける', 'Collection Runner で全件を実行し、Failed が 0 になることを確認する', 'Share → Export → Bruno Collection (ZIP) で共有用ファイルを作る'], { x: 0.6, y: 1.8, w: 12.1, h: 4.2 }, { fontSize: 16, space: 9 });
  L.sample(p, s, 'samples の 10_Final\\Posts の 01〜05（完成形の例）を開いて、自分で作ったものと比べる（Comments は追加の例）');
}
{ // 合格基準
  const s = L.slide(p, '修了課題の合格基準（チェックリスト）');
  L.table(s, [['確認すること', '確認方法', 'OK'],
    ['コレクションと 5 つのリクエストがある', 'サイドバー', '□'],
    ['URL がすべて {{baseUrl}} で始まり、緑で表示される', '各リクエストの URL 欄', '□'],
    ['POST・PATCH・PUT の Body の種類が JSON', 'Body タブ', '□'],
    ['各リクエストにアサーションがある', 'Assert タブ', '□'],
    ['Runner で Passed 5、Failed 0', 'Runner の結果', '□'],
    ['ZIP ファイルができている', 'エクスプローラー', '□'],
    ['「保存されない理由」を説明できる（Q15）', '講師に口頭で説明', '□']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [6.6, 4.0, 1.5], fontSize: 15, rowH: 0.6 });
}
{ // 解答
  const s = L.slide(p, '理解度チェックの解答');
  L.table(s, [['No', '解答'], ...Q.map(q => [q[0], q[2]])], { x: 0.6, y: 1.2, w: 12.1 }, { colW: [0.8, 11.3], fontSize: 11, rowH: 0.33 });
}
{ // 自己評価
  const s = L.slide(p, '学習目標の達成度を確かめよう');
  L.table(s, [['学習目標', 'できる／あいまい', '復習する章'],
    ['API・リクエスト・レスポンス・JSON を説明できる', '', '第1章'],
    ['Bruno をインストールして起動できる', '', '第2章'],
    ['コレクション・リクエストを作って保存できる', '', '第3章'],
    ['5 つのメソッドを送信し、結果を確認できる', '', '第4〜8章'],
    ['PUT と PATCH の違いを説明できる', '', '第6・7章'],
    ['開く・インポート・エクスポートができる', '', '第3章'],
    ['環境変数・アサーション・まとめて実行ができる', '', '第9章'],
    ['JSONPlaceholder の制約を説明できる', '', '第3・5〜8章']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [7.0, 2.6, 2.5], fontSize: 14, rowH: 0.53 });
}
{ // 参考資料
  const s = L.slide(p, '参考資料と次のステップ');
  L.table(s, [['資料', 'URL'],
    ['Bruno 公式ドキュメント', 'https://docs.usebruno.com/'],
    ['Bruno ダウンロード', 'https://www.usebruno.com/downloads'],
    ['JSONPlaceholder', 'https://jsonplaceholder.typicode.com/'],
    ['HTTP の仕様（RFC 9110）', 'https://www.rfc-editor.org/rfc/rfc9110'],
    ['Mambu API リファレンス', 'https://docs.mambu.com/api/'],
    ['json-server', 'https://github.com/typicode/json-server']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [4.2, 7.9], fontSize: 15, rowH: 0.52 });
  L.bullets(s, ['業務で使う API の仕様書を読み、Bruno で 1 つずつ試してみましょう', 'テストを増やして、変更のたびに Runner や CLI で確認する習慣をつけましょう'], { x: 0.6, y: 5.2, w: 12.1, h: 1.0 }, { fontSize: 15 });
}

console.log('fit:', L.fitSamples(p).join(' '));
const out = path.join(L.ROOT, 'slides', process.env.OUT_NAME || 'part05_ch10.pptx');
p.writeFile({ fileName: out }).then(f => console.log('wrote', f));
