// 第10章 Mambu 机上演習：ステップ①〜⑦の詳細手順（1 操作 = 1 スライド）
// 画像：Bruno v4.2.1 の実画面（2026-10-13 撮影、3840x2064 = CSS 1920x1032 の 2 倍）。値はすべてダミー。Send は押していない。
// 枠の座標：ch10m_boxes.json（撮影時に DOM から取得した CSS px）。crop も CSS px で指定する。
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const L = require('./lib');
const { C } = L;
const BOX = require('./ch10m_boxes.json');
const DIR = path.join(L.ROOT, 'assets', 'screenshots', 'ch10m');
const SHOT = '実画面（Bruno v4.2.1、2026-10-13 撮影）。値はダミーで、Send は押していません';
const COL = 'exercises' + String.fromCharCode(92) + 'mambu-corporate-onboarding' + String.fromCharCode(92);
const T0 = { tag: '未実行' };

// 切り出し範囲（CSS px）
const CROP = {
  req: [250, 90, 1050, 540], // リクエストの左半分（URL・タブ・入力欄）
  full: [0, 0, 1920, 1032],
  saved: [1180, 40, 1920, 640], // 保存アイコンと Send の周り
  env: [500, 110, 1300, 560],
  colh: [0, 40, 1120, 520], // コレクションの設定（左のサイドバー＋Headers タブ）
  envsel: [1100, 30, 1920, 490],
  ctx: [0, 30, 1000, 600],
};
const dlgCrop = (b, h) => [b.name[0] - 60, 40, b.name[2] + 60, h || 440];

// 画像を切り出して保存（キャッシュ）し、ファイル名を返す
function cropped(name, c) {
  const src = path.join(DIR, name + '.png');
  const out = path.join(DIR, `z_${name}_${c.join('_')}.png`);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs) {
    execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${path.join(__dirname, 'crop.ps1')}" "${src}" "${out}" ${c[0]} ${c[1]} ${c[2] - c[0]} ${c[3] - c[1]} 2`);
  }
  return out;
}

// 参考コレクションの .yml から Post Response のスクリプトを取り出す（スライドとファイルの中身をそろえる）
function scriptOf(file) { return blockOf(file, 'code: |-'); }
function bodyOf(file) { return blockOf(file, 'data: |-'); }
function blockOf(file, key) {
  const y = fs.readFileSync(path.join(L.ROOT, 'exercises', 'mambu-corporate-onboarding', file), 'utf8').replace(/\r/g, '').split('\n');
  const i = y.findIndex(l => l.trim() === key);
  if (i < 0) throw new Error('スクリプトがない：' + file);
  const ind = y[i + 1].match(/^ */)[0].length, out = [];
  for (let k = i + 1; k < y.length && (y[k].trim() === '' || y[k].match(/^ */)[0].length >= ind); k++) out.push(y[k].slice(ind));
  return out.join('\n').replace(/\s+$/, '');
}

// 1 手順スライド：左に画像、右に手順と補足。frames = [[番号, 枠のキー or [x1,y1,x2,y2], {pos}], ...]
function stepSlide(p, title, name, crop, frames, steps, opt = {}) {
  const s = L.slide(p, title, { tag: '未実行' });
  const IMG = opt.code ? { x: 0.45, y: 1.15, w: 6.2, h: 4.75 } : { x: 0.45, y: 1.15, w: 8.4, h: 4.75 };
  const R = L.image(s, cropped(name, crop), IMG, opt.label || SHOT, { align: 'left', valign: 'top' });
  frames.forEach(([n, k, o]) => {
    const b = typeof k === 'string' ? BOX[name][k] : k;
    if (!b) throw new Error(`枠がない：${name}.${k}`);
    L.hl(p, s, R, n, [b[0] - crop[0], b[1] - crop[1], b[2] - crop[0], b[3] - crop[1]].map(v => v * 2), o);
  });
  if (opt.code) {
    const X = 6.85, Wd = 6.05;
    L.steps(s, steps, { x: X, y: 1.15, w: Wd, h: opt.stepsH || 1.2 }, { fontSize: 12.5, space: 4 });
    const cy = opt.codeY || 2.65, ch = opt.codeH || 2.0;
    L.code(s, opt.code, { x: X, y: cy, w: Wd, h: ch }, { fontSize: opt.codeSize || 10, label: opt.codeLabel || 'コピー用（この枠の中を全部コピーして、Post Response に貼り付ける）' });
    if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: X, y: cy + ch + 0.12, w: Wd, h: opt.noteH || 0.9 }, { fontSize: 11, valign: 'top' });
    if (opt.sample) L.sample(p, s, opt.sample);
    return s;
  }
  L.steps(s, steps, { x: 9.05, y: 1.2, w: 3.85, h: opt.stepsH || 3.4 }, { fontSize: opt.fontSize || 13, space: 7 });
  (opt.masks || []).forEach(([x1, y1, x2, y2, label]) => { const a = R.px((x1 - crop[0]) * 2, (y1 - crop[1]) * 2), b = R.px((x2 - crop[0]) * 2, (y2 - crop[1]) * 2); s.addText(label || '', { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, fontSize: 9, color: '374151', fill: { color: 'FFFFFF' }, margin: 1, valign: 'middle' }); });
  if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: 9.05, y: opt.noteY || 4.5, w: 3.85, h: opt.noteH || 1.65 }, { fontSize: 11.5, valign: 'top' });
  if (opt.sample) L.sample(p, s, opt.sample);
  return s;
}

// ステップの概要スライド
function overview(p, title, rows, opt = {}) {
  const s = L.slide(p, title, { tag: '未実行', source: opt.source });
  L.table(s, [['項目', '内容'], ...rows], { x: 0.6, y: 1.25, w: 12.1 }, { colW: [2.6, 9.5], fontSize: 14, rowH: 0.5 });
  if (opt.flow) L.text(s, opt.flow, { x: 0.6, y: 5.0, w: 12.1, h: 0.45 }, { fontSize: 14, bold: true, color: C.navy });
  if (opt.note) L.callout(p, s, opt.noteKind || 'hint', opt.noteTitle || null, opt.note, { x: 0.6, y: 5.5, w: 12.1, h: 0.75 }, { fontSize: 12.5 });
  return s;
}

const sample = (f) => `参考コレクション ${COL}${f} を開いて、自分の入力と比べる`;
// 保存のスライド（共通）
function savedSlide(p, title, name, expect, f, opt = {}) {
  return stepSlide(p, title, name, CROP.saved, [[1, 'save', { pos: 'l' }], [2, 'send', { pos: 'bl' }]],
    ['Ctrl + S を押して保存する（または ① の保存アイコンをクリック）', '保存すると、① のアイコンがオレンジから灰色に変わる（タブの名前の右のオレンジの点も消える）', '② の Send は押さない（Ctrl + Enter も押さない。この教材では送信しない）', ...(opt.more || [])],
    { note: expect, noteKind: 'ok', noteTitle: '実際に Send したときの期待する結果', noteY: opt.noteY || 3.85, noteH: opt.noteH || 2.3, sample: sample(f) });
}

