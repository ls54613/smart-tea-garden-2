import request from '@/utils/request'

// 查询常宁茶农人均收入与总体人均收入列表
export function listTeaPeasantIncomeSituation(query) {
  return request({
    url: '/system/teaPeasantIncomeSituation/list',
    method: 'get',
    params: query
  })
}

// 查询常宁茶农人均收入与总体人均收入详细
export function getTeaPeasantIncomeSituation(id) {
  return request({
    url: '/system/teaPeasantIncomeSituation/' + id,
    method: 'get'
  })
}

// 新增常宁茶农人均收入与总体人均收入
export function addTeaPeasantIncomeSituation(data) {
  return request({
    url: '/system/teaPeasantIncomeSituation',
    method: 'post',
    data: data
  })
}

// 修改常宁茶农人均收入与总体人均收入
export function updateTeaPeasantIncomeSituation(data) {
  return request({
    url: '/system/teaPeasantIncomeSituation',
    method: 'put',
    data: data
  })
}

// 删除常宁茶农人均收入与总体人均收入
export function delTeaPeasantIncomeSituation(id) {
  return request({
    url: '/system/teaPeasantIncomeSituation/' + id,
    method: 'delete'
  })
}

// 导出常宁茶农人均收入与总体人均收入
export function exportTeaPeasantIncomeSituation(query) {
  return request({
    url: '/system/teaPeasantIncomeSituation/export',
    method: 'get',
    params: query
  })
}