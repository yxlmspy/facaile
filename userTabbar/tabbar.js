//初始化数据
function tabbarinit() {
  return [
    // {
    //   "current": 0,
    //   "pagePath": "../../../user/pages/hr/hr",
    //   "iconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/user/icon_user/bottom1.png",
    //   "selectedIconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/user/icon_user/bottom1h.png",
    //   "text": "首页"
    // },
    {
      "current": 0,
      "pagePath": "../../../user/pages/hr/hr",
      "selectedIconPath": "../../../hr/images/top1_active.png",
      "iconPath": "../../../hr/images/top1.png",
      "text": "职位"
    },
    {
      "current": 0,
      "pagePath": "../../../user/pages/my/my",
      "iconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/user/icon_user/bottom3.png",
      "selectedIconPath": "https://www.shimida777.com/uploadFiles/uploadImgs/user/icon_user/bottom3h.png",
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