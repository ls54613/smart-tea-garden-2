import request from '@/utils/request'

// 查询中国茶叶线上销售规模监测数据列表
export function listTeaMarketScale(query) {
  return request({
    url: '/system/teaMarketScale/list',
    method: 'get',
    params: query
  })
}

// 查询中国茶叶线上销售规模监测数据详细
export function getTeaMarketScale(id) {
  return request({
    url: '/system/teaMarketScale/' + id,
    method: 'get'
  })
}

// 新增中国茶叶线上销售规模监测数据
export function addTeaMarketScale(data) {
  return request({
    url: '/system/teaMarketScale',
    method: 'post',
    data: data
  })
}

// 修改中国茶叶线上销售规模监测数据
export function updateTeaMarketScale(data) {
  return request({
    url: '/system/teaMarketScale',
    method: 'put',
    data: data
  })
}

// 删除中国茶叶线上销售规模监测数据
export function delTeaMarketScale(id) {
  return request({
    url: '/system/teaMarketScale/' + id,
    method: 'delete'
  })
}

// 导出中国茶叶线上销售规模监测数据
export function exportTeaMarketScale(query) {
  return request({
    url: '/system/teaMarketScale/export',
    method: 'get',
    params: query
  })
}