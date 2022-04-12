import request from '@/utils/request'

// 查询2021年各品种产量占比情况列表
export function listTeaMarketProportion(query) {
  return request({
    url: '/system/teaMarketProportion/list',
    method: 'get',
    params: query
  })
}

// 查询2021年各品种产量占比情况详细
export function getTeaMarketProportion(id) {
  return request({
    url: '/system/teaMarketProportion/' + id,
    method: 'get'
  })
}

// 新增2021年各品种产量占比情况
export function addTeaMarketProportion(data) {
  return request({
    url: '/system/teaMarketProportion',
    method: 'post',
    data: data
  })
}

// 修改2021年各品种产量占比情况
export function updateTeaMarketProportion(data) {
  return request({
    url: '/system/teaMarketProportion',
    method: 'put',
    data: data
  })
}

// 删除2021年各品种产量占比情况
export function delTeaMarketProportion(id) {
  return request({
    url: '/system/teaMarketProportion/' + id,
    method: 'delete'
  })
}

// 导出2021年各品种产量占比情况
export function exportTeaMarketProportion(query) {
  return request({
    url: '/system/teaMarketProportion/export',
    method: 'get',
    params: query
  })
}