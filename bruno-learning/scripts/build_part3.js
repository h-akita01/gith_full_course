// 分割単位⑤：第6章（PATCH）＋第7章（PUT）＋第8章（DELETE）
const path = require('path');
const L = require('./lib');
const { C, F, SHOT } = L;
const K = require('./ch678_steps'); // 06_PATCH〜08_DELETE を自分で作る手順

const p = L.newDeck('Bruno ではじめる API 入門（第6〜8章）');
const JPG = 'https://jsonplaceholder.typicode.com/#guide（2026-10-09 に確認）';
const RFC_PATCH = 'RFC 5789（PATCH Method for HTTP）https://www.rfc-editor.org/rfc/rfc5789';
const RFC = 'RFC 9110（HTTP Semantics）https://www.rfc-editor.org/rfc/rfc9110';
const VERIFIED = '結果は 2026-10-09 に Bruno v4.2.1（画面・CLI）と curl で確認';

// 一般論と JSONPlaceholder の挙動の 2 列比較
function twoCol(s, leftTitle, left, rightTitle, right, y = 1.3, h = 2.4) {
  L.box(p, s, leftTitle, { x: 0.6, y, w: 5.9, h: 0.55 }, { fill: C.navy, color: 'FFFFFF', bold: true, fontSize: 16 });
  L.bullets(s, left, { x: 0.7, y: y + 0.65, w: 5.8, h }, { fontSize: 15 });
  L.box(p, s, rightTitle, { x: 6.8, y, w: 5.9, h: 0.55 }, { fill: C.orange, line: C.orange, color: 'FFFFFF', bold: true, fontSize: 16 });
  L.bullets(s, right, { x: 6.9, y: y + 0.65, w: 5.8, h }, { fontSize: 15 });
}

// =========================================================
// 第6章 PATCH
// =========================================================
L.chapter(p, '第6章', 'PATCH の基本演習', [
  'PATCH とは（一部だけを変更する）',
  'PUT との違い（予告）',
  'PATCH のリクエストを自分で作って送り、レスポンスを確認する',
  'JSONPlaceholder の制約を確かめる',
  '演習問題',
], { time: '30 分', goals: 'B5, B6, B7, A5' });

