# Unwanted recommendations (extensions)

This extensions, tries to help out with extensions which are not recommended for specific workspaces.

## Details / Situation

Until now, it seems not to be possible to automate enabling or disabling extensions per project/workspace
VSCode Team is working on profiles, which might be the solution in the future for that.

Until then, its not easy to handle it. This extension tries to improve the experience for developers.

## Features

### Note down unwanted extensions

This extension allows you to put unwanted extensions, into the already existing `.vscode/extensions.json` file, which already seems to kind of support the property `unwantedRecommendations`. Simply put your vscode extension id's in this array.

Following is a possible example for using **`Volar`**, and check for disabled `Vetur`, `Typescript Vue Plugin` amd `(@builtin) Typescript Language Features`:

```json
{
    "recommendations": [
        "vue.volar"
    ],
    "unwantedRecommendations": [
        "vscode.typescript-language-features",
        "octref.vetur",
        "vue.vscode-typescript-vue-plugin"
    ]
}
```

> Note: This extension is only handling the `unwantedRecommendations`, as the `recommendations` are already handled by **VSCode**.

### What does this extension do

* This extension will *automatically* run if the `.vscode/extensions.json` file exists. (When opening the folder/workspace).
* If there are `unwantedRecommendations`, it will go through them and check if the `extension` is enabled.
* If it is **enabled**, it will show a warning message including an info to disabled the extension manually.
* After all extensions are checked, a popup will ask to show all extensions in the extension-gallery.

After the user disabled manually all unwanted extensions, the workspace should work fine, even after restarts/reboots.

<!-- For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

### Execute the check manually

You can also execute the check manually, using the vscode **command**

* `Check for unwanted recommendations (extensions)`

## Requirements

`.vscode/extensions.json` should contain the list of unwanted extensions within the `unwantedRecommendations` property. See above for details.

## Extension Settings

No settings yet.

## Known Issues

None.

## Release Notes

### 0.1.0

Initial release

---

## 🎉 Sponsored by GARAIO AG 🎉

The extension was developed by [Fabian Gander aka Cyclodex](https://github.com/Cyclodex), sponsored by [GARAIO AG](https://www.garaio.com). Thanks!
