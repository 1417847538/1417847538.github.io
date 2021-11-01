$(function () {
  var arr = [];

  var obj = {
    Row: 4,
    Col: 4,
    r: 0,
    c: 0,
    f: 0,
    keyCd: 0,
    Score: 0,
    createEl: 0, //是否需要创建元素
    eleFragment: "",
    // 游戏开始
    gameStart: function () {
      obj.init();
      document.onkeydown = function (e) {
        if (e.keyCode === 37) {
          obj.keyCd = 1;
          obj.moveLeft();
        } else if (e.keyCode === 38) {
          obj.keyCd = 2;
          obj.moveUp();
        } else if (e.keyCode === 39) {
          obj.keyCd = 1;
          obj.moveRight();
        } else if (e.keyCode === 40) {
          obj.keyCd = 2;
          obj.moveDown();
        }
        $(".score").html(obj.Score);
      };
      obj.touch();
    },
    // 初始化
    init: function () {
      obj.eleFragment = document.createDocumentFragment();
      for (let r = 0; r < obj.Row; r++) {
        arr.push([]);
        for (let c = 0; c < obj.Col; c++) {
          arr[r][c] = 0;
          if (obj.createEl === 1) {
            obj.create(r, c);
          }
        }
      }
      if (obj.createEl === 1) {
        obj.createEl = 0;
        $(".gridPanel").html("");
        $(".gridPanel").append(obj.eleFragment);
      }
      obj.Score = 0;
      $(".score").html(obj.Score);
      $("#gameOver").css({ display: "none" });
      obj.random();
      obj.random();
      obj.updateView();
    },
    // 创建Div元素，添加到gridPanel中
    create(r, c) {
      let grid, cell;
      let increment,
        grWidth,
        grHeight,
        grMarginTop,
        grMarginLeft,
        ceWidth,
        ceHeight;
      grid = document.createElement("div");
      cell = document.createElement("div");
      grid.id = "g" + r + c;
      grid.className = "grid";
      cell.id = "c" + r + c;
      cell.className = "cell";

      if (obj.Row === 3) {
        increment = 0.417;
      } else if (obj.Row === 4) {
        increment = 0.3125;
      } else if (obj.Row === 5) {
        increment = 0.265;
      } else if (obj.Row === 6) {
        increment = 0.1;
      }
      grWidth = grHeight = ceWidth = ceHeight = 1 + (6 - obj.Row) * increment;
      grMarginTop = grMarginLeft = (7.5 - grWidth * obj.Row) / (obj.Row + 1);
      grid.style.width = grWidth + "rem";
      grid.style.height = grHeight + "rem";
      grid.style.marginTop = grMarginTop + "rem";
      grid.style.marginLeft = grMarginLeft + "rem";
      cell.style.width = ceWidth + "rem";
      cell.style.height = ceHeight + "rem";
      cell.style.top = grMarginTop + r * (grMarginTop + ceWidth) + "rem";
      cell.style.left = grMarginLeft + c * (grMarginLeft + ceHeight) + "rem";
      cell.style.lineHeight = ceHeight + "rem";
      cell.style.fontSize = 0.5 + (6 - obj.Row) * 0.2 + "rem";
      obj.eleFragment.appendChild(grid);
      obj.eleFragment.appendChild(cell);
    },
    // 随机生成2,4
    random: function () {
      while (1) {
        let row = Math.floor(Math.random() * obj.Row);
        let col = Math.floor(Math.random() * obj.Col);
        if (arr[row][col] === 0) {
          arr[row][col] = Math.random() > 0.5 ? 4 : 2;
          break;
        }
      }
    },
    // 更新页面
    updateView: function () {
      let win = 0;
      obj.Score = 0;
      for (let r = 0; r < obj.Row; r++) {
        for (let c = 0; c < obj.Col; c++) {
          obj.Score += arr[r][c];
          if (arr[r][c] === 0) {
            $("#c" + r + c).html("");
            document.getElementById("c" + r + c).className = "cell";
          } else {
            $("#c" + r + c).html(arr[r][c]);
            document.getElementById("c" + r + c).className =
              "cell n" + arr[r][c];
            if (obj.Row === 3 && arr[r][c] === 1024) {
              win = 1;
            } else if (obj.ROW == 4 && arr[r][c] == 2048) {
              win = 1;
            } else if (obj.ROW == 5 && arr[r][c] == 4096) {
              win = 1;
            } else if (obj.ROW == 6 && arr[r][c] == 8192) {
              win = 1;
            }
          }
        }
      }
      if (win === 1) {
        $(".win_lose").html("你通关了！");
        $("#Score").html("你的分数是：" + obj.Score);
        $("#gameOVer").css({ display: "block" });
      }
      if (obj.isGameOver()) {
        $(".win_lose").html("你死了！");
        $("#Score").html("你的分数是：" + obj.Score);
        $("#gameOver").css({ display: "block" });
      }
    },
    // ****判断失败条件
    isGameOver: function () {
      for (let r = 0; r < obj.Row; r++) {
        for (let c = 0; c < obj.Col; c++) {
          if (arr[r][c] === 0) {
            return false;
          } else if (c !== obj.Col - 1 && arr[r][c] === arr[r][c + 1]) {
            return false;
          } else if (r !== obj.Row - 1 && arr[r][c] === arr[r + 1][c]) {
            return false;
          }
        }
      }
      return true;
    },
    // 查找下一个不为0的位置
    find: function (r, c, start, condition, direction) {
      if (obj.keyCd === 2) {
        //上下键
        if (direction === 1) {
          // 上按键
          for (let f = start; f < condition; f += direction) {
            if (arr[f][c] !== 0) {
              return f;
            }
          }
        } else if (direction === -1) {
          for (let f = start; f >= condition; f += direction) {
            if (arr[f][c] !== 0) {
              return f;
            }
          }
        }
      } else if (obj.keyCd === 1) {
        // 左右键
        if (direction === 1) {
          //左按键
          for (let f = start; f < condition; f += direction) {
            if (arr[r][f] !== 0) {
              return f;
            }
          }
        } else if (direction === -1) {
          for (let f = start; f >= condition; f += direction) {
            if (arr[r][f] !== 0) {
              return f;
            }
          }
        }
      }
      return null;
    },
    move: function (itertor) {
      let before, after;
      before = arr.toString();
      itertor(); //进行一次操作
      after = arr.toString();
      if (before !== after) {
        obj.random();
        obj.updateView();
      }
    },
    // 左移动处理
    dealToLeft: function (r) {
      let next;
      for (let c = 0; c < obj.Col; c++) {
        //遍历每一列
        next = obj.find(r, c, c + 1, obj.Col, 1); //找到不为0的位置
        if (next === null) {
          break;
        }
        if (arr[r][c] === 0) {
          arr[r][c] = arr[r][next]; //替换
          arr[r][next] = 0;
          c--;
        } else if (arr[r][c] === arr[r][next]) {
          arr[r][c] *= 2;
          arr[r][next] = 0;
        }
      }
    },
    // 左移动
    moveLeft: function () {
      obj.move(function () {
        for (let r = 0; r < obj.Row; r++) {
          obj.dealToLeft(r);
        }
      });
    },
    // 右移动处理
    dealToRight: function (r) {
      let next;
      for (let c = obj.Col - 1; c >= 0; c--) {
        next = obj.find(r, c, c - 1, 0, -1);
        if (next === null) {
          break;
        }
        if (arr[r][c] === 0) {
          arr[r][c] = arr[r][next];
          arr[r][next] = 0;
          c++;
        } else if (arr[r][c] === arr[r][next]) {
          arr[r][c] *= 2;
          arr[r][next] = 0;
        }
      }
    },
    moveRight: function () {
      obj.move(function () {
        for (let r = 0; r < obj.Row; r++) {
          obj.dealToRight(r);
        }
      });
    },
    dealToTop: function (c) {
      let next;
      for (let r = 0; r < obj.Row; r++) {
        next = obj.find(r, c, r + 1, obj.Row, 1);
        if (next === null) {
          break;
        }
        if (arr[r][c] === 0) {
          arr[r][c] = arr[next][c];
          arr[next][c] = 0;
          r--;
        } else if (arr[r][c] === arr[next][c]) {
          arr[r][c] *= 2;
          arr[next][c] = 0;
        }
      }
    },
    moveUp: function () {
      obj.move(function () {
        for (let c = 0; c < obj.Col; c++) {
          obj.dealToTop(c);
        }
      });
    },
    dealToBottom: function (c) {
      let next;
      for (let r = obj.Row - 1; r >= 0; r--) {
        next = obj.find(r, c, r - 1, 0, -1);
        if (next === null) {
          break;
        }
        if (arr[r][c] === 0) {
          arr[r][c] = arr[next][c];
          arr[next][c] = 0;
          r++;
        } else if (arr[r][c] === arr[next][c]) {
          arr[r][c] *= 2;
          arr[next][c] = 0;
        }
      }
    },
    moveDown: function () {
      obj.move(function () {
        for (let c = 0; c < obj.Col; c++) {
          obj.dealToBottom(c);
        }
      });
    },

    // 移动端移动
    touch: function () {
      let gridPanel = document.getElementsByClassName("gridPanel")[0];
      gridPanel.addEventListener(
        "touchstart",
        function (e) {
          startX = e.changedTouches[0].pageX;
          startY = e.changedTouches[0].pageY;
        },
        false
      );

      gridPanel.addEventListener("touchend", function (e) {
        e.preventDefault();
        endX = e.changedTouches[0].pageX;
        endY = e.changedTouches[0].pageY;
        distanceX = endX - startX;
        distanceY = endY - startY;
        if (Math.abs(distanceX) / Math.abs(distanceY) > 1.73 && distanceX > 0) {
          obj.keyCd = 1;
          obj.moveRight();
          $(".score").html(obj.Score);
        } else if (
          Math.abs(distanceX) / Math.abs(distanceY) > 1.73 &&
          distanceX < 0
        ) {
          obj.keyCd = 1;
          obj.moveLeft();
          $(".score").html(obj.Score);
        } else if (
          Math.abs(distanceY) / Math.abs(distanceX) > 1.73 &&
          distanceY < 0
        ) {
          obj.keyCd = 2;
          obj.moveUp();
          $(".score").html(obj.Score);
        } else if (
          Math.abs(distanceY) / Math.abs(distanceX) > 1.73 &&
          distanceY > 0
        ) {
          obj.keyCd = 2;
          obj.moveDown();
          $(".score").html(obj.Score);
        }
      });
    },
  };
  // 开始游戏
 
    obj.createEl = 1;
    obj.gameStart();
  
  // 切换模式
  $(".Model").on("click", function getModel(e) {
    let a = e.target,
      modelValue = 4;
    if (a.nodeName === "A") {
      if (a.innerHTML == "3X3") {
        modelValue = 3;
      } else if (a.innerHTML == "4X4") {
        modelValue = 4;
      } else if (a.innerHTML == "5X5") {
        modelValue = 5;
      } else if (a.innerHTML == "6X6") {
        modelValue = 6;
      }
    }
    obj.Row = obj.Col = modelValue;
    obj.createEl = 1;
    obj.init();
  });

  $("#again").on("click", function () {
    obj.createEl = 1;
    obj.gameStart();
  });
});
