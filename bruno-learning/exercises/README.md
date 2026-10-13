# 演習用ファイルの使い方

対象：Bruno v4.2.1（Windows 11）／確認日 2026-10-09
※ 演習の多くはインターネット接続が必要です（練習用 API：https://jsonplaceholder.typicode.com/）。
※ 秘密の値（API キー・パスワード）は含まれていません。

## 1. 配置

配布フォルダ `bruno-learning` を「ドキュメント」に置きます（例：`C:\Users\<ユーザー名>\Documents\bruno-learning\`）。zip の場合は必ず展開してから使います。

| フォルダ・ファイル | 用途 | 使う章 |
|---|---|---|
| `bruno-hands-on/` | 演習用コレクション（YAML / OpenCollection 形式） | 第3〜9章 |
| `bruno-hands-on/environments/JSONPlaceholder.yml` | 環境：baseUrl = https://jsonplaceholder.typicode.com | 第3章〜 |
| `bruno-hands-on/environments/Local-Mock.yml` | 環境：baseUrl = http://localhost:3000（発展課題用） | 第10章 |
| `import-practice/import-practice.postman_collection.json` | Import Collection の練習用（Postman 形式） | 第3章 |
| `tips/tips-posts.csv`、`tips/tips-posts.json` | TIPS（外部ファイルの値で繰り返し実行）用 | 第9章 |
| `samples/` | **手順どおりにできなかった場合の完成済みリクエスト（YAML）**。Open Collection で開き、該当の .yml を Send する。詳しくは samples/README.md | 第3〜9章 |

## 2. 開き方

- **Open Collection（演習3-B）**：サイドバー上部の「＋」→「Open collection」→ `exercises` フォルダを選ぶ → `bruno-hands-on` にチェック →「Open」
- **Import Collection（演習3-C）**：「＋」→「Import collection」→ File タブで `import-practice.postman_collection.json` を選ぶ → 保存先を Browse で選ぶ →「Import」
- 開いたら、画面右上の環境で **JSONPlaceholder** を選びます（選ばないと `getaddrinfo ENOTFOUND {{baseurl}}` になります）。

## 3. bruno-hands-on の中身

| フォルダ | リクエスト | 期待する結果（2026-10-09 確認） |
|---|---|---|
| 04_GET | **配布物には含めない**。第4章（4-3〜4-12）で受講者が New Folder・New Request で自分で作る：01 Get Posts / 02 Get Post by ID / 03 Get Posts by Query（userId=1&id=3）/ 04 Get Post by Path Param（:id）/ 05 Get Comments of Post / 06 Get Missing Post。完成形は `samples\04_GET` | 200（100 件）/ 200 / 200（1 件）/ 200 / 200（5 件）/ 404 |
| 05_POST | **配布物には含めない**。第5章（5-5〜5-10）で受講者が New Folder・New Request で自分で作る：01 Create Post（POST・Body は JSON）/ 02 Check Created Post / 03 Mistake Text Body。完成形は `samples\05_POST` | 201（id 101）/ 404（保存されないことの確認）/ 201 だが `{"id":101}` だけ（間違いの例） |
| 06_PATCH | 01 Patch Post Title / 02 Check After Patch | 200（title だけ変わる）/ 200（元のまま） |
| 07_PUT | 01 Put Post Full / 02 Put Post Title Only / 03 Patch Post Title Only | 200 / 200（title と id だけ）/ 200（他の項目が残る） |
| 08_DELETE | 01 Delete Post / 02 Check After Delete | 200 `{}` / 200（残っている） |
| 09_Features | 01 Assert Example / 02 Test Script Example / 03 Save First Post Id / 04 Use Saved Id | アサーション 3 件・テスト 2 件が成功。03 → 04 の順で実行すると 04 は /posts/11 に送られる |
| 09_TIPS | 01 Create Post from Data File / 02 Create Post with Random Values | CLI でデータファイルを指定して実行（下記）／送るたびに値が変わる |

## 4. CLI での実行（第9章）

Node.js（LTS 版）をインストールし、`npm install -g @usebruno/cli` で CLI を入れます。`bruno-hands-on` フォルダで実行します。

```powershell
cd $env:USERPROFILE\Documents\bruno-learning\exercises\bruno-hands-on
bru run 09_Features --env JSONPlaceholder
bru run -r --env JSONPlaceholder --reporter-html report.html
bru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --csv-file-path ../tips/tips-posts.csv
bru run "09_TIPS/01 Create Post from Data File.yml" --env JSONPlaceholder --json-file-path ../tips/tips-posts.json
```

## 5. 注意

- JSONPlaceholder の POST・PUT・PATCH・DELETE は「成功したふり」で、データは保存されません（公式：https://jsonplaceholder.typicode.com/#guide）。
- 03 Mistake Text Body は、わざと Body の種類を TEXT にした「間違いの例」です。
- 演習で値を変えて試したときは、元に戻してから保存してください。

## 6. 検証状況

- 全リクエストを Bruno CLI 4.2.1 で実行し、期待どおりの結果を確認（`answers/cli-results/`）。
- 第3〜9章の画面操作は Bruno v4.2.1 の画面で実際に操作して確認（`research/GUI_VERIFICATION.md`）。
- `npm install -g`（PC 全体へのインストール）は作成環境では行っていません（作業用フォルダへのインストールで動作を確認）。
