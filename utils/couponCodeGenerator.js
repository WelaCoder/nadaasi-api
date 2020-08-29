var voucher_codes = require("voucher-code-generator");
module.exports = () => {
  let coupon = voucher_codes.generate({ length: 6, count: 1 });
  // console.log(code);
  return coupon[0];
};
