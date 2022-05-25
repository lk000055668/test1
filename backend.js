var rgbled;
var led;
var irrecv;
var irrawsend;
var Chat;
var fan_cond;
var myData;
var val;


boardReady({board: 'Smart', device: 'AwXLa', transport: 'mqtt', multi: true}, function (board) {
  board.samplingInterval = 50;
  rgbled = getRGBLedCathode(board, 15, 12, 13);
  led = getLed(board, 12);
  irrecv = getIrRawRecv(board, 2);
  irrawsend = getIrRawSend(board, 5);
  Chat = new Firebase('https://webduino-chat-363a7-default-rtdb.firebaseio.com/');
  fan_cond = new Firebase('https://webduino-fan-default-rtdb.firebaseio.com/');
  myData= {};
  myData.sheetUrl = 'https://docs.google.com/spreadsheets/d/1xNnyrAyFdRfHI-27UUKyPnHdBSueGWwoESg-QZ6FUIY/edit#gid=2143217410';
  myData.sheetName = '工作表1';
  Chat.limitToLast(1).on('child_added', function (snapshot) {
    val = snapshot.val().content;
    if (val == '遙控器設定') {
      readSheetData({
        row : 3,
        col : 2,
        sheetUrl : myData.sheetUrl,
        sheetName : myData.sheetName
      }, function(googleSheetReadData){
        if (!(googleSheetReadData?googleSheetReadData:[]).length) {
          irrecv.receive(function(val){
            irrecv.onVal = val;
            myData.column0 = '電源';
            myData.column1 = irrecv.onVal;
            writeSheetData(myData);
            irrecv.receive(function(val){
              irrecv.onVal = val;
              myData.column0 = '風量';
              myData.column1 = irrecv.onVal;
              writeSheetData(myData);
              irrecv.receive(function(val){
                irrecv.onVal = val;
                myData.column0 = '擺頭';
                myData.column1 = irrecv.onVal;
                writeSheetData(myData);
                irrecv.stopRecv();
              });
            });
          });
        }
      });
    } else if (val == '開燈') {
      led.on();
    } else if (val == '關燈') {
      led.off();
    } else if (val == '開電扇') {
      readSheetData({
        row : 1,
        col : 2,
        sheetUrl : myData.sheetUrl,
        sheetName : myData.sheetName
      }, function(googleSheetReadData){
        irrawsend.send(googleSheetReadData,
          function(){});
      });
    } else if (val == '關電扇') {
      readSheetData({
        row : 1,
        col : 2,
        sheetUrl : myData.sheetUrl,
        sheetName : myData.sheetName
      }, function(googleSheetReadData){
        irrawsend.send(googleSheetReadData,
          function(){});
      });
    } else if (val == '風量') {
      readSheetData({
        row : 2,
        col : 2,
        sheetUrl : myData.sheetUrl,
        sheetName : myData.sheetName
      }, function(googleSheetReadData){
        irrawsend.send(googleSheetReadData,
          function(){});
      });
    } else if (val == '擺頭') {
      readSheetData({
        row : 3,
        col : 2,
        sheetUrl : myData.sheetUrl,
        sheetName : myData.sheetName
      }, function(googleSheetReadData){
        irrawsend.send(googleSheetReadData,
          function(){});
      });
    }
  });
});
