//这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request';
import * as url from 'url';

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
});

//处理添加修改品牌
export const reqAddOrUpdateTradeMark = data => {
  if (data.id) {
    return request({
      //带给服务器数据携带ID--修改
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data
    });
  } else {
    //新增品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data
    });
  }
};

//删除品牌的接口
export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  });
};

