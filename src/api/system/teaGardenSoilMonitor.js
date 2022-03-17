import request from '@/utils/request'

// 查询茶园土壤监测列表
export function listTeaGardenSoilMonitor(query) {
  return request({
    url: '/system/teaGardenSoilMonitor/list',
    method: 'get',
    params: query
  })
}

// 查询茶园土壤监测详细
export function getTeaGardenSoilMonitor(id) {
  return request({
    url: '/system/teaGardenSoilMonitor/' + id,
    method: 'get'
  })
}

// 新增茶园土壤监测
export function addTeaGardenSoilMonitor(data) {
  return request({
    url: '/system/teaGardenSoilMonitor',
    method: 'post',
    data: data
  })
}

// 修改茶园土壤监测
export function updateTeaGardenSoilMonitor(data) {
  return request({
    url: '/system/teaGardenSoilMonitor',
    method: 'put',
    data: data
  })
}

// 删除茶园土壤监测
export function delTeaGardenSoilMonitor(id) {
  return request({
    url: '/system/teaGardenSoilMonitor/' + id,
    method: 'delete'
  })
}

// 导出茶园土壤监测
export function exportTeaGardenSoilMonitor(query) {
  return request({
    url: '/system/teaGardenSoilMonitor/export',
    method: 'get',
    params: query
  })
}