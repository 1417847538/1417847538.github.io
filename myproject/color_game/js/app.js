!(function () {
  var loading = $("#loading"),
    room = $("#room"),
    index = $("#index"),
    dialog = $("#dialog"),
    play = $(".btn_play");

  app = {
    init() {
      this.initEvent();
      this.loading();
    },
    //  页面加载效果
    loading() {
      function loadingTime() {
        loading_time++;
        loading_time === 10 && app.render();
      }
      app.render();
    },
    // loading页面到index页面的切换
    render() {
      setTimeout(function () {
        loading.hide();
        index.show();
      }, 1000);
    },
    initEvent() {
      myAPP = this;
      play.on("click", function (e) {
        if (e.target.innerHTML === "普通模式") {
          index.hide();
          window.Game.init("model1", room, myAPP);
        } else if (e.target.innerHTML === "双色模式") {
          index.hide();
          window.Game.init("model2", room, myAPP);
        }
      });
    },
  };
  app.init();
  window.API = {};
})();