const steps = (p, SRC) => {
  // ================= ステップ① =================
  overview(p, 'ステップ①：設定値を確認する（GET を 3 つ作る）', [
    ['目的', '組織のテナントにある「支店」「預金商品」「取引チャネル」の一覧を取り出し、あとのステップで使う key や ID を確認する'],
    ['作るリクエスト', '01 Get Branches：GET {{baseUrl}}/branches\n02 Get Deposit Products：GET {{baseUrl}}/depositproducts\n03 Get Transaction Channels：GET {{baseUrl}}/organization/transactionChannels?transactionChannelState=ACTIVE'],
    ['使う値（入力）', '{{baseUrl}}（環境変数）。ヘッダー Accept・apiKey・User-Agent はコレクションの設定から自動で付く（準備4）'],
    ['出力', '01：支店の一覧に準備3 の branchKey があるか確認\n02・03：Script で depositProductKey・channelId を環境に自動で保存（手で書き写さない）'],
    ['アサーション', 'res.status equals 200'],
  ], { source: SRC.spec('branches.json・depositproducts.json・organization_transactionChannels.json'), flow: '手順：New Request → 名前と URL → Create → Assert（02・03 は Script も）→ 保存（× 3 回）→ 環境を確認', note: '画面の操作は 3 つとも同じです。1 つ目（01 Get Branches）で手順を細かく説明し、2 つ目・3 つ目は違うところ（Script）を説明します。' });
  stepSlide(p, 'ステップ①【1/9】コレクションを右クリック → New Request', 's1_01_ctx', CROP.ctx, [[1, 'col'], [2, 'menu']],
    ['サイドバーで mambu-practice（コレクション名）を右クリック', 'メニューの「New Request」をクリック'],
    { note: 'コレクション名の下の「+ Add request」からも作れます。画面右上の環境が「Mambu-Sandbox」になっていることも確認しましょう（準備3）。' });
  stepSlide(p, 'ステップ①【2/9】名前と URL を入力して Create', 's1_02_dialog', dlgCrop(BOX.s1_02_dialog), [[1, 'name'], [2, 'url'], [3, 'create', { pos: 'r' }]],
    ['Request Name：01 Get Branches', 'URL：{{baseUrl}}/branches（左のメソッドは GET のまま）', '「Create」をクリック'],
    { note: '{{baseUrl}} が緑色なら、環境の変数が見つかっています。赤色のときは、画面右上で環境 Mambu-Sandbox を選びます。' });
  stepSlide(p, 'ステップ①【3/9】Assert を入れて保存する（Send は押さない）', 's1_04_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'expr'], [3, 'op', { pos: 'tl' }], [4, 'val', { pos: 'tr' }]],
    ['「Assert」タブをクリック', 'Expr：res.status', 'Operator：equals（初期値のまま）', 'Value：200 → Ctrl + S で保存（Send は押さない）'],
    { note: '200 OK と支店の一覧（[ ] の配列）。準備3 で入れた branchKey と同じ encodedKey の支店があるかを確かめる。Headers タブには何も入れません（準備4 の共通ヘッダーが自動で付く）。', noteKind: 'ok', noteTitle: '実際に Send したとき', noteY: 4.0, noteH: 2.15, sample: sample('01 Get Branches.yml') });
  stepSlide(p, 'ステップ①【4/9】02 Get Deposit Products を作る', 's1_06_dialog', dlgCrop(BOX.s1_06_dialog), [[1, 'name'], [2, 'url'], [3, 'create', { pos: 'r' }]],
    ['【1/9】と同じく右クリック → New Request', 'Request Name：02 Get Deposit Products', 'URL：{{baseUrl}}/depositproducts →「Create」', 'Assert タブ：res.status equals 200'],
    { note: '次のスライドで、レスポンスから預金商品の key を探して環境に保存するスクリプトを入れます。' });
  stepSlide(p, 'ステップ①【5/9】Script：預金商品の key を環境に自動で保存', 's1_06b_script02', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'sub', { pos: 'tr' }], [3, 'editor']],
    ['「Script」タブ →「Post Response」を選ぶ', '下の枠のスクリプトをコピーして貼り付ける', 'Ctrl + S で保存（Send は押さない）'],
    { code: scriptOf('02 Get Deposit Products.yml'), codeY: 2.6, codeH: 2.75, codeSize: 9, note: '「当座・ACTIVE・JPY」の商品の encodedKey を環境の depositProductKey に保存します。複数あるときは最初の 1 つ。組織の指定と違うときは条件を直します。', noteH: 0.75, sample: sample('02 Get Deposit Products.yml') });
  stepSlide(p, 'ステップ①【6/9】03 Get Transaction Channels を作る', 's1_08_dialog', dlgCrop(BOX.s1_08_dialog), [[1, 'name'], [2, 'url'], [3, 'create', { pos: 'r' }]],
    ['右クリック → New Request', 'Request Name：03 Get Transaction Channels', 'URL：{{baseUrl}}/organization/transactionChannels?transactionChannelState=ACTIVE', '「Create」をクリック'],
    { note: 'URL の「?」より後ろはクエリ（第3・9章）。transactionChannelState=ACTIVE で「有効な取引チャネルだけ」に絞り込みます。' });
  stepSlide(p, 'ステップ①【7/9】Params タブでクエリを確かめる', 's1_09_params', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'row']],
    ['「Params」タブをクリック', 'Query に transactionChannelState ＝ ACTIVE の行が自動で入っていることを確認'],
    { note: 'URL にクエリを書くと Params タブに自動で反映されます。逆に Params タブで入力しても URL に反映されます（第4章 4-9）。' });
  stepSlide(p, 'ステップ①【8/9】Assert と Script を入れて保存する', 's1_09b_script03', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'sub', { pos: 'tr' }], [3, 'editor']],
    ['Assert タブ：res.status equals 200', '「Script」タブ →「Post Response」に、下の枠のスクリプトを貼り付ける', 'Ctrl + S で保存（Send は押さない）'],
    { code: scriptOf('03 Get Transaction Channels.yml'), codeY: 2.6, codeH: 2.3, codeSize: 9.5, note: '既定（isDefault）の取引チャネル（なければ最初のチャネル）の id を、環境の channelId に保存します。', noteH: 0.75, sample: sample('03 Get Transaction Channels.yml') });
  stepSlide(p, 'ステップ①【9/9】環境を確認し、残りの 2 つを入れる', 'p09_env_final', CROP.env, [[1, 'auto'], [2, 'manual'], [3, 'save', { pos: 'l' }]],
    ['実際の環境で 02・03 を Send すると、depositProductKey と channelId に値が自動で入る（Script が保存。この教材では Send しないので SET_BY_ORGANIZATION のまま）', 'groupTypeKey・roleNameKey だけは組織から受け取った値を手で入力する（API で取る方法が公式資料で確認できていないため）', '「Save」をクリック'],
    { label: '実画面（Bruno v4.2.1、2026-10-13 撮影）。値はダミー。①は動作確認用の模擬サーバー（作成者の PC）に送って Script で保存された値で、Mambu には送っていません', note: 'bru.setVar（ステップ②〜④で使う）はその場かぎりの値ですが、bru.setEnvVar は環境に保存され、Bruno を閉じても残ります（v4 の公式ドキュメント）。', noteY: 4.4, noteH: 1.75 });

  // ================= ステップ② =================
  overview(p, 'ステップ②：役員を個人顧客（Client）として登録する', [
    ['目的', '法人のメンバー（代表取締役など）になる人を、先に個人の顧客として登録する'],
    ['作るリクエスト', '04 Create Director Client：POST {{baseUrl}}/clients'],
    ['使う値（入力）', '{{branchKey}}（準備3 で入れた環境変数）、{{$randomUUID}}（Bruno が送信のたびに作る値）'],
    ['保存する値（出力）', 'レスポンスの encodedKey → 変数 directorClientKey（ステップ③で使う）'],
    ['アサーション', 'res.status equals 201'],
  ], { source: SRC.spec('clients.json'), flow: '手順：New Request（POST を選ぶ）→ Headers → Body（JSON）→ Script → Assert → 保存', note: 'POST のリクエストは GET より設定する場所が多くなります。ステップ②で Headers・Body・Script の入れ方を 1 つずつ説明します。' });
  stepSlide(p, 'ステップ②【1/9】New Request でメソッドを POST にする', 's2_01_method', dlgCrop(BOX.s2_01_method, 640), [[1, 'name'], [2, 'method'], [3, 'post']],
    ['右クリック → New Request。Request Name：04 Create Director Client', 'URL 欄の左の「GET ▼」をクリック', '一覧から「POST」を選ぶ'],
    { note: 'メソッドは、作ったあとに URL 欄の左（リクエストの画面）でも変えられます。' });
  stepSlide(p, 'ステップ②【2/9】URL を入力して Create', 's2_02_dialog', dlgCrop(BOX.s2_02_dialog), [[1, 'method'], [2, 'url', { pos: 'tr' }], [3, 'create', { pos: 'r' }]],
    ['メソッドが POST になっていることを確認', 'URL：{{baseUrl}}/clients', '「Create」をクリック'],
    { note: 'サイドバーに「POST 04 Create Director Client」が追加されます。' });
  stepSlide(p, 'ステップ②【3/9】Headers タブに Idempotency-Key を入れる', 's2_07_headers', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'name'], [3, 'value', { pos: 'tr' }]],
    ['「Headers」タブをクリック', 'Name：Idempotency-Key', 'Value：{{$randomUUID}}'],
    { note: '二重登録を防ぐためのヘッダーです（準備5）。{{$randomUUID}} は送信のたびに新しい値になります（第9章 TIPS の動的変数）。' });
  stepSlide(p, 'ステップ②【4/9】Body タブで種類を JSON にする', 's2_04_bodytype', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'dd', { pos: 'tr' }], [3, 'json']],
    ['「Body」タブをクリック（最初は No Body）', '右の「No Body ▼」をクリック', 'RAW の「JSON」を選ぶ'],
    { note: 'JSON を選ぶと、送信時に Content-Type: application/json が自動で付きます（第5章）。Mambu の POST では必須です。' });
  stepSlide(p, 'ステップ②【5/9】Body に JSON を入力する', 's2_06_body', CROP.req, [[1, 'dd', { pos: 'tr' }], [2, 'editor']],
    ['種類が「JSON」になっていることを確認', '下の枠の JSON をコピーして、Body の入力欄に貼り付ける'],
    { code: bodyOf('04 Create Director Client.yml'), codeLabel: 'コピー用（この枠の中を全部コピーして、Body の入力欄に貼り付ける）', codeY: 2.3, codeH: 1.35, codeSize: 11, note: 'firstName（名）・lastName（姓）は必須。{{branchKey}} は送るときに環境の値に置き換わります。手で打つときは、{{branchKey}} の前後の " を忘れないようにします。', noteH: 1.15 });
  stepSlide(p, 'ステップ②【6/9】Script タブで値を保存する処理を書く', 's2_08_script', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'sub', { pos: 'tr' }], [3, 'editor']],
    ['「Script」タブをクリック', '「Post Response」（レスポンスを受け取った後）を選ぶ', '下の枠のスクリプトをコピーして貼り付ける'],
    { code: scriptOf('04 Create Director Client.yml'), codeY: 2.6, codeH: 1.0, codeSize: 10, note: 'res.body.encodedKey（レスポンスの encodedKey）を、directorClientKey という名前で保存します。次のステップで {{directorClientKey}} として使えます（第9章 TIPS「値の受け渡し」）。', noteH: 1.2 });
  stepSlide(p, 'ステップ②【7/9】Assert タブで 201 を確認する設定', 's2_09_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', 'Expr：res.status、Operator：equals、Value：201'],
    { note: '201 Created は「作成できた」という意味です（第5章）。GET の 200 と間違えないようにしましょう。' });
  savedSlide(p, 'ステップ②【8/9】保存する（Send は押さない）', 's2_10_saved',
    '201 Created。Tests タブで Assertions が Passed。Post Response のスクリプトで directorClientKey が保存される。', '04 Create Director Client.yml');
  {
    const s = L.slide(p, 'ステップ②【9/9】レスポンスで見るところと、顧客の状態', { tag: '未実行', source: SRC.spec('clients.json') + ' ／ ' + SRC.ctl });
    L.code(s, '{\n  "encodedKey": "（Mambu が付けた値）",   ← directorClientKey に保存\n  "id": "（顧客の ID）",\n  "state": "INACTIVE または PENDING_APPROVAL",\n  "firstName": "太郎",\n  "lastName": "山田", ...\n}', { x: 0.6, y: 1.6, w: 7.5, h: 2.4 }, { fontSize: 13, label: 'レスポンスで見るところ（値の例は省略）' });
    L.callout(p, s, 'warn', '顧客の状態に注意', '作った直後の状態は、テナントの設定（Internal Controls の New Client Initial State）で「INACTIVE」か「PENDING_APPROVAL（承認待ち）」になります。承認待ちの顧客は口座を開設できません（公式）。API で承認する方法は公式資料で確認できていません。', { x: 8.4, y: 1.6, w: 4.3, h: 2.9 }, { fontSize: 12, valign: 'top' });
    L.text(s, '確認したいとき：Timeline タブ（レスポンス側）で、実際に送ったヘッダーと Body を確認できます（第9章）。', { x: 0.6, y: 4.3, w: 7.5, h: 0.7 }, { fontSize: 13 });
  }

  // ================= ステップ③ =================
  overview(p, 'ステップ③：法人をグループ（Group）として登録する', [
    ['目的', '法人（株式会社サンプル）を Group として登録し、ステップ②の役員をメンバーに加える'],
    ['作るリクエスト', '05 Create Corporate Group：POST {{baseUrl}}/groups'],
    ['使う値（入力）', '{{groupTypeKey}}・{{branchKey}}・{{roleNameKey}}（環境変数）、{{directorClientKey}}（ステップ②で保存）'],
    ['保存する値（出力）', 'レスポンスの encodedKey → 変数 groupEncodedKey（ステップ④で使う）'],
    ['アサーション', 'res.status equals 201'],
  ], { source: SRC.spec('groups.json'), flow: '手順：New Request（POST）→ Headers → Body（JSON）→ Script → Assert → 保存（ステップ②と同じ流れ）' });
  stepSlide(p, 'ステップ③【1/7】POST のリクエストを作る', 's3_02_dialog', dlgCrop(BOX.s3_02_dialog), [[1, 'name'], [2, 'method'], [3, 'url', { pos: 'tr' }], [4, 'create', { pos: 'r' }]],
    ['右クリック → New Request。Request Name：05 Create Corporate Group', 'メソッド：POST', 'URL：{{baseUrl}}/groups', '「Create」をクリック']);
  stepSlide(p, 'ステップ③【2/7】Headers タブに Idempotency-Key', 's3_04_headers', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'name'], [3, 'value', { pos: 'tr' }]],
    ['「Headers」タブをクリック', 'Name：Idempotency-Key', 'Value：{{$randomUUID}}'],
    { note: 'POST のリクエストには毎回付けます（ステップ②と同じ）。' });
  stepSlide(p, 'ステップ③【3/7】Body を JSON にして入力する', 's3_05_body', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'dd', { pos: 'tr' }], [3, 'editor']],
    ['「Body」タブ →「No Body ▼」→「JSON」を選ぶ', '下の枠の JSON をコピーして貼り付ける（項目の意味は次のスライド）'],
    { code: bodyOf('05 Create Corporate Group.yml'), codeLabel: 'コピー用（この枠の中を全部コピーして、Body の入力欄に貼り付ける）', codeY: 2.3, codeH: 2.45, codeSize: 10, note: '{{directorClientKey}} が赤色なのは、まだ値がないためです（ステップ②を Send して保存されるまでは値がない）。この教材では送信しないので、赤のままで正常です。', noteKind: 'warn', noteTitle: '赤い変数について', noteH: 1.15 });
  {
    const s = L.slide(p, 'ステップ③【4/7】Body の項目と groupMembers の読み方', { tag: '未実行', source: SRC.spec('groups.json') });
    L.code(s, '{\n  "groupName": "株式会社サンプル",        ← 法人名（必須）\n  "groupRoleKey": "{{groupTypeKey}}",     ← Group の種類（法人用）\n  "assignedBranchKey": "{{branchKey}}",   ← 担当支店\n  "groupMembers": [                       ← メンバーの一覧（配列）\n    {                                     ← 1 人目\n      "clientKey": "{{directorClientKey}}",  ← 誰か（ステップ②で保存）\n      "roles": [ { "groupRoleNameKey": "{{roleNameKey}}" } ]  ← 役職\n    }\n  ]\n}', { x: 0.6, y: 1.3, w: 8.4, h: 3.6 }, { fontSize: 12 });
    L.callout(p, s, 'hint', '第1章の復習', '[ ] は配列（複数を並べる）、{ } はオブジェクト（項目のまとまり）。入れ子になっていても読み方は同じです。', { x: 9.3, y: 1.3, w: 3.4, h: 2.0 }, { fontSize: 13, valign: 'top' });
    L.bullets(s, ['メンバーを 2 人にするときは、{ } を , で区切って並べる', '[ ] と { } の対応を間違えると 400 エラーになる', 'groupRoleKey・assignedBranchKey は仕様上は任意だが、テナントの設定で必要になる場合がある（条件は未確認）'], { x: 0.6, y: 5.05, w: 12.1, h: 1.2 }, { fontSize: 13, space: 4 });
  }
  stepSlide(p, 'ステップ③【5/7】Script タブで法人の key を保存する', 's3_06_script', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'sub', { pos: 'tr' }], [3, 'editor']],
    ['「Script」タブをクリック', '「Post Response」を選ぶ', '下の枠のスクリプトをコピーして貼り付ける'],
    { code: scriptOf('05 Create Corporate Group.yml'), codeY: 2.6, codeH: 1.0, codeSize: 10, note: '保存した groupEncodedKey は、ステップ④で口座の名義人（accountHolderKey）として使います。', noteH: 0.9 });
  stepSlide(p, 'ステップ③【6/7】Assert タブで 201 を確認する設定', 's3_07_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', 'Expr：res.status、Operator：equals、Value：201']);
  savedSlide(p, 'ステップ③【7/7】保存する（Send は押さない）', 's3_08_saved',
    '201 Created。レスポンスの encodedKey（法人の内部キー）が groupEncodedKey に保存される。Group には「承認待ち」のような状態の項目はない（公式仕様）。', '05 Create Corporate Group.yml');

  // ================= ステップ④ =================
  overview(p, 'ステップ④：法人の預金口座を作る', [
    ['目的', 'ステップ③の法人を名義人として、預金口座（当座預金）を作る'],
    ['作るリクエスト', '06 Create Deposit Account：POST {{baseUrl}}/deposits'],
    ['使う値（入力）', '{{groupEncodedKey}}（ステップ③で保存）、{{depositProductKey}}・{{branchKey}}（環境変数）'],
    ['保存する値（出力）', 'レスポンスの id → 変数 depositId（ステップ⑤〜⑦の URL で使う）'],
    ['アサーション', 'res.status equals 201、res.body.accountState equals PENDING_APPROVAL'],
  ], { source: SRC.spec('deposits.json') + ' ／ ' + SRC.life, flow: '手順：New Request（POST）→ Headers → Body（JSON）→ Script → Assert（2 行）→ 保存', note: '作った直後の口座は PENDING_APPROVAL（承認待ち）です。アサーションを 2 行にして、状態も自動で確認します。' });
  stepSlide(p, 'ステップ④【1/7】POST のリクエストを作る', 's4_02_dialog', dlgCrop(BOX.s4_02_dialog), [[1, 'name'], [2, 'method'], [3, 'url', { pos: 'tr' }], [4, 'create', { pos: 'r' }]],
    ['右クリック → New Request。Request Name：06 Create Deposit Account', 'メソッド：POST', 'URL：{{baseUrl}}/deposits', '「Create」をクリック']);
  stepSlide(p, 'ステップ④【2/7】Headers タブに Idempotency-Key', 's4_04_headers', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'name'], [3, 'value', { pos: 'tr' }]],
    ['「Headers」タブをクリック', 'Name：Idempotency-Key', 'Value：{{$randomUUID}}']);
  stepSlide(p, 'ステップ④【3/7】Body を JSON にして入力する', 's4_05_body', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'dd', { pos: 'tr' }], [3, 'editor']],
    ['「Body」タブ →「No Body ▼」→「JSON」', '下の枠の JSON をコピーして貼り付ける（項目の意味は次のスライド）'],
    { code: bodyOf('06 Create Deposit Account.yml'), codeLabel: 'コピー用（この枠の中を全部コピーして、Body の入力欄に貼り付ける）', codeY: 2.3, codeH: 2.1, codeSize: 10.5, note: 'accountHolderType は "GROUP"（法人）です。個人の口座なら "CLIENT" にします。', noteH: 0.8 });
  {
    const s = L.slide(p, 'ステップ④【4/7】Body の項目の意味', { tag: '未実行', source: SRC.spec('deposits.json') + ' ／ ' + SRC.err });
    L.table(s, [['項目', '入れる値', '意味', '必須'],
      ['name', '法人当座', '口座の名前', '必須'],
      ['accountHolderType', 'GROUP', '名義人の種類。法人は GROUP（個人は CLIENT）', '必須'],
      ['accountHolderKey', '{{groupEncodedKey}}', '名義人の encodedKey（ステップ③で保存）', '必須'],
      ['productTypeKey', '{{depositProductKey}}', '預金商品の key（ステップ①の 02 の Script で保存）', '必須'],
      ['accountType', 'CURRENT_ACCOUNT', '口座の種類（CURRENT_ACCOUNT＝当座 など）', '実質必須※'],
      ['currencyCode', 'JPY', '通貨（商品の設定と合わせる）', '任意'],
      ['assignedBranchKey', '{{branchKey}}', '担当支店', '任意']], { x: 0.6, y: 1.25, w: 12.1 }, { colW: [2.6, 2.9, 5.2, 1.4], fontSize: 13, rowH: 0.48 });
    L.callout(p, s, 'warn', null, '※ 仕様上は任意ですが、公式のエラー一覧に「accountType がないと 410 SAVINGS_ACCOUNT_INVALID」とあります。商品の設定と合わない値は 2814 DEPOSIT_PRODUCT_MISMATCH になります。', { x: 0.6, y: 5.3, w: 12.1, h: 0.85 }, { fontSize: 12 });
  }
  stepSlide(p, 'ステップ④【5/7】Script タブで口座の id を保存する', 's4_06_script', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'sub', { pos: 'tr' }], [3, 'editor']],
    ['「Script」タブをクリック', '「Post Response」を選ぶ', '下の枠のスクリプトをコピーして貼り付ける'],
    { code: scriptOf('06 Create Deposit Account.yml'), codeY: 2.6, codeH: 1.0, codeSize: 10, note: 'ここだけ encodedKey ではなく id を保存します。口座の URL（/deposits/{{depositId}}）に入れて使うためです。', noteH: 0.9 });
  stepSlide(p, 'ステップ④【6/7】Assert タブに 2 行入れる', 's4_07_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', '1 行目：res.status equals 201', '2 行目：res.body.accountState equals PENDING_APPROVAL'],
    { note: '1 行入力すると、下に新しい空の行が出ます。Expr 欄は幅が狭いので、長い式は途中で切れて見えますが、入力した値は保存されます。' });
  savedSlide(p, 'ステップ④【7/7】保存する（Send は押さない）', 's4_08_saved',
    '201 Created。accountState が PENDING_APPROVAL（承認待ち）でアサーション 2 件が Passed。レスポンスの id が depositId に保存される。', '06 Create Deposit Account.yml');

  // ================= ステップ⑤ =================
  overview(p, 'ステップ⑤：口座を承認する', [
    ['目的', '承認待ち（PENDING_APPROVAL）の口座を承認し、APPROVED（承認済み）にする'],
    ['作るリクエスト', '07 Approve Deposit Account：POST {{baseUrl}}/deposits/{{depositId}}:changeState'],
    ['使う値（入力）', '{{depositId}}（ステップ④で保存。URL の中で使う）'],
    ['保存する値（出力）', 'なし'],
    ['アサーション', 'res.status equals 200、res.body.accountState equals APPROVED'],
  ], { source: SRC.spec('deposits.json'), flow: '手順：New Request（POST）→ Headers → Body（JSON）→ Assert（2 行）→ 保存（Script はなし）', note: 'URL の最後の「:changeState」は「状態を変える」という意味のパスです。作成ではないので、成功は 201 ではなく 200 です。' });
  stepSlide(p, 'ステップ⑤【1/6】URL に変数を入れてリクエストを作る', 's5_02_dialog', dlgCrop(BOX.s5_02_dialog), [[1, 'name'], [2, 'method'], [3, 'url', { pos: 'tr' }], [4, 'create', { pos: 'r' }]],
    ['右クリック → New Request。Request Name：07 Approve Deposit Account', 'メソッド：POST', 'URL：{{baseUrl}}/deposits/{{depositId}}:changeState', '「Create」をクリック']);
  stepSlide(p, 'ステップ⑤【2/6】URL の赤い変数を確認する', 's5_03_created', CROP.req, [[1, [277, 132, 1055, 166]]],
    ['URL 欄で {{depositId}} が赤色になっていることを確認'],
    { note: 'depositId は、ステップ④を Send したときに Script で保存される変数です。まだ送信していないので値がなく、赤色で表示されます。実際の環境では、④ → ⑤ の順に送れば値が入ります。', noteKind: 'warn', noteTitle: '赤い変数について', noteY: 2.6, noteH: 2.2 });
  stepSlide(p, 'ステップ⑤【3/6】Headers タブに Idempotency-Key', 's5_04_headers', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'name'], [3, 'value', { pos: 'tr' }]],
    ['「Headers」タブをクリック', 'Name：Idempotency-Key', 'Value：{{$randomUUID}}']);
  stepSlide(p, 'ステップ⑤【4/6】Body で操作（action）を指定する', 's5_05_body', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'dd', { pos: 'tr' }], [3, 'editor']],
    ['「Body」タブ →「No Body ▼」→「JSON」', '下の枠の JSON をコピーして貼り付ける'],
    { code: bodyOf('07 Approve Deposit Account.yml'), codeLabel: 'コピー用（この枠の中を全部コピーして、Body の入力欄に貼り付ける）', codeY: 2.3, codeH: 1.1, codeSize: 11, note: 'action（必須）：APPROVE＝承認。ほかに UNDO_APPROVE（承認の取り消し）・LOCK・CLOSE など。notes はメモ（任意）。KYC は本人確認のことです。', noteH: 1.15 });
  stepSlide(p, 'ステップ⑤【5/6】Assert タブに 2 行入れる', 's5_07_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', '1 行目：res.status equals 200', '2 行目：res.body.accountState equals APPROVED'],
    { note: '承認できない状態の口座に APPROVE を送ると、400 INVALID_SAVINGS_ACCOUNT_STATE_TRANSITION（状態を変えられない）になります。', noteKind: 'warn' });
  savedSlide(p, 'ステップ⑤【6/6】保存する（Send は押さない）', 's5_08_saved',
    '200 OK。レスポンスは口座の情報で、accountState が APPROVED（承認済み）。アサーション 2 件が Passed。', '07 Approve Deposit Account.yml');

  // ================= ステップ⑥ =================
  overview(p, 'ステップ⑥：初回入金をする', [
    ['目的', '承認済みの口座に 10,000 円を入金する。最初の取引で、口座は自動的に ACTIVE（利用中）になる'],
    ['作るリクエスト', '08 First Deposit：POST {{baseUrl}}/deposits/{{depositId}}/deposit-transactions'],
    ['使う値（入力）', '{{depositId}}（ステップ④で保存）、{{channelId}}（ステップ①の Script で保存した環境変数）'],
    ['保存する値（出力）', 'なし'],
    ['アサーション', 'res.status equals 201'],
  ], { source: SRC.spec('deposits_transactions.json') + ' ／ ' + SRC.life, flow: '手順：New Request（POST）→ Headers → Body（JSON）→ Assert → 保存（Script はなし）', note: '"Once the client makes any transaction … on the account, it will become "Active"."（公式）＝ 承認済みの口座で取引をすると ACTIVE になる。' });
  stepSlide(p, 'ステップ⑥【1/6】POST のリクエストを作る', 's6_02_dialog', dlgCrop(BOX.s6_02_dialog), [[1, 'name'], [2, 'method'], [3, 'url', { pos: 'tr' }], [4, 'create', { pos: 'r' }]],
    ['右クリック → New Request。Request Name：08 First Deposit', 'メソッド：POST', 'URL：{{baseUrl}}/deposits/{{depositId}}/deposit-transactions', '「Create」をクリック']);
  stepSlide(p, 'ステップ⑥【2/6】Headers タブに Idempotency-Key', 's6_04_headers', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'name'], [3, 'value', { pos: 'tr' }]],
    ['「Headers」タブをクリック', 'Name：Idempotency-Key', 'Value：{{$randomUUID}}'],
    { note: 'お金を動かす操作では特に大切です。通信が切れて再送しても、同じキーなら入金が 2 回にならない（準備5）。' });
  stepSlide(p, 'ステップ⑥【3/6】Body に入金額と取引チャネルを入れる', 's6_05_body', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'dd', { pos: 'tr' }], [3, 'editor']],
    ['「Body」タブ →「No Body ▼」→「JSON」', '下の枠の JSON をコピーして貼り付ける'],
    { code: bodyOf('08 First Deposit.yml'), codeLabel: 'コピー用（この枠の中を全部コピーして、Body の入力欄に貼り付ける）', codeY: 2.3, codeH: 1.35, codeSize: 10.5, note: 'amount（必須）は数値なので " で囲みません（第1章）。取引チャネルが必須かどうかはテナントの設定によります（必須なのに無いと 228 TRANSACTION_CHANNEL_IS_MANDATORY）。', noteH: 1.3 });
  stepSlide(p, 'ステップ⑥【4/6】Assert タブで 201 を確認する設定', 's6_07_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', 'Expr：res.status、Operator：equals、Value：201'],
    { note: '入金のレスポンスは「取引」の情報です。口座の状態（ACTIVE）は、ステップ⑦で口座を取得して確認します。' });
  savedSlide(p, 'ステップ⑥【5/6】保存する（Send は押さない）', 's6_08_saved',
    '201 Created。レスポンスは入金の取引（DepositTransaction）の情報。', '08 First Deposit.yml');
  {
    const s = L.slide(p, 'ステップ⑥【6/6】入金のレスポンスと口座の変化', { tag: '未実行', source: SRC.spec('deposits_transactions.json') + ' ／ ' + SRC.life });
    L.table(s, [['レスポンスの項目', '意味'], ['id／encodedKey', '取引の識別子'], ['type', '取引の種類（DEPOSIT＝入金）'], ['amount', '入金額'], ['accountBalances', '取引後の残高'], ['parentAccountKey', '入金した口座']], { x: 0.6, y: 1.3, w: 7.0 }, { colW: [3.0, 4.0], fontSize: 13, rowH: 0.48 });
    L.box(p, s, 'APPROVED\n承認済み', { x: 7.9, y: 1.5, w: 2.0, h: 1.0 }, { fontSize: 13, bold: true });
    L.box(p, s, 'ACTIVE\n利用中', { x: 10.7, y: 1.5, w: 2.0, h: 1.0 }, { fontSize: 13, bold: true, fill: C.okBg, line: C.ok });
    L.arrow(p, s, { x: 9.95, y: 2.0 }, { x: 10.65, y: 2.0 }, { label: '初回入金' });
    L.text(s, '口座の状態は、入金のレスポンスではなく、次のステップ⑦で口座を取得して確認します。', { x: 7.9, y: 2.8, w: 4.8, h: 1.0 }, { fontSize: 13 });
    L.callout(p, s, 'warn', null, '入金額が商品で決められた最低・最高の開設金額の範囲外だと、400 INVALID_DEPOSIT_AMOUNT になります（公式のエラー一覧）。', { x: 0.6, y: 4.5, w: 12.1, h: 0.85 }, { fontSize: 13 });
  }

  // ================= ステップ⑦ =================
  overview(p, 'ステップ⑦：口座が使える状態になったか確認する', [
    ['目的', '口座を取得して、ACTIVE（利用中）になったことと残高を確認する'],
    ['作るリクエスト', '09 Check Deposit Account：GET {{baseUrl}}/deposits/{{depositId}}?detailsLevel=FULL'],
    ['使う値（入力）', '{{depositId}}（ステップ④で保存）'],
    ['保存する値（出力）', 'なし'],
    ['アサーション', 'res.status equals 200、res.body.accountState equals ACTIVE'],
  ], { source: SRC.spec('deposits.json'), flow: '手順：New Request（GET）→ Params を確認 → Assert（2 行）→ 保存（Headers・Body・Script はなし）', note: 'detailsLevel=FULL を付けると、すべての項目が返ります。取引の一覧は GET /deposits/{{depositId}}/transactions で確認できます。' });
  stepSlide(p, 'ステップ⑦【1/6】GET のリクエストを作る', 's7_02_dialog', dlgCrop(BOX.s7_02_dialog), [[1, 'name'], [2, 'method'], [3, 'url', { pos: 'tr' }], [4, 'create', { pos: 'r' }]],
    ['右クリック → New Request。Request Name：09 Check Deposit Account', 'メソッド：GET（初期値のまま）', 'URL：{{baseUrl}}/deposits/{{depositId}}?detailsLevel=FULL', '「Create」をクリック']);
  stepSlide(p, 'ステップ⑦【2/6】Params タブでクエリを確かめる', 's7_04_params', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'row']],
    ['「Params」タブをクリック', 'Query に detailsLevel ＝ FULL の行があることを確認'],
    { note: 'URL の {{depositId}} はステップ⑤と同じく、まだ値がないので赤色です。' });
  stepSlide(p, 'ステップ⑦【3/6】Assert タブに 2 行入れる', 's7_07_assert', CROP.req, [[1, 'tab', { pos: 'tl' }], [2, 'rows']],
    ['「Assert」タブをクリック', '1 行目：res.status equals 200', '2 行目：res.body.accountState equals ACTIVE'],
    { note: '残高も確かめたいときは、3 行目に res.body.balances.totalBalance equals 10000 を加えます（参考コレクションには含めていません）。' });
  savedSlide(p, 'ステップ⑦【4/6】保存する（Send は押さない）', 's7_08_saved',
    '200 OK。accountState が ACTIVE（利用中）でアサーション 2 件が Passed。', '09 Check Deposit Account.yml');
  {
    const s = L.slide(p, 'ステップ⑦【5/6】確認のレスポンスの見かた', { tag: '未実行', source: SRC.spec('deposits.json') });
    L.code(s, '{\n  "id": "（口座の ID）",\n  "accountHolderType": "GROUP",\n  "accountHolderKey": "（法人の encodedKey）",\n  "accountState": "ACTIVE",\n  "accountType": "CURRENT_ACCOUNT",\n  "currencyCode": "JPY",\n  "approvedDate": "…",\n  "activationDate": "…",\n  "balances": { "totalBalance": 10000, … }\n}', { x: 0.6, y: 1.6, w: 6.5, h: 3.9 }, { fontSize: 12, label: 'レスポンスで確認する項目（値は例。実際の値はテナントにより異なる）' });
    L.steps(s, ['accountHolderType が GROUP、accountHolderKey が法人の key になっている（法人名義の口座）', 'accountState が ACTIVE（利用中）', 'balances.totalBalance が入金額になっている', 'approvedDate（承認日）・activationDate（利用開始日）が入っている'], { x: 7.4, y: 1.6, w: 5.3, h: 3.9 }, { fontSize: 14, space: 10 });
  }
  {
    const s = L.slide(p, 'ステップ⑦【6/6】完成したコレクションとゴール', T0);
    L.code(s, 'mambu-practice\\\n├─ opencollection.yml   … 共通ヘッダー（準備4）\n├─ environments\\Mambu-Sandbox.yml（準備3）\n├─ 01 Get Branches.yml\n├─ 02 Get Deposit Products.yml\n├─ 03 Get Transaction Channels.yml\n├─ 04 Create Director Client.yml\n├─ 05 Create Corporate Group.yml\n├─ 06 Create Deposit Account.yml\n├─ 07 Approve Deposit Account.yml\n├─ 08 First Deposit.yml\n└─ 09 Check Deposit Account.yml', { x: 0.6, y: 1.3, w: 6.3, h: 3.9 }, { fontSize: 12 });
    L.callout(p, s, 'ok', 'ゴール達成', '法人の顧客登録 → 口座の作成 → 承認 → 初回入金 → 確認 の 9 つのリクエストができました。実際の環境では、01 から順に Send すると、口座が ACTIVE になるまでを確認できます。', { x: 7.2, y: 1.3, w: 5.5, h: 1.9 }, { fontSize: 13, valign: 'top' });
    L.callout(p, s, 'hint', '自分で作ったものと比べる', '作成環境で、この手順どおりに Bruno の画面で入力して保存した 9 つのファイルは、参考コレクション（' + COL + '）のファイルと内容が完全に一致しました（2026-10-13 確認）。', { x: 7.2, y: 3.4, w: 5.5, h: 1.8 }, { fontSize: 12, valign: 'top' });
  }
};


