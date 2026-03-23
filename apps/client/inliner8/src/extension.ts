'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import cp = require('child_process');
// import {resolve} from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors
  // (console.error) This line of code will only be executed once when your
  // extension is activated
  console.log('Congratulations, your extension "inliner8" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable =
      vscode.commands.registerCommand('extension.runInliner', () => {
        // The code you place here will be executed every time your command is
        // executed
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;  // No open text editor
        }
        let text = editor.document.getText();

        let formatArgs = ['-i', editor.document.fileName];
        // Display a message box to the user
        let workingPath = vscode.workspace.rootPath;
        vscode.window.showInformationMessage(
            'Running inliner ' + formatArgs.join(' ') + '! Please HODL.');

        let inlinerCompleted = (err: any, stdout: string, stderr: string) => {
          if (err && (<any>err).code === 'ENOENT') {
            vscode.window.showInformationMessage(
                'The \'inliner\' command is not available.');
          }
          if (err) {
            vscode.window.showInformationMessage(
                'Unable to run inliner ' + stderr);
          }
          // Perform the edit
          return editor.edit(function(edit) {
            edit.replace(
                new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(text.length)),
                    stdout);
          })
        };

        let child = cp.exec('inliner ' + formatArgs.join(" "), {cwd: workingPath}, inlinerCompleted);
        child.stdin.end(text);
      });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
