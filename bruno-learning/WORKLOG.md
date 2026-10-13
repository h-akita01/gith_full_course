# WORKLOG（作業記録）

## 現在の状況（最新）（2026-10-09 業務終了時点）

| 項目 | 内容 |
|---|---|
| 現在のフェーズ | **フェーズ5 完了（第0〜10章のスライド 217 枚を作成）→ 次はフェーズ6（最終レビュー）と補足資料** |
| 承認状況 | 第0〜9章：ユーザー確認済み（指示に沿って修正済み）。第10章：**未レビュー**（「10章まで作成し、続きを今度」の指示で作成） |
| 次に実施する作業 | 下の「次回やること」を上から順に |

### スライドファイル（slides/）
| ファイル | 章 | 枚数 | 生成スクリプト |
|---|---|---|---|
| part01_ch00-02.pptx | 第0〜2章 | 45 | scripts/build_part1.js |
| part02_ch03-05.pptx | 第3〜5章 | 48 | scripts/build_part2.js |
| part03_ch06-08.pptx | 第6〜8章 | 30 | scripts/build_part3.js |
| part04_ch09.pptx | 第9章 | 67 | scripts/build_part4.js（＋ch9_steps.js、ch9_zoom.js） |
| part05_ch10.pptx | 第10章 | 27 | scripts/build_part5.js |

### 次回やること（再開手順）
1. ユーザーに第10章（part05_ch10.pptx）のレビューを依頼し、指摘を反映する
2. ~~補足資料を作成する~~ → 2026-10-09 作成済み：docs/GLOSSARY.md（用語集）、docs/TROUBLESHOOTING.md（トラブルシューティング集）
3. フェーズ6 最終レビュー：用語・画面名の統一、章間の矛盾、OUTLINE.md との差分（枚数・構成が当初案から増えている点を OUTLINE に反映）、全ファイルの文字サイズ・はみ出しチェック、参考 URL の確認
4. （任意）5 ファイルを 1 つの pptx に結合するか、ユーザーに確認する
5. 最終の品質評価（7 項目）と未検証事項の一覧を REVIEW.md にまとめて報告する

### 作業の進め方メモ
- 再生成：`cd scripts` → `node build_partN.js` → `powershell -File render.ps1 ../slides/<ファイル> ../slides/preview/<名前>`（PNG・PDF で確認）→ `montage.ps1` で一覧画像
- 生成先の pptx が PowerPoint で開かれていると上書きできない（EBUSY）。その場合は `OUT_NAME=xxx_rev1.pptx` で別名に出力する
- 文字列中の「」は制御文字化しやすい。生成後に slides の XML に制御文字がないか確認する（WORKLOG 過去の記録参照）
- GUI 確認は scratchpad の専用プロファイルで Bruno を起動（scripts ではなく scratchpad/envcheck の launch.js・gui_step.js・h.js を使用。セッションが変わると scratchpad は消える可能性があるため、必要なら作り直す）
- **ユーザーへの応答・途中の一言はすべて日本語で書く**（強く指示されている）

---

## 2026-10-09 フェーズ0〜3

### 実施したこと

1. **作業環境の確認**（→ `research/ENVIRONMENT.md`）
   - Node.js 24.21.0、pptxgenjs 4.0.1 で .pptx を生成できること、PowerPoint 16 の COM で開いて PNG・PDF に書き出せることを確認した（実機検証済み）
   - Python は実体がない（Store のスタブのみ）。LibreOffice もない
   - Bruno v4.2.1 がインストール済み。CLI 4.2.1 は scratchpad にローカル導入して動作を確認した
2. **既存ファイルの確認**：`Bruno-Learning-Sample.zip`（YAML 形式のコレクション）、`Bruno_ハンズオン入門_v4.2.1.pptx`（171枚、v4.2.1 の画面と見られる画像 52 枚）。参考にのみ使い、変更はしていない
3. **Bruno の調査**（→ `research/BRUNO.md`、サブエージェントで公式ドキュメントを調査）
4. **JSONPlaceholder の調査**（→ `research/JSONPLACEHOLDER.md`、curl で実機検証）
5. **CLI による自動検証**（→ `research/CLI_VERIFICATION.md`：V-01〜V-05）
6. **構成案の作成**（→ `OUTLINE.md` v0.1：全 160 枚、11 部構成）
7. README.md、SOURCES.md、REVIEW.md を作成した

