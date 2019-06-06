const QQ_MAP_KEY = 'APYBZ-IVFK2-W3RUT-CERR4-2VTJ6-RUFTI'
/**
 *  逆地址查询
 * @param {*} lat
 * @param {*} lon
 */
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success,
    fail
  })
}
//# sourceMappingURL=api.js.map
