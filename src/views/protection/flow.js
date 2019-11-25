/**
 * 点击文字删除对应节点及关系事件
 * @param {*} rightText 
 * @param {*} paper 
 */
var deleteTextFun = function (rightText,paper) {
  if (rightText.prev.nodeNo == "N-END" || rightText.prev.nodeNo == "N-START") {
    return;
  }

  if (rightText.prev && !isObjNull(rightText.prev.nextRectObjs)) {
    for (var rn in rightText.prev.nextRectObjs) {
      if (rightText.prev.nextRectObjs.hasOwnProperty(rn)) {
        paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id].arrow.remove();
        paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id].arrowText.remove();
        delete paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id];

        rightText.prev.nextRectObjs[rn].arrow.remove();
        rightText.prev.nextRectObjs[rn].arrowText.remove();
      }
    }
    delete rightText.prev.nextRectObjs;
  }
  if (rightText.prev && !isObjNull(rightText.prev.prevRectObjs)) {
    for (var rp in rightText.prev.prevRectObjs) {
      if (rightText.prev.prevRectObjs.hasOwnProperty(rp)) {
        paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id].arrow.remove();
        paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id].arrowText.remove();
        delete paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id];

        rightText.prev.prevRectObjs[rp].arrow.remove();
        rightText.prev.prevRectObjs[rp].arrowText.remove();
      }
    }
    delete rightText.prev.prevRectObjs;
  }

  // nodeIdArr 节点存储ID删除
  if (flow.nodeIdArr.indexOf(rightText.prev.id) != -1) {
    flow.nodeIdArr.splice(flow.nodeIdArr.indexOf(rightText.prev.id), 1);
  }

  if (document.getElementById(rightText.prev.nodeNo)) {
    document.getElementById(rightText.prev.nodeNo).parentNode.style.background = "#ffffff";
    document.getElementById(rightText.prev.nodeNo).draggable = true;
  }

  rightText.next.remove();
  rightText.prev.remove();
  rightText.remove();

  borderBox.parentBox.remove();
  arrowStartX = undefined;
}

/**
 * 点击节点删除节点及对应关系事件
 * @param {*} rightRect 
 * @param {*} paper 
 */
var deleteRectFun = function (rightRect,paper) {
  if (rightRect.nodeNo == "N-END" || rightRect.nodeNo == "N-START") {
    return;
  }

  if (!isObjNull(rightRect.nextRectObjs)) {
    for (var rn in rightRect.nextRectObjs) {
      if (rightRect.nextRectObjs.hasOwnProperty(rn)) {
        paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id].arrow.remove();
        paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id].arrowText.remove();
        delete paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id];

        rightRect.nextRectObjs[rn].arrow.remove();
        rightRect.nextRectObjs[rn].arrowText.remove();
      }
    }
    delete rightRect.nextRectObjs;
  }
  if (!isObjNull(rightRect.prevRectObjs)) {
    for (var rp in rightRect.prevRectObjs) {
      if (rightRect.prevRectObjs.hasOwnProperty(rp)) {
        paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id].arrow.remove();
        paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id].arrowText.remove();
        delete paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id];

        rightRect.prevRectObjs[rp].arrow.remove();
        rightRect.prevRectObjs[rp].arrowText.remove();
      }
    }
    delete rightRect.prevRectObjs;
  }

  // nodeIdArr 节点存储ID删除

  if (flow.nodeIdArr.indexOf(rightRect.id) != -1) {
    flow.nodeIdArr.splice(flow.nodeIdArr.indexOf(rightRect.id), 1);

  }

  if (document.getElementById(rightRect.nodeNo)) {
    document.getElementById(rightRect.nodeNo).parentNode.style.background = "#ffffff";
    document.getElementById(rightRect.nodeNo).draggable = true;
  }

  rightRect.next.next.remove();
  rightRect.next.remove();
  rightRect.remove();

  borderBox.parentBox.remove();
  arrowStartX = undefined;
}
/**
 * 点击关系删除关系及时间偏移值事件
 * @param {*} deleteNode 
 * @param {*} paper 
 */
var deleteArrowFun = function (deleteNode,paper) {
  var arrowText = deleteNode.next;
  delete paper.getById(arrowText.prevNext.split('_')[0]).nextRectObjs['tempArrow' + arrowText.prevNext.split('_')[1]];
  delete paper.getById(arrowText.prevNext.split('_')[1]).prevRectObjs['tempArrow' + arrowText.prevNext.split('_')[0]];

  deleteNode.remove();
  arrowText.remove();
}

/**
 * 删除事件
 * @param {*} e 
 */
var delteFunction = function (e) {
  if (e.keyCode != 46 || !borderBox || !flow.deleteFeature) {
    return
  }

  var deleteNode = flow.deleteFeature;
  var paper = flow.paper.canvas;

  if(deleteNode.type == 'rect'){
    deleteRectFun(deleteNode,paper)
  }else if(deleteNode.type == 'path'){
    deleteArrowFun(deleteNode,paper)
  }else{
    deleteTextFun(deleteNode,paper)
  }
}

/**
 * 常量定义
 */
