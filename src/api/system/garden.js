import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listGarden(query) {
  return request({
    url: '/system/garden/list',
    method: 'get',
    params: query
  })
}

export function listAll(query) {
  return request({
    url: '/system/garden/listAll',
    method: 'get',
    params: query
  })
}


export function listTeaGarden(query) {
  return request({
    url: '/system/garden/listTeaGarden',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getGarden(teaGardenId) {
  return request({
    url: '/system/garden/' + teaGardenId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addGarden(data) {
  return request({
    url: '/system/garden',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateGarden(data) {
  return request({
    url: '/system/garden',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delGarden(teaGardenId) {
  return request({
    url: '/system/garden/' + teaGardenId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportGarden(query) {
  return request({
    url: '/system/garden/export',
    method: 'get',
    params: query
  })
}
