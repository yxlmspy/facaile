//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "../../../hr/pages/hr/hr",
      "iconPath": "../../../hr/images/top1.png",
      "selectedIconPath": "../../../hr/images/top1_active.png",
      "text": "首页"
    },
    // {
    //   "current": 0,
    //   "pagePath": "../../../hr/pages/share/share",
    //   "iconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/hr/hr/bottom-3.png",
    //   "selectedIconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/hr/hr/bottom-3.png",
    //   "text": "分享"
    // },
    {
      "current": 0,
      "pagePath": "../../../hr/pages/my/my",
      "iconPath": "http://www.shimida777.com/uploadFiles/uploadImgs/hr/hr/bottom-3.png",
      "selectedIconPath": "http://www.shimida777.com/uploadFiles/uploadImgs/hr/hr/bottom-3-h.png",
      "text": "我的"
    }
  ]
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}