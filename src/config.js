const dotSettings = {
    evaluate: /\{\{([\s\S]+?)\}\}\n?/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode: /\{\{!([\s\S]+?)\}\}\n?/g,
    use: /.*?\{\{#([\s\S]+?)\}\}\n?/g,
    define: /.*?\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}\n?/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}\n?/g,
    iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})\n?/g,
    varname: '$',
    strip: false,
    append: true,
    selfcontained: false,
}

module.exports = {
    dotSettings
}