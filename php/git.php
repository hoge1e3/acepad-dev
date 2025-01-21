<?php
$gitrepo="/home/user03/petit.git";//should be bare
$workroot="/tmp/pgit";

$cmd=($_GET["cmd"]);
if ($cmd=="clone") {
    
} else if ($cmd=="sync") {
    $work=$_GET["work"];
    sync($work);
}
function unzip($zipfile, $dstdir) {
    // Check if the zip file exists
    if (!file_exists($zipfile)) {
        throw new Exception("Zip file does not exist: $zipfile");
    }
    // Check if the destination directory is writable or create it
    if (!is_dir($dstdir)) {
        if (!mkdir($dstdir, 0755, true)) {
            throw new Exception("Failed to create destination directory: $dstdir");
        }
    }
    // Open the zip file
    $zip = new ZipArchive();
    if ($zip->open($zipfile) === true) {
        // Extract the contents of the zip file to the destination directory
        if (!$zip->extractTo($dstdir)) {
            $zip->close();
            throw new Exception("Failed to extract zip file: $zipfile");
        }
        $zip->close();
        // List of deleted files is stored in "$dstdir/.git/DELETED.json" as arry
        // Delete these files 
        // Path to the JSON file that contains the list of deleted files
        $deletedFilesPath = "$dstdir/.git/DELETED.json";
        
        // Check if the JSON file exists
        if (file_exists($deletedFilesPath)) {
            // Read the JSON file
            $deletedFilesContent = file_get_contents($deletedFilesPath);
            // Decode the JSON content into an array
            $deletedFiles = json_decode($deletedFilesContent, true);
            // Check if the decoding was successful and the result is an array
            if (is_array($deletedFiles)) {
                foreach ($deletedFiles as $file) {
                    // Construct the full file path
                    $filePath = $dstdir . DIRECTORY_SEPARATOR . $file;
        
                    // Check if the file exists
                    if (file_exists($filePath)) {
                        // Attempt to delete the file
                        if (!unlink($filePath)) {
                            // Log or handle the failure to delete the file
                            error_log("Failed to delete file: $filePath");
                        }
                    } else {
                        // Log or handle the case where the file does not exist
                        error_log("File not found: $filePath");
                    }
                }
            } else {
                // Log or handle the case where the JSON decoding failed
                error_log("Invalid JSON format in $deletedFilesPath");
            }
        } else {
            // Log or handle the case where the JSON file does not exist
            error_log("Deleted files JSON not found: $deletedFilesPath");
        }
        
    } else {
        throw new Exception("Unable to open zip file: $zipfile");
    }
    return true; // Extraction successful
}
// Gitコマンドを実行し、結果を配列で返す関数
function runGitCommand($command) {
    $output = [];
    exec($command, $output);
    return $output;
}

function sync($work) {
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
}
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