### 作成・更新したファイル

`README.md`、`WORKLOG.md`、`OUTLINE.md`、`REVIEW.md`、`SOURCES.md`、`research/ENVIRONMENT.md`、`research/BRUNO.md`、`research/JSONPLACEHOLDER.md`、`research/CLI_VERIFICATION.md`
（空のフォルダ：`slides/`、`exercises/`、`assets/screenshots/`、`assets/diagrams/`、`scripts/`、`answers/`）

### 検証した内容と結果

| 内容 | 区分 | 結果 |
|---|---|---|
| pptxgenjs → PowerPoint COM → PNG/PDF | 実機検証済み | 成功（16:9、960×540pt） |
| JSONPlaceholder の各メソッドの挙動、永続化されないこと | 実機検証済み（curl） | 公式の記述どおり |
| 演習問題の期待値 | 実機検証済み（curl） | JSONPLACEHOLDER.md 付録 |
| Bruno CLI 4.2.1 で YAML コレクションを実行 | 自動検証済み | 成功 |
| JSON の Body に Content-Type が自動で付くか（CLI） | 自動検証済み | 付く（Text の場合は text/plain） |
| CLI での CSV 繰り返し実行、HTML レポート | 自動検証済み | 成功（無料かどうかの公式記載は未確認） |
| Bruno の GUI 操作 | 未検証 | Claude は GUI を操作できない |

### 未解決事項

- OUTLINE.md「10. 判断をお願いしたい事項」Q1〜Q7（スクリーンショットの入手方法、GUI の実機確認の担当、スライド数、分割単位、Git 演習の前提など）
- research/BRUNO.md の U-01〜U-08（GUI でしか確認できない事項）

## 2026-10-09 フェーズ4〜5（ユーザー指示への対応と、第0〜2章の制作）

### ユーザー指示（要約）
- Query Parameter の使い方を入れる。TIPS（CSV・JSON ファイルの値で実行、取得値の受け渡し、ランダム値）を追加する
- 応用編に Mambu API による法人顧客の作成〜口座開設〜利用開始（実行確認は不要）を追加する
- スクリーンショットは撮り直して実行できるかを確認する。GUI の実機確認は Claude が行う。スライド数は 160 で可、分割単位は案のとおり、Git 演習は不要
- 未検証事項は本スライドの作成前に検証する。40 枚程度のきりのいいところまで作ったらレビューする

### 実施したこと
1. OUTLINE.md を v0.2 に更新（変更点 C1〜C8）
2. Mambu API を調査（research/MAMBU.md。API は未実行）
3. Bruno の GUI を操作できる仕組みを用意（専用プロファイル＋CDP＋UI Automation）。U-01・U-02・U-06 を実機で解決（research/GUI_VERIFICATION.md）
4. 第0部〜第2章（45 枚）を作成：slides/part01_ch00-02.pptx
5. PowerPoint COM で PNG・PDF に変換して目視確認し、9 件を修正（REVIEW.md R-02）
6. 後片付け：専用プロファイルの Bruno を終了し、初回起動時に Documents\bruno に自動で作られた「Sample API Collection - 2」（Claude の操作で作成されたもの）を削除した。ユーザーの既存のコレクションには触れていない

### 作成・更新したファイル
OUTLINE.md、REVIEW.md、WORKLOG.md、README.md、.gitignore、research/ENVIRONMENT.md（追記）、research/MAMBU.md、research/GUI_VERIFICATION.md、scripts/（package.json, lib.js, build_part1.js, render.ps1, crop.ps1, montage.ps1, check_fonts.js）、assets/screenshots/（実画面 30 点）、slides/part01_ch00-02.pptx、slides/preview/part01/（確認用。Git 管理外）

### 未解決事項
- U-03（GUI での Content-Type の自動付与）、U-04（Share・Import）、U-05（Runner の実行順序）：第3章の作成前に検証する
- TIPS の JSON ファイル（--json-file-path）とランダム値（動的変数）の動作：第9章の作成前に CLI と GUI で検証する
- インストール手順（2-9, 2-10）は未検証のまま（ユーザーの環境を変更しないため）

## 2026-10-09 フェーズ5（第3〜9章の制作）

