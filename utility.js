var SETTINGS = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('設定') // 設定シート情報
// 設定利益率
var profitRate = SETTINGS.getRange('F2').getDisplayValue()
// ドル円レート
var USDJPY = SETTINGS.getRange('G2').getDisplayValue()
// 料金表シート情報
var priceTable = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('料金表')
// 重量列取得
var weightList = arrConv(priceTable.getRange(3,1,86,1).getValues())
// Fedex(北米)列取得
var priceList = arrConv(priceTable.getRange(3,11,86,1).getValues())
// 燃料サーチャージ％取得
var fuelSurchargeRatio = SETTINGS.getRange('E2').getDisplayValue()
// サイズ表記がない場合に使用する各サイズ
var defaultLength = SETTINGS.getRange('B2').getDisplayValue()
var defaultWidth = SETTINGS.getRange('C2').getDisplayValue()
var defaultHeight = SETTINGS.getRange('D2').getDisplayValue()
var defaultWeight = SETTINGS.getRange('A2').getDisplayValue()

// 2次元配列の1次元化
function arrConv(arr) {
  const formatted = arr.reduce(function (acc, cur, i) {
    return acc.concat(cur);
  });
  return formatted
}

// タイトル変換
function titleConv(title) {
  const translationText = LanguageApp.translate(title, 'ja', 'en')
  if(translationText.length > 80){
    const fixedTitle = translationText.substr(0, 80)
    return fixedTitle
  }
  else{
    return translationText
  }
}

// 商品説明変換
function descriptionConv(text) {
  
  const translationText = LanguageApp.translate(text, 'ja', 'en')

  return '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>.main1 { border: 1px solid #000;border-radius: 5px;margin: 0 auto;width: 100%;padding: 0 20px 10px;background: #fff;box-sizing: border-box;word-break: break-all; }.main1 p,.main1 span { line-height: 24px;font-size: 18px }.main1 h1 { font-size: 26px !important; margin: 30px 0;text-align: center; color: #000 }.main1 h2 { margin: 0 0 10px 0; color: #000; font-size: 22px; line-height:1.2; text-align: left }.main1 p,.main1 .product_dec div { margin: 0; padding: 0 0 20px 0; color: #333; text-align: left }.margin-bottom_change{ padding-bottom: 10px !important }h2 { position: relative;background-color: #1190d9;padding: 10px;margin-bottom: 20px !important;color: #fff !important; }h2:after { position: absolute;content: "";top: 100%;left: 30px;border: 15px solid transparent;border-top: 15px solid #1190d9;width: 0;height: 0; }</style><div class="main1"><section class="product_dec"><h2>Description</h2><div vocab="http://schema.org/" typeof="Product"><span property="description">' + translationText + '</span></div></section><aside><div class="hasso"><h2>Shipping</h2><p>Handling time: 2-10 business days after payment.<br/>Economy Shipping from outside US (11 to 23 business days) - Free shipping Due to Japanese Post Service/DHL/FedEX, will be shipped according to the situation., estimated arrival time can be delay.<br>And it depends on custom in your country also. So if it is late please contact local post office (carrier)with tracking number .<br>NOTE:When shipping small items, the tracking number of economy shipping may not be attached.</p></div><div class="tyuui"><h2>International Buyers - Please Note:</h2><p class="margin-bottom_change">Import duties, taxes, and charges are not included in the item price or shipping cost. These charges are the buyer\'s responsibility. Please check with your country\'s customs office to determine what these additional costs will be prior to bidding or buying.</p><p>Thank you for your understanding.</p></div></aside></div>'
}


// 画像URL変換
function imgUrlConv(urls) {
  // 先頭のhttpsは何もせず、2個目のhttpsの前に | を追加
  var n = 1;
  const formatUrls = urls.replace(/https/g, function(){ if(--n==0) return 'https'; else return '|https'; });
  return formatUrls
  
}


// 価格変換
function priceConv(size, costPrice) {
  const sizes = size.split(' x ')
  // 長さ
  const length = Number(sizes[0])
  // 幅
  const width = Number(sizes[1])
  const heightWithWeight = sizes[2].split(' cm; ')
  // 高さ
  const height = Number(heightWithWeight[0])
  // gかkgか
  const isKg = heightWithWeight[1].indexOf('kg') !== -1
  // 重さ(g)
  var normalWeight
  if(isKg){
    normalWeight =  Number(heightWithWeight[1].replace(' kg','')) * 1000
  }
  else{
    normalWeight =  Number(heightWithWeight[1].replace(' g',''))
  }
  console.log('梱包サイズ', sizes)
  console.log('長さ',length)
  console.log('幅', width)
  console.log('高さ', height)
  console.log('重量', normalWeight)

  // 発送重量
  const shippingWeight = calcShippingWeight(length, width, height, normalWeight)
  // 送料
  const shippingCost = calcShippingCost(shippingWeight)
  
  // 販売手数料(%)
  const salesCommissionPercentage = 0.2


  // 価格計算
  // 販売価格＝原価÷（1 - 利益率 - 手数料）
  const sellingPriceYen = (costPrice + shippingCost) / (1 - profitRate - salesCommissionPercentage)
  const sellingPrice = Math.floor(sellingPriceYen / USDJPY * 10) / 10
  console.log('販売価格',sellingPrice)
  
  return sellingPrice

}

// 重量計算
function calcShippingWeight(length, width, height, weight) {
  // 容積重量
  var volumetricWeight
  // 実重量
  var shippingWeight
  if(length){
    console.log('サイズ表記あり')
    volumetricWeight = (length * width * height) / 5 //g換算
    // 重量と容積重量の比較
    if(volumetricWeight > weight){
      shippingWeight = volumetricWeight
    }else{
      shippingWeight = weight
    }
  }else{
    console.log('サイズ表記なし')
    // 仕入れ先にサイズがない場合
    volumetricWeight = (defaultLength * defaultWidth * defaultHeight) / 5 //g換算
    // 重量と容積重量の比較
    if(volumetricWeight > defaultWeight){
      shippingWeight = volumetricWeight
    }else{
      shippingWeight = defaultWeight
    }
  }
  console.log('発送重量', shippingWeight)
  return shippingWeight
}

// 送料計算
function calcShippingCost(weight) {
  // 重量の500単位計算処理
  var tripleDigits = Number(String(weight).slice(-3))
  var finalWeight
  if( 500 >= tripleDigits && tripleDigits > 0){
    finalWeight = (Math.floor(weight/1000) * 1000) + 500
  }else if(tripleDigits === 0){
    finalWeight = weight
  }else{
    finalWeight = Math.ceil(weight/1000) * 1000
  }

  // 料金表と一致する行番号
  const matchWeightIndex = weightList.indexOf(finalWeight)
  // Fedex 基本料金(北米)
  const shippingBaseCost = priceList[matchWeightIndex]
  // 繁忙期割増金(1kg毎に110円)
  const peakSeasonSurcharge = 110 * (finalWeight / 1000)
  // 燃料サーチャージ
  const fuelSurcharge = Math.floor(shippingBaseCost * fuelSurchargeRatio)

  const shippingCost = shippingBaseCost + peakSeasonSurcharge + fuelSurcharge
  console.log('送料', shippingCost)
  return shippingCost

}