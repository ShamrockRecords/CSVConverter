# CSVConverter

https://ShamrockRecords.github.io/CSVConverter/

このプログラムはUDトークで書き出されたCSVファイルをYouTubeおよびFacebook動画のクローズドキャプション用のファイルに変換するためのものです。

2020.12.8更新：１行の文字数を設定できるようにしました。UDトークの書き出しデータは１発話の文字数が多いので、いい感じに分割して書き出します。十分に大きな数を設定すると分割処理を行いません。

## .srtを作成（Facebook動画用）

Convert To SRTをクリックします。Offset Millisecondsは開始時間のオフセットを入力します。0のときは一行目のデータが00:00:00.000で始まります。
テキストエリアにsrt形式で出力されるのでコピペしてファイルに保存してください。

## .sbvを作成（YouTube用）

Convert To SBVをクリックします。Offset Millisecondsは開始時間のオフセットを入力します。0のときは一行目のデータが00:00:00.000で始まります。
テキストエリアにsbv形式で出力されるのでコピペしてファイルに保存してください。

# ライセンス

CC BY UDトーク
