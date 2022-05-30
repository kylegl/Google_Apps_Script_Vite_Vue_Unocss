import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const htmlFilePath = '../dist/index.html'
const assetsDir = './dist/assets'
const outputDir = './.appscript'

const assetFiles = fs.readdirSync(path.resolve(assetsDir))
const [cssFileName] = assetFiles.filter(file => path.extname(file) === '.css')
const [jsFileName] = assetFiles.filter(file => path.extname(file) === '.js')

const cssFilePath = `${assetsDir}/${cssFileName}`
const jsFilePath = `${assetsDir}/${jsFileName}`

const cssFile = fs.readFileSync(path.resolve(cssFilePath), 'utf-8')
const jsFile = fs.readFileSync(path.resolve(jsFilePath), 'utf-8')
const htmlFile = fs.readFileSync(path.resolve(__dirname, htmlFilePath), 'utf8').split('\r\n')

const editRowIndex = htmlFile.findIndex(row => row.includes('INSERT_JS'))
let editRow = htmlFile[editRowIndex]

const jsEdit = editRow.split('INSERT_JS')
jsEdit.splice(1, 0, jsFile)

editRow = jsEdit.join('')

const cssEdit = editRow.split('INSERT_CSS')
cssEdit.splice(1, 0, cssFile)

editRow = cssEdit.join('')

let updatedHtmlFile = [...htmlFile]
updatedHtmlFile[editRowIndex] = editRow
updatedHtmlFile = updatedHtmlFile.join('\r\n')

fs.writeFileSync(`${outputDir}/index.html`, updatedHtmlFile)

const serverDir = './server'

const localServerFiles = fs.readdirSync(path.resolve(serverDir))

localServerFiles.forEach(file => fs.copyFileSync(path.resolve(serverDir, file), path.resolve(outputDir, file)))
