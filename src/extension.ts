// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { execSync } from 'child_process';
import * as vscode from 'vscode';
import { ExtensionContext, extensions } from 'vscode';
import { Configs } from './types';
import { getConfigs, getWorkSpacePath, isConfirm } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "extensions-unwanted-recommendations" is now active!');

	vscode.window.showInformationMessage('Checking for unwanted extension recommendations!');
	// Check for extensions
	checkingExtensions(context);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extensions-unwanted-recommendations.checkPackages', () => {
		// The code you place here will be executed every time your command is executed
		checkingExtensions(context);
	});

	context.subscriptions.push(disposable);
}

async function checkingExtensions(context: ExtensionContext) {
	let unwantedRecommendations: string[] = [];

	const configs: Configs = await getConfigs(context);
	if (configs.unwantedRecommendations.length === 0) {
		vscode.window.showInformationMessage("No extensions to disable");
		return;
	} else {
		let installedExtensions = vscode.extensions.all;
		console.log("installed extensions", installedExtensions);

		configs.unwantedRecommendations.map(async unwantedExtensionId => {
			const unwantedExtension = installedExtensions.find(extension => extension.id === unwantedExtensionId);
			console.log("extension enabled?", unwantedExtensionId, unwantedExtension);

			if (unwantedExtension) {
				unwantedRecommendations.push(unwantedExtensionId);

				const message = `Extension ${unwantedExtension.packageJSON.displayName} (${unwantedExtension.id}) seems to be enabled, please disable it for this workspace`;
				console.log(message);
				const data = await vscode.window.showWarningMessage(message, { title: 'Show', value: 'show' },);
				if (data?.value === "show") {
					showExtensionsInMarketplaceSearch(context, [unwantedExtension.id]);
				}
			}

		});

		if (unwantedRecommendations.length > 0) {
			const result = await isConfirm("Display unwanted extensions?", "Do you want to open the unwanted extensions in the extension gallery?\nIt is recommended to disable them for this workspace.\n You need to do this manually.");
			if (result) {
				showExtensionsInMarketplaceSearch(context, unwantedRecommendations);
			}
		}

	}
}

function showExtensionsInMarketplaceSearch(context: ExtensionContext, extensions: string[]) {
	vscode.commands.executeCommand('workbench.extensions.search', '@id:' + extensions.join(", @id:"));
}

// This method is called when your extension is deactivated
export function deactivate() { }
