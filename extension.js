// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path')
const { readdir, readJSON, copy, replaceFile, writeJSONFile } = require('./src')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mp-creator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.createProject', function (uri) {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     // vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);

    context.subscriptions.push(vscode.commands.registerCommand('extension.createProject', function (uri) {
        let isRoot = false
        const workspaceFolders = vscode.workspace.workspaceFolders
        for (let index = 0; index < workspaceFolders.length; index++) {
            const workspaceFolder = workspaceFolders[index]
            if (uri.fsPath === workspaceFolder.uri.fsPath) {
                readdir(uri.fsPath).then(items => {
                    if (!items.length) {
                        vscode.window.showInputBox({placeHolder: 'please input appid', prompt: '小程序appid'}).then(appid => {
                            if (appid !== undefined) {
                                copy(path.join(__dirname, './templates/project'), uri.fsPath).then(() =>{
                                    const projectFile = path.join(uri.fsPath, './project.config.json')
                                    const sourceData = {
                                        libVersion: '2.4.0',
                                        appid,
                                        projectname: vscode.workspace.getWorkspaceFolder(uri).name
                                    }
                                    replaceFile(projectFile, projectFile, sourceData)
                                }).catch(err => {
                                    vscode.window.showErrorMessage('请保持根目录为一个空目录')
                                })
                            } else {
                                vscode.window.showErrorMessage('请输入小程序appid')
                            }
                        })
                    } else {
                        vscode.window.showErrorMessage('请保持根目录为一个空目录')
                    }
                }).catch(err => {
                    vscode.window.showErrorMessage('请保持根目录为一个空目录')
                })
                isRoot = true
                break
            }
        }
        if (!isRoot) vscode.window.showErrorMessage('请在根目录下新建小程序项目')
    }))
    context.subscriptions.push(vscode.commands.registerCommand('extension.createPage', function (uri) {
        vscode.window.showInputBox({placeHolder: 'please input Page name', value: 'index', prompt: '页面名称'}).then(currentPath => {
            if (currentPath !== undefined) {
                const rootPath = vscode.workspace.getWorkspaceFolder(uri).uri.fsPath
                const filepath = `${path.relative(rootPath, uri.fsPath).replace('\\', '/')}/${currentPath}`
                const sourceData = {
                    filepath
                }
                const wxmlSrcFile = path.join(__dirname, './templates/page/template.wxml')
                const wxmlDestFile = path.join(uri.fsPath, `./${currentPath}.wxml`)
                replaceFile(wxmlSrcFile, wxmlDestFile, sourceData)
                const jsSrcFile = path.join(__dirname, './templates/page/template.js')
                const jsDestFile = path.join(uri.fsPath, `./${currentPath}.js`)
                replaceFile(jsSrcFile, jsDestFile, sourceData)
                const wxssSrcFile = path.join(__dirname, './templates/page/template.wxss')
                const wxssDestFile = path.join(uri.fsPath, `./${currentPath}.wxss`)
                replaceFile(wxssSrcFile, wxssDestFile, sourceData)
                const jsonSrcFile = path.join(__dirname, './templates/page/template.json')
                const jsonDestFile = path.join(uri.fsPath, `./${currentPath}.json`)
                copy(jsonSrcFile, jsonDestFile)

                const appFile = path.join(rootPath, './app.json')
                readJSON(appFile).then(jsonData => {
                    if (jsonData.pages.indexOf(filepath) === -1) {
                        jsonData.pages.push(filepath)
                    }
                    writeJSONFile(appFile, jsonData)
                })
            } else {
                vscode.window.showErrorMessage('请输入Page name')
            }
        })
    }))
    context.subscriptions.push(vscode.commands.registerCommand('extension.createComponent', function (uri) {
        vscode.window.showInputBox({placeHolder: 'please input Component name', value: 'index', prompt: '组件名称'}).then(currentPath => {
            if (currentPath !== undefined) {
                const filepath = `${path.relative(vscode.workspace.getWorkspaceFolder(uri).uri.fsPath, uri.fsPath).replace('\\', '/')}/${currentPath}`
                const sourceData = {
                    filepath
                }
                const wxmlSrcFile = path.join(__dirname, './templates/component/template.wxml')
                const wxmlDestFile = path.join(uri.fsPath, `./${currentPath}.wxml`)
                replaceFile(wxmlSrcFile, wxmlDestFile, sourceData)
                const jsSrcFile = path.join(__dirname, './templates/component/template.js')
                const jsDestFile = path.join(uri.fsPath, `./${currentPath}.js`)
                replaceFile(jsSrcFile, jsDestFile, sourceData)
                const wxssSrcFile = path.join(__dirname, './templates/component/template.wxss')
                const wxssDestFile = path.join(uri.fsPath, `./${currentPath}.wxss`)
                replaceFile(wxssSrcFile, wxssDestFile, sourceData)
                const jsonSrcFile = path.join(__dirname, './templates/component/template.json')
                const jsonDestFile = path.join(uri.fsPath, `./${currentPath}.json`)
                copy(jsonSrcFile, jsonDestFile)
            } else {
                vscode.window.showErrorMessage('请输入Component name')
            }
        })
    }))
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;