export const flow = {
  nodeIdArr: [],
  paper: {
    width: 1920,
    height: 938,
    canvas: null
  },
  beginNodeAttr: {
    rect: {
      // "fill": "180-rgba(1,182,116,0.8)-rgba(120,208,106,0.8)",
      "fill":"rgba(1,182,116,0.8)",
      "fill-opacity": 1,
      "stroke": "none"
    },
    text: {
      "font-family": "MicrosoftYaHei",
      "font-size": "15px",
      "fill": "#ffffff",
      "font-weight": "400",
      "text-anchor": "middle"
    },
    img: {
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAr0lEQVQ4T8XSMQtBURjG8f//YzH6QDJJMsgig80oH0A+hMEus0FIUiaThaNbbqHr3nMzOOOp59d5n/fIj8cf87wBIYQasFfXsfAn0AK6wAjoqZciKAvoP0MnoANM1Ps3KA9IM0ugri6ykBggyQVgCjTV3SsUC6SZI1BRt+lFLHADxkkn6rnsC+ZAQ12V7WDznHmWt8qsEdrAABiq17L/oAps1UNRMLPE2NDXEv8CPAAPVEMR7gIlCwAAAABJRU5ErkJggg==',
      width: 16,
      height: 16,
      x: 24,
      y: 8 / 3
    },
  },
  endNodeAttr: {
    rect: {
      "fill": "#F79F2D",
      "fill-opacity": 1,
      "stroke": "none"
    },
    text: {
      "font-family": "MicrosoftYaHei",
      "font-size": "15px",
      "fill": "#ffffff",
      "font-weight": "400",
      "text-anchor": "middle"
    },
    img: {
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVQ4T2NkoBAwUqifgboG/P///z8hFzEyMqJYisIZNYCBYTQMCCUh7PLUTcrkuIFiFwAAYDgkEehNyRQAAAAASUVORK5CYII=',
      width: 16,
      height: 16,
      x: 24,
      y: 8 / 3
    },
  },
  nodeInfo: {
    // width: 128,
    // height: 60,
    width: 108,
    height: 52,
    radius: 8,
    rectStyle: {
      "fill": "#ffffff",
      "fill-opacity": 1,
      "stroke": "none"
    },
    textStyle: {
      "font-family": "MicrosoftYaHei",
      "font-size": "15px",
      "fill": "#3D424D",
      "font-weight": "400",
      "text-anchor": "middle"
    },
    imgStyle: {
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWUlEQVQ4T6WT30oCYRDFf7OLGwaBBUEQhN0aUuIT1G0vUC9Q0IWR+Rhm5EVQL1Av4HVPICaSt0kQBEFJQaKyO7Gru/lnLcO5PN/MmXPmmxFmDBmtTx9oxEmyTJuYYzHnvhvQRmgaNV7L19IdrBki2DrXGBA3DMwwYY6DDTTuT6TpvwcEyUtdtBzW1WZM1VBHE+0YPNaO5N3FveT0lUbsLzYmdR5V4yox53koH0rXI9gs6KppshIkChGBDLDbx0oKRZTAv23zUs3Ks0eQymtCIkQDX8IpsD/S+UaVMx/TLq1KTuo9BUVNmeoOuxcCdwgLQwTKp8K2j9mCU81IZXoC+FBlJ5QgVdSE6I8FICfC3qACFW5xyIdbCBkiyrH0h6hQQriYOMSZv9GVlSjoUtQiPs0itTo06ll5CxbJ9+WSWMLab6vcUZ784jECbyv9Y1JiDv88prAD+gv7BtDwlhFckCyhAAAAAElFTkSuQmCC',
      width: 16,
      height: 16,
      x: 24,
      y: 8 / 3
    },
    arrowStyle: {
      'stroke': "#3392FF",
      "stroke-width": 4,
      'title': 'title',
      'text': 'text',
      'font-size': '18px'
    },
    arrowTextStyle: {
      'font-size': '14px',
      "font-family": "MicrosoftYaHei",
      "fill": "#3392FF",
      "font-weight": "400",
      "text-anchor": "middle"
    }
  },
  borderBox: {
    "fill-opacity": 1,
    "stroke": "#3392FF",
    "stroke-width": 2
  },
  dragDropFunction: function (e) {
    if (dragObj.className == "basicNode") {
      event.preventDefault();
      dragObj.draggable = false;
      var nodeNo = dragObj.getAttribute('nodeNo');
      var nodeName = dragObj.getAttribute('nodeName');
      var nodeWidth = flow.nodeInfo.width
      var nodeHeight = flow.nodeInfo.height
      var nodeRadius = flow.nodeInfo.radius
      var paper = flow.paper.canvas;
      if (nodeName != "开始" && nodeName != "结束") {
        dragObj.parentNode.style.background = "rgba(137, 157, 178, 0.2)";
      }

      customizeFlow[name] = new addRect(paper, e.offsetX - nodeWidth / 2, e.offsetY - nodeHeight / 2, nodeWidth, nodeHeight, nodeRadius, nodeName, nodeNo);

      flow.nodeIdArr.push(customizeFlow[name].tempRect.id);

      if(dragObj.getAttribute("isclick")) {
        registerClick(flow.nodeIdArr, paper)
      }
    }
  },
  deleteFeature:null,
  delteFunction: delteFunction
}

/**
 * 全局变量定义
 */
var customizeFlow = {},
  templateFlow = {},
  dragObj,
  dragState = false,
  textClickState = true,
  borderBox,
  arrowStartX,
  arrowStartY,
  arrowEndX,
  arrowEndY,
  clickState,
  firstNode,
  secondNode,
  thirdNode,
  fourNode,
  nodeWidth = flow.nodeInfo.width,
  nodeHeight = flow.nodeInfo.height,
  nodeRadius = flow.nodeInfo.radius,
  tempFlowType,
  beNode,
  myFlow = {
    processNo: "",
    processName: "",
    relationArray: [],
    nodeArray: []
  },
  nodeIdArr = [],
  mousedownPos = { x: undefined, y: undefined };

/**
 * 菜单节点拖拽
 */
export function dragChildNode(paper) {
  flow.paper.canvas = null;
  flow.paper.canvas = paper;
  document.addEventListener('drag', function (e) {
    dragObj = e.target;
  })
  document.addEventListener('dragstart', function (e) {

  })
  document.addEventListener('dragend', function (e) {
    document.body.style.cursor = 'default';
  })
  document.addEventListener('dragover', function (e) {
    event.preventDefault();
  }, false)

  document.removeEventListener('drop', flow.dragDropFunction);
  document.addEventListener('drop', flow.dragDropFunction);

  document.removeEventListener('keydown',flow.delteFunction);
  document.addEventListener('keydown',flow.delteFunction);
}

/**
* 移除节点的边框盒子
* @param {画笔对象} raphaelObj 
* @param {边框对象} boxObj 
*/
function removeBorderBox(raphaelObj, boxObj) {
  boxObj.parentBox.remove();
  boxObj.boxObj.forEach(function (value) {
    value.remove()
  });
}


/**
* 添加节点四周的边框盒子
* @param {画笔对象} raphaelObj 
* @param {节点的x位置} x 
* @param {节点的y位置} y 
* @param {节点的宽度} w 
* @param {节点的高度} h 
* @param {边框每个小矩形的长和宽} r 
* @param {边框盒子的样式，可选} obj 
*/
export function addBorderBox(raphaelObj, x, y, w, h, r, obj) {
  var parentBox = raphaelObj.rect(x, y, w, h, r);
  parentBox.attr(obj);
  return {
    parentBox: parentBox
  }
};

