import request from '@/utils/request'

// 查询库存情况货值分布列表
export function listTeaWarehouseCurrentValue(query) {
  return request({
    url: '/system/teaWarehouseCurrentValue/list',
    method: 'get',
    params: query
  })
}

// 查询库存情况货值分布详细
export function getTeaWarehouseCurrentValue(id) {
  return request({
    url: '/system/teaWarehouseCurrentValue/' + id,
    method: 'get'
  })
}

// 新增库存情况货值分布
export function addTeaWarehouseCurrentValue(data) {
  return request({
    url: '/system/teaWarehouseCurrentValue',
    method: 'post',
    data: data
  })
}

// 修改库存情况货值分布
export function updateTeaWarehouseCurrentValue(data) {
  return request({
    url: '/system/teaWarehouseCurrentValue',
    method: 'put',
    data: data
  })
}

// 删除库存情况货值分布
export function delTeaWarehouseCurrentValue(id) {
  return request({
    url: '/system/teaWarehouseCurrentValue/' + id,
    method: 'delete'
  })
}

// 导出库存情况货值分布
export function exportTeaWarehouseCurrentValue(query) {
  return request({
    url: '/system/teaWarehouseCurrentValue/export',
    method: 'get',
    params: query
  })
}