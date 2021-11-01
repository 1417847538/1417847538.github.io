var _config = {
    //游戏时间和大小配置
    model1: {
      allTime: 60,
      addTime: 1,
      mapRow: [2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10],
    },
    model2: {
      allTime: 60,
      addTime: 0,
      mapRow: [4, 4, 6, 6, 6, 6, 6, 6, 8],
    },
  },
  _content = {
    // 游戏相关内容
    title: "你是色盲吗？",
    help_txt: "找出所有色块里颜色不同的一个",
    score: "得分:",
    btn_pause: "暂停",
    btn_normal: "普通场",
    btn_double: "双色场",
    btn_normal_mode: "普通模式",
    btn_double_mode: "双色模式",
    btn_reTry: "重来",
    game_pause: "游戏暂停",
    btn_resume: "继续",
    loading: "加载中...",
    lv_txt: [
      "瞎子",
      "色盲",
      "色狼",
      "色鬼",
      "色魔",
      "变态色魔",
      "孤独求色",
      "老色批",
      "色批头子",
    ],
    lv_txt2: [
      "色不起来",
      "有色心没色胆",
      "好色之徒",
      "色胆包天",
      "色不知耻",
      "英雄本色",
      "色射具全",
      "裸色舔香",
      "衣冠禽色",
    ],
  };

!(function () {
  var box = $("#box"),
    room = $("#room"),
    index = $("#index"),
    dialog = $("#dialog"), //暂停和游戏结束对话框
    params = {
      grade: $("#room .grade i"), //分数
      timeText: $("#room .head .time"), //倒计时
      pause: $("#room .btn_pause"), //暂停按钮
      resume: $("#dialog .resume"), //继续按钮
      toIndex: $("#dialog .indexPage"), //回到主页面按钮
      restart: $("#dialog .restart"), //重新开始按钮
      indexPage: $("#dialog indexPage"), //主页面按钮
      d_pause: $("#dialog .pause"), //暂停对话框
      d_gameOver: $("#dialog .gameOver"), //游戏结束对话框
    },
    game = {
      target: 1, //颜色不同块数
      finded: 0,
      score: 0,
      //初始化
      init(type, el, parent) {
        this.type = type;
        this.target = "model1" == type ? 1 : 2;
        this.api = API[type];
        this.config = _config[type];
        this.el = el;
        this.parent = parent;
        this.reset();
        this.renderUI();
        this.initEvent();
        this.start();
      },
      //设置游戏时间和初始化等级
      reset() {
        this.time = this.config.allTime;
        params.timeText.text(this.time);
        this.lv = -1;
      },
      //加载UI游戏界面并做到移动端与pc端适配
      renderUI() {
        var width = window.innerWidth;
        width -= 20;
        width = Math.min(width, 500);
        box.width(width).height(width);
        this.el.show();
      },
      // 初始化绑定事件
      initEvent() {
        var myGame = this;
        // 窗口变化重新加载UI游戏界面
        // $(window).resize(function () {
          myGame.renderUI();
        // });
        box.on("click", "span", function () {
          var type = $(this).data("type");
          console.log(type);
          if (type === "target") {
            $(this).data("type", "");
            myGame.finded++;
            if (myGame.finded === myGame.target) {
              myGame.nextLv.call(myGame);
            }
          }
        });
        params.pause.on("click", function () {
          myGame._pause = true;
          room.hide(); //隐藏主界面游戏UI界面
          params.d_gameOver.hide();
          params.d_pause.show(); //显示暂停对话框
          dialog.show(); //显示dialog全部对话框
        });
        params.resume.on("click", function () {
          dialog.hide(); //隐藏dialog全部对话框
          room.show();
          myGame._pause = false;
        });
        // 重新开始按钮绑定点击事件
        params.restart.on("click", function () {
          myGame.score = 0;
          params.timeText.html(0);
         room.show();
          myGame.reset();
          myGame.start();
        });
        params.toIndex.on("click", function () {
          myGame.score = 0;
          dialog.hide();
          index.show();
        });
      },
      // 找到目标颜色后下一等级
      nextLv() {
        this.time += this.config.addTime;
        params.timeText.text(this.time);
        if (!this._pause) this.start();
      },
      // 游戏新的开始
      start() {
        this.time > 5 && params.timeText.removeClass("danger");
        this.finded = 0;
        dialog.hide();
        this._pause = false;
        this.lv = typeof this.lv != "undefined" ? this.lv + 1 : 0;
        this.mapRow = this.config.mapRow[this.lv] || _.last(this.config.mapRow); //每行的块数
        this.renderMap();
        this.renderInfo();
        this.timer ||
          (this.timer = setInterval(function () {
              console.log(this.Game);
            if (this.Game._pause) {
              return ;
            } else {
              this.Game.time--;
              this.Game.time < 6 && params.timeText.addClass("danger");
              if (this.Game.time < 0) {
                this.Game.gameOver();
              } else {
                params.timeText.text(this.Game.time);
              }
            }
          }, 1000));
      },
      // 添加box中的每块
      renderMap() {
        if (!this._pause) {
          var n = this.mapRow * this.mapRow, //总块数
            c = "",
            d = "lv" + this.mapRow;
          _.times(n, function () {
            c += "<span></span>";
          });
          box.attr("class", d).html(c);
          this.api.render(this.mapRow, this.lv);
        } //调用model1中的render函数
      },
      // 添加分数等级
      renderInfo() {
        this.score += this.type == "model1" ? 1 : 2;
        params.grade.html(this.score);
      },
      // 游戏结束对应操作
      gameOver() {
        var grade = this.api.getGameOverText(this.score);
        this.endScore = this.score;
        this.endScoreText = grade.text;
        params.d_gameOver.show().find("h3").html(this.endScoreText);

        box.find("span").fadeOut(1200,function () {
            room.hide()
          dialog.show();
          params.d_pause.hide()
        });
        this._pause = true;
      },
    };
  window.Game = game;
})();
