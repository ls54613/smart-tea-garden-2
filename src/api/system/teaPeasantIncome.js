import request from '@/utils/request'

// 查询种植大户收入列表
export function listTeaPeasantIncome(query) {
  return request({
    url: '/system/teaPeasantIncome/list',
    method: 'get',
    params: query
  })
}

// 查询种植大户收入详细
export function getTeaPeasantIncome(id) {
  return request({
    url: '/system/teaPeasantIncome/' + id,
    method: 'get'
  })
}

// 新增种植大户收入
export function addTeaPeasantIncome(data) {
  return request({
    url: '/system/teaPeasantIncome',
    method: 'post',
    data: data
  })
}

// 修改种植大户收入
export function updateTeaPeasantIncome(data) {
  return request({
    url: '/system/teaPeasantIncome',
    method: 'put',
    data: data
  })
}

// 删除种植大户收入
export function delTeaPeasantIncome(id) {
  return request({
    url: '/system/teaPeasantIncome/' + id,
    method: 'delete'
  })
}

// 导出种植大户收入
export function exportTeaPeasantIncome(query) {
  return request({
    url: '/system/teaPeasantIncome/export',
    method: 'get',
    params: query
  })
}