// 準備2〜4（練習用コレクション・環境・共通ヘッダー）
const prep = (p, SRC) => {
  {
    const s = L.slide(p, '準備2：練習用のコレクションを用意する', T0);
    L.text(s, 'この節では、自分のコレクション mambu-practice に 9 つのリクエストを 1 つずつ作ります。', { x: 0.6, y: 1.2, w: 12.1, h: 0.45 }, { fontSize: 16, bold: true });
    L.steps(s, ['第3章の手順で、新しいコレクション mambu-practice を作る', '環境 Mambu-Sandbox を用意する。方法A：参考コレクションの environments フォルダにある Mambu-Sandbox.yml を、mambu-practice の中の environments フォルダ（なければ作る）にコピーする。方法B：Ctrl + E →「＋」で Mambu-Sandbox を作り、6 つの変数（準備3 の表）を自分で追加する', '完成形を見たいときは、参考コレクション mambu-corporate-onboarding を「＋」→「Open collection」で開く'], { x: 0.6, y: 1.75, w: 7.0, h: 3.6 }, { fontSize: 14, space: 9 });
    L.code(s, 'mambu-corporate-onboarding\\（参考・完成形）\n├─ opencollection.yml   … 共通ヘッダー\n├─ environments\\Mambu-Sandbox.yml\n├─ 01 Get Branches.yml\n├─ …\n└─ 09 Check Deposit Account.yml', { x: 7.9, y: 1.75, w: 4.8, h: 2.0 }, { fontSize: 11 });
    L.callout(p, s, 'warn', null, '参考コレクションも、この節で作るリクエストも、送信はしていません。作成環境では、Bruno の画面で入力・保存できることと、保存したファイルが参考コレクションと一致することを確認しました。', { x: 7.9, y: 4.0, w: 4.8, h: 1.9 }, { fontSize: 12, valign: 'top' });
    L.text(s, '作成環境では方法A（ファイルのコピー）で環境を用意しました。', { x: 0.6, y: 5.5, w: 7.0, h: 0.4 }, { fontSize: 12, color: C.sub });
  }
  // ---- 準備3：baseUrl と branchKey だけを入れる ----
  {
    const s = L.slide(p, '準備3：環境に入れる値と、入れるタイミング', T0);
    L.text(s, '環境 Mambu-Sandbox には 6 つの変数と 1 つの Secret があります。準備3 で入れるのは baseUrl と branchKey の 2 つ（と API キー）だけです。', { x: 0.6, y: 1.15, w: 12.1, h: 0.5 }, { fontSize: 14, bold: true });
    const H = { opt: { bold: true, color: C.warn } };
    L.table(s, [['変数', '何の値か', 'どこで使うか', 'いつ入れるか'],
      [{ text: 'baseUrl', ...H }, 'テナント（組織の Mambu の環境）の URL', '全リクエストの URL の先頭', { text: '★ 準備3（いま）', ...H }],
      [{ text: 'branchKey', ...H }, '担当支店の encodedKey', '②③④ の Body（assignedBranchKey）', { text: '★ 準備3（いま）', ...H }],
      ['groupTypeKey・roleNameKey', '法人用の Group の種類・役職の key', '③ の Body', 'ステップ①の最後（組織から受け取った値を手で入力）'],
      ['depositProductKey', '預金商品の encodedKey', '④ の Body', 'ステップ①（02 の Script で自動）'],
      ['channelId', '取引チャネルの id', '⑥ の Body', 'ステップ①（03 の Script で自動）'],
      ['apiKey（Secret）', 'API キー', '全リクエストのヘッダー（準備4）', '準備3（Secrets タブ）']], { x: 0.6, y: 1.75, w: 12.1 }, { colW: [2.7, 3.5, 3.1, 2.8], fontSize: 12.5, rowH: 0.44 });
    L.callout(p, s, 'ok', 'なぜ 2 つだけ先に入れるのか', 'baseUrl がないと、ステップ①の GET も含めてどのリクエストも送れません。branchKey は組織が決める値（どの支店で口座を扱うか）なので、最初に受け取って入れておきます。depositProductKey・channelId はステップ①のスクリプトが自動で入れ、groupTypeKey・roleNameKey はステップ①の最後に手で入れます（それまでは SET_BY_ORGANIZATION のままで構いません）。', { x: 0.6, y: 5.15, w: 12.1, h: 1.15 }, { fontSize: 12.5 });
  }
  {
    const s = L.slide(p, '準備3：baseUrl とは（リクエストの送り先）', { tag: '未実行', source: SRC.base });
    const parts = [['https://', 'C', 1.4, '通信の方式'], ['example-bank', 'W', 2.6, 'テナント名\n（組織ごとに違う）'], ['.sandbox.mambu.com', 'H', 3.6, 'サンドボックス（練習用）\n本番は .mambu.com'], ['/api', 'C', 1.2, 'API の入口']];
    let x = 0.9;
    parts.forEach(([v, k, w, lab]) => {
      L.box(p, s, v, { x, y: 1.35, w, h: 0.7 }, { code: true, fontSize: 15, bold: true, fill: k === 'W' ? 'FEF3C7' : (k === 'H' ? C.hintBg : C.pale), line: k === 'W' ? C.orange : (k === 'H' ? C.hint : C.navy) });
      L.text(s, lab, { x, y: 2.1, w, h: 0.65 }, { fontSize: 12, align: 'center', color: C.sub });
      x += w + 0.1;
    });
    L.text(s, 'Bruno では、URL に {{baseUrl}} と書くと、送るときに環境の値に置き換わります。', { x: 0.6, y: 2.95, w: 12.1, h: 0.4 }, { fontSize: 15 });
    L.code(s, '{{baseUrl}}/branches\n　↓ 送るとき\nhttps://example-bank.sandbox.mambu.com/api/branches', { x: 0.6, y: 3.45, w: 7.2, h: 1.25 }, { fontSize: 14 });
    L.bullets(s, ['9 つのリクエストすべてが {{baseUrl}} から始まる', '組織のテナント名に変わっても、ここを 1 か所直すだけでよい', '入れる値は組織から受け取る（例の example-bank はダミー）'], { x: 8.1, y: 3.4, w: 4.6, h: 1.6 }, { fontSize: 13, space: 5 });
    L.callout(p, s, 'warn', '本番の URL は入れない', '練習では必ず .sandbox. が入った URL（サンドボックス）を使います。本番（https://テナント名.mambu.com/api）を入れると、本物の顧客・口座を作ってしまいます。', { x: 0.6, y: 5.0, w: 12.1, h: 1.0 }, { fontSize: 13 });
  }
  {
    const s = L.slide(p, '準備3：branchKey とは（担当支店）', { tag: '未実行', source: SRC.spec('branches.json・clients.json・groups.json・deposits.json') });
    L.text(s, 'Mambu では、顧客（個人・法人）と口座に「担当の支店」を付けられます。branchKey には、その支店の encodedKey（Mambu が付けた長い内部キー）を入れます。', { x: 0.6, y: 1.2, w: 12.1, h: 0.75 }, { fontSize: 15 });
    L.table(s, [['ステップ', 'リクエスト', 'Body の項目'], ['②', '04 Create Director Client（役員）', '"assignedBranchKey": "{{branchKey}}"'], ['③', '05 Create Corporate Group（法人）', '"assignedBranchKey": "{{branchKey}}"'], ['④', '06 Create Deposit Account（口座）', '"assignedBranchKey": "{{branchKey}}"']], { x: 0.6, y: 2.1, w: 8.0 }, { colW: [1.2, 3.6, 3.2], fontSize: 12.5, rowH: 0.45 });
    L.callout(p, s, 'hint', '同じ値を 3 回使う', '役員・法人・口座を同じ支店の担当にするため、3 つのリクエストで同じ {{branchKey}} を使います。環境に 1 回入れておけば、毎回コピーする必要がありません。', { x: 8.9, y: 2.1, w: 3.8, h: 1.9 }, { fontSize: 12.5, valign: 'top' });
    L.bullets(s, ['値は組織から受け取る（どの支店で口座を扱うかは組織が決める）', 'ステップ①の 01 Get Branches で支店の一覧を取り、受け取った値と同じ encodedKey の支店があるかを確かめられる', 'assignedBranchKey は仕様上は任意ですが、テナントの設定によっては必要になります（条件は公式資料で確認できていません）'], { x: 0.6, y: 4.3, w: 12.1, h: 1.9 }, { fontSize: 13, space: 6 });
  }
  stepSlide(p, '準備3【1/4】画面右上で環境 Mambu-Sandbox を選ぶ', 'p00_env_select', CROP.envsel, [[1, 'env', { pos: 'l' }], [2, 'item', { pos: 'l' }]],
    ['画面右上の環境（最初は No Environment）をクリック', '一覧から「Mambu-Sandbox」を選ぶ'],
    { note: '環境を選ばないと {{baseUrl}} などの変数が赤色になり、値が入りません（第9章）。' });
  {
    const s = L.slide(p, '準備3：仮の文字 SET_BY_ORGANIZATION とは', T0);
    L.text(s, '参考コレクションの環境ファイル（Mambu-Sandbox.yml）には、本物の値の代わりに「仮の文字」が入っています。教材の作成者が「ここに本物の値を入れてください」という目印として入れたもので、Mambu や Bruno の機能ではありません。', { x: 0.6, y: 1.15, w: 12.1, h: 0.8 }, { fontSize: 14 });
    L.table(s, [['仮の文字', '英語の意味', 'つまり', '置き換える値'],
      [{ text: 'YOUR_TENANT', code: true }, 'あなたのテナント', 'テナント名を入れる場所', '組織のテナント名（例：example-bank）'],
      [{ text: 'SET_BY_ORGANIZATION', code: true }, '組織が設定する（set by organization）', '組織から受け取る値を入れる場所', '組織から受け取った key や ID（例：8a44b1c2…）']], { x: 0.6, y: 2.1, w: 12.1 }, { colW: [3.0, 3.2, 2.9, 3.0], fontSize: 13, rowH: 0.6 });
    L.code(s, 'baseUrl    https://YOUR_TENANT.sandbox.mambu.com/api\n　　　　　→ https://example-bank.sandbox.mambu.com/api\nbranchKey  SET_BY_ORGANIZATION\n　　　　　→ 8a44b1c27f6d4e2a017f6d5b3c2e0011', { x: 0.6, y: 4.6, w: 6.6, h: 1.2 }, { fontSize: 12.5, label: '置き換えの例（値はダミー）' });
    L.callout(p, s, 'warn', '置き換えないまま送ると', 'Bruno は仮の文字をそのまま送ります。URL は存在しないテナントあてになり、Body の key は Mambu に「正しくない key」として扱われ、エラーになります（例：支店の key が違うと 400 INVALID_BRANCH_KEY）。', { x: 7.45, y: 4.3, w: 5.25, h: 1.5 }, { fontSize: 12, valign: 'top' });
    L.text(s, 'まだ値が分からない 4 つの変数は、仮の文字のままで構いません。Description（説明）列にも、何に置き換えるかが書いてあります。', { x: 0.6, y: 5.9, w: 12.1, h: 0.45 }, { fontSize: 13, color: C.navy, bold: true });
  }
  stepSlide(p, '準備3【2/4】Variables を開き、変える 2 行を確かめる', 'p05_env_before', CROP.env, [[1, 'tab', { pos: 'tl' }], [2, 'base'], [3, 'branch']],
    ['Ctrl + E で環境の設定を開き、「Variables」タブを選ぶ', 'baseUrl の行：最初は https://YOUR_TENANT.sandbox.mambu.com/api（YOUR_TENANT ＝ テナント名を入れる場所）', 'branchKey の行：最初は SET_BY_ORGANIZATION（＝ 組織から受け取る値を入れる場所）'],
    { note: 'どちらも仮の文字です（前のスライド）。残りの 4 行も SET_BY_ORGANIZATION のままですが、まだ変えません。ステップ①で入ります（2 つはスクリプトで自動、2 つは手で入力）。', noteY: 4.3, noteH: 1.6 });
  stepSlide(p, '準備3【3/4】baseUrl と branchKey を入力して Save', 'p06_env_two', CROP.env, [[1, 'base'], [2, 'branch'], [3, 'save', { pos: 'l' }]],
    ['baseUrl の Value をクリックして全部消し、組織のテナントの URL を入力（例：https://example-bank.sandbox.mambu.com/api）', 'branchKey の Value に、組織から受け取った支店の encodedKey を入力', '「Save」をクリック（画面上部に Changes saved successfully と出る）'],
    { note: '画面の値はダミー（例）です。Value 欄をクリックして Ctrl + A で全選択してから入力すると、元の文字を残さずに書き換えられます。', noteKind: 'warn', noteTitle: 'この画面の値について', noteY: 4.4, noteH: 1.75 });
  stepSlide(p, '準備3【4/4】Secrets タブで apiKey を入れる', 'p04_secret_filled', CROP.env, [[1, 'tab', { pos: 'tl' }], [2, 'val'], [3, 'save', { pos: 'l' }]],
    ['「Secrets」タブを選ぶ', 'apiKey の Value に API キーを入力する（入力すると * で隠れる。目のアイコンで表示を切り替え）', '「Save」をクリック'],
    { note: 'API キーは変数ではなく秘密の値（Secret）なので、Variables とは別のタブに入れます。Secrets の値はファイル・エクスポート・Git に含まれません（第3章 3-F）。画面の値は練習用のダミーです。', noteKind: 'warn', noteTitle: 'API キーは必ず Secrets に', noteY: 4.1, noteH: 2.05 });
};
// 準備4：なぜ 3 つのヘッダーを入れるのか ＋ 手順
const colHeaders = (p) => {
  stepSlide(p, '準備4：すべてのリクエストに付ける 3 つのヘッダー（完成形）', 'q04_col_headers_saved', CROP.colh, [[null, 'col'], [null, 'ctab'], [1, 'accept'], [2, 'apikey'], [3, 'ua']],
    ['Accept ＝ application/vnd.mambu.v2+json：Mambu の API v2 を使うという指定', 'apiKey ＝ {{apiKey}}：API キーによる本人確認（値は準備3 で Secrets に入れたもの）', 'User-Agent ＝ bruno-training：送り手（アプリ）の名前'],
    { masks: [[790, 40, 1120, 60, '']], note: '左のサイドバーで選んだコレクション mambu-practice の設定画面（赤枠の Collection タブ → Headers タブ）に 3 つ入れ終わった状態です。ここに入れると、9 つのリクエストすべてに自動で付きます。次のスライドで理由、そのあとで入れ方を説明します。', noteKind: 'ok', noteTitle: 'この画面について', noteY: 3.95, noteH: 2.2 });
  {
    const s = L.slide(p, '準備4：なぜこの 3 つのヘッダーを入れるのか', { tag: '未実行', source: 'https://docs.mambu.com/docs/mambu-apis/ ／ …/api-v2/authentication/ ／ …/audit-trail-and-the-user-agent-header/（2026-10-09 確認）' });
    L.table(s, [['ヘッダー（値）', '入れる理由', '入れないと'],
      ['Accept\n（application/vnd.mambu.v2+json）', 'Mambu に「API の v2 を使います」と伝える。公式に「すべての v2 リクエストで必須」とある', '必須の指定がないため、正しく扱われない（どんなエラーになるかは未確認）'],
      ['apiKey\n（{{apiKey}}）', 'Mambu が「API を使ってよい相手か」を確かめる（認証）。値は準備3 で Secrets に入れた API キー', '認証に失敗し（401）、どのリクエストも実行されない'],
      ['User-Agent\n（bruno-training）', '送り手のアプリの名前。監査ログ（Audit Trail：誰が何をしたかの記録）が有効なテナントでは必須。研修の操作だと分かる名前にする', '監査ログが有効なテナントでは、必須の項目がないため通らない（どんなエラーになるかは未確認）']], { x: 0.6, y: 1.25, w: 12.1 }, { colW: [3.3, 5.0, 3.8], fontSize: 12.5, rowH: 0.85 });
    L.callout(p, s, 'ok', 'なぜコレクションに入れるのか', '3 つとも 9 つのリクエストすべてで同じ値です。コレクションの Headers に 1 回入れれば全リクエストに自動で付き、値を変えるときも 1 か所で済みます。', { x: 0.6, y: 4.95, w: 6.0, h: 1.25 }, { fontSize: 12.5, valign: 'top' });
    L.callout(p, s, 'hint', 'コレクションに入れないヘッダー', 'Idempotency-Key は POST だけに付け、値も毎回変わるので、各リクエストの Headers に入れます（ステップ②〜⑥）。Content-Type は Body を JSON にすると自動で付きます（第5章）。', { x: 6.75, y: 4.95, w: 5.95, h: 1.25 }, { fontSize: 12.5, valign: 'top' });
  }
  stepSlide(p, '準備4【1/4】コレクション名をクリックして設定画面を開く', 'q01_col_overview', CROP.ctx, [[1, 'col'], [2, 'tab', { pos: 'tl' }]],
    ['サイドバーでコレクション名 mambu-practice をクリック → 右側にコレクションの設定画面（Overview）が開く', '「Headers」タブをクリック'],
    { masks: [[326, 258, 940, 300, '（コレクションの保存場所。画面ではパスが表示されます）']], note: 'リクエストの Headers タブではなく、コレクションの設定画面の Headers タブです。間違えると、そのリクエストにしか付きません。', noteKind: 'warn', noteTitle: '間違えやすいところ' });
  stepSlide(p, '準備4【2/4】Headers タブを確かめる（最初は空）', 'q02_col_headers_empty', CROP.colh, [[null, 'col'], [null, 'ctab'], [1, 'tab', { pos: 'tl' }], [2, 'row']],
    ['左のサイドバーで mambu-practice が選ばれ、上のタブが「Collection」になっている（＝コレクションの設定画面）ことと、「Headers」タブが選ばれていることを確認', '表は空で、Name・Value・Description の入力欄が 1 行だけある'],
    { note: '画面の説明文「Add request headers that will be sent with every request in this collection.」＝「このコレクションのすべてのリクエストと一緒に送るヘッダーを追加します」という意味です。' });
  stepSlide(p, '準備4【3/4】Name と Value を 3 行入力する', 'q03_col_headers_typed', CROP.colh, [[null, 'col'], [null, 'ctab'], [1, 'names'], [2, 'values', { pos: 'tr' }]],
    ['Name に 1 行ずつ入力：Accept、apiKey、User-Agent', 'Value に 1 行ずつ入力：application/vnd.mambu.v2+json、{{apiKey}}、bruno-training'],
    { note: '1 行入力すると、下に新しい空の行が出ます。{{apiKey}} が緑色なら、環境 Mambu-Sandbox の Secret（準備3【4/4】）が見つかっています。赤色のときは、画面右上で環境を選びます。', noteY: 4.1, noteH: 2.05 });
  stepSlide(p, '準備4【4/4】Save で保存する', 'q04_col_headers_saved', CROP.colh, [[null, 'col'], [null, 'ctab'], [1, 'save', { pos: 'l' }], [2, 'tab', { pos: 'tr' }]],
    ['「Save」をクリック（画面上部に Collection Settings saved successfully と出る）', 'タブの名前が「Headers 3」になり、3 つ入ったことが分かる'],
    { masks: [[790, 40, 1120, 60, '']], note: 'User-Agent を指定しないと、Bruno の名前（bruno-runtime/4.2.1）が送られます（作成環境で確認）。作成環境では、画面で入力して保存した内容が、参考コレクションの opencollection.yml のヘッダーと一致しました。', noteY: 4.0, noteH: 2.15 });
};
module.exports = { steps, prep, colHeaders };
