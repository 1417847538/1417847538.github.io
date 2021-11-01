!(function () {
  var box = $("#box");
  model1 = {
    lvtxt: _content.lv_txt, //等级对应的文字
    render(mapRow, number) {
      var MapNumber =
        _config.model1.mapRow[number] || _.last(_config.model1.mapRow); //块数大小
      this.grade = 12 * Math.max(10 - MapNumber, 1);
      this.grade = number > 20 ? 10 : this.grade;
      this.grade = number > 35 ? 8 : this.grade;
      this.grade = number > 50 ? 5 : this.grade;
      var targetNumber = Math.floor(Math.random() * mapRow * mapRow), //目标所在块数
        others = this.getColor(255), //其他颜色
        target = this.getLvColor(others[0]); //目标颜色
      box.find("span").css("background-color", others[1]);
      box
        .find("span")
        .eq(targetNumber)
        .css("background-color", target[1])
        .data("type", "target");
    },
    // 获取其他颜色
    getColor(a) {
      // 获得rgb三元素各数值
      var rgb = [
          Math.round(Math.random() * a),
          Math.round(Math.random() * a),
          Math.round(Math.random() * a),
        ],
        // 获得rgb三元素文本
        rgbText = "rgb(" + rgb.join(",") + ")";
      return [rgb, rgbText];
    },
    // 获取目标颜色
    getLvColor(othersRgb) {
      var change = this.grade, //颜色的变化
        // 遍历数组，每个元素执行return后的公式
        targetRgb = _.map(othersRgb, function (othersRgb) {
          return othersRgb + change + 8;
        }),
        //  获得targetRgb三元素文本
        targetRgbText = "rgb(" + targetRgb.join(",") + ")";
      return [targetRgb, targetRgbText];
    },
    // 游戏结束对应的等级文本显示
    getGameOverText(lv) {
      var gradeNumber = lv > 20 ? Math.ceil((lv - 10) / 10) : 0; //对应的等级文字序号
      var gradeText = this.lvtxt[gradeNumber] + "  Lv" + lv;
      return {
        text: gradeText,
      };
    },
  };
  API.model1 = model1;
})();
