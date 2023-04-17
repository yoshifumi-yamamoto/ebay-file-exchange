var settings = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('設定')
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function showModal(){
    // 開いているスプレッドシートを取得
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // HTMLファイルを取得
    const output = HtmlService.createTemplateFromFile('index');
    const data = spreadsheet.getSheetByName('設定');
  
    const projectsLastRow = data.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
    output.projects = data.getRange(2, 1, projectsLastRow - 1).getValues();
  
    const html = output.evaluate();
    spreadsheet.show(html);
}

// 入力項目を取得
function getParams() {
  const fileName = 'params.json'
  const fileIT = DriveApp.getFilesByName(fileName).next();
  const textdata = fileIT.getBlob().getDataAsString('utf8');
  const data = JSON.parse(textdata);
  const results = data.results
  const params = results.map(function(item){return item.properties.Name.title[0].plain_text}).reverse()
  return params

}

// アップロードボタン
function sendForm(formObject) {
  
  // フォームから受け取ったcsvデータ
  const blob = formObject.myFile;
  const csvText = blob.getDataAsString();
  const data = Utilities.parseCsv(csvText);

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName('シート1');

  // 2次元配列に整形
  var addValues = []
  addValues = formatData(data)
  
  // 既存レコードをクリアし、CSVのレコードを貼り付け
  // clearRecords(RC_ROW, RC_COL, sheet);
  // sheet.getRange(RC_ROW, RC_COL, addValues.length, addValues[0].length).setValues(addValues);
  sheet.getRange(2, 1, addValues.length, addValues[0].length).setValues(addValues);
}
function formatData(data){
  // csvをjson化
  const [header, ...rows] = data
  const jsonData = rows.map((row) =>
    row.reduce((acc, cell, i) => ({ ...acc, [header[i]]: cell }), {})
  );
  const params = getParams()
  const condition = settings.getRange('I2').getValue()
  const CategoryID = settings.getRange('H2').getValue()
  const formatedData = jsonData.map((d)=>{
    Utilities.sleep(1000)
    return params.map((param)=>{
      switch(param){
        case 'Title':return titleConv(d[param])
        case 'PicURL': return imgUrlConv(d[param])
        case 'StartPrice': return priceConv(d['Size'], d[param])
        case 'Description': return descriptionConv(condition)
        case 'Action(SiteID=US|Country=JP|Currency=USD|Version=941)': return 'Add'
        case 'Duration': return 'GTC'
        case 'Format': return 'FixedPrice'
        case 'Location': return 'Japan'
        case 'Quantity': return '1'
        case 'Product:UPC': return 'Does not apply'
        case 'C:MPN': return 'Does not apply'
        case 'BestOfferEnabled': return '1'
        case 'ShippingProfileName': return 'Free shipping'
        case 'ReturnProfileName': return 'Return 30days'
        case 'Payments:Immediate': return 'ebay Payments:Immediate pay'
        case 'ConditionID': return conditionConv(condition)
        case 'Category': return CategoryID
        default:return d[param]

      }
    })
  })
  return formatedData
}
