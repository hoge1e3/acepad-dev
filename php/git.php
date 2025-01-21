<?php

// Gitコマンドを実行し、結果を配列で返す関数
function runGitCommand($command) {
    $output = [];
    exec($command, $output);
    return $output;
}

// リモートの変更（pull 直後の変更）
$remoteChanges = runGitCommand('git diff --name-status HEAD@{1}..HEAD');

// ステージング済みの変更
$stagedChanges = runGitCommand('git diff --name-status --cached');

// ワーキングツリーの未コミットの変更
$unstagedChanges = runGitCommand('git diff --name-status');

// コンフリクトしたファイル
$conflictedFiles = runGitCommand('git diff --name-only --diff-filter=U');

// データ構造に変換
$changes = [];

// 共通の関数でデータ変換
function parseGitChanges($lines, $defaultStatus) {
    $parsed = [];
    foreach ($lines as $line) {
        if (!empty($line)) {
            list($status, $file) = preg_split('/\s+/', $line, 2);
            $parsed[] = [
                'status' => $status ?: $defaultStatus,
                'file' => $file
            ];
        }
    }
    return $parsed;
}

// 各種変更をまとめる
$changes = array_merge(
    parseGitChanges($remoteChanges, 'R'),  // リモート変更 (デフォルト: "R")
    parseGitChanges($stagedChanges, 'S'), // ステージング済み変更 (デフォルト: "S")
    parseGitChanges($unstagedChanges, 'U') // 未コミット変更 (デフォルト: "U")
);

// コンフリクトを追加
foreach ($conflictedFiles as $file) {
    if (!empty($file)) {
        $changes[] = [
            'status' => 'C', // コンフリクトは "C"
            'file' => $file
        ];
    }
}

// JSONとして出力
header('Content-Type: application/json');
echo json_encode($changes, JSON_PRETTY_PRINT);

