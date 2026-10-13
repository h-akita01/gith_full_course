// 緑の帯（できなかった場合）と samples の説明の文言を、samples の中身に合わせる（2026-10-13）。
// 使い方：node scripts/fix_sample_banners.js [教材フォルダ]。置き換え済みの箇所は SKIP（何度実行してもよい）
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const R = (f, from, to) => {
  const p = path.join(ROOT, f), t = fs.readFileSync(p, 'utf8');
  if (t.includes(to)) { console.log('SKIP', f, '|', to.slice(0, 60)); return; }
  const n = t.split(from).length - 1;
  if (n !== 1) throw new Error(`${f}: ${n} 件 → ${from.slice(0, 60)}`);
  fs.writeFileSync(p, t.replace(from, to)); console.log('OK', f, '|', to.slice(0, 80));
};
// 3-9b：samples のフォルダ構成に 09_Chain・10_* を追加
R('scripts/build_part2.js',
  "'フォルダ構成：03_Setup（第3章）／04_GET〜08_DELETE（第4〜8章。演習問題の解答 Q1〜 を含む）／09_Features・09_TIPS・10_MyFolder（第9章）'",
  "'フォルダ構成：03_Setup（第3章）／04_GET〜08_DELETE（第4〜8章。演習問題の解答 Q1〜 を含む）／09_Features・09_TIPS・09_Chain・10_MyFolder（第9章）／10_Final・10_LocalMock（第10章）'");
// 3-11：同じリクエストのファイル名と、環境を選ぶことを書く
R('scripts/build_part2.js',
  '"samples コレクション（exercises\\\\samples）を開いて先へ進めます（04_GET に同じリクエストがあります）"',
  '"samples の 04_GET\\\\02 Get Post by ID.yml を開き、環境 JSONPlaceholder を選んで Send（インポートした 02 Get Post by ID と同じリクエスト）"');
// 4-13・5-11：Q の番号と問題の番号（①〜）の対応
R('scripts/build_part2.js',
  '"samples の 04_GET\\\\Q1〜Q4 の .yml を開いて Send（解答が入っています）"',
  '"samples の 04_GET\\\\Q1〜Q4 の .yml（問題①〜④の解答）を開いて Send"');
R('scripts/build_part2.js',
  '"samples の 05_POST\\\\Q1 Create Comment.yml → Q2 Check Created Comment.yml の順に開いて Send（解答）"',
  '"samples の 05_POST\\\\Q1 Create Comment.yml → Q2 Check Created Comment.yml の順に開いて Send（問題①②の解答）"');
// 7-5：帯がなかった（6-5・8-5 と揃える）
R('scripts/build_part3.js',
  "  const s = L.slide(p, 'レスポンスを確認する（すべての項目を送った場合）', { source: VERIFIED });\n",
  "  const s = L.slide(p, 'レスポンスを確認する（すべての項目を送った場合）', { source: VERIFIED });\n  L.sample(p, s, \"samples の 07_PUT\\\\01 Put Post Full.yml を開いて Send\");\n");
// 修了課題：10_Final は Posts 5 件＋Comments 1 件
R('scripts/build_part5.js',
  "'samples の 10_Final フォルダ（完成形の例）を開いて、自分で作ったものと比べる'",
  "'samples の 10_Final\\\\Posts の 01〜05（完成形の例）を開いて、自分で作ったものと比べる（Comments は追加の例）'");
// Mambu 環境の説明：スライドでは 02・03 の Script で自動保存する
R('exercises/mambu-corporate-onboarding/environments/Mambu-Sandbox.yml',
  'description: 預金商品の encodedKey（GET /depositproducts で確認）',
  'description: 預金商品の encodedKey（02 Get Deposit Products の Script で自動保存）');
R('exercises/mambu-corporate-onboarding/environments/Mambu-Sandbox.yml',
  'description: 取引チャネルの ID（GET /organization/transactionChannels で確認）',
  'description: 取引チャネルの ID（03 Get Transaction Channels の Script で自動保存）');
