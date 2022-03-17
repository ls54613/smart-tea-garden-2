import request from '@/utils/request'

// 查询茶仓基本情况列表
export function listTeaWarehouseEssential(query) {
  return request({
    url: '/system/TeaWarehouseEssential/list',
    method: 'get',
    params: query
  })
}

// 查询全部茶仓基本信息列表
export function findAllTeaWarehouse(query) {
  return request({
    url: '/system/TeaWarehouseEssential/findAllTeaWarehouse',
    method: 'get',
    params: query
  })
}

// 查询茶仓基本情况详细
export function getTeaWarehouseEssential(id) {
  return request({
    url: '/system/TeaWarehouseEssential/' + id,
    method: 'get'
  })
}

// 新增茶仓基本情况
export function addTeaWarehouseEssential(data) {
  return request({
    url: '/system/TeaWarehouseEssential',
    method: 'post',
    data: data
  })
}

// 修改茶仓基本情况
export function updateTeaWarehouseEssential(data) {
  return request({
    url: '/system/TeaWarehouseEssential',
    method: 'put',
    data: data
  })
}

// 删除茶仓基本情况
export function delTeaWarehouseEssential(id) {
  return request({
    url: '/system/TeaWarehouseEssential/' + id,
    method: 'delete'
  })
}

// 导出茶仓基本情况
export function exportTeaWarehouseEssential(query) {
  return request({
    url: '/system/TeaWarehouseEssential/export',
    method: 'get',
    params: query
  })
}
