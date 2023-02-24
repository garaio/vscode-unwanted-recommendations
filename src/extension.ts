// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import { Configs } from './types';
import { getExtensionsJson, isConfirm, showExtensionsInMarketplaceSearch } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "extensions-unwanted-recommendations" is now active!');

	// Check for extensions
	checkingExtensions(context);

	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand('extensions-unwanted-recommendations.checkPackages', () => {
		checkingExtensions(context, true);
	});

	context.subscriptions.push(disposable);
}

async function checkingExtensions(context: ExtensionContext, verbose = false) {
	// Get the extensions.json content
	const configs: Configs = await getExtensionsJson(verbose);

	// Make sure, that the unwantedRecommendations is defined, otherwise we have nothing to do
	let amountOfUnwantedRecommendations = configs.unwantedRecommendations?.length ?? 0;
	if (amountOfUnwantedRecommendations === 0) {
		console.log("No unwanted recommendations found.");
		verbose && vscode.window.showWarningMessage("No unwanted recommendations found.");
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Unwanted recommendations",
		cancellable: false
	}, async (progress, token) => {
		// In case "cancellable" is set to true and the user canceled the operation
		token.onCancellationRequested(() => {
			console.log("User canceled operation");
		});

		return new Promise<void>(async (resolve) => {
			// Start checking for extensions
			progress.report({ increment: 25, message: "checking... 🕵️" });

			// Collect all unwanted recommendations which are still enabled
			let enabledUnwantedRecommendations: string[] = [];
			const installedExtensions = vscode.extensions.all;
			// Progress is already on 25, define the rest for every extension
			let progressStep = 75 / amountOfUnwantedRecommendations;

			// Iterate over the unwanted recommendations
			configs.unwantedRecommendations.map(async unwantedExtensionId => {
				progress.report({ increment: progressStep, message: unwantedExtensionId + "..." });

				const unwantedExtension = installedExtensions.find(extension => extension.id === unwantedExtensionId);
				console.log(`${unwantedExtensionId} is ${unwantedExtension ? "enabled" : "disabled"}`);

				if (unwantedExtension) {
					enabledUnwantedRecommendations.push(unwantedExtensionId);

					const message = `Its recommended to disable "${unwantedExtension.packageJSON.displayName}" (${unwantedExtension.id}) for this workspace`;
					console.log(message);

					// Allow the user to click a single extension to verify in the extension marketplace
					const data = await vscode.window.showWarningMessage(message, { title: 'Show', value: 'show' },);
					if (data?.value === "show") {
						showExtensionsInMarketplaceSearch([unwantedExtension.id]);
					}
				}
			});

			if (enabledUnwantedRecommendations.length > 0) {
				// Show a summary for the user about enabled unwanted recommendations
				progress.report({ increment: 100, message: `Found ${enabledUnwantedRecommendations.length} enabled unwanted extensions!` });
				const result = await isConfirm("Display unwanted recommendations (extensions)?", "Do you want to display the unwanted recommendations (extensions)?\nIt's recommended to disable them for this workspace.\nYou need to do this manually.");
				if (result) {
					showExtensionsInMarketplaceSearch(enabledUnwantedRecommendations);
				}
			} else {
				// Checked, all unwanted extensions are disabled
				progress.report({ increment: 100, message: `Done ✔️` });
			}

			// Wait a bit until we resolve the progress indicator Notification
			await new Promise(resolveWaiting => setTimeout(resolveWaiting, 5000));
			resolve();
		});

	});
}


// This method is called when your extension is deactivated
export function deactivate() { }
