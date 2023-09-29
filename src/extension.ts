// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";
import { Uri } from "vscode";
import { Capibara } from "./types/capibara";
import { RefTypeEnum, RefTypeNone, RefTypeStruct } from "./types/typedef";
import { FunctionKind } from "./types/macro";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const fileDownloader: FileDownloader = await getApi();
  let json = "{}";
  let definitions : Capibara = JSON.parse(json);

  vscode.languages.registerHoverProvider("c", {
    async provideHover(document, position, token) {
      if (json === "") {
        fileDownloader.getItem("capibara.json", context).then((uri) => {
          console.log("Loading capibara.json");
          vscode.workspace.openTextDocument(uri).then((document) => {
            console.log("Reading capibara.json");
            json = document.getText();
            definitions = JSON.parse(json);
          });
        });
      }

      let hoveredTextRange = document.getWordRangeAtPosition(position, /\w+/g);

      let text = document.getText(hoveredTextRange);

      let macros = definitions.macros.filter((x) => x.name === text);
      let enums = definitions.enums.filter((x) => x.name === text);
      let structs = definitions.structs.filter((x) => x.name === text);
      let typedefs = definitions.typedefs.filter((x) => x.name === text);
      let functions = definitions.functions.filter((x) => x.name === text);

      //console.log(functions)

      let response = "";

      macros.forEach((mo) => {
        response += "`<"+mo.header.name+">`\n\n";
        response += "_macro_ "+mo.name;
        if((mo.kind as FunctionKind).function !== undefined) {
          const fn = (mo.kind as FunctionKind).function;
          response += "(";
          fn.parameters.forEach((param, i: any) => {
            response += " ";
            response += "`" + param.name + "`";
            if (i !== fn.parameters.length - 1) {
              response += ", ";
            }
          });
          response += ")";
        }
        response += "\n---";
        response += "\n\n__Summary:__\t" + mo.summary;
        if((mo.kind as FunctionKind).function !== undefined) {
          const fn = (mo.kind as FunctionKind).function;
          response += "\n\n__(Function-Like)__\t";
          response += "\n\n__Returns:__\t";
          response += "\n\n - _"+fn.returns.type+"_";
          response += " - ";
          response += fn.returns.description+"";
          response += "\n\n__Parameters:__\t";
          fn.parameters.forEach((param) => {
            response += "\n\n - ";
            response += "`"+param.name+"`";
            response += " - ";
            response += param.description+"";
        });
        }
        else{
          response += "\n\n__(Object-Like)__\t";
        }
        response += "\n\n__Environments:__\t" + mo.os_affinity.join(",");
        response += "\n\n__Description:__\n\n" + mo.description;
        if((mo.kind as FunctionKind).function !== undefined) {
          const fn = (mo.kind as FunctionKind).function;
          response += "\n\n__Examples:__\n\n";
          fn.examples.forEach((example) => {
            response += "\n\n - ";
            response += "__"+example.title+"__";
            response += "\n\n";
            response += "```"+example.code+"```";
        });}
        response += "\n\n";
      });

      enums.forEach((em) => {
        response += "`<"+em.header.name+">`\n\n";
        response += "_enum_ "+em.name;
        response += "\n---";
        response += "\n\n__Summary:__\t" + em.summary;
        response += "\n\n__Fields:__\t";
        em.variants.forEach((field) => {
          response += "\n\n - ";
          response += "`"+field.name+"`";
          response += " - ";
          response += field.description+"";
        });
        response += "\n\n__Environments:__\t" + em.os_affinity.join(",");
        response += "\n\n__Description:__\n\n" + em.description;
        response += "\n\n";
      });

      structs.forEach((st) => {
        response += "`<"+st.header.name+">`\n\n";
        response += "_struct_ "+st.name;
        response += "\n---";
        response += "\n\n__Summary:__\t" + st.summary;
        response += "\n\n__Fields:__\t";
        st.fields.forEach((field) => {
          response += "\n\n - ";
          response += "`"+field.name+"`";
          response += " : ";
          response += "_"+field.type+"_";
          response += " - ";
          response += field.description+"";
        });
        response += "\n\n__Environments:__\t" + st.os_affinity.join(",");
        response += "\n\n__Description:__\n\n" + st.description;
        response += "\n\n";
      });

      typedefs.forEach((tf) => {
        response += "`<"+tf.header.name+">`\n\n";
        response += "_typedef_ "+tf.name;
        response += "\n---";
        response += "\n\n__Summary:__\t" + tf.summary;
        response += "\n\n__Base Type:__\t_" + tf.type+"_";
        response += "\n\n__Linked Type Definition:__\n\n";
        if((tf.associated_ref as RefTypeEnum).enum !== undefined) {
          const em = (tf.associated_ref as RefTypeEnum).enum;
          var tempResponse = "---\n\n";
          tempResponse += "`<"+em.header.name+">`\n\n";
          tempResponse += "enum "+em.name;
          tempResponse += "\n---";
          tempResponse += "\n\n__Summary:__\t" + em.summary;
          tempResponse += "\n\n__Fields:__\t";
          em.variants.forEach((field) => {
            tempResponse += "\n\n - ";
            tempResponse += "`"+field.name+"`";
            tempResponse += " - ";
            tempResponse += field.description+"";
          });
          tempResponse += "\n\n__Environments:__\t" + em.os_affinity.join(",");
          tempResponse += "\n\n__Description:__\n\n" + em.description;
          tempResponse += "\n\n";
          tempResponse += "---";
          response += tempResponse;
        }
        else if((tf.associated_ref as RefTypeStruct).struct !== undefined) {
          const st = (tf.associated_ref as RefTypeStruct).struct;
          var tempResponse = "---\n\n";
          tempResponse += "`<"+st.header.name+">`\n\n";
          tempResponse += "struct "+st.name;
          tempResponse += "\n---";
          tempResponse += "\n\n__Summary:__\t" + st.summary;
          tempResponse += "\n\n__Fields:__\t";
          st.fields.forEach((field) => {
            tempResponse += "\n\n - ";
            tempResponse += "`"+field.name+"`";
            tempResponse += " : ";
            tempResponse += "_"+field.type+"_";
            tempResponse += " - ";
            tempResponse += field.description+"";
          });
          tempResponse += "\n\n__Environments:__\t" + st.os_affinity.join(",");
          tempResponse += "\n\n__Description:__\n\n" + st.description;
          tempResponse += "\n\n";
          response += tempResponse;
        }
        else{
          response += "> No linked definition.";
        }
        response += "\n\n__Environments:__\t" + tf.os_affinity.join(",");
        response += "\n\n__Description:__\n\n" + tf.description;
        response += "\n\n";
      });

      functions.forEach((fn) => {
        response += "`<"+fn.header.name+">`\n\n";
        response += "_function_ "+fn.name;
        response += "(";
        fn.parameters.forEach((param, i: any) => {
          response += "_" + param.type + "_";
          response += " ";
          response += "`" + param.name + "`";
          if (i !== fn.parameters.length - 1) {
            response += ", ";
          }
        });
        response += ")";
        response += "\n---";
        response += "\n\n__Summary:__\t" + fn.summary;
        response += "\n\n__Returns:__\t";
        response += "\n\n - _"+fn.returns.type+"_";
        response += " - ";
        response += fn.returns.description+"";
        response += "\n\n__Parameters:__\t";
        fn.parameters.forEach((param) => {
          response += "\n\n - ";
          response += "`"+param.name+"`";
          response += " : ";
          response += "_"+param.type+"_";
          response += " - ";
          response += param.description+"";
        });
        response += "\n\n__Environments:__\t" + fn.os_affinity.join(",");
        response += "\n\n__Description:__\n\n" + fn.description;
        response += "\n\n__Examples:__\n\n";
        fn.examples.forEach((example) => {
          response += "\n\n - ";
          response += "__"+example.title+"__";
          response += "\n\n";
          response += "```"+example.code+"```";
        });
        response += "\n\n";
      });

      response = response.replace(
        /\[\`([^\`\]]+)\/(.+?)\`\]/gm,
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
              if (action === "Contribute Docs") {
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
              if (action === "Sponsor") {
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
