import * as vscode from 'vscode';
import { Configs } from './types';
import * as Hjson from 'hjson';

export async function getJsonConfig(uri: vscode.Uri): Promise<Configs> {
    const buffer = await vscode.workspace.fs.readFile(uri);
    // Hjson can handle/ignore comments within the json file
    const config: Configs = Hjson.parse(buffer.toString());

    // If workspace settings, return only the extensions
    if (config.extensions) {
        return config.extensions;
    }
    return config;
}

export async function getExtensionsJson(): Promise<Configs> {
    // Check for default extensions.json file
    // Note: We could open it further for all subdirectories if wanted (**/)
    const fileGlob = '.vscode/extensions.json';
    const files = await vscode.workspace.findFiles(fileGlob, '**​/node_modules/**');

    // Add Workspace file if one exists
    const workspaceFile = vscode.workspace.workspaceFile;
    if (workspaceFile) {
        files.push(workspaceFile);
    }

    if (files.length === 0) {
        vscode.window.showWarningMessage('No defined extensions found, please define "unwantedRecommendations" within the ".vscode/extensions.json" file. See [documentation](https://github.com/garaio/vscode-unwanted-recommendations) for more details.');

        throw new Error('No ".vscode/extensions.json" file found');
    } else {
        let configs: Configs = {
            recommendations: [],
            unwantedRecommendations: [],
        };

        await Promise.all(files.map(async file => {
            const config = await getJsonConfig(file);
            // Merge the configs
            if (config.recommendations) {
                configs.recommendations = [...configs.recommendations, ...config.recommendations];
            }
            if (config.unwantedRecommendations) {
                configs.unwantedRecommendations = [...configs.unwantedRecommendations, ...config.unwantedRecommendations];
            }
        }));
        return configs;
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