# Table2Excel.js

在Table2Excel.js基础上进行了修改，以便能够传人一个类似table的非DOM对象后，在 Web Worker 中处理Excel，加快导出excel的速度。

![](https://raw.githubusercontent.com/niqingyang/table2excel.js/master/images/table2excel.gif?raw=true)

This is a library to export html tables to excel sheets.

## Precondition

It has to be a row * column table

## Features

1. able to export with width, alignment and colors
2. extendable

## Dependencies

[ExcelJS](https://github.com/guyonroche/exceljs)

[FileSaver.js](https://github.com/eligrey/FileSaver.js)

## Live Demo

[Demo](https://jackgit.github.io/table2excel.js/index.html)

## Include table2excel.js

### npm

`ExcelJS` is peer dependency to `table2excel.js`, so you need to install exceljs first:

```bash
npm i exceljs
```

then, install table2excel.js:

```bash
npm i table2excel.js
```

use in your code like:

```js
import Table2Excel from 'table2excel.js'
new Table2Excel('table').export()
```

you may also need a config in webpack:

```js
node: { fs: 'empty' }
```

### table2excel.min.js (with ExcelJS packed)

```html
<script src="path/to/table2excel.min.js"></script>
```

### table2excel.core.js (without ExcelJS packed)

```html
<script src="path/to/exceljs.min.js"></script>
<script src="path/to/table2excel.core.js"></script>
```

## Basic Usage

```js
var tables = [{
  rows: [ // 行数组
    {
      cells: [ // 行内单元格数组
        {
          innerText: "XXXX", // 单元格内容 or value: "XXXX"
          colSpan: 1, // 跨列
          rowSpan: 1, // 跨行
          ... // 其他自定义参数
        },
        {
          innerText: "XXXX", // 单元格内容 or value: "XXXX"
          colSpan: 1, // 跨列
          rowSpan: 1, // 跨行
          ... // 其他自定义参数
        },
        ....
      ]
    },
    ...
  ]
}];
const table2Excel = new Table2Excel(tables, options) 
table2Excel.export(function(blob){
  saveAs(blob, filename, extension);
}, extension) 
```

`extension` can be `'xls'` or `'xlsx'`, default as `'xlsx'`

### selector

It's optional, and defaulted as `'table'`

### options

It's optional, and defaulted as:

```js
{
  workbook: {
    views: [{
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }]
  },
  widthRatio: .14,
  plugins: [
    Table2Excel.plugins.fontPlugin,
    Table2Excel.plugins.fillPlugin,
    Table2Excel.plugins.formPlugin,
    Table2Excel.plugins.alignmentPlugin,
    Table2Excel.plugins.hyperlinkPlugin,
    Table2Excel.plugins.autoWidthPlugin
  ]
}
```

`workbook` is options used while creating a workbook, please refer [exceljs#create-a-workbook](https://github.com/guyonroche/exceljs#create-a-workbook) for details.

`widthRatio` is a ratio that will be used while converting `width` style of html table cells to width of sheet cells.

## Plugins

Plugin helps to extend the ability of transforming table to excel.

Build-in plugins can be access like:

```js
Table2Excel.plugins.fontPlugin,
Table2Excel.plugins.fillPlugin,
Table2Excel.plugins.formPlugin,
Table2Excel.plugins.alignmentPlugin,
Table2Excel.plugins.hyperlinkPlugin,
Table2Excel.plugins.autoWidthPlugin
```

A plugin can be defined to join different phase of table to excel process, and in different phase, plugin is able to access different objects from context.

```js
{
  /**
   * after an empty workbook created
   * @param  {ExcelJS.Workbook} context.workbook
   * @param  {NodeList} context.tables   
   */
  workbookCreated ({ workbook, tables }) {},
  /**
   * after an empty worksheet created
   * @param  {ExcelJS.Workbook} workbook
   * @param  {NodeList} tables
   * @param  {ExcelJS.Worksheet} worksheet
   * @param  {HTMLTableElement} table
   */
  worksheetCreated ({ workbook, tables, worksheet, table }) {},
  /**
   * after a worksheet been filled with data from table
   * @param  {ExcelJS.Workbook} workbook
   * @param  {NodeList} tables
   * @param  {ExcelJS.Worksheet} worksheet
   * @param  {HTMLTableElement} table
   */
  worksheetCompleted ({ workbook, tables, worksheet, table }) {},
  /**
   * after an cell of worksheet created
   * @param  {ExcelJS.Workbook} workbook
   * @param  {NodeList} tables
   * @param  {ExcelJS.Worksheet} worksheet
   * @param  {HTMLTableElement} table
   * @param  {ExcelJS.Cell} workcell
   * @param  {HTMLTableCellElement} cell
   * @param  {colRange} [from, to]
   * @param  {rowRange} [from, to]
   */
  workcellCreated ({ workbook, tables, worksheet, table, workcell, cell, cellStyle, colRange, rowRange }) {}
}
```


Example 1, you can define a plugin to make some rows or columns hidden of exported excel:

```js
const table2Excel = new Table2Excel('table', {
  plugins: [{
    worksheetCompleted ({ workbook, tables, worksheet, table }) {
      worksheet.getRow(1).hidden = true
      worksheet.getColumn(1).hidden = true
    }
  }]
})
```

Example 2, you can add your customized cell parser for your table:

```js
const table2Excel = new Table2Excel('table', {
  plugins: [{
    workcellCreated ({ workbook, tables, worksheet, table, workcell, cell, cellStyle, rowRange, colRange }) {
      workcell.value = { text: '', link: '' }
      workcell.style = {
        ...workcell.style,
        font: {},
        color: {}
      }
    }
  }]
})
```
