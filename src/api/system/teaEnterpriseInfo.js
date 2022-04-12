import request from '@/utils/request'

// 查询茶企基本信息列表
export function listTeaEnterpriseInfo(query) {
  return request({
    url: '/system/teaEnterpriseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询全部茶企基本信息列表
export function listTeaEnterpriseInfoAll(query) {
  return request({
    url: '/system/teaEnterpriseInfo/findAll',
    method: 'get',
    params: query
  })
}

// 查询茶企基本信息详细
export function getTeaEnterpriseInfo(id) {
  return request({
    url: '/system/teaEnterpriseInfo/' + id,
    method: 'get'
  })
}

// 新增茶企基本信息
export function addTeaEnterpriseInfo(data) {
  return request({
    url: '/system/teaEnterpriseInfo',
    method: 'post',
    data: data
  })
}

// 修改茶企基本信息
export function updateTeaEnterpriseInfo(data) {
  return request({
    url: '/system/teaEnterpriseInfo',
    method: 'put',
    data: data
  })
}

// 删除茶企基本信息
export function delTeaEnterpriseInfo(id) {
  return request({
    url: '/system/teaEnterpriseInfo/' + id,
    method: 'delete'
  })
}

// 导出茶企基本信息
export function exportTeaEnterpriseInfo(query) {
  return request({
    url: '/system/teaEnterpriseInfo/export',
    method: 'get',
    params: query
  })
}

