import * as vscode from 'vscode';
import { Configs } from './types';
import * as Hjson from 'hjson';

export async function getExtensionsJson() {
    const fileGlob = '.vscode/extensions.json';
    const files = await vscode.workspace.findFiles(fileGlob, '**​/node_modules/**');

    if (files.length === 1) {
        const buffer = await vscode.workspace.fs.readFile(files[0]);
        // Hjson can handle/ignore comments within the json file
        const configs: Configs = Hjson.parse(buffer.toString());
        console.log("extensions.json", configs);
        return configs;
    } else {
        vscode.window.showWarningMessage('No defined extensions found, please define "unwantedRecommendations" within the ".vscode/extensions.json" file. See [documentation](https://github.com/garaio/vscode-unwanted-recommendations) for more details.');

        throw new Error('No ".vscode/extensions.json" file found');
    }
}

export async function isConfirm(message: string, detail?: string): Promise<boolean> {
    interface MsgItem extends vscode.MessageItem { value: 'confirm' | 'cancel' };

    const data = await vscode.window.showInformationMessage<MsgItem>(
        message,
        { modal: true, detail: detail },
        { title: 'Yes', value: 'confirm' },
        { title: 'Cancel', isCloseAffordance: true, value: 'cancel' },
    );
    return data?.value === 'confirm';
}


export function showExtensionsInMarketplaceSearch(extensions: string[]) {
    vscode.commands.executeCommand('workbench.extensions.search', '@id:' + extensions.join(", @id:"));
}