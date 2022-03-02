import request from '@/utils/request'

// 查询茶农基本信息列表
export function listTeaPeasantInfo(query) {
  return request({
    url: '/system/teaPeasantInfo/list',
    method: 'get',
    params: query
  })
}

// 查询茶农基本信息详细
export function getTeaPeasantInfo(id) {
  return request({
    url: '/system/teaPeasantInfo/' + id,
    method: 'get'
  })
}

// 新增茶农基本信息
export function addTeaPeasantInfo(data) {
  return request({
    url: '/system/teaPeasantInfo',
    method: 'post',
    data: data
  })
}

// 修改茶农基本信息
export function updateTeaPeasantInfo(data) {
  return request({
    url: '/system/teaPeasantInfo',
    method: 'put',
    data: data
  })
}

// 删除茶农基本信息
export function delTeaPeasantInfo(id) {
  return request({
    url: '/system/teaPeasantInfo/' + id,
    method: 'delete'
  })
}

// 导出茶农基本信息
export function exportTeaPeasantInfo(query) {
  return request({
    url: '/system/teaPeasantInfo/export',
    method: 'get',
    params: query
  })
}