/**
* 根据指定位置添加箭头
* @param {画笔对象} raphaelObj 
* @param {起点x坐标} sx 
* @param {起点y坐标} sy 
* @param {终点x坐标} ex 
* @param {终点y坐标} ey 
* @param {箭头的标注文字，可选} text 
*/
export function addArrow(raphaelObj, sx, sy, ex, ey, text, rectId, width, height, isDblclick, isRight) {
  flow.paper.canvas = raphaelObj;

  var text = text || "0";
  var arrowPath = arrowStyle(sx, sy, ex, ey, width, height);
  isDblclick = isDblclick != undefined ? isDblclick : true; //关系注册双击事件，默认为true
  isRight = isRight != undefined ? isRight : false; //关系右击事件注册，默认为注册

  var str = arrowPath.str;
  var cx1 = arrowPath.cx1 + 8;
  var cy1 = arrowPath.cy1 + 10;
  this.arrow = raphaelObj.path(str).attr(flow.nodeInfo.arrowStyle);

  this.arrowText = raphaelObj.text(cx1, cy1, text).attr(flow.nodeInfo.arrowTextStyle);
  this.arrowText.rectId = rectId;
  var arrowText = this.arrowText;
  var arrow = this.arrow;
  //文字注册双击事件，双击修改文字

  if (isRight) {
    arrow.mousedown(function (e) {
      if (e.button == 0) {
        arrow.attr({
          'stroke': "#F79F2D",
        })

        flow.deleteFeature = arrow;
      }
    })
  }
  if (isDblclick) {
    arrowText.dblclick(function (e) {
      var paper = flow.paper.canvas;
      if (!document.getElementById('tempInput')) {
        var tempInput = document.createElement('input');
        tempInput.id = "tempInput";
        document.body.append(tempInput);
        tempInput.style.position = 'absolute';
        tempInput.style.top = e.clientY + 'px';
        tempInput.style.left = e.clientX + 'px';

        tempInput.setSelectionRange(1, 1);
        tempInput.focus();

        tempInput.onblur = function (e) {
          if (e.target.value) {
            var reg = new RegExp("^[0-9]{0,6}$");
            var val;
            if(!reg.test(e.target.value)){
              arrowText.attr({
                "text": "请输入长度不超过6位的数字！",
                "fill": "red"
              })
              val = "请输入长度不超过6位的数字！"
            }else {
              arrowText.attr({
                "text": e.target.value,
                "fill": "#3392FF"
              })

              val = e.target.value
            }
          }
          paper.getById(arrowText.rectId)['timespan_' + arrowText.id] = val;
          e.target.parentElement.removeChild(e.target);
        }
      }
    })
  }

};

var rightClickback = function (e, ex, ey) {
  console.log(e.keyCode)
  if (e.button == 2) {
    if (document.getElementById('rightNodeDiv')) {
      document.getElementById('rightNodeDiv').remove();
    }
    if (this.nodeNo == "N-END" || this.nodeNo == "N-START") {
      return;
    }
    var rightDialog = '<span id="cancelNode"><img src="img/selected.png" style="background:red"></span><span id ="removeNode"><img src="img/cancel.png" style="background:red"></span>'
    var rightDiv = document.createElement('div');

    rightDiv.id = "rightNodeDiv";

    rightDiv.style.position = "absolute";
    rightDiv.style.top = e.clientY + "px";
    rightDiv.style.left = e.clientX + "px";

    rightDiv.innerHTML = rightDialog;

    document.body.append(rightDiv);

    var rightRect = this;
    document.getElementById('removeNode').onclick = function (e) {
      if (!isObjNull(rightRect.nextRectObjs)) {
        for (var rn in rightRect.nextRectObjs) {
          if (rightRect.nextRectObjs.hasOwnProperty(rn)) {
            paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id].arrow.remove();
            paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id].arrowText.remove();
            delete paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightRect.id];

            rightRect.nextRectObjs[rn].arrow.remove();
            rightRect.nextRectObjs[rn].arrowText.remove();
          }
        }
        delete rightRect.nextRectObjs;
      }
      if (!isObjNull(rightRect.prevRectObjs)) {
        for (var rp in rightRect.prevRectObjs) {
          if (rightRect.prevRectObjs.hasOwnProperty(rp)) {
            paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id].arrow.remove();
            paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id].arrowText.remove();
            delete paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightRect.id];

            rightRect.prevRectObjs[rp].arrow.remove();
            rightRect.prevRectObjs[rp].arrowText.remove();
          }
        }
        delete rightRect.prevRectObjs;
      }

      // nodeIdArr 节点存储ID删除

      if (nodeIdArr.indexOf(rightRect.id) != -1) {
        nodeIdArr.splice(nodeIdArr.indexOf(rightRect.id), 1);

      }

      if (document.getElementById(rightRect.nodeNo)) {
        document.getElementById(rightRect.nodeNo).style.background = "#4c8eb3";
        document.getElementById(rightRect.nodeNo).draggable = true;
      }

      rightRect.next.remove();
      rightRect.remove();

      document.getElementById('rightNodeDiv').remove();
    }

    document.getElementById('cancelNode').onclick = function (e) {
      document.getElementById('rightNodeDiv').remove();
    }
  }
}

var rightTextClickback = function (e) {
  if (e.button == 2) {
    if (document.getElementById('rightNodeDiv')) {
      document.getElementById('rightNodeDiv').remove();
    }
    if (this.prev.nodeNo == "N-END" || this.prev.nodeNo == "N-START") {
      return;
    }
    var rightDialog = '<span id="cancelNode"><img src="img/selected.png" style="background:red"></span><span id ="removeNode"><img src="img/cancel.png" style="background:red"></span>'
    var rightDiv = document.createElement('div');

    rightDiv.id = "rightNodeDiv";

    rightDiv.style.position = "absolute";
    rightDiv.style.top = e.clientY + "px";
    rightDiv.style.left = e.clientX + "px";

    rightDiv.innerHTML = rightDialog;

    document.body.append(rightDiv);

    var rightText = this;
    document.getElementById('removeNode').onclick = function (e) {
      if (!isObjNull(rightText.prev.nextRectObjs)) {
        for (var rn in rightText.prev.nextRectObjs) {
          if (rightText.prev.nextRectObjs.hasOwnProperty(rn)) {
            paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id].arrow.remove();
            paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id].arrowText.remove();
            delete paper.getById(rn.replace('tempArrow', '')).prevRectObjs['tempArrow' + rightText.prev.id];

            rightText.prev.nextRectObjs[rn].arrow.remove();
            rightText.prev.nextRectObjs[rn].arrowText.remove();
          }
        }
        delete rightText.prev.nextRectObjs;
      }
      if (!isObjNull(rightText.prev.prevRectObjs)) {
        for (var rp in rightText.prev.prevRectObjs) {
          if (rightText.prev.prevRectObjs.hasOwnProperty(rp)) {
            paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id].arrow.remove();
            paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id].arrowText.remove();
            delete paper.getById(rp.replace('tempArrow', '')).nextRectObjs['tempArrow' + rightText.prev.id];

            rightText.prev.prevRectObjs[rp].arrow.remove();
            rightText.prev.prevRectObjs[rp].arrowText.remove();
          }
        }
        delete rightText.prev.prevRectObjs;
      }

      // nodeIdArr 节点存储ID删除
      if (nodeIdArr.indexOf(rightText.prev.id) != -1) {
        nodeIdArr.splice(nodeIdArr.indexOf(rightText.prev.id), 1);
      }

      if (document.getElementById(rightText.prev.nodeNo)) {
        document.getElementById(rightText.prev.nodeNo).style.background = "#4c8eb3";
        document.getElementById(rightText.prev.nodeNo).draggable = true;
      }

      rightText.prev.remove();
      rightText.remove();

      document.getElementById('rightNodeDiv').remove();
    }

    document.getElementById('cancelNode').onclick = function (e) {
      document.getElementById('rightNodeDiv').remove();
    }
  }
}

