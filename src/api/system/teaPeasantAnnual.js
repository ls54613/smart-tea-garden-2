import request from '@/utils/request'

// 查询茶农历年年收入列表
export function listTeaPeasantAnnual(query) {
  return request({
    url: '/system/teaPeasantAnnual/list',
    method: 'get',
    params: query
  })
}

// 查询茶农历年年收入详细
export function getTeaPeasantAnnual(id) {
  return request({
    url: '/system/teaPeasantAnnual/' + id,
    method: 'get'
  })
}

// 新增茶农历年年收入
export function addTeaPeasantAnnual(data) {
  return request({
    url: '/system/teaPeasantAnnual',
    method: 'post',
    data: data
  })
}

// 修改茶农历年年收入
export function updateTeaPeasantAnnual(data) {
  return request({
    url: '/system/teaPeasantAnnual',
    method: 'put',
    data: data
  })
}

// 删除茶农历年年收入
export function delTeaPeasantAnnual(id) {
  return request({
    url: '/system/teaPeasantAnnual/' + id,
    method: 'delete'
  })
}

// 导出茶农历年年收入
export function exportTeaPeasantAnnual(query) {
  return request({
    url: '/system/teaPeasantAnnual/export',
    method: 'get',
    params: query
  })
}