/**
 * Redondea un número a una cantidad específica de decimales.
 *
 * @param {number} value - El número que se desea redondear.
 * @param {number} precision - La cantidad de decimales a la que se desea redondear.
 * @returns {number} - El número redondeado a la precisión especificada.
 *
 * @example
 * // Devuelve 2.35
 * roundToPrecision(2.34567, 2);
 *
 * @example
 * // Devuelve 3.14
 * roundToPrecision(3.14159, 2);
 */
export const roundToPrecision = (value, precision) => {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  }