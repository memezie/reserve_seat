var selectedItem;
var gDeltaX, gDeltaY;
var selectedPositionX, selectedPositionY;
var selectedItemID;
var tableNum;
var tableFrom
var dropStyle;
var dropTable;
var contents;
var info = {
  name:'',
  people:'',
  course:'',
  number:'',
  id:''
}
////////////////////////////////////////////////////////////////////////

function addEvent(elm, evtType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evtType, fn, useCapture);
    return true;
  } else if (elm.attachEvent) {
    var r = elm.attachEvent('on' + evtType, fn);
    return r;
  } else {
    elm['on' + evtType] = fn;
  }
}

////////////////////////////////////////////////////////////////////////

function removeEvent(elm, evtType, fn, useCapture) {
  if (elm.removeEventListener) {
    elm.removeEventListener(evtType, fn, useCapture);
    return true;
  } else if (elm.detachEvent) {
    var r = elm.detachEvent('on' + evtType, fn);
    return r;
  } else {
    elm['on' + evtType] = fn;
  }
}

////////////////////////////////////////////////////////////////////////

function setCursor(elm, curtype) {
  elm.style.cursor = curtype;
}

////////////////////////////////////////////////////////////////////////

function setOpacity(node, val) {
  if (node.filters) {
    try {
      node.filters['alpha'].opacity = val * 100;
    } catch (e) {}
  } else if (node.style.opacity) {
    node.style.opacity = val;
  }
}

////////////////////////////////////////////////////////////////////////

function getAttrValue(elm, attrname) {
  return elm.attributes[attrname].nodeValue;
}

////////////////////////////////////////////////////////////////////////

function getX(elm) {
  return parseInt(elm.style.left);
}

////////////////////////////////////////////////////////////////////////

function getY(elm) {
  return parseInt(elm.style.top);
}

////////////////////////////////////////////////////////////////////////

function getEventX(evt) {
  return evt.pageX ? evt.pageX : evt.clientX;
}

////////////////////////////////////////////////////////////////////////

function getEventY(evt) {
  return evt.pageY ? evt.pageY : evt.clientY;
}

////////////////////////////////////////////////////////////////////////

function getWidth(elm) {
  return parseInt(elm.style.width);
}

////////////////////////////////////////////////////////////////////////

function getHeight(elm) {
  return parseInt(elm.style.height);
}

////////////////////////////////////////////////////////////////////////

function getContents(elm, attrWord) {
  var nodes = elm.getElementsByClassName(attrWord);
  var node_values = [];
  for ( i = 0; i < nodes.length; i++ ) {
    node_values.push(nodes[i].textContent);
  }
  return node_values;
}

////////////////////////////////////////////////////////////////////////

function moveElm(elm, x, y) {
  elm.style.left = x + 'px';
  elm.style.top = y + 'px';
}

////////////////////////////////////////////////////////////////////////

function getStyle(elm) {
  var params = {
    left:   elm['left'],
    top:    elm['top'],
    width:  elm['width'],
    height: elm['height']
  }
  return params;
}

////////////////////////////////////////////////////////////////////////

function getRand( min, max ) {
  min = Math.ceil(min);
  max = Math.floor(max);
  var randNum = Math.floor(Math.random() * ( max - min )) + min;
  randNum = randNum + 'px';
  return randNum;
}

////////////////////////////////////////////////////////////////////////

function onDropped(elm) {
  var custmers = document.getElementsByClassName('dragged_elm');
  var styleParams = getStyle( dropStyle );
  var target_style = selectedItem.style;

  for ( i =0; i < custmers.length; i++ ) {
    var custmer = custmers[i].style;
    var custmerStyle = getStyle( custmer );
    if ( custmerStyle['left'] == styleParams['left'] && custmerStyle['top'] == styleParams['top'] ){
     
      custmer['left']   = getRand(10, 150);
      custmer['top']    = getRand(10, 60);
      custmer['width']  = '50px';
      custmer['height'] = '50px';
      
      for ( var sName in styleParams ) {
        target_style[sName] = styleParams[sName];
      }

      alert ( 'テーブル：' + tableNum + '名前：' + info['name'] + '人数：' + info['people'] + 'コース：' + info['course'] + '電話番号：' + info['number'] + 'ID：' + info['id'] );  

      return;
    }
  }

  for ( var sName in styleParams ) {
    target_style[sName] = styleParams[sName];
  }

  alert ( 'テーブル：' + tableNum + '名前：' + info['name'] + '人数：' + info['people'] + 'コース：' + info['course'] + '電話番号：' + info['number'] + 'ID：' + info['id'] );  
  
return;
}

