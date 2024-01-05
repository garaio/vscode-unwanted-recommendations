# ⛔️ DEPRECATED - Unwanted recommendations (extensions)

This repo & extension is no longer maintained/supported, please consider using the successor [vscode-unwanted-extensions](https://github.com/SoulcodeAgency/vscode-unwanted-extensions) instead.  
It's exactly the same extension but still maintained and getting more features.

# Outdated README

This extensions, tries to help out with extensions which are not recommended for specific workspaces.

## 📖 Blog post

I have writen a more complete blog post about the whole topic and this extension, [👀 read it here](https://www.garaio.com/blog/vscode-extensions-unwanted-recommendations)

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

### Screenshots

#### If `unwantedRecommendations` are defined

1. When opening a project, this extension checks all configured `unwantedRecommendations` and reports the still enabled extensions:
![image](https://user-images.githubusercontent.com/840929/211357086-5c4428ac-d849-4fd4-b178-68e84a513e0b.png)

1. After click "yes" on the provided popup, it will bring you to the extensions, to disable them manually: (list will be already filtered to the specific extensions)
![image](https://user-images.githubusercontent.com/840929/211357256-536e539e-c6e0-4e3a-9419-a9412304faf2.png)

1. You / the user can now disable the extensions manually - preferably using the **Disable (Workspace)** action
![image](https://user-images.githubusercontent.com/840929/211357536-c6de209c-f52d-4ff8-b1b8-5e5349de04b0.png)

1. On the next restart/reload of vscode, the extension will check again and notify that all is fine (if all `unwantedRecommendations`-extensions are disabled)
![image](https://user-images.githubusercontent.com/840929/211357704-63f4c7f0-f393-4155-abe7-0798f3d5fe77.png)

----

#### No unwanted recommendations defined

Further when there is no extension defined as `unwantedRecommendations`, this extension will show the following information:

1. When manually checking using the **command** (see below) and no `extensions.json` file exist:
![image](https://user-images.githubusercontent.com/840929/211356852-d2d72204-4ae8-4514-a86b-e5ac5660d2b6.png)

1. No `unwantedRecommendations` configured within `extension.json`
![image](https://user-images.githubusercontent.com/840929/211356601-e160749a-4da4-4fe9-8ec1-c6f35639f93e.png)

### Execute the check manually

You can also execute the check manually, using the vscode **command**

* `Check for unwanted recommendations (extensions)`

## Requirements

`.vscode/extensions.json` should contain the list of unwanted extensions within the `unwantedRecommendations` property. See above for details.

**Workspaces / Multi-root workspaces**

You can use the above approach if you are running a workspace.
Just place the `.vscode/extensions.json` file into your workspace root directory.

Alternatively you can also put the unwanted extensions within your `***.code-workspace` file.

```json
{
 "extensions": {
  "unwantedRecommendations": [
   "octref.vetur",
  ]
 }
}
```

## Extension Settings

No settings yet.

## 🎉 Sponsored by GARAIO AG 🎉

The extension was developed by [Fabian Gander aka Cyclodex](https://github.com/Cyclodex), sponsored by [GARAIO AG](https://www.garaio.com). Thanks!
