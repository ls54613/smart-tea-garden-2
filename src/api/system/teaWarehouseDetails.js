import request from '@/utils/request'

// 查询茶仓详情列表
export function listTeaWarehouseDetails(query) {
  return request({
    url: '/system/teaWarehouseDetails/list',
    method: 'get',
    params: query
  })
}

// 查询茶仓详情详细
export function getTeaWarehouseDetails(id) {
  return request({
    url: '/system/teaWarehouseDetails/' + id,
    method: 'get'
  })
}

// 新增茶仓详情
export function addTeaWarehouseDetails(data) {
  return request({
    url: '/system/teaWarehouseDetails',
    method: 'post',
    data: data
  })
}

// 修改茶仓详情
export function updateTeaWarehouseDetails(data) {
  return request({
    url: '/system/teaWarehouseDetails',
    method: 'put',
    data: data
  })
}

// 删除茶仓详情
export function delTeaWarehouseDetails(id) {
  return request({
    url: '/system/teaWarehouseDetails/' + id,
    method: 'delete'
  })
}

// 导出茶仓详情
export function exportTeaWarehouseDetails(query) {
  return request({
    url: '/system/teaWarehouseDetails/export',
    method: 'get',
    params: query
  })
}