////////////////////////////////////////////////////////////////////////

function onDeleted(elm) {
  alert ( tableFrom + 'から帰ります。' + 'ID：' + info['id'] + '名前：' + info['name'] + '人数：' + info['people'] + 'コース：' + info['course'] + '電話番号：' + info['number'] );  
//  selectedItem.remove();
}

////////////////////////////////////////////////////////////////////////

function onCancel(elm) {
  alert ( 'キャンセル' + 'ID：' + info['id'] + '名前：' + info['name'] + '人数：' + info['people'] + 'コース：' + info['course'] + '電話番号：' + info['number'] );  
}

////////////////////////////////////////////////////////////////////////

function onMouseDown(evt) {
  var target = evt.currentTarget ? evt.currentTarget : evt.srcElement;
  var x = getEventX(evt);
  var y = getEventY(evt);
  if ( isOnDropTable(evt) ) { tableFrom = tableNum }
  //
  // Save Information to Globals
  //

  selectedItem = target;

  var custmerInfo = selectedItem.getElementsByClassName('contents');
  var cnt = 0;
  for ( var sub in info ) {
    info[sub] = custmerInfo[cnt].textContent;
    cnt++;
  }

  var selectedPositionX = getX(selectedItem);
  var selectedPositionY = getY(selectedItem);

  gDeltaX = parseInt( x - selectedPositionX );
  gDeltaY = parseInt( y - selectedPositionY );

  selectedItemId = getAttrValue(selectedItem, 'did');
  if ( selectedItemId ) {
    contents  = getContents(selectedItem, 'contents');
  }
  setCursor(selectedItem, 'move');


  //
  // Set
  //

  setOpacity(selectedItem, 0.6);

  addEvent(document, 'mousemove', onMouseMove, false);
  addEvent(document, 'mouseup', onMouseUp, false);
}

////////////////////////////////////////////////////////////////////////

function onMouseMove(evt) {
  var x = getEventX(evt);
  var y = getEventY(evt);

  moveElm(selectedItem, x - gDeltaX, y - gDeltaY);
}

////////////////////////////////////////////////////////////////////////

function onMouseUp(evt) {
  setOpacity(selectedItem, 1);
  setCursor(selectedItem, 'default');

  removeEvent(document, 'mousemove', onMouseMove, false);
  removeEvent(document, 'mouseup', onMouseUp, false);

  if ( isOnDropTable(evt) ) {
    onDropped(evt);
  } else if ( isOnDropDelete(evt, 'gone_custmer') ) {
    onDeleted(evt);
  } else if ( isOnDropDelete(evt, 'cancel_custmer') ) {
    onCancel(evt);
  } else {
     moveElm(selectedItem, selectedPositionX, selectedPositionY);
  }
}

////////////////////////////////////////////////////////////////////////

function isOnDropTable(evt) {
  var target_divs = document.getElementsByClassName('drop_target');

  for (var i = 0; i < target_divs.length; i++) {
    if (isEventOnElm(evt, target_divs[i].id)) {
      if (target_divs[i].attributes['tid']) {
        tableNum   = getAttrValue(target_divs[i], 'tid');
        dropStyle = target_divs[i].style;
        return true;
      }
    }
  }
  return false;
}

////////////////////////////////////////////////////////////////////////

function isOnDropDelete(evt, query) {
  var delete_div = document.getElementsByClassName(query);

    if (isEventOnElm(evt, query)) {
        return true;
    }
  return false;
}

////////////////////////////////////////////////////////////////////////

function isEventOnElm(evt, drop_target_id) {
  var evtX = getEventX(evt);
  var evtY = getEventY(evt);

  var drop_target = document.getElementById(drop_target_id);

  var x = getX(drop_target);
  var y = getY(drop_target);

  var width = getWidth(drop_target);
  var height = getHeight(drop_target);

  return evtX > x && evtY > y && evtX < x + width && evtY < y + height;
}

////////////////////////////////////////////////////////////////////////

function init() {
  document.body.ondrag = function() {
    return false;
  };
  document.body.onselectstart = function() {
    return false;
  };

  //
  // Assign Event Handlers
  //

  var all_elms = document.getElementsByTagName('div');

  for (var i = 0; i < all_elms.length; i++) {
    if (getAttrValue(all_elms[i], 'class') == 'dragged_elm') {
      addEvent(all_elms[i], 'mousedown', onMouseDown, false);
    }
  }
}

addEvent(window, 'load', init, false);