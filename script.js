var firebase;
$(function(){
  //宣告
  var
      $content = $('#content'),
      $btn = $('#btn'),
      $show = $('#show'),
      ms = new Date().getTime();
  //宣告資料庫網址
  var config = {
    databaseURL: "https://webduino-chat-363a7-default-rtdb.firebaseio.com/"
  };
  firebase.initializeApp(config);
  var database = firebase.database().ref();
  
  $btn.on('click',write);
  $content.on('keydown', function(e){
    //按下enter傳送
    if(e.keyCode == 13){
      write();
    }
  });
  
  function write(){
    
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    //處裡個位數補0
    if(h<10){
      h = '0'+h;
    }
    if(m<10){
      m = '0' + m;
    }
    if(s<10){
      s = '0' + s;
    }
    var now = h+':'+m+':'+s;  //取得傳送訊息的時間
    //要傳送的資料
    var postData = {
      content:$('#content').val(),
      time:now,
      id:'id'+ms
    };
    database.push(postData);
    $content.val('');
  }
  
  //顯示所有聊天室中先前的內容
  database.once('value', function(snapshot) {
    $show.html('');
    for(var i in snapshot.val()){
       $show.prepend('<div ><div class="time" style="float:right " >'+snapshot.val()[i].time+'</div><span style="color:#FFD306">User說：</span><span><div class="content" style="float:right "></span>'+snapshot.val()[i].content+'</div>');
    }
    $show.scrollTop($show[0].scrollHeight);
  });
//資料庫有新內容時顯示
  database.limitToLast(1).on('value', function(snapshot) {
    for(var i in snapshot.val()){
       $show.append('<div class="'+snapshot.val()[i].id+'"><div class="time">'+snapshot.val()[i].time+'</div><span style="color:#FFD306">User說:</span><div class="content">'+snapshot.val()[i].content+'</div>');
    }
    
    //新內容時控制卷軸在最下方
    $show.scrollTop($show[0].scrollHeight);
    $show.find('.id'+ms+name).css({
      'float':'right',
      'padding-top':'12px'
      //'color':'#fc0'
    });
    $show.find('.id'+ms+' .content').css({
      'float':'right',
      'margin-right':'10px'
    });
    $show.find('.id'+ms+' .time').css({
      'right':'0',
      'color':'#777'
    });
  });
  
  
});