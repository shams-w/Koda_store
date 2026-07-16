export function formatPrice(price) {
  return `EGP ${Number(price).toLocaleString()}`;
}

export function getDiscountPercent(product) {
  if (!product.price || !product.discountPrice || product.discountPrice >= product.price) {
    return 0;
  }
  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
}
