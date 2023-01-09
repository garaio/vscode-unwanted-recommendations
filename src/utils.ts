import { workspace, ExtensionContext, window, MessageItem } from 'vscode';
import * as path from 'path';
import { Configs } from './types';
import * as Hjson from 'hjson';



export function getWorkSpacePath ()  {
  let workspacePath: string = '';
  if (workspace.workspaceFolders?.length) {
    workspacePath = workspace.workspaceFolders[0].uri.fsPath;
    workspacePath = path.normalize(workspacePath);
    return workspacePath;
  } else {
    throw new Error('No workspace file found');
  }
};

export async function getConfigs(context: ExtensionContext) {
  const fileGlob = '.vscode/extensions.json';
  const files = await workspace.findFiles(fileGlob, '**​/node_modules/**');

  if (files.length === 1) {
    const buffer = await workspace.fs.readFile(files[0]);
    const configs: Configs = Hjson.parse(buffer.toString());
	console.log("extensions.json", configs);
    return configs;
  } else {
    throw new Error('No ".vscode/extensions.json" file found');
  }
}

export async function isConfirm(message: string, detail?: string): Promise<boolean> {
  interface MsgItem extends MessageItem { value: 'confirm' | 'cancel' };

  const data = await window.showInformationMessage<MsgItem>(
    message,
    { modal: true, detail: detail },
    { title: 'Yes', value: 'confirm' },
    { title: 'Cancel', isCloseAffordance: true, value: 'cancel' },
  );
  return data?.value === 'confirm';
}