- ユーザー指示：「OK。次進んで。今度は第5章まで作成して」→ 作業中に「休憩入るから9章まで進めておいて」
- 実施：演習ファイル・解答の作成と CLI 検証 → Bruno の画面で第3〜9章の全操作を実行・撮影（GUI_VERIFICATION G-21〜G-44）→ スライド 102 枚を作成 → 目視確認・修正（REVIEW R-04）
- 作成・更新：slides/part02〜04、scripts/build_part2〜4.js、crop_batch.ps1、lib.js（mask・矢印ラベル）、assets/screenshots/ch3〜ch9 と crop_*.png、exercises/（bruno-hands-on、import-practice、tips、README.md）、answers/（bruno-hands-on-answers、cli-results）
- 未解決：REVIEW R-04「未検証・未解決」を参照

## 2026-10-09 夕方（第9章の追加・第10章の作成）
- 第9章：ランダム値「固定テキスト＋3 桁」（64・65 枚目）、値の受け渡し 4 パターン（56〜60 枚目：一覧・Vars タブ・Body・Query・ヘッダー）を追加。調査結果は research/VALUE_PASSING.md
- 第10章（27 枚）を作成：応用演習 10-1〜10-5、よくある失敗、Mambu 机上演習 9 枚（未実行と明記）、発展課題 2 枚（json-server を実機で確認：POST 後の GET が 200、DELETE 後の GET が 404）、理解度チェック 15 問・修了課題・合格基準・解答・自己評価・参考資料
- samples に 09_Chain（6）、10_LocalMock（4）、10_Final（6）を追加し、CLI で全件成功を確認
- exercises/local-mock（json-server 1.0.0-beta.15、db.template.json）を作成
- 未作成：docs/GLOSSARY.md、docs/TROUBLESHOOTING.md、最終レビュー

## 2026-10-09 補足資料の作成
- docs/GLOSSARY.md（用語集：API の基本、メソッド、ステータスコード、JSON、Bruno の画面と機能、関連サービス）
- docs/TROUBLESHOOTING.md（症状・原因・対処を 7 分類で整理。各項目に「実機／公式／未検証」の確認区分を付けた）
- 内容は research/ と REVIEW.md に記録した検証結果のみを根拠にしている

## 2026-10-13 第10章 Mambu 机上演習のステップ①〜⑦を詳細化
- ユーザー指示：「part05_ch10.pptx のステップ①〜⑦を、手順を省略せず初心者にもわかるように。各ステップ最大 10 枚。API は送信できないが、Bruno に値を入れて設定するスクリーンショットを掲載する」
- 実施：Bruno v4.2.1 を専用プロファイル（scratchpad）で起動し、CDP で操作。練習用コレクション mambu-practice（scratchpad 内）に 01〜09 のリクエストを画面から 1 つずつ作成し、各操作を撮影（assets/screenshots/ch10m/、54 点）。**Send は一度も押していない**
  - 環境 Mambu-Sandbox はダミー値（example-bank.sandbox.mambu.com、8a44… の key、apiKey は dummy-api-key-12345）を画面で入力。opencollection.yml（共通ヘッダー）と環境ファイルは参考コレクションからコピーして用意した
  - 画面で入力・保存した 9 ファイルは、参考コレクション（exercises/mambu-corporate-onboarding）の 9 ファイルと diff で完全に一致
  - 後片付け：撮影用の Bruno を終了。Documents\bruno は変更なし
- スライド：scripts/mambu_steps.js を新規作成（準備2〜4・ステップ①〜⑦）。mambu_slides.js から呼び出す形に変更（旧版は mambu_slides.js.bak）
  - 枚数：①10、②10、③8、④8、⑤7、⑥7、⑦7（各ステップ＝概要 1 枚＋手順）。準備3 を画面付き 3 枚、準備4 に画面付きの手順 1 枚を追加。第10章は 97 枚
  - 枠の座標は撮影時に DOM から取得（scripts/ch10m_boxes.json）
- PowerPoint COM で PNG に書き出して目視確認し、概要スライドの重なり・保存スライドの画像の大きさ・保存アイコンの枠の位置を修正
- part05_ch10.pptx は PowerPoint で開かれていたため一時的に part05_ch10_new.pptx に出力し、ユーザーが閉じた後に置き換えた

