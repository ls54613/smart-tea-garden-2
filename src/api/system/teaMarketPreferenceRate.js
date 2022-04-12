import request from '@/utils/request'

// 查询中国茶叶线上销售品类数据监测列表
export function listTeaMarketPreferenceRate(query) {
  return request({
    url: '/system/teaMarketPreferenceRate/list',
    method: 'get',
    params: query
  })
}

// 查询中国茶叶线上销售品类数据监测详细
export function getTeaMarketPreferenceRate(id) {
  return request({
    url: '/system/teaMarketPreferenceRate/' + id,
    method: 'get'
  })
}

// 新增中国茶叶线上销售品类数据监测
export function addTeaMarketPreferenceRate(data) {
  return request({
    url: '/system/teaMarketPreferenceRate',
    method: 'post',
    data: data
  })
}

// 修改中国茶叶线上销售品类数据监测
export function updateTeaMarketPreferenceRate(data) {
  return request({
    url: '/system/teaMarketPreferenceRate',
    method: 'put',
    data: data
  })
}

// 删除中国茶叶线上销售品类数据监测
export function delTeaMarketPreferenceRate(id) {
  return request({
    url: '/system/teaMarketPreferenceRate/' + id,
    method: 'delete'
  })
}

// 导出中国茶叶线上销售品类数据监测
export function exportTeaMarketPreferenceRate(query) {
  return request({
    url: '/system/teaMarketPreferenceRate/export',
    method: 'get',
    params: query
  })
}