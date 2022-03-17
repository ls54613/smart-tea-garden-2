import request from '@/utils/request'

// 查询茶农资产状况列表
export function listTeaPeasantAsset(query) {
  return request({
    url: '/system/teaPeasantAsset/list',
    method: 'get',
    params: query
  })
}

// 查询茶农资产状况详细
export function getTeaPeasantAsset(id) {
  return request({
    url: '/system/teaPeasantAsset/' + id,
    method: 'get'
  })
}

// 新增茶农资产状况
export function addTeaPeasantAsset(data) {
  return request({
    url: '/system/teaPeasantAsset',
    method: 'post',
    data: data
  })
}

// 修改茶农资产状况
export function updateTeaPeasantAsset(data) {
  return request({
    url: '/system/teaPeasantAsset',
    method: 'put',
    data: data
  })
}

// 删除茶农资产状况
export function delTeaPeasantAsset(id) {
  return request({
    url: '/system/teaPeasantAsset/' + id,
    method: 'delete'
  })
}

// 导出茶农资产状况
export function exportTeaPeasantAsset(query) {
  return request({
    url: '/system/teaPeasantAsset/export',
    method: 'get',
    params: query
  })
}