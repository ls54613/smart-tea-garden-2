import request from '@/utils/request'

// 查询企业历年产量及销售情况列表
export function listTeaEnterpriseYieldSales(query) {
  return request({
    url: '/system/teaEnterpriseYieldSales/list',
    method: 'get',
    params: query
  })
}

// 查询企业历年产量及销售情况详细
export function getTeaEnterpriseYieldSales(id) {
  return request({
    url: '/system/teaEnterpriseYieldSales/' + id,
    method: 'get'
  })
}

// 新增企业历年产量及销售情况
export function addTeaEnterpriseYieldSales(data) {
  return request({
    url: '/system/teaEnterpriseYieldSales',
    method: 'post',
    data: data
  })
}

// 修改企业历年产量及销售情况
export function updateTeaEnterpriseYieldSales(data) {
  return request({
    url: '/system/teaEnterpriseYieldSales',
    method: 'put',
    data: data
  })
}

// 删除企业历年产量及销售情况
export function delTeaEnterpriseYieldSales(id) {
  return request({
    url: '/system/teaEnterpriseYieldSales/' + id,
    method: 'delete'
  })
}

// 导出企业历年产量及销售情况
export function exportTeaEnterpriseYieldSales(query) {
  return request({
    url: '/system/teaEnterpriseYieldSales/export',
    method: 'get',
    params: query
  })
}