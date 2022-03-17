import request from '@/utils/request'

// 查询茶农家庭成员列表
export function listTeaPeasantFamily(query) {
  return request({
    url: '/system/teaPeasantFamily/list',
    method: 'get',
    params: query
  })
}

// 查询茶农家庭成员详细
export function getTeaPeasantFamily(id) {
  return request({
    url: '/system/teaPeasantFamily/' + id,
    method: 'get'
  })
}

// 新增茶农家庭成员
export function addTeaPeasantFamily(data) {
  return request({
    url: '/system/teaPeasantFamily',
    method: 'post',
    data: data
  })
}

// 修改茶农家庭成员
export function updateTeaPeasantFamily(data) {
  return request({
    url: '/system/teaPeasantFamily',
    method: 'put',
    data: data
  })
}

// 删除茶农家庭成员
export function delTeaPeasantFamily(id) {
  return request({
    url: '/system/teaPeasantFamily/' + id,
    method: 'delete'
  })
}

// 导出茶农家庭成员
export function exportTeaPeasantFamily(query) {
  return request({
    url: '/system/teaPeasantFamily/export',
    method: 'get',
    params: query
  })
}