/**
* 节点注册点击事件回调
* @param {*} ex 
* @param {*} ey 
* @param {*} x 
* @param {*} y 
* @param {*} e 
*/
var clickCallback = function (ex, ey, x, y, e) {
  if (borderBox) {
    borderBox.parentBox.remove();
  }

  flow.deleteFeature = this;
  var paper = flow.paper.canvas;
  borderBox = new addBorderBox(paper, this.attrs.x, this.attrs.y, this.attrs.width, this.attrs.height, 10, flow.borderBox);

  if (!arrowStartX || firstNode.id == this.id) {
    firstNode = this;
    clickState = 'stat';
    arrowStartX = this.attrs.x;
    arrowStartY = this.attrs.y;
  } else {
    secondNode = this;

    arrowEndX = this.attrs.x;
    arrowEndY = this.attrs.y;

    if (!this.prevRectObjs.hasOwnProperty('tempArrow' + firstNode.id)) {
      this.prevRectObjs['tempArrow' + firstNode.id] = new addArrow(paper, arrowStartX, arrowStartY, arrowEndX, arrowEndY, 0, this.id, this.attrs.width, this.attrs.height);
    }
    if (!firstNode.nextRectObjs.hasOwnProperty('tempArrow' + this.id)) {
      firstNode.nextRectObjs['tempArrow' + this.id] = this.prevRectObjs['tempArrow' + firstNode.id];
      // paper.getById(this.id).timespan = firstNode.nextRectObjs['tempArrow' + this.id].arrowText.attrs.text || "0";

      var timespanId = firstNode.nextRectObjs['tempArrow' + this.id].arrowText.id;
      paper.getById(this.id)['timespanId' + firstNode.id + this.id] = timespanId;
      paper.getById(this.id)['timespanPN' + firstNode.id + this.id] = firstNode.id + this.id;
      paper.getById(this.id)['timespan_' + timespanId] = firstNode.nextRectObjs['tempArrow' + this.id].arrowText.attrs.text || "0";

      firstNode.nextRectObjs['tempArrow' + this.id].arrowText['prevNext'] = firstNode.id + '_' + this.id;
    }

    arrowStartX = this.attrs.x;
    arrowStartY = this.attrs.y;
    firstNode = secondNode;
  }
};

/**
* 文字注册点击事件
* @param {*} ex 
* @param {*} ey 
* @param {*} x 
* @param {*} y 
* @param {*} e 
*/
var clickTextCallback = function (ex, ey, x, y, e) {
  if (dragState && textClickState) {
    textClickState = false;
    return;
  }

  dragState = false;
  textClickState = true;

  if (borderBox) {
    borderBox.parentBox.remove();
  }

  flow.deleteFeature = this;
  var paper = flow.paper.canvas;

  borderBox = new addBorderBox(paper, this.prev.attrs.x, this.prev.attrs.y, this.prev.attrs.width, this.prev.attrs.height, 10, flow.borderBox);

  if (!arrowStartX || firstNode.id == this.prev.id) {
    firstNode = this.prev;
    clickState = 'stat';
    arrowStartX = this.prev.attrs.x;
    arrowStartY = this.prev.attrs.y;
  } else {
    secondNode = this.prev;

    arrowEndX = this.prev.attrs.x;
    arrowEndY = this.prev.attrs.y;

    if (!this.prev.prevRectObjs.hasOwnProperty('tempArrow' + firstNode.id)) {
      this.prev.prevRectObjs['tempArrow' + firstNode.id] = new addArrow(paper, arrowStartX, arrowStartY, arrowEndX, arrowEndY, 0, this.prev.id, this.prev.attrs.width, this.prev.attrs.height);
    }
    if (!firstNode.nextRectObjs.hasOwnProperty('tempArrow' + this.prev.id)) {
      firstNode.nextRectObjs['tempArrow' + this.prev.id] = this.prev.prevRectObjs['tempArrow' + firstNode.id];
      // paper.getById(this.id).timespan = firstNode.nextRectObjs['tempArrow' + this.id].arrowText.attrs.text || "0";

      var timespanId = firstNode.nextRectObjs['tempArrow' + this.prev.id].arrowText.id;
      paper.getById(this.prev.id)['timespanId' + firstNode.id + this.prev.id] = timespanId;
      paper.getById(this.prev.id)['timespanPN' + firstNode.id + this.prev.id] = firstNode.id + this.prev.id;
      paper.getById(this.prev.id)['timespan_' + timespanId] = firstNode.nextRectObjs['tempArrow' + this.prev.id].arrowText.attrs.text || "0";

      firstNode.nextRectObjs['tempArrow' + this.prev.id].arrowText['prevNext'] = firstNode.id + '_' + this.prev.id;
    }

    arrowStartX = this.prev.attrs.x;
    arrowStartY = this.prev.attrs.y;
    firstNode = secondNode;
  }
};

