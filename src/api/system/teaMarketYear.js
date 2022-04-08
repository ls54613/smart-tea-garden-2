import request from '@/utils/request'

// 查询茶市基本情况表列表
export function listTeaMarketYear(query) {
  return request({
    url: '/system/teaMarketYear/list',
    method: 'get',
    params: query
  })
}

// 查询茶市基本情况表详细
export function getTeaMarketYear(id) {
  return request({
    url: '/system/teaMarketYear/' + id,
    method: 'get'
  })
}

// 新增茶市基本情况表
export function addTeaMarketYear(data) {
  return request({
    url: '/system/teaMarketYear',
    method: 'post',
    data: data
  })
}

// 修改茶市基本情况表
export function updateTeaMarketYear(data) {
  return request({
    url: '/system/teaMarketYear',
    method: 'put',
    data: data
  })
}

// 删除茶市基本情况表
export function delTeaMarketYear(id) {
  return request({
    url: '/system/teaMarketYear/' + id,
    method: 'delete'
  })
}

// 导出茶市基本情况表
export function exportTeaMarketYear(query) {
  return request({
    url: '/system/teaMarketYear/export',
    method: 'get',
    params: query
  })
}