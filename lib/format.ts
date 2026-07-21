export const NUMBER_LOCALE = "es-CL";
export const PLOTLY_SPANISH_SEPARATORS = ",.";

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return value.toLocaleString(NUMBER_LOCALE, options);
}

export function formatPercent(value: number) {
  return `${formatNumber(value, { maximumFractionDigits: 0 })}%`;
}

export function formatCompactMw(mw: number) {
  return mw >= 1000
    ? `${formatNumber(mw / 1000, { maximumFractionDigits: 1 })} GW`
    : `${formatNumber(mw, { maximumFractionDigits: 0 })} MW`;
}

export function formatMw(mw: number, fractionDigits = 1) {
  return `${formatNumber(mw, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} MW`;
}
