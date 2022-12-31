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
  var fileIT = DriveApp.getFilesByName(fileName).next();
  var textdata = fileIT.getBlob().getDataAsString('utf8');
  var jobj = JSON.parse(textdata);
  console.log(jobj)


}

function myFunction() {
  const text='これはペンです。'
  // const sample ="https://m.media-amazon.com/images/G/09/HomeCustomProduct/360_icon_73x73v2._CB485971312__FMpng_RI_.pnghttps://m.media-amazon.com/images/I/41giDQs6tUL._AC_US40_.jpghttps://m.media-amazon.com/images/I/41dP2SXRliL._AC_US40_.jpghttps://m.media-amazon.com/images/I/51HPCe2BMzL._AC_US40_.jpghttps://m.media-amazon.com/images/I/41Xgnl7FVkL._AC_US40_.jpghttps://m.media-amazon.com/images/I/41mLMa5t3xL._AC_US40_.jpg"
  // const sample ='RICOH デジタル一眼レフ PENTAX K-50 DAL18-55mmWR・DAL55-300mmダブルズームキット ブラック K-50 300WZOOM KIT BLACK 10879'
  const sample ='RICOH デジタル一眼レフ PENTAX K-50 DAL18-55mmWR・DAL55-300mm'
  console.log(titleConv(sample))
    const sampleSize ='7 x 12.9 x 9.7 cm; 590 g'
    const sampleCostPrice = 2000
  console.log(priceConv(sampleSize, sampleCostPrice) )
}