/**
* 图片注册点击事件
* @param {*} ex 
* @param {*} ey 
* @param {*} x 
* @param {*} y 
* @param {*} e 
*/
var clickImageCallback = function (ex, ey, x, y, e) {
  if (borderBox) {
    borderBox.parentBox.remove();
  }

  flow.deleteFeature = this;
  var paper = flow.paper.canvas;

  borderBox = new addBorderBox(paper, this.prev.prev.attrs.x, this.prev.prev.attrs.y, this.prev.prev.attrs.width, this.prev.prev.attrs.height, 10, flow.borderBox);

  if (!arrowStartX || firstNode.id == this.prev.prev.id) {
    firstNode = this.prev.prev;
    clickState = 'stat';
    arrowStartX = this.prev.prev.attrs.x;
    arrowStartY = this.prev.prev.attrs.y;
  } else {
    secondNode = this.prev.prev;

    arrowEndX = this.prev.prev.attrs.x;
    arrowEndY = this.prev.prev.attrs.y;

    if (!this.prev.prev.prevRectObjs.hasOwnProperty('tempArrow' + firstNode.id)) {
      this.prev.prev.prevRectObjs['tempArrow' + firstNode.id] = new addArrow(paper, arrowStartX, arrowStartY, arrowEndX, arrowEndY, 0, this.prev.prev.id, this.prev.prev.attrs.width, this.prev.prev.attrs.height);
    }
    if (!firstNode.nextRectObjs.hasOwnProperty('tempArrow' + this.prev.prev.id)) {
      firstNode.nextRectObjs['tempArrow' + this.prev.prev.id] = this.prev.prev.prevRectObjs['tempArrow' + firstNode.id];
      // paper.getById(this.id).timespan = firstNode.nextRectObjs['tempArrow' + this.id].arrowText.attrs.text || "0";

      var timespanId = firstNode.nextRectObjs['tempArrow' + this.prev.prev.id].arrowText.id;
      paper.getById(this.prev.prev.id)['timespanId' + firstNode.id + this.prev.prev.id] = timespanId;
      paper.getById(this.prev.prev.id)['timespanPN' + firstNode.id + this.prev.prev.id] = firstNode.id + this.prev.prev.id;
      paper.getById(this.prev.prev.id)['timespan_' + timespanId] = firstNode.nextRectObjs['tempArrow' + this.prev.prev.id].arrowText.attrs.text || "0";

      firstNode.nextRectObjs['tempArrow' + this.prev.prev.id].arrowText['prevNext'] = firstNode.id + '_' + this.prev.prev.id;
    }

    arrowStartX = this.prev.prev.attrs.x;
    arrowStartY = this.prev.prev.attrs.y;
    firstNode = secondNode;
  }

};
/**
* 添加矩形及矩形内部的文字
* @param {画笔对象} raphaelObj 
* @param {矩形的x坐标} x 
* @param {矩形的y坐标} y 
* @param {矩形的宽度} w 
* @param {矩形的高度} h 
* @param {圆角矩形参数} r 
* @param {文字，可选} text 
*/
export function addRect(raphaelObj, x, y, w, h, r, nodeName, nodeNo, isClick, isDrag, isRight) {
  flow.paper.canvas = raphaelObj;
  let text = nodeName || '';
  isClick = isClick != undefined ? isClick : false; //注册点击事件，默认不开启
  isDrag = isDrag != undefined ? isDrag : true; //注册拖拽事件，默认开启
  isRight = isRight != undefined ? isRight : false;//注册右击事件，默认开启
  let imgStyle = nodeName == "开始" ? flow.beginNodeAttr.img : (nodeName == "结束" ? flow.endNodeAttr.img : flow.nodeInfo.imgStyle)
  let textStyle = nodeName == "开始" ? flow.beginNodeAttr.text : (nodeName == "结束" ? flow.endNodeAttr.text : flow.nodeInfo.textStyle)

  //添加节点矩形，文字，图片
  this.tempRect = nodeName == "开始" ? raphaelObj.rect(x, y, w, h, r).attr(flow.beginNodeAttr.rect) : (nodeName == "结束" ? raphaelObj.rect(x, y, w, h, r).attr(flow.endNodeAttr.rect) : raphaelObj.rect(x, y, w, h, r).attr(flow.nodeInfo.rectStyle));
  this.tempText = raphaelObj.text(x + w / 2, y + h / 2, text).attr(textStyle);
  this.image = raphaelObj.image(imgStyle.url, x + w / imgStyle.x, y + h / imgStyle.y, imgStyle.width, imgStyle.height);
  //定义前后关联节点对象组
  this.tempRect.prevRectObjs = {};
  this.tempRect.nextRectObjs = {};
  //节点添加对应节点编号及节点名称
  this.tempRect.nodeNo = nodeNo || "";
  this.tempRect.nodeName = nodeName || "";

  var tempRect = this.tempRect,
    tempText = this.tempText,
    tempImage = this.image;
  tempRect.selfText = tempText;
  tempRect.selfImg = tempImage;

  //注册拖拽事件
  if (isDrag) {
    //矩形拖拽
    tempRect.drag(function (ex, ey, x, y, e) {
      var paper = flow.paper.canvas;
      if(e.clientX > 1600 || e.clientY > 935) {
        return
      }
      if (mousedownPos.x != e.clientX || mousedownPos.y != e.clientY) {
        if (borderBox) {
          borderBox.parentBox.remove();
        }
        if (dragState) {
          textClickState = true;
        } else {
          dragState = true;
        }

        document.body.style.cursor = 'default';
        this.attr({
          x: e.offsetX - nodeWidth / 2,
          y: e.offsetY - nodeHeight / 2
        });
        tempText.attr({
          x: e.offsetX,
          y: e.offsetY
        });
        tempImage.attr({
          x: e.offsetX - nodeWidth * 11 / 24,
          y: e.offsetY - nodeHeight / 8
        });
        var arrowPath,
          prevNodeObjs = this.prevRectObjs,
          nextNodeObjs = this.nextRectObjs,
          prevNode,
          nextNode;

        if (!isObjNull(prevNodeObjs)) {
          for (var pno in prevNodeObjs) {
            if (prevNodeObjs[pno]) {
              prevNode = paper.getById(pno.replace('tempArrow', ''));
              arrowPath = arrowStyle(prevNode.attrs.x, prevNode.attrs.y, this.attrs.x, this.attrs.y, this.attrs.width, this.attrs.height).str;
              prevNodeObjs[pno].arrow.attr({
                path: arrowPath
              });
              prevNodeObjs[pno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }

        if (!isObjNull(nextNodeObjs)) {
          for (var nextno in nextNodeObjs) {
            if (nextNodeObjs[nextno]) {
              nextNode = paper.getById(nextno.replace('tempArrow', ''));
              arrowPath = arrowStyle(this.attrs.x, this.attrs.y, nextNode.attrs.x, nextNode.attrs.y, this.attrs.width, this.attrs.height).str;
              nextNodeObjs[nextno].arrow.attr({
                path: arrowPath
              });
              nextNodeObjs[nextno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }
      }
    });
    //图片拖拽
    tempImage.drag(function (ex, ey, x, y, e) {
      var paper = flow.paper.canvas;
      if(e.clientX > 1600 || e.clientY > 935) {
        return
      }
      if (mousedownPos.x != e.clientX || mousedownPos.y != e.clientY) {
        if (borderBox) {
          borderBox.parentBox.remove();
        }
        if (dragState) {
          textClickState = true;
        } else {
          dragState = true;
        }

        document.body.style.cursor = 'default';
        this.attr({
          x: e.offsetX - nodeWidth * 11 / 24,
          y: e.offsetY - nodeHeight / 8

        });
        tempRect.attr({
          x: e.offsetX - nodeWidth / 2,
          y: e.offsetY - nodeHeight / 2
        });
        tempText.attr({
          x: e.offsetX,
          y: e.offsetY
        });

        var arrowPath,
          prevNodeObjs = tempRect.prevRectObjs,
          nextNodeObjs = tempRect.nextRectObjs,
          prevNode,
          nextNode;

        if (!isObjNull(prevNodeObjs)) {
          for (var pno in prevNodeObjs) {
            if (prevNodeObjs[pno]) {
              prevNode = paper.getById(pno.replace('tempArrow', ''));
              arrowPath = arrowStyle(prevNode.attrs.x, prevNode.attrs.y, tempRect.attrs.x, tempRect.attrs.y, tempRect.attrs.width, tempRect.attrs.height).str;
              prevNodeObjs[pno].arrow.attr({
                path: arrowPath
              });
              prevNodeObjs[pno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }

        if (!isObjNull(nextNodeObjs)) {
          for (var nextno in nextNodeObjs) {
            if (nextNodeObjs[nextno]) {
              nextNode = paper.getById(nextno.replace('tempArrow', ''));
              arrowPath = arrowStyle(tempRect.attrs.x, tempRect.attrs.y, nextNode.attrs.x, nextNode.attrs.y, nextNode.attrs.width, nextNode.attrs.height).str;
              nextNodeObjs[nextno].arrow.attr({
                path: arrowPath
              });
              nextNodeObjs[nextno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }
      }
    })
    //文字拖拽
    tempText.drag(function (ex, ey, x, y, e) {
      var paper = flow.paper.canvas;
      if(e.clientX > 1600 || e.clientY > 935) {
        return
      }
      if (mousedownPos.x != e.clientX || mousedownPos.y != e.clientY) {
        if (borderBox) {
          borderBox.parentBox.remove();
        }
        if (dragState) {
          textClickState = true;
        } else {
          dragState = true;
        }

        document.body.style.cursor = 'default';
        this.attr({
          x: e.offsetX,
          y: e.offsetY
        });
        tempRect.attr({
          x: e.offsetX - nodeWidth / 2,
          y: e.offsetY - nodeHeight / 2
        });
        tempImage.attr({
          x: e.offsetX - nodeWidth * 11 / 24,
          y: e.offsetY - nodeHeight / 8
        });

        var arrowPath,
          prevNodeObjs = tempRect.prevRectObjs,
          nextNodeObjs = tempRect.nextRectObjs,
          prevNode,
          nextNode;

        if (!isObjNull(prevNodeObjs)) {
          for (var pno in prevNodeObjs) {
            if (prevNodeObjs[pno]) {
              prevNode = paper.getById(pno.replace('tempArrow', ''));
              arrowPath = arrowStyle(prevNode.attrs.x, prevNode.attrs.y, tempRect.attrs.x, tempRect.attrs.y, tempRect.attrs.width, tempRect.attrs.height).str;
              prevNodeObjs[pno].arrow.attr({
                path: arrowPath
              });
              prevNodeObjs[pno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }

        if (!isObjNull(nextNodeObjs)) {
          for (var nextno in nextNodeObjs) {
            if (nextNodeObjs[nextno]) {
              nextNode = paper.getById(nextno.replace('tempArrow', ''));
              arrowPath = arrowStyle(tempRect.attrs.x, tempRect.attrs.y, nextNode.attrs.x, nextNode.attrs.y, nextNode.attrs.width, nextNode.attrs.height).str;
              nextNodeObjs[nextno].arrow.attr({
                path: arrowPath
              });
              nextNodeObjs[nextno].arrowText.attr({
                x: parseFloat(arrowPath.split(' ')[1].split('L')[1]) - 7,
                y: parseFloat(arrowPath.split(' ')[2].split('L')[0]) + 5
              });
            }
          }
        }
      }
    })
  }

  if (isClick) {
    tempRect.click(clickCallback);
    tempText.click(clickTextCallback);
  }

  if (isRight) {
    tempRect.node.addEventListener('keydown',function(e){
      console.log('keydown')
    });
    tempText.mousedown(rightTextClickback);
  }
};

addRect.prototype.getRect = function () {
  return this.tempRect;
}
addRect.prototype.getText = function () {
  return this.tempText;
}
addRect.prototype.clickEvent = function () {
  var currentRect = this.tempRect;
  currentRect.click(clickCallback);
}
addRect.prototype.unclickEvent = function () {
  var currentRect = this.tempRect;
  currentRect.unclick(clickCallback);
}
addRect.prototype.removeNode = function () {
  this.tempRect.remove();
  this.tempText.remove();
}
/**
* 根据起点和终点的位置拼箭头的参数
* @param {起始点x坐标} sx 
* @param {起始点y坐标} sy 
* @param {终点x坐标} ex 
* @param {终点y坐标} ey 
* @param {节点宽度} width 
* @param {节点高度} height 
*/
function arrowStyle(sx, sy, ex, ey, width, height) {
  var str, nx1, ny1, nx2, ny2, dx, dy, cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4,
    arrowPath = {
      str: "",
      cx1: "",
      cy1: ""
    };

  if (ey + height < sy) {
    if (sx + width < ex) {
      sx = sx + width / 2;
      ex = ex - 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      cx1 = sx
      cy1 = ey - 3;
      cy2 = ey + 3;
      cx3 = ex + 9;
      cy4 = ey - 3;

      str = str + "L" + sx + " " + ey + "L" + ex + " " + ey + "L" + ex + " " + cy2 + "L" + cx3 + " " + ey + "L" + ex + " " + cy4 + "L" + ex + " " + ey;
    } else if (sx > ex + width) {
      sx = sx + width / 2;
      ex = ex + width + 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      cx1 = sx
      cy1 = ey - 3;
      cy2 = ey - 3;
      cx3 = ex - 9;
      cy4 = ey + 3;

      str = str + "L" + sx + " " + ey + "L" + ex + " " + ey + "L" + ex + " " + cy2 + "L" + cx3 + " " + ey + "L" + ex + " " + cy4 + "L" + ex + " " + ey;
    } else {
      sx = sx + width / 2;
      ex = ex + width / 2;
      ey = ey + height + 14;

      str = "M" + sx + " " + sy;
      dx = ex - sx;
      dy = sy - ey;
      nx1 = sx;
      ny1 = sy - dy / 2;
      nx2 = ex;
      ny2 = ny1;

      cx1 = nx1
      cy1 = ny1 - 3;

      cx2 = ex + 3;
      cy2 = ey;
      cx3 = ex;
      cy3 = ey - 9;
      cx4 = ex - 3;
      cy4 = ey;

      str = str + "L" + nx1 + " " + ny1 + "L" + nx2 + " " + ny2 + "L" + ex + " " + ey + "L" + cx2 + " " + cy2 + "L" + cx3 + " " + cy3 + "L" + cx4 + " " + cy4 + "L" + ex + " " + ey;
    }
  } else if (ey > sy + height) {
    if (sx + width < ex) {
      sx = sx + width / 2;
      sy = sy + height;
      ex = ex - 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      cx1 = sx
      cy1 = ey + 3;
      cy2 = ey + 3;
      cx3 = ex + 9;
      cy4 = ey - 3;

      str = str + "L" + sx + " " + ey + "L" + ex + " " + ey + "L" + ex + " " + cy2 + "L" + cx3 + " " + ey + "L" + ex + " " + cy4 + "L" + ex + " " + ey;
    } else if (sx > ex + width) {
      sx = sx + width / 2;
      sy = sy + height;
      ex = ex + width + 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      cx1 = sx
      cy1 = ey + 3;
      cy2 = ey - 3;
      cx3 = ex - 9;
      cy4 = ey + 3;

      str = str + "L" + sx + " " + ey + "L" + ex + " " + ey + "L" + ex + " " + cy2 + "L" + cx3 + " " + ey + "L" + ex + " " + cy4 + "L" + ex + " " + ey;
    } else {
      sx = sx + width / 2;
      sy = sy + height;
      ex = ex + width / 2;
      ey = ey - 14;

      str = "M" + sx + " " + sy;
      dx = ex - sx;
      dy = ey - sy;
      nx1 = sx;
      ny1 = sy + dy / 2;
      nx2 = ex;
      ny2 = ny1;

      cx1 = nx1
      cy1 = ny1 + 3;

      cx2 = ex + 3;
      cy2 = ey;
      cx3 = ex;
      cy3 = ey + 9;
      cx4 = ex - 3;
      cy4 = ey;

      str = str + "L" + nx1 + " " + ny1 + "L" + nx2 + " " + ny2 + "L" + ex + " " + ey + "L" + cx2 + " " + cy2 + "L" + cx3 + " " + cy3 + "L" + cx4 + " " + cy4 + "L" + ex + " " + ey;
    }

  } else {
    if (sx + width < ex) {
      sx = sx + width;
      sy = sy + height / 2;
      ex = ex - 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      dx = ex - sx;
      dy = ey - sy;
      nx1 = sx + dx / 2;
      ny1 = sy;
      nx2 = nx1;
      ny2 = ey;

      cx1 = nx1
      cy1 = ny1 + 3;

      cx2 = ex;
      cy2 = ey - 3;
      cx3 = ex + 9;
      cy3 = ey;
      cx4 = ex;
      cy4 = ey + 3;

      str = str + "L" + nx1 + " " + ny1 + "L" + nx2 + " " + ny2 + "L" + ex + " " + ey + "L" + cx2 + " " + cy2 + "L" + cx3 + " " + cy3 + "L" + cx4 + " " + cy4 + "L" + ex + " " + ey;
    } else {
      // sx = sx;
      sy = sy + height / 2;
      ex = ex + width + 14;
      ey = ey + height / 2;

      str = "M" + sx + " " + sy;
      dx = ex - sx;
      dy = ey - sy;
      nx1 = sx + dx / 2;
      ny1 = sy;
      nx2 = nx1;
      ny2 = ey;

      cx1 = nx1
      cy1 = ny1 + 3;

      cx2 = ex;
      cy2 = ey - 3;
      cx3 = ex - 9;
      cy3 = ey;
      cx4 = ex;
      cy4 = ey + 3;

      str = str + "L" + nx1 + " " + ny1 + "L" + nx2 + " " + ny2 + "L" + ex + " " + ey + "L" + cx2 + " " + cy2 + "L" + cx3 + " " + cy3 + "L" + cx4 + " " + cy4 + "L" + ex + " " + ey;
    }
  }

  arrowPath.str = str;
  arrowPath.cx1 = cx1;
  arrowPath.cy1 = cy1;
  return arrowPath;
}

/**
* 流程存储的数据
* @param {画笔对象} paper 
* @param {已添加的节点ID数组} nodeId 
*/
export function saveFlowData(paper, nodeId) {
  var myFlow = {};
  myFlow.processNo = "";
  myFlow.processName = "";
  myFlow.classify = "";
  myFlow.relationArray = [];
  myFlow.nodeArray = [];
  myFlow.condSql = "test";

  myFlow.timeSpanError = false;

  var currentNode,
    relationObj = {},
    nodeObj = {};

  var nextRectObjArr = [],
    nextRectTextArr = [];
  nodeId.forEach(function (n) {
    currentNode = paper.getById(n);
    nodeObj = {};
    nextRectObjArr = [];
    nextRectTextArr = [];
    var isObjectNull = true;

    for (var k in currentNode.nextRectObjs) {
      if (currentNode.nextRectObjs.hasOwnProperty(k)) {
        isObjectNull = false;
        break;
      }
    }

    if (!isObjectNull) {
      for (var key in currentNode.nextRectObjs) {
        if (currentNode.nextRectObjs.hasOwnProperty(key)) {
          nextRectObjArr.push(paper.getById(key.replace('tempArrow', '')));
          // nextRectTextArr.push(currentNode.nextRectObjs[key].arrowText.attrs.text);
        }
      }

      nodeObj.relationType = "L";
    } else {
      nodeObj.relationType = null;
    }

    nextRectObjArr.forEach(function (objVal, objIndex) {
      relationObj['nodeNext' + objIndex] = {};
      relationObj['nodeNext' + objIndex].nodeNoPrev = currentNode.nodeNo || "";

      relationObj['nodeNext' + objIndex].nodeNoNext = objVal.nodeNo || "";

      // if (objIndex == 0) {
      //     relationObj['nodeNext' + objIndex].relationType = "L";
      // } else {
      //     relationObj['nodeNext' + objIndex].relationType = "R";
      // }

      if (isObjNull(objVal.nextRectObjs) && objVal.nodeNo != "N-END") {
        relationObj['nodeNext' + objIndex].relationType = "R";
      } else {
        relationObj['nodeNext' + objIndex].relationType = "L";
      }

      relationObj['nodeNext' + objIndex].timespan = "0";
      if (objVal['timespanPN' + currentNode.id + objVal.id] && objVal['timespanId' + currentNode.id + objVal.id]) {
        relationObj['nodeNext' + objIndex].timespan = objVal['timespan_' + objVal['timespanId' + currentNode.id + objVal.id]] || "0";
        if(objVal['timespan_' + objVal['timespanId' + currentNode.id + objVal.id]] == "请输入长度不超过6位的数字！") {
          myFlow.timeSpanError = true
        }
      }

      myFlow.relationArray.push(relationObj['nodeNext' + objIndex]);
    })

    nodeObj.nodeNo = currentNode.nodeNo || "";
    nodeObj.nodeName = currentNode.nodeName || "";
    nodeObj.coordinateX = currentNode.attrs.x;
    nodeObj.coordinateY = currentNode.attrs.y;
    nodeObj.width = currentNode.attrs.width;
    nodeObj.height = currentNode.attrs.height;

    myFlow.nodeArray.push(nodeObj);
  })

  return myFlow;
}
/**
* 根据已有流程数据，展示流程
* @param {画笔对象} paper 
* @param {*} resData 
* @param {*} nodeId 
*/
export function flowView(paper, resData, nodeId, status) {
  var flowNodeArray = resData.nodeArray;
  var flowRelationArray = resData.relationArray;

  var paintNode = {};
  flowNodeArray.forEach(function (pt, ptIndex) {
    var paintObj = {}

    paintObj.x = pt.coordinateX;
    paintObj.y = pt.coordinateY;
    paintObj.width = pt.width || 108;
    paintObj.height = pt.height || 60;
    paintObj.radius = pt.radius || flow.nodeInfo.radius;
    paintObj.nodeNo = pt.nodeNo;
    paintObj.nodeName = pt.nodeName;

    paintNode[pt.nodeNo] = new addRect(paper, paintObj.x, paintObj.y, paintObj.width, paintObj.height, paintObj.radius, paintObj.nodeName, paintObj.nodeNo, status, status, status);
    // nodeId.push(paintNode[pt.nodeNo].tempRect.id);
    flow.nodeIdArr.push(paintNode[pt.nodeNo].tempRect.id);
  })

  flowRelationArray.forEach(function (fa, faIndex) {
    var prevNodeObj;
    var nextNodeObj;

    for (var pn in paintNode) {
      if (paintNode.hasOwnProperty(pn) && pn == fa.nodeNoPrev) {
        prevNodeObj = paintNode[pn].tempRect;
      }
      if (paintNode.hasOwnProperty(pn) && pn == fa.nodeNoNext) {
        nextNodeObj = paintNode[pn].tempRect;
      }
    }

    if (prevNodeObj && !prevNodeObj.prevRectObjs && isObjNull(prevNodeObj.prevRectObjs)) {
      prevNodeObj.prevRectObjs = {};
    }
    if (prevNodeObj && !prevNodeObj.nextRectObjs && isObjNull(prevNodeObj.nextRectObjs)) {
      prevNodeObj.nextRectObjs = {};
    }
    if (nextNodeObj && !nextNodeObj.prevRectObjs && isObjNull(nextNodeObj.prevRectObjs)) {
      nextNodeObj.prevRectObjs = {};
    }
    if (nextNodeObj && !nextNodeObj.nextRectObjs && isObjNull(nextNodeObj.nextRectObjs)) {
      nextNodeObj.nextRectObjs = {};
    }

    if(prevNodeObj && nextNodeObj){
      prevNodeObj.nextRectObjs['tempArrow' + nextNodeObj.id] = new addArrow(paper, prevNodeObj.attrs.x, prevNodeObj.attrs.y, nextNodeObj.attrs.x, nextNodeObj.attrs.y, fa.timespan, nextNodeObj.id, prevNodeObj.attrs.width, prevNodeObj.attrs.height, status, status);
      var timespanId = prevNodeObj.nextRectObjs['tempArrow' + nextNodeObj.id].arrowText.id;
      nextNodeObj['timespanId' + prevNodeObj.id + nextNodeObj.id] = timespanId;
      nextNodeObj['timespanPN' + prevNodeObj.id + nextNodeObj.id] = prevNodeObj.id + nextNodeObj.id;
      nextNodeObj['timespan_' + timespanId] = prevNodeObj.nextRectObjs['tempArrow' + nextNodeObj.id].arrowText.attrs.text;

      prevNodeObj.nextRectObjs['tempArrow' + nextNodeObj.id].arrowText['prevNext'] = prevNodeObj.id + '_' + nextNodeObj.id;

      nextNodeObj.prevRectObjs['tempArrow' + prevNodeObj.id] = prevNodeObj.nextRectObjs['tempArrow' + nextNodeObj.id];
    }
  })
}
/**
* 判断对象是否为空
* @param {*} obj 
*/
function isObjNull(obj) {
  var isObjNull = true;

  for (var ke in obj) {
    if (obj.hasOwnProperty(ke)) {
      isObjNull = false;
      break;
    }
  }
  return isObjNull
}

//用鼠标位置区别节点点击和拖拽事件
document.body.onmousedown = function (e) {
  mousedownPos.x = e.clientX;
  mousedownPos.y = e.clientY;
}

//body点击事件，去除选中节点的状态
document.body.onclick = function (e) {
  event.preventDefault();
  if (e.target.tagName == "tspan" || e.target.tagName == "rect" || e.target.tagName == "text" || e.target.tagName == "image" || e.target.tagName == "path") {
    return;
  }

  if (borderBox) {
    borderBox.parentBox.remove();
  }
  arrowStartX = undefined;

  if(flow.deleteFeature && flow.deleteFeature.type == "path"){
    flow.deleteFeature.attr({
      stroke:"#3392FF"
    })
  }

  flow.deleteFeature = null;
}


/**
* 添加关系
* 给画板上的所有节点添加点击事件
*  
* */
export function registerClick(nodeObjs, paper) {
  if (!nodeObjs || !paper) {
    return;
  }
  removeRegisterClick(nodeObjs, paper);

  var curRect, curText, curImg;
  for (var o = 0; o < nodeObjs.length; o++) {
    curRect = paper.getById(nodeObjs[o]);
    if (curRect) {
      curRect.click(clickCallback);
      curRect.clickCallbackFun = clickCallback;
      if (curRect.selfText) {
        curText = curRect.selfText;
        curText.click(clickTextCallback);
        curText.clickTextCallbackFun = clickTextCallback;
      }
      if (curRect.selfImg) {
        curImg = curRect.selfImg;
        curImg.click(clickImageCallback);
        curImg.clickImageCallbackFun = clickImageCallback;
      }
    }
  }
}

/**
* 删除节点的注册点击事件
* 
* 
*/
export function removeRegisterClick(nodeObjs, paper) {
  if (!nodeObjs || !paper) {
    return;
  }

  var curRect, curText, curImg;
  for (var o = 0; o < nodeObjs.length; o++) {
    curRect = paper.getById(nodeObjs[o]);
    if (curRect && curRect.clickCallbackFun) {
      curRect.unclick(curRect.clickCallbackFun);
      curRect.clickCallbackFun = null;
      delete curRect.clickCallbackFun;
      if (curRect.selfText && curRect.selfText.clickTextCallbackFun) {
        curText = curRect.selfText;
        curText.unclick(curText.clickTextCallbackFun);
        curText.clickTextCallbackFun = null;
        delete curText.clickTextCallbackFun;
      }
      if (curRect.selfImg && curRect.selfImg.clickImageCallbackFun) {
        curImg = curRect.selfImg;
        curImg.unclick(curImg.clickImageCallbackFun);
        curImg.clickImageCallbackFun = null;
        delete curImg.clickImageCallbackFun;
      }
    }
  }
};