{ // 6-2
  const s = L.slide(p, 'PATCH とは', { source: RFC_PATCH });
  L.text(s, 'すでにあるデータの「一部だけ」を変更するためのメソッドです（HTTP 仕様上の一般的な意味）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.6 }, { fontSize: 18 });
  L.box(p, s, '変更前\nuserId: 1\nid: 1\ntitle: "sunt aut facere ..."\nbody: "quia et suscipit ..."', { x: 0.8, y: 2.1, w: 3.9, h: 2.2 }, { code: true, fontSize: 13 });
  L.box(p, s, '送るボディ\n{ "title": "タイトルだけ変更" }', { x: 5.0, y: 2.6, w: 3.3, h: 1.2 }, { code: true, fontSize: 13, fill: 'FEF3C7', line: C.orange });
  L.box(p, s, '変更後（期待する状態）\nuserId: 1\nid: 1\ntitle: "タイトルだけ変更"\nbody: "quia et suscipit ..."', { x: 8.6, y: 2.1, w: 4.1, h: 2.2 }, { code: true, fontSize: 13 });
  L.arrow(p, s, { x: 4.75, y: 3.2 }, { x: 4.95, y: 3.2 }, {});
  L.arrow(p, s, { x: 8.35, y: 3.2 }, { x: 8.55, y: 3.2 }, {});
  L.callout(p, s, 'ok', null, '送らなかった項目（userId・id・body）は、そのまま残ります。', { x: 0.6, y: 4.7, w: 12.1, h: 0.8 }, { fontSize: 16 });
}
{ // 6-3
  const s = L.slide(p, 'PUT との違い（予告）');
  L.table(s, [['', 'PATCH（第6章）', 'PUT（第7章）'], ['送る内容', '変えたい項目だけ', 'データ全体'], ['送らなかった項目', '残る', 'なくなる（全体を置き換えるため）'], ['たとえ', '書類の一部を修正液で直す', '書類を新しいものに差し替える']], { x: 0.6, y: 1.4, w: 12.1 }, { colW: [3.0, 4.55, 4.55], fontSize: 17, rowH: 0.7 });
  L.text(s, '※ 一般的な意味です。実際の動きは API ごとの仕様で決まります。第7章で、同じボディを送って比べます。', { x: 0.6, y: 4.6, w: 12.1, h: 0.5 }, { fontSize: 14, color: C.sub });
}
// 6-4 PATCH のリクエストを自分で作って送る（全体の流れ＋手順 8 枚：scripts/ch678_steps.js）
K.ch6(p);
{ // 6-5
  const s = L.slide(p, 'レスポンスを確認する', { source: VERIFIED });
  L.sample(p, s, "samples の 06_PATCH\\01 Patch Post Title.yml を開いて Send");
  K.ch6Resp(s, p);
  L.bullets(s, ['ステータス：200 OK', 'title が「タイトルだけ変更」になっている', 'userId・id・body は元のまま返ってくる'], { x: 0.45, y: 5.0, w: 5.0, h: 1.25 }, { fontSize: 14, space: 4 });
  L.callout(p, s, 'ok', '読み取れること', 'JSONPlaceholder は、送った項目を元のデータに重ねた（マージした）結果を返しています。これは PATCH の一般的な意味と同じ動きです。', { x: 5.65, y: 5.0, w: 7.2, h: 1.2 }, { fontSize: 13 });
}
{ // 6-6
  const s = L.slide(p, '⚠ JSONPlaceholder の制約（PATCH）', { source: JPG + '　' + VERIFIED });
  L.sample(p, s, "samples の 06_PATCH\\02 Check After Patch.yml を開いて Send");
  L.text(s, '"The resource is not really patched on the server, but the response is faked as if."', { x: 0.45, y: 1.15, w: 12.4, h: 0.45 }, { fontSize: 14, italic: true, fill: C.pale });
  K.ch6Check(s, p);
  L.bullets(s, ['title は元の "sunt aut facere ..." のまま', '→ PATCH の結果は保存されていない'], { x: 10.05, y: 2.45, w: 2.8, h: 2.4 }, { fontSize: 13 });
  L.callout(p, s, 'warn', '本物の API と違う点', '存在しない ID（例：/posts/999）に PATCH しても、JSONPlaceholder は 200 OK を返します（2026-10-09 に curl で確認）。本物の API では一般に 404 などのエラーになります。', { x: 0.45, y: 5.4, w: 12.4, h: 0.85 }, { fontSize: 12 });
}
{ // 6-7
  const s = L.slide(p, '演習問題6');
  L.sample(p, s, "samples の 06_PATCH\\Q1 Complete Todo 1.yml → Q2 Check Todo 1.yml の順に開いて Send（解答）");
  L.text(s, '06_PATCH フォルダに新しいリクエストを作りましょう。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.steps(s, ['/todos/1 の completed を true に変更する PATCH を作って送ってください。', 'ステータスと、レスポンスの completed・title の値は何ですか？', '続けて /todos/1 を GET すると、completed は何になっていますか？'], { x: 0.6, y: 1.8, w: 12.1, h: 2.3 }, { fontSize: 17, space: 12 });
  L.callout(p, s, 'hint', null, 'Body の種類を JSON にするのを忘れずに。true は真偽値なので " で囲みません。', { x: 0.6, y: 4.4, w: 12.1, h: 0.8 }, { fontSize: 15 });
}
{ // 6-8
  const s = L.slide(p, '演習問題6：期待する結果と解答', { source: '2026-10-09 に curl と Bruno CLI 4.2.1 で確認（answers/bruno-hands-on-answers/Ex06_PATCH）' });
  L.code(s, 'PATCH {{baseUrl}}/todos/1\nBody（JSON）：\n{\n  "completed": true\n}', { x: 0.6, y: 1.3, w: 5.0, h: 2.1 }, { fontSize: 15 });
  L.table(s, [['問題', '結果'], ['①②', '200 OK、completed: true、title: "delectus aut autem"（元のまま）'], ['③', 'completed: false（変更は保存されていない）']], { x: 5.9, y: 1.3, w: 6.8 }, { colW: [1.0, 5.8], fontSize: 15, rowH: 0.7 });
}
{ // 6-9
  const s = L.slide(p, '第6章のまとめ');
  L.bullets(s, ['PATCH は一部だけを変更するメソッド（一般的な意味）', '変えたい項目だけをボディに入れて送る', 'JSONPlaceholder のレスポンスでは、送らなかった項目が残る', 'ただし保存はされない。GET すると元のまま'], { x: 0.6, y: 1.3, w: 12.1, h: 4.0 }, { fontSize: 18, space: 12 });
}

// =========================================================
// 第7章 PUT
// =========================================================
L.chapter(p, '第7章', 'PUT の基本演習', [
  'PUT とは（データ全体を置き換える）',
  'PUT のリクエストを自分で作り、すべての項目を送る',
  '一部の項目だけを送る PUT と PATCH を作って比べる',
  '一般的な意味と JSONPlaceholder の挙動の違い',
  '演習問題',
], { time: '35 分', goals: 'B5, B6, B7, A5' });

{ // 7-2
  const s = L.slide(p, 'PUT とは', { source: RFC });
  L.text(s, '指定したデータを、送った内容で「丸ごと置き換える」ためのメソッドです（HTTP 仕様上の一般的な意味）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.6 }, { fontSize: 18 });
  L.bullets(s, ['URL で「どのデータか」を指定する（例：/posts/1）', 'ボディには、置き換えた後のデータ全体を書く', '何度送っても結果は同じになる（同じ内容に置き換わるだけ）'], { x: 0.6, y: 2.0, w: 12.1, h: 2.0 }, { fontSize: 17 });
  L.callout(p, s, 'hint', null, 'API によっては、指定した URL にデータがなければ新しく作る場合もあります（仕様は API ごとに異なります）。', { x: 0.6, y: 4.3, w: 12.1, h: 0.85 }, { fontSize: 15 });
}
{ // 7-3
  const s = L.slide(p, '「置き換える」という考え方');
  L.box(p, s, '変更前\nuserId: 1\nid: 1\ntitle: "sunt aut ..."\nbody: "quia et ..."', { x: 0.8, y: 1.5, w: 3.6, h: 2.0 }, { code: true, fontSize: 13 });
  L.box(p, s, '送るボディ\n{ "title": "変更後" }', { x: 4.9, y: 1.9, w: 3.2, h: 1.2 }, { code: true, fontSize: 13, fill: 'FEF3C7', line: C.orange });
  L.box(p, s, '変更後（PUT の一般的な意味）\nid: 1\ntitle: "変更後"\n（userId・body はなくなる）', { x: 8.6, y: 1.5, w: 4.1, h: 2.0 }, { code: true, fontSize: 13, fill: C.warnBg, line: C.warn });
  L.arrow(p, s, { x: 4.45, y: 2.5 }, { x: 4.85, y: 2.5 }, {});
  L.arrow(p, s, { x: 8.15, y: 2.5 }, { x: 8.55, y: 2.5 }, {});
  L.callout(p, s, 'warn', null, 'PUT で一部の項目しか送らないと、送らなかった項目が消えてしまうことがあります。PUT では、残したい項目もすべて送ります。', { x: 0.6, y: 3.95, w: 12.1, h: 0.95 }, { fontSize: 15 });
}
// 7-4 PUT のリクエストを自分で作って送る（全体の流れ＋手順 3 枚：scripts/ch678_steps.js）
K.ch7(p);
{ // 7-5
  const s = L.slide(p, 'レスポンスを確認する（すべての項目を送った場合）', { source: VERIFIED });
  L.sample(p, s, "samples の 07_PUT\\01 Put Post Full.yml を開いて Send");
  K.ch7Resp(s, p);
  L.bullets(s, ['ステータス：200 OK', '送った 4 項目がそのまま返ってくる'], { x: 0.45, y: 5.4, w: 4.6, h: 0.85 }, { fontSize: 14, space: 4 });
  L.text(s, 'すべての項目を送ったので、PATCH との違いはまだ見えません。次のスライドで、title だけを送ってみます。', { x: 5.25, y: 5.4, w: 7.6, h: 0.85 }, { fontSize: 14 });
}
{ // 7-6
  const s = L.slide(p, '【操作】title だけを送る PUT を作る（07_PUT/02 Put Post Title Only）', { source: VERIFIED });
  L.sample(p, s, "samples の 07_PUT\\02 Put Post Title Only.yml を開いて Send");
  K.ch7Title(s, p);
  L.bullets(s, ['① 送った Body は title だけ', '② レスポンスも title と id だけ'], { x: 9.65, y: 2.35, w: 3.2, h: 2.6 }, { fontSize: 13 });
  L.callout(p, s, 'warn', '結果', 'body と userId が含まれていません。→ JSONPlaceholder は「送った内容で丸ごと置き換えた」結果を返しています。', { x: 0.45, y: 5.45, w: 12.4, h: 0.78 }, { fontSize: 13 });
}
// 7-6b 比較用の PATCH を作る
K.ch7Patch(p, VERIFIED);
{ // 7-7
  const s = L.slide(p, 'PUT と PATCH の比較（同じボディを送る）', { source: VERIFIED });
  L.text(s, 'どちらも URL は {{baseUrl}}/posts/1、ボディは同じ { "title": "変更後" }', { x: 0.6, y: 1.15, w: 12.1, h: 0.45 }, { fontSize: 16, bold: true });
  L.text(s, 'PUT（07_PUT/02 Put Post Title Only）', { x: 0.6, y: 1.7, w: 5.9, h: 0.4 }, { fontSize: 15, bold: true, color: C.warn });
  L.code(s, '{\n  "title": "変更後",\n  "id": 1\n}', { x: 0.6, y: 2.1, w: 5.9, h: 1.7 }, { fontSize: 16 });
  L.text(s, 'PATCH（07_PUT/03 Patch Post Title Only）', { x: 6.8, y: 1.7, w: 5.9, h: 0.4 }, { fontSize: 15, bold: true, color: C.ok });
  L.code(s, '{\n  "userId": 1,\n  "id": 1,\n  "title": "変更後",\n  "body": "quia et suscipit ..."\n}', { x: 6.8, y: 2.1, w: 5.9, h: 1.7 }, { fontSize: 16 });
  L.table(s, [['', 'PUT', 'PATCH'], ['送らなかった項目（userId・body）', 'レスポンスにない（置き換え）', 'レスポンスに残る（部分更新）'], ['ステータス', '200 OK', '200 OK']], { x: 0.6, y: 4.1, w: 12.1 }, { colW: [4.1, 4.0, 4.0], fontSize: 15, rowH: 0.55 });
}
{ // 7-8
  const s = L.slide(p, 'HTTP 仕様上の意味と JSONPlaceholder の実際の挙動', { source: RFC + ' ／ ' + JPG });
  twoCol(s, 'HTTP 仕様上の一般的な意味', ['PUT：送った内容で全体を置き換える', 'PATCH：一部だけを変更する', '結果はサーバーに保存される（一般的な API の場合）'], 'JSONPlaceholder での実際の挙動', ['PUT・PATCH の違いは、レスポンスの形で確認できる', 'ただし保存はされない（GET すると元のまま）', '存在しない ID：PUT は 500、PATCH は 200（本物の API とは異なる）'], 1.3, 2.2);
  L.callout(p, s, 'warn', null, '「JSONPlaceholder ではこう返った」ことを、「PUT／PATCH なら必ずこうなる」と思い込まないようにしましょう。実際の業務では、使う API の仕様書を必ず確認します。', { x: 0.6, y: 4.5, w: 12.1, h: 1.1 }, { fontSize: 15 });
}
{ // 7-9
  const s = L.slide(p, '⚠ JSONPlaceholder の制約（PUT）', { source: JPG + '　' + VERIFIED });
  L.text(s, '"The resource is not really updated on the server, but the response is faked as if."', { x: 0.6, y: 1.2, w: 12.1, h: 0.55 }, { fontSize: 16, italic: true, fill: C.pale });
  L.table(s, [['確かめたこと', '結果'], ['PUT の後に GET /posts/1', '元のデータのまま（置き換えは保存されない）'], ['PUT /posts/101（存在しない ID）', '500 Internal Server Error（HTML のエラー）']], { x: 0.6, y: 2.0, w: 12.1 }, { colW: [5.0, 7.1], fontSize: 15, rowH: 0.6 });
  L.text(s, '本物の API で存在しないデータを PUT したときの結果（404 など、または新規作成）は、API の仕様によって異なります。', { x: 0.6, y: 4.0, w: 12.1, h: 0.7 }, { fontSize: 15, color: C.sub });
}
{ // 7-10
  const s = L.slide(p, '演習問題7');
  L.sample(p, s, "samples の 07_PUT\\Q1 Put User 1.yml と Q2 Patch User 1.yml を開いて Send（解答）");
  L.text(s, '07_PUT フォルダに 2 つのリクエストを作り、同じボディで送り比べましょう。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.code(s, '{\n  "name": "Taro",\n  "email": "taro@example.com"\n}', { x: 0.6, y: 1.8, w: 5.6, h: 1.6 }, { fontSize: 16, label: '' });
  L.steps(s, ['PUT {{baseUrl}}/users/1 で送ると、レスポンスにはどの項目が入っていますか？', 'PATCH {{baseUrl}}/users/1 で送ると、username の値は何ですか？', '①と②の違いを、PUT と PATCH の意味を使って説明してください。'], { x: 0.6, y: 3.6, w: 12.1, h: 2.2 }, { fontSize: 16, space: 10 });
  L.text(s, '予想してから送りましょう。', { x: 6.5, y: 1.9, w: 6.2, h: 0.5 }, { fontSize: 16, color: C.orange, bold: true });
}
{ // 7-11
  const s = L.slide(p, '演習問題7：期待する結果と解答', { source: '2026-10-09 に curl と Bruno CLI 4.2.1 で確認（answers/bruno-hands-on-answers/Ex07_PUT）' });
  L.table(s, [['問題', '結果'], ['① PUT', '200 OK。name・email・id の 3 項目だけ（username・address などは含まれない）'], ['② PATCH', '200 OK。username は "Bret"（元の値のまま）。address・phone なども残っている'], ['③ 説明の例', 'PUT は送った内容で全体を置き換えたため、送らなかった項目がなくなった。PATCH は送った項目だけを変更したため、ほかの項目が残った（いずれも JSONPlaceholder では保存はされない）']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.8, 10.3], fontSize: 15, rowH: 0.9 });
}
{ // 7-12
  const s = L.slide(p, '第7章のまとめ');
  L.bullets(s, ['PUT は全体を置き換える、PATCH は一部を変更する（一般的な意味）', 'PUT で一部だけ送ると、送らなかった項目が消える場合がある', 'JSONPlaceholder でも、レスポンスの形で違いを確認できる', 'ただし保存はされず、存在しない ID への動きは本物の API と異なる'], { x: 0.6, y: 1.3, w: 12.1, h: 4.0 }, { fontSize: 18, space: 12 });
}

// =========================================================
// 第8章 DELETE
// =========================================================
L.chapter(p, '第8章', 'DELETE の基本演習', [
  'DELETE とは',
  '対象の指定、DELETE のリクエストを自分で作って送る',
  'レスポンスの確認',
  'JSONPlaceholder の制約を確かめる',
  '第4〜8章のまとめ',
], { time: '25 分', goals: 'B5, B6, A5' });

{ // 8-2
  const s = L.slide(p, 'DELETE とは', { source: RFC });
  L.text(s, '指定したデータを「削除する」ためのメソッドです（HTTP 仕様上の一般的な意味）。', { x: 0.6, y: 1.2, w: 12.1, h: 0.6 }, { fontSize: 18 });
  L.box(p, s, 'Bruno', { x: 0.8, y: 2.1, w: 2.6, h: 1.0 }, { fill: C.hintBg, line: C.hint, bold: true });
  L.box(p, s, 'JSONPlaceholder', { x: 9.9, y: 2.1, w: 2.8, h: 1.0 }, { fill: 'FEF3C7', line: C.orange, bold: true });
  L.arrow(p, s, { x: 3.5, y: 2.4 }, { x: 9.8, y: 2.4 }, { label: 'DELETE /posts/1（投稿 1 を削除して）' });
  L.arrow(p, s, { x: 9.8, y: 2.85 }, { x: 3.5, y: 2.85 }, { label: '200 OK（削除したふり）', labelUp: -0.1 });
  L.callout(p, s, 'warn', '実際の業務では', '本物のサーバーに DELETE を送ると、データが本当に消えます。業務の API で試すときは、必ずテスト用の環境とデータを使いましょう。', { x: 0.6, y: 3.8, w: 12.1, h: 1.1 }, { fontSize: 15 });
}
{ // 8-3
  const s = L.slide(p, '対象の指定');
  L.code(s, 'DELETE {{baseUrl}}/posts/1', { x: 0.6, y: 1.3, w: 7.0, h: 0.7 }, { fontSize: 20, valign: 'middle' });
  L.bullets(s, ['どのデータを削除するかは URL のパスで指定する（/posts/1 ＝ id が 1 の投稿）', 'ボディは通常送らない', '/posts（一覧）に DELETE を送ると、JSONPlaceholder は 404 を返す（全件削除はできない）'], { x: 0.6, y: 2.3, w: 12.1, h: 2.4 }, { fontSize: 16 });
  L.text(s, '※ /posts への DELETE の結果は 2026-10-09 に curl で確認', { x: 0.6, y: 4.9, w: 12, h: 0.4 }, { fontSize: 12, color: C.sub });
}
// 8-4 DELETE のリクエストを自分で作る（全体の流れ＋手順 1・2：scripts/ch678_steps.js）
K.ch8(p);
{ // 8-5
  const s = L.slide(p, '【手順 3/3】Body はそのまま Send して、レスポンスを確認する', { source: VERIFIED });
  L.sample(p, s, "samples の 08_DELETE\\01 Delete Post.yml を開いて Send");
  K.ch8Resp(s, p);
  L.steps(s, ['Body は No Body のまま「Send」', 'ステータス：200 OK', 'ボディ：{}（空のオブジェクト）→ Ctrl + S で保存'], { x: 10.05, y: 1.15, w: 2.8, h: 3.0 }, { fontSize: 13, space: 8 });
  L.callout(p, s, 'hint', '一般的には', '削除に成功したとき、200 OK を返す API もあれば、204 No Content（返す本文がない）を返す API もあります。どちらになるかは API の仕様で決まります。', { x: 0.45, y: 5.15, w: 12.4, h: 1.05 }, { fontSize: 13 });
}
{ // 8-6
  const s = L.slide(p, '⚠ JSONPlaceholder の制約（DELETE）', { source: JPG + '　' + VERIFIED });
  L.sample(p, s, "samples の 08_DELETE\\02 Check After Delete.yml を開いて Send");
  L.text(s, '"The resource is not really deleted on the server, but the response is faked as if."', { x: 0.45, y: 1.15, w: 12.4, h: 0.45 }, { fontSize: 14, italic: true, fill: C.pale });
  K.ch8Check(s, p);
  L.bullets(s, ['200 OK で、投稿 1 がそのまま返る', '→ 削除は保存されていない'], { x: 10.05, y: 2.45, w: 2.8, h: 2.4 }, { fontSize: 13 });
  L.callout(p, s, 'warn', '本物の API と違う点', '存在しない ID（例：/posts/999）に DELETE しても、JSONPlaceholder は 200 OK を返します。', { x: 0.45, y: 5.6, w: 12.4, h: 0.62 }, { fontSize: 12 });
}
{ // 8-7
  const s = L.slide(p, '演習問題8');
  L.sample(p, s, "samples の 08_DELETE\\Q1 Delete Comment 1.yml → Q2 Check Comment 1.yml の順に開いて Send（解答）");
  L.text(s, '08_DELETE フォルダに新しいリクエストを作りましょう。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16 });
  L.steps(s, ['/comments/1 を DELETE してください。ステータスとボディは何ですか？', '続けて /comments/1 を GET すると、何が返りますか？', '②の結果になる理由を説明してください。'], { x: 0.6, y: 1.8, w: 12.1, h: 2.4 }, { fontSize: 17, space: 12 });
}
{ // 8-8
  const s = L.slide(p, '演習問題8：期待する結果と解答', { source: '2026-10-09 に curl と Bruno CLI 4.2.1 で確認（answers/bruno-hands-on-answers/Ex08_DELETE）' });
  L.table(s, [['問題', '結果'], ['①', '200 OK、ボディ {}'], ['②', '200 OK。コメント 1 のデータがそのまま返る'], ['③', 'JSONPlaceholder は削除したふりをするだけで、データを本当には削除しないから']], { x: 0.6, y: 1.3, w: 12.1 }, { colW: [1.2, 10.9], fontSize: 16, rowH: 0.7 });
}
{ // 8-9
  const s = L.slide(p, '第4〜8章のまとめ：5 つのメソッドと JSONPlaceholder', { source: JPG + '　' + VERIFIED });
  L.table(s, [
    ['メソッド', '一般的な意味', 'JSONPlaceholder の成功時', 'データは保存される？'],
    ['GET', '取得', '200 OK', '—（読み取りのみ）'],
    ['POST', '作成', '201 Created（id 101 など）', '保存されない'],
    ['PATCH', '一部を変更', '200 OK（送った項目をマージ）', '保存されない'],
    ['PUT', '全体を置き換え', '200 OK（送った内容で置き換え）', '保存されない'],
    ['DELETE', '削除', '200 OK、{}', '保存されない（削除されない）'],
  ], { x: 0.6, y: 1.25, w: 12.1 }, { colW: [1.6, 2.6, 4.4, 3.5], fontSize: 15, rowH: 0.55 });
  L.text(s, '確認できること：リクエストの作り方、ステータスコード、レスポンスの形（PUT と PATCH の違いなど）\n確認できないこと：データの保存・変更・削除、認証エラー、入力チェックのエラー、存在しない ID に対する正しいエラー', { x: 0.6, y: 4.75, w: 12.1, h: 1.1 }, { fontSize: 15, fill: C.pale });
}

const out = path.join(L.ROOT, 'slides', process.env.OUT_NAME || 'part03_ch06-08.pptx');
console.log('fit:', L.fitSamples(p).join(' '));
p.writeFile({ fileName: out }).then(f => console.log('wrote', f));
