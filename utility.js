// 2次元配列の1次元化
function arrConv(arr) {
  const formatted = arr.reduce(function (acc, cur, i) {
    return acc.concat(cur);
  });
  return formatted
}

// タイトル変換
function titleConv() {

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
function priceConv() {
  
}