## 2026-10-13 準備3・準備4 の構成変更
- ユーザー指示：準備3 は baseUrl と branchKey だけを設定する流れにし、設定する値の説明を入れる。準備4 は 3 つのヘッダーを入れる理由を説明する（スライドが増えてもよい）
- 準備3：説明 3 枚（入れる値とタイミングの表／baseUrl の構成／branchKey の使い道）＋手順 4 枚（環境の選択／変える 2 行の確認／2 つを入力して Save／Secrets の apiKey）。新しい画面 p05_env_before・p06_env_two を撮影（Send なし）
- ステップ①【9/9】を「残りの 4 つ（groupTypeKey・roleNameKey・depositProductKey・channelId）を入れる」に変更。01 の期待結果を「準備3 の branchKey が一覧にあるか確認」に変更
- 準備4：「なぜこの 3 つのヘッダーを入れるのか」を追加（理由・入れないとどうなるか・コレクションに入れる理由・入れないヘッダー）。opencollection.yml の例に User-Agent を追加
- 第10章は 102 枚
- 追記：準備3【2/4】の前に「仮の文字 SET_BY_ORGANIZATION とは」を追加（YOUR_TENANT も含めて、仮の文字の意味・置き換える値・置き換えないで送るとどうなるか）。【2/4】の手順にも意味を併記。第10章は 103 枚
- 追記：準備4 を画面から始める構成に変更。冒頭に完成形の画面（3 つのヘッダーに番号付き）を置き、表だけの旧スライドを削除。手順を画面付き 4 枚（コレクション名をクリック／Headers タブ（空）／3 行入力／Save）に分割。コレクションの Headers は今回 Bruno の画面から入力して撮影し、保存結果が参考コレクションのヘッダーと一致することを確認（Send なし）。Overview 画面の保存場所のパス（ユーザー名を含む）は白で隠した。第10章は 106 枚
- 追記：準備4 の画像（完成形・【2/4】〜【4/4】）を左のサイドバーまで含めて切り出し、コレクション名と Collection タブを赤枠で示した
- 追記：ステップ①の depositProductKey・channelId を、02・03 の Post Response スクリプト（bru.setEnvVar）で環境に自動保存する形に変更。02 は「CURRENT_ACCOUNT・ACTIVE・通貨 JPY」の商品、03 は isDefault のチャネル（なければ最初）を選ぶ。groupTypeKey・roleNameKey は API で取得する方法が未確認のため手入力のまま
  - 確認方法：作成者の PC で Mambu の応答の形をまねた模擬サーバー（127.0.0.1:4010、ダミーデータ）を動かし、Bruno の画面から 02・03 を Send。3 商品から JPY の当座が、2 チャネルから isDefault が選ばれ、環境ファイル（Mambu-Sandbox.yml）に保存された。共通ヘッダー（Accept・apiKey・User-Agent）が送られることも模擬サーバーのログで確認。Mambu には送っていない
  - 参考コレクションの 02・03 を更新し、画面で作った 9 ファイルと一致することを確認。README も更新
  - ステップ①は「01 の保存」スライドを Assert のスライドに統合し、Script のスライドを 2 枚追加（合計 10 枚のまま）
  - part05_ch10.pptx が PowerPoint で開かれていたため slides/part05_ch10_new.pptx に出力
- 追記：Post Response のスクリプト 5 か所（ステップ①の 02・03、②③④）を、スライド上にコピー用の文字の枠として掲載（左に画面、右に手順とコピー用の枠）。文字は参考コレクションの .yml から読み込み、PowerPoint COM で取り出した枠の文字が .yml のスクリプトと完全に一致することを確認。ステップ①は 10 枚のまま、第10章は 106 枚
- 追記：ステップ②〜⑥の Body の JSON 5 か所も、コピー用の枠で掲載（参考コレクションの .yml から読み込み）。PowerPoint から取り出した文字が .yml と完全に一致し、JSON として正しいことを確認。枚数は変わらず 106 枚
- 追記：第10章全体をセルフレビュー（REVIEW.md R-12）。10 件を修正し、目安時間と確認日の扱いを要判断として記録

