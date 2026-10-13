# samples：手順どおりにできなかった場合の完成済みリクエスト（YAML）

研修中に、自分でリクエストを作れなかった・設定がうまくいかなかったときは、このフォルダを Bruno で開き、
スライド下部の緑の帯「できなかった場合：」に書かれた .yml（リクエスト）を開いて Send してください。

## 開き方
1. Bruno のサイドバー上部の「＋」→「Open collection」
2. `exercises\samples` フォルダを選ぶ → サイドバーに samples が表示される
3. 画面右上の環境で **JSONPlaceholder** を選ぶ
4. 使いたいリクエスト（例：`04_GET\01 Get Posts.yml`）をクリックして Send

## 中身（すべて Bruno CLI 4.2.1 で実行し、期待どおりの結果を確認済み：2026-10-09、2026-10-13 再確認）
| フォルダ | 内容 | 対応 |
|---|---|---|
| 03_Setup | 01 Get Post 1（演習3-A の Get Post 1 の完成形）、02 Get Posts with baseUrl（演習3-D） | 第3章 |
| 04_GET | 01〜06（手順のリクエスト）、Q1〜Q4（演習問題4 ①〜④の解答） | 第4章 |
| 05_POST | 01〜03、Q1〜Q2（演習問題5 ①②の解答） | 第5章 |
| 06_PATCH | 01〜02、Q1〜Q2（演習問題6の解答） | 第6章 |
| 07_PUT | 01〜03、Q1〜Q2（演習問題7の解答） | 第7章 |
| 08_DELETE | 01〜02、Q1〜Q2（演習問題8の解答） | 第8章 |
| 09_Features | 01 アサーション、02 テスト、03→04 値の受け渡し（firstPostId） | 第9章 |
| 09_TIPS | 01 CSV/JSON ファイルの値で実行（CLI）、02 ランダム値、03 固定の文字＋3 桁の数字 | 第9章 TIPS |
| 09_Chain | 01〜06 値の受け渡し（Script・Vars タブで保存 → URL・Query・Header・Body で使う） | 第9章 |
| 10_MyFolder | My Request（9-A〜9-C で作るリクエストの完成形） | 第9章 |
| 10_Final | 修了課題の完成形の例（Posts に 01〜05、Comments に 01） | 第10章 |
| 10_LocalMock | 発展課題（json-server）の 01〜04 | 第10章 |
| environments | JSONPlaceholder、Local-Mock | — |

※ Q で始まるリクエストは解答です。先に自分で考えてから開きましょう。
※ 次のものは、そのまま Send するだけでは期待どおりにならないことがあります。
- 09_Features の 04、09_Chain の 02〜06：前のリクエスト（03、01）を先に Send して値を保存してから送る（フォルダを右クリック → Run なら順番に実行される）
- 09_TIPS の 01：データファイルを指定して CLI で実行する（`--csv-file-path ../tips/tips-posts.csv` など。第9章 TIPS のスライド）
- 10_LocalMock：json-server を起動し、環境を **Local-Mock** に切り替えてから 01 → 04 の順に Send する
- 10_Final：修了課題で作るのは 5 つ（Posts の 01〜05）。Comments の 01 は追加の例なので、Runner の件数は 6 になる
※ 演習3-E（Share）の ZIP の見本と、全リクエストの実行結果の記録は answers\results にあります（講師用）。
