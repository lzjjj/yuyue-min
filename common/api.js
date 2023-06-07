const globalUrl = "https://www.asmas.club/"
let requestUrl = {
  'areaList': globalUrl + 'province/',//获取城市以及区域接口
  'login': globalUrl + 'usr/welogin/',//登录接口
  'userDetail': globalUrl + 'usr/detail/',//获取用户信息接口
  'detailUpdate': globalUrl + 'usr/update/',//用户信息修改接口
  'dtoolsList': globalUrl + 'dtools/',//工具列表接口
  'toolDetail': globalUrl + 'dtools/',//工具详情接口
  'dtoolsType': globalUrl + 'dtoolsType/',//工具分类列表
  'getClientuser': globalUrl + 'clientuser/',//获取用户列表
  'getRecords': globalUrl + 'userdate/',//获取记录列表
  'dateTool': globalUrl + 'opr/add/',//预约工具
  'cancelDate': globalUrl + 'opr/del/',//取消预约工具
  'getComments': globalUrl + 'comment/',//获取评论列表
  'addComment': globalUrl + 'opr/comment/',//添加评论列表
  'setUserInfo': globalUrl + 'usr/we_update/',//将微信信息存入书库
  'updateDateInfo': globalUrl + 'opr/update/',//预约工具
}
export default requestUrl