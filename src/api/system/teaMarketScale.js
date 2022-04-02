import request from '@/utils/request'

// 查询2021年各品种产量占比情况列表
export function listTeaMarketScale(query) {
  return request({
    url: '/system/teaMarketScale/list',
    method: 'get',
    params: query
  })
}

// 查询2021年各品种产量占比情况详细
export function getTeaMarketScale(id) {
  return request({
    url: '/system/teaMarketScale/' + id,
    method: 'get'
  })
}

// 新增2021年各品种产量占比情况
export function addTeaMarketScale(data) {
  return request({
    url: '/system/teaMarketScale',
    method: 'post',
    data: data
  })
}

// 修改2021年各品种产量占比情况
export function updateTeaMarketScale(data) {
  return request({
    url: '/system/teaMarketScale',
    method: 'put',
    data: data
  })
}

// 删除2021年各品种产量占比情况
export function delTeaMarketScale(id) {
  return request({
    url: '/system/teaMarketScale/' + id,
    method: 'delete'
  })
}

// 导出2021年各品种产量占比情况
export function exportTeaMarketScale(query) {
  return request({
    url: '/system/teaMarketScale/export',
    method: 'get',
    params: query
  })
}