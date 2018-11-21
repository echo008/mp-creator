const { window } = require('vscode')
const fs = require('fs-extra')
const doT = require('doT')
const { fromCallback: u } = require('universalify')
const { dotSettings } = require('./config')

function compileTemplate(source, data) {
    const template = doT.template(source, dotSettings)
    return template(data)
}

const replaceFile = u(function replaceFile(srcFile, destFile, data, callback) {
    fs.readFile(srcFile).then(res => {
        const content = compileTemplate(res, data)
        fs.writeFile(destFile, content).then(() => {
            callback()
        }).catch(err => {
            callback(err)
        })
    }).catch(err => {
        callback(err)
    })
})

const writeJSONFile = u(function writeJSONFile(filePath, jsonData, callback) {
    const editorOptions = window.activeTextEditor.options
    const tabSpace = editorOptions.insertSpaces ? editorOptions.tabSize : '\t'
    const content = JSON.stringify(jsonData, null, tabSpace)
    fs.writeFile(filePath, content).then(() => {
        callback()
    }).catch(err => {
        callback(err)
    })
})

module.exports = Object.assign({}, fs, {
    replaceFile,
    writeJSONFile
})
