import request from '@/utils/request'

// 查询茶园种植种类占比列表
export function listTeaGardenTeaType(query) {
  return request({
    url: '/system/teaGardenTeaType/list',
    method: 'get',
    params: query
  })
}

// 查询茶园种植种类占比详细
export function getTeaGardenTeaType(id) {
  return request({
    url: '/system/teaGardenTeaType/' + id,
    method: 'get'
  })
}

// 新增茶园种植种类占比
export function addTeaGardenTeaType(data) {
  return request({
    url: '/system/teaGardenTeaType',
    method: 'post',
    data: data
  })
}

// 修改茶园种植种类占比
export function updateTeaGardenTeaType(data) {
  return request({
    url: '/system/teaGardenTeaType',
    method: 'put',
    data: data
  })
}

// 删除茶园种植种类占比
export function delTeaGardenTeaType(id) {
  return request({
    url: '/system/teaGardenTeaType/' + id,
    method: 'delete'
  })
}

// 导出茶园种植种类占比
export function exportTeaGardenTeaType(query) {
  return request({
    url: '/system/teaGardenTeaType/export',
    method: 'get',
    params: query
  })
}