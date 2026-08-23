export function useOperatorLogo() {
  const operatorLogos: Record<string, string> = {
    'TELKOMSEL': '/images/operators/telkomsel.png',
    'INDOSAT': '/images/operators/indosat.png',
    'XL': '/images/operators/xl.png',
    'AXIS': '/images/operators/axis.jpg',
    'TRI': '/images/operators/tri.jpg',
    'THREE': '/images/operators/tri.jpg',
    'SMARTFREN': '/images/operators/smartfren.jpg',
    'BY.U': '/images/operators/byu.png',
    'BYU': '/images/operators/byu.png',
  }

  const ewalletLogos: Record<string, string> = {
    'OVO': '/images/ewallet/ovo.jpg',
    'GOPAY': '/images/ewallet/gopay.png',
    'GO PAY': '/images/ewallet/gopay.png',
    'DANA': '/images/ewallet/dana.png',
    'SHOPEEPAY': '/images/ewallet/shopeepay.png',
    'SHOPEE PAY': '/images/ewallet/shopeepay.png',
  }

  const gameLogo: Record<string, string> = {
    'MOBILE LEGENDS': '/images/games/mobilelegends.jpg',
    'MOBILE LEGEND': '/images/games/mobilelegends.jpg',
    'FREE FIRE': '/images/games/freefire.png',
    'FREEFIRE': '/images/games/freefire.png',
  }

  function getOperatorLogo(brand: string): string | null {
    if (!brand) return null
    return operatorLogos[brand.toUpperCase().trim()] || null
  }

  function getEwalletLogo(brand: string): string | null {
    if (!brand) return null
    return ewalletLogos[brand.toUpperCase().trim()] || null
  }

  function getGameLogo(brand: string): string | null {
    if (!brand) return null
    return gameLogo[brand.toUpperCase().trim()] || null
  }

  return { getOperatorLogo, getEwalletLogo, getGameLogo }
}
