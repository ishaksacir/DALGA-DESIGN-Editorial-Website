/** Zero-pads a step or item number to two digits: 1 → "01". */
export const twoDigits = (number) => String(number).padStart(2, '0')
