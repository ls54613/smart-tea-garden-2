import request from '@/utils/request'

// 查询病虫害分析列表
export function listTeaGardenDisease(query) {
  return request({
    url: '/system/teaGardenDisease/list',
    method: 'get',
    params: query
  })
}

// 查询病虫害分析详细
export function getTeaGardenDisease(id) {
  return request({
    url: '/system/teaGardenDisease/' + id,
    method: 'get'
  })
}

// 新增病虫害分析
export function addTeaGardenDisease(data) {
  return request({
    url: '/system/teaGardenDisease',
    method: 'post',
    data: data
  })
}

// 修改病虫害分析
export function updateTeaGardenDisease(data) {
  return request({
    url: '/system/teaGardenDisease',
    method: 'put',
    data: data
  })
}

// 删除病虫害分析
export function delTeaGardenDisease(id) {
  return request({
    url: '/system/teaGardenDisease/' + id,
    method: 'delete'
  })
}

// 导出病虫害分析
export function exportTeaGardenDisease(query) {
  return request({
    url: '/system/teaGardenDisease/export',
    method: 'get',
    params: query
  })
}