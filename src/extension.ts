// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";
import { Uri } from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const fileDownloader: FileDownloader = await getApi();
  let json = "{}";
  let definitions = JSON.parse(json);

  vscode.languages.registerHoverProvider("c", {
    async provideHover(document, position, token) {
      if (json == "") {
        fileDownloader.getItem("capibara.json", context).then((uri) => {
          console.log("Loading capibara.json");
          vscode.workspace.openTextDocument(uri).then((document) => {
            console.log("Reading capibara.json");
            json = document.getText();
            definitions = JSON.parse(json);
          });
        });
      }

      let hovered_text_range = document.getWordRangeAtPosition(position, /\w+/g);

      let text = document.getText(hovered_text_range);

      let functions = definitions.functions.filter((x: any) => x.name == text);

      //console.log(functions)

      let response = "";

      functions.forEach((fn: any) => {
        response += "`<"+fn.header.name+">`\n\n"
        response += fn.name;
        response += "(";
        fn.parameters.forEach((param: any, i: any) => {
          response += "_" + param.type + "_";
          response += " ";
          response += "`" + param.name + "`";
          if (i != fn.parameters.length - 1) {
            response += ", ";
          }
        });
        response += ")";
        response += "\n---";
        response += "\n\n__Summary:__\t" + fn.summary;
        response += "\n\n__Returns:__\t" + "_"+fn.returns+"_";
        response += "\n\n__Parameters:__\t";
        fn.parameters.forEach((param: any) => {
          response += "\n\n - ";
          response += "`"+param.name+"`";
          response += " : ";
          response += "_"+param.type+"_";
          response += " - ";
          response += param.description+"";
        });
        response += "\n\n__Description:__\n\n" + fn.description;
        response += "\n\n";
      });

      response = response.replace(
        /\[\`(.+)\/(.+)\`\]/gm,
        "[`$2`](" + definitions.reference_url + "/capi/$1/$2)"
      );

      return {
        contents: [response],
      };
    },
  });
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const fetchLatestDefinitions = () => {
    vscode.window.showInformationMessage(
      "Downloading latest Capibara definitions."
    );

    fileDownloader
      .downloadFile(
        Uri.parse(
          vscode.workspace
            .getConfiguration()
            .get("capibara.definitionsFileURL") ||
            "https://capibara.tools/capibara.json"
        ),
        "capibara.json",
        context
      )
      .then((uri) => {
        vscode.window.showInformationMessage(
          "Definitions downloaded successfully."
        );
        setTimeout(() => {
          vscode.window
            .showInformationMessage(
              "Capibara is made possible by people like you! Contribute documentation today!",
              ...["Contribute Docs"]
            )
            .then((action) => {
              if (action == "Contribute Docs") {
                vscode.env.openExternal(
                  vscode.Uri.parse(
                    "https://capibara.tools/docs/contribute-docs"
                  )
                );
              }
            });
        }, 5000);
        setTimeout(() => {
          vscode.window
            .showInformationMessage(
              "If you love this Capibara extension please consider sponsoring its creator! ❤",
              ...["Sponsor"]
            )
            .then((action) => {
              if (action == "Sponsor") {
                vscode.env.openExternal(
                  vscode.Uri.parse(
                    "https://github.com/sponsors/JustinWoodring/"
                  )
                );
              }
            });
        }, 10000);
        json = "";
      })
      .catch((err) => {
        vscode.window.showErrorMessage(
          "There was an error downloading the Capibara definitions."
        );
        console.log(err);
      });
  };

  let disposable = vscode.commands.registerCommand(
    "capibara.fetchLatestDefinitions",
    fetchLatestDefinitions
  );

  context.subscriptions.push(disposable);

  fetchLatestDefinitions();
}

// This method is called when your extension is deactivated
export function deactivate() {}