## 2026-10-13 環境変数の説明を第9章から第3章へ移動
- ユーザー指示：「環境変数の説明は part04_ch09.pptx から part02_ch03-05.pptx に移動」
- 第3章（scripts/build_part2.js）：演習3-D（3-14）の直後に、旧 9-5【操作】環境と変数を作る → 3-14b、旧 9-6【操作】環境を切り替える → 3-14c、旧 9-7 変数の種類と Secret → 3-14d、旧 9-B Secret の手順（節扉＋3 枚）→ 3-F を追加。Secret の手順は ch9_steps.js の secrets(節番号) を共用
  - 旧 9-4「環境変数でできること」は 3-13「ベース URL と環境変数の考え方」と図・表が重複するため、箇条書きだけを 3-13 に統合（「第9章で詳しく扱います」の文は削除）
  - 章扉の「この章で学ぶこと」、まとめ（Secrets の一文）を更新
- 第9章（scripts/build_part4.js）：9-4〜9-7 と 9-B を削除。章扉・9-2 の表・まとめから環境変数を外し、学習目標から A1 を外した。節扉を 9-A〜9-E に詰め、本文中の参照（9-E → 9-D）と build_part5.js（9-F → 9-E）、mambu_steps.js（9-B → 3-F）、exercises/samples/README.md、docs/GLOSSARY.md を更新
- 枚数：第3〜5章 48 → 55 枚、第9章 67 → 59 枚。目安時間（第3章 50 分・第9章 約 100 分）は変更していない（要判断）
- PowerPoint COM で PNG に書き出して目視確認。slides/preview/part02・part04 を更新。part05_ch10.pptx も参照番号の変更のため再生成

## 2026-10-13 3-3「エンドポイントの調べ方」を 10 枚に詳細化
- ユーザー指示：「part02_ch03-05.pptx のエンドポイントの調べ方。これじゃどう調べたらいいかわからん。スライド 10 枚でもっと丁寧に」
- 新規 scripts/ch3_endpoint.js（10 枚）を build_part2.js の 3-3 から呼び出す形に変更（旧 3-3 の 1 枚は削除）
  - 【1/10】全体の流れ（URL の分解図と 5 つの手順）／【2/10】公式サイトを開く（ページ全体図で Guide・Resources・Routes の位置）／【3/10】Resources（6 種類・件数・項目）／【4/10】リソース名をクリックして中身を見る／【5/10】Routes／【6/10】GET の 4 つの形（一覧・1 件・関連データ・絞り込み）／【7/10】Guide（Create タブを例に、Bruno のどこに入れるか）／【8/10】ブラウザのアドレスバーで GET を試す／【9/10】Bruno に書き写す／【10/10】練習問題とよくある間違い
- 公式サイトは現在 Guide がタブ形式（Get・List・Create・Update・Patch・Delete・Filter・Nested）になっていた（2026-10-13 確認）
- 画像：assets/screenshots/ch3/jp_*.png（8 点）。サイトの節は headless Chrome（playwright-core）、アドレスバー付きの画面は別プロファイルの Chrome を開いてウィンドウを撮影
- 確認（2026-10-13、curl とブラウザ）：/users/3 → Clementine Bauch、/users/3/todos → 20 件、/albums/1/photos → 50 件、/posts?userid=1 → 100 件、/post/1・/posts/101・/posts/1/comments/1 → 404 {}。各リソースの項目名は 1 件目で確認
- 第3〜5章は 55 → 64 枚。目安時間（第3章 50 分）は変更していない（要判断）
- PowerPoint COM で PNG に書き出して目視確認（重なり・はみ出し・番号位置を修正）

## 2026-10-13 4-3「一覧を取得する」を、04_GET とリクエストを自分で作る手順に変更
- ユーザー指示：「スライド 38 がおかしい。なんで最初から 04_GET ができてるの？そこは作り方を教えないとダメやん」
- 原因：配布コレクション bruno-hands-on に 04_GET（01〜06）が完成済みで入っており、4-3 は「開いて Send」だけだった
- 配布物：exercises/bruno-hands-on/04_GET を削除（完成形は samples\04_GET に残る）。exercises/README.md を更新
- 第4章：新規 scripts/ch4_get_steps.js（6 枚）を build_part2.js の 4-3 から呼び出す形に変更（旧 4-3 の 1 枚は削除）
  - 全体の流れ（入力する値の表）／手順 1/5 コレクションを右クリック → New Folder／2/5 04_GET を入力して Create／3/5 04_GET を右クリック → New Request（04_GET は 09_Chain の下に追加される注意）／4/5 名前と URL → Create／5/5 Send → 200 OK → Ctrl + S
  - 4-6・4-8・4-10・4-11・4-12 を「04_GET を右クリック → New Request で作る」手順に変更。4-8 は Params の Query 表に userId=1・id=3 を入力、4-10 は URL に :id を入れて Path の Value に 1 を入力
