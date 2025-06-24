# テストログ出力ガイド

## 利用可能なテストログコマンド

### 1. 基本的なテスト実行（標準出力）

```bash
npm run test
```

### 2. 詳細ログをファイルに出力

```bash
npm run test:all
```

**出力ファイル**: `test-output.log`
**内容**: 詳細なテスト実行ログ（標準出力とエラー出力の両方）

### 3. JSON形式でテスト結果を出力

```bash
npm run test:log
```

**出力ファイル**: `test-results.json`
**内容**: 構造化されたテスト結果データ

### 4. JUnit XML形式でテスト結果を出力

```bash
npm run test:report
```

**出力ファイル**: `test-results.xml`
**内容**: CI/CDツール用のJUnit形式テストレポート

### 5. カバレッジ付きテスト（HTMLレポート付き）

```bash
npm run test:coverage
```

**出力フォルダ**: `coverage/`
**内容**: HTMLファイルでのカバレッジレポート

## 推奨されるログ出力方法

### 開発時の詳細確認

```bash
# 詳細ログをファイルに出力し、同時に画面でも確認
npm run test:all
```

### CI/CD環境での結果保存

```bash
# JSON形式で機械読み取り可能な結果を保存
npm run test:log
```

### テスト結果の分析

```bash
# カバレッジレポートと合わせて確認
npm run test:coverage
```

## 出力ファイルの説明

### test-output.log

- 人間が読みやすい形式
- エラーメッセージの詳細
- テスト実行の時系列情報
- 失敗したテストのスタックトレース

### test-results.json

```json
{
  "version": "1",
  "results": [
    {
      "file": "src/example.test.ts",
      "name": "テスト名",
      "status": "passed|failed|skipped",
      "duration": 123,
      "error": "エラーメッセージ（失敗時）"
    }
  ],
  "summary": {
    "passed": 23,
    "failed": 8,
    "total": 31,
    "duration": 37410
  }
}
```

### test-results.xml (JUnit形式)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="テストスイート名" tests="31" failures="8" time="37.41">
    <testcase classname="NotificationCenter" name="正常にレンダリングされる" time="0.123"/>
    <testcase classname="NotificationCenter" name="失敗テスト" time="5.042">
      <failure>エラーメッセージ</failure>
    </testcase>
  </testsuite>
</testsuites>
```

## ログファイルの活用方法

### 1. エラー分析

```bash
# エラーのみを抽出
grep -i "error\|fail" test-output.log

# 特定のテストファイルの結果のみ表示
grep "NotificationCenter" test-output.log
```

### 2. パフォーマンス分析

```bash
# 実行時間の長いテストを特定
grep "Duration\|ms" test-output.log | sort -n
```

### 3. JSON結果の解析

```bash
# jqを使用してJSON結果を解析（jqがインストールされている場合）
cat test-results.json | jq '.summary'
cat test-results.json | jq '.results[] | select(.status == "failed")'
```

## 自動化での活用

### GitHub Actions例

```yaml
- name: Run tests with logging
  run: npm run test:log

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      test-results.json
      test-results.xml
      test-output.log
```

### ローカル開発での継続監視

```bash
# ファイル変更を監視してテスト実行し、ログを保存
npm run test -- --watch --reporter=verbose 2>&1 | tee -a test-watch.log
```

## トラブルシューティング

### ログファイルが生成されない場合

1. 権限を確認: `ls -la test-*.log test-*.json`
2. ディスク容量を確認: `df -h`
3. Vitestのバージョンを確認: `npm list vitest`

### 大きすぎるログファイル

```bash
# ログファイルのサイズを制限（最新1000行のみ保持）
tail -1000 test-output.log > test-output-latest.log
```

これらのコマンドを使用して、テスト結果を適切にファイルに出力し、分析に活用してください。
