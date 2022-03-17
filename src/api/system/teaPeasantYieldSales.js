import request from '@/utils/request'

// 查询茶农历年产量产值、销量销售额列表
export function listTeaPeasantYieldSales(query) {
  return request({
    url: '/system/teaPeasantYieldSales/list',
    method: 'get',
    params: query
  })
}

// 查询茶农历年产量产值、销量销售额详细
export function getTeaPeasantYieldSales(id) {
  return request({
    url: '/system/teaPeasantYieldSales/' + id,
    method: 'get'
  })
}

// 新增茶农历年产量产值、销量销售额
export function addTeaPeasantYieldSales(data) {
  return request({
    url: '/system/teaPeasantYieldSales',
    method: 'post',
    data: data
  })
}

// 修改茶农历年产量产值、销量销售额
export function updateTeaPeasantYieldSales(data) {
  return request({
    url: '/system/teaPeasantYieldSales',
    method: 'put',
    data: data
  })
}

// 删除茶农历年产量产值、销量销售额
export function delTeaPeasantYieldSales(id) {
  return request({
    url: '/system/teaPeasantYieldSales/' + id,
    method: 'delete'
  })
}

// 导出茶农历年产量产值、销量销售额
export function exportTeaPeasantYieldSales(query) {
  return request({
    url: '/system/teaPeasantYieldSales/export',
    method: 'get',
    params: query
  })
}