- 第3章：3-9 の配布物の説明、3-10 の画像（04_GET のない状態）と手順④、演習3-D（コレクション直下に Get Posts with baseUrl を作って送る。samples の 03_Setup\02 と同じ）、3-16 のチェックリストを更新
- 撮影（Send は JSONPlaceholder に実際に送信）：Bruno v4.2.1 を専用プロファイル（job の tmp）で起動し、bruno-hands-on のコピー（04_GET なし）を CDP で操作。画像は assets/screenshots/ch4/g00〜g06（g03 は不使用）。保存場所のパス（ユーザー名）は切り出しまたは白塗りで除外
  - 画面から作った 01〜06 の .yml は、旧配布版の 04_GET の 6 ファイルと diff で完全に一致（違いは folder.yml の seq が 9 になる点だけ）
  - 初回起動で自動作成された Documents\bruno\Sample API Collection - 2 は削除。Documents\bruno はほかに変更なし
- 第3〜5章は 64 → 69 枚。目安時間（第4章 55 分）は変更していない（要判断）
- 未対応（同じ問題の可能性）：第5〜8章も、配布コレクションの 05_POST〜08_DELETE に完成済みのリクエストが入っている

## 2026-10-13 第5章 POST の作成手順と、第4章の画像にサイドバーを追加
- ユーザー指示：「POST の手順も、Datadog の左側の画像も入れてよ」。「Datadog」はリポジトリ内に該当がなく、「GET（第4章）の画像に左のサイドバーを入れる」と解釈した（要確認）。別ジョブ経由の追加指示により、対象は part02_ch03-05.pptx だけ（part03_ch06-08 は変更しない）
- 配布物：exercises/bruno-hands-on/05_POST を削除（完成形は samples\05_POST に残る）。exercises/README.md を更新
- 第5章：新規 scripts/ch5_post_steps.js（9 枚：全体の流れ＋手順 1/8〜8/8。フォルダ作成 → New Request → メソッドを POST に → URL → Body を JSON に → JSON 入力（コピー用の枠つき）→ Send・保存）を 5-5 から呼び出す形に変更。5-9（02 Check Created Post）と 5-10（03 Mistake Text Body）を自分で作る手順＋サイドバー付きの画面に変更。5-10 は「① TEXT」「② JSON の書き間違い（元の画像のまま）」の 2 枚に分けた
- 第4章：4-6・4-8・4-10・4-11・4-12 の画像を、左のサイドバー（04_GET の中のどのリクエストか）まで含む画面に差し替え（ch4/h02〜h06）
- 05_POST を配布物から外すと、04_GET の seq が 8 になり 09_Chain（seq 8）と同じ番号になるため、04_GET は 09_TIPS の下（09_Chain の上）に追加される（作成環境で確認）。4-3 の注意書きを変更し、4-3 の画像（g01・g02・g04・g05・g06）を 05_POST のない状態で撮り直した。05_POST は seq 9 で 09_Chain の下・10_LocalMock の上に追加される
- 演習3-B の画像 g00_opened_tree（04_GET・05_POST のない状態）と、3-B・チェックリストの文言を更新
- 撮影（Send は JSONPlaceholder に実際に送信）：Bruno v4.2.1 を専用プロファイル（job の tmp）で起動し CDP で操作。画面から作った 05_POST の 3 ファイルは旧配布版と diff で完全に一致（folder.yml の seq だけ 9）。保存場所のパス（ユーザー名）が写る部分は白で塗った。Documents\bruno は変更なし
- Body の入力は、括弧の自動補完の影響を避けるため、撮影時はエディタに値を直接設定した（受講者がキーボードで入力したときの動作は未確認）
- 第3〜5章は 69 → 78 枚。目安時間（第5章 45 分）は変更していない（要判断）
- PowerPoint COM で PNG に書き出して目視確認（重なり・枠の位置・読めない画像を修正）
