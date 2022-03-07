import request from '@/utils/request'

// 查询近半年采购情况列表
export function listTeaEnterpriseProcurement(query) {
  return request({
    url: '/system/teaEnterpriseProcurement/list',
    method: 'get',
    params: query
  })
}

// 查询近半年采购情况详细
export function getTeaEnterpriseProcurement(id) {
  return request({
    url: '/system/teaEnterpriseProcurement/' + id,
    method: 'get'
  })
}

// 新增近半年采购情况
export function addTeaEnterpriseProcurement(data) {
  return request({
    url: '/system/teaEnterpriseProcurement',
    method: 'post',
    data: data
  })
}

// 修改近半年采购情况
export function updateTeaEnterpriseProcurement(data) {
  return request({
    url: '/system/teaEnterpriseProcurement',
    method: 'put',
    data: data
  })
}

// 删除近半年采购情况
export function delTeaEnterpriseProcurement(id) {
  return request({
    url: '/system/teaEnterpriseProcurement/' + id,
    method: 'delete'
  })
}

// 导出近半年采购情况
export function exportTeaEnterpriseProcurement(query) {
  return request({
    url: '/system/teaEnterpriseProcurement/export',
    method: 'get',
    params: query
  })
}