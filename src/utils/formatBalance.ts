export function formatBalance(balance: string): string {
    // Check if the input is a valid number in string format
    if (isNaN(parseFloat(balance))) {
        throw new Error(
            "Invalid input. Please provide a valid numeric string."
        );
    }
    // divide by 1e18 to convert wei to eth
    // we use string division to preserve the decimal places (rather than 1.1e-7)
    balance = divideByTens(balance, 18);

    // Split the input into integer and decimal parts
    let [integerPart, decimalPart] = balance.split(".");

    // remove leading zeros from the integer part
    integerPart = integerPart.replace(/^0+/, "");
    if (!integerPart) {
        integerPart = "0";
    }

    // always show at least 2 decimal places
    if (!decimalPart) {
        decimalPart = "00";
    } else if (decimalPart.length === 1) {
        decimalPart = decimalPart + "0";
    }

    const significantFigures = 4;
    let [formatted, firstInsignificant] = getSignificance(
        integerPart,
        decimalPart,
        significantFigures
    );
    formatted = roundUpSigFig(formatted, firstInsignificant);
    formatted = trim(formatted);
    formatted = addThousandsSeparator(formatted, ",");

    return formatted;
}

function divideByTens(numerator: string, power: number): string {
    // Check if the input is a valid number in string format
    if (isNaN(parseFloat(numerator))) {
        throw new Error(
            "Invalid input. Please provide a valid numeric string."
        );
    }
    // remove leading zeros from the integer part
    numerator = numerator.replace(/^0+/, "");

    // Split the input into integer and decimal parts
    let [integerPart, decimalPart] = numerator.split(".");

    if (!decimalPart) {
        decimalPart = "0";
    }
    if (integerPart === "0") {
        return "0." + "0".repeat(power) + decimalPart;
    } else {
        if (integerPart.length <= power) {
            return (
                "0." +
                "0".repeat(power - integerPart.length) +
                integerPart +
                decimalPart
            );
        } else {
            return (
                integerPart.substring(0, integerPart.length - power) +
                "." +
                integerPart.substring(integerPart.length - power) +
                decimalPart
            );
        }
    }
}

function getSignificance(
    integerPart: string,
    decimalPart: string,
    significantFigures: number
): string[] {
    // minimal decimal places initially
    let decimalPartLength = 2;

    if (integerPart.length < significantFigures) {
        if (integerPart !== "0") {
            significantFigures -= integerPart.length;
            decimalPartLength = Math.max(decimalPartLength, significantFigures);
        } else {
            let startCounting = false;
            for (let i = 0; i < decimalPart.length; i++) {
                if (decimalPart[i] !== "0") {
                    startCounting = true;
                }
                if (startCounting) {
                    significantFigures -= 1;
                    if (significantFigures === 0) {
                        decimalPartLength = Math.max(decimalPartLength, i + 1);
                        break;
                    }
                }
            }
        }
    }

    const formatted =
        integerPart + "." + decimalPart.substring(0, decimalPartLength);
    const firstInsignificant = decimalPart[decimalPartLength];
    return [formatted, firstInsignificant];
}

// add a seperator between every 3 digits like a comma
// addThousandsSeparator("1234.56", ",") = "1,234.56"
function addThousandsSeparator(input: string, separator: string): string {
    // Check if the input is a valid number in string format
    if (isNaN(parseFloat(input))) {
        throw new Error(
            "Invalid input. Please provide a valid numeric string."
        );
    }

    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = input.split(".");

    // Add a comma as the thousands separator to the integer part
    const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        separator
    );

    // If there is a decimal part, combine it with the formatted integer part
    if (decimalPart) {
        return `${formattedInteger}.${decimalPart}`;
    } else {
        return formattedInteger;
    }
}

// remove leading and trailing zeros
function trim(input: string): string {
    if (!input || isNaN(parseFloat(input))) {
        throw new Error(
            "Invalid input. Please provide a valid numeric string."
        );
    }

    let trimmed = input;
    if (input[1] !== ".") {
        // Remove leading zeros
        trimmed = trimmed.replace(/^0+/, "");
    }

    // Remove trailing zeros after the decimal point
    trimmed = trimmed.replace(/\.?0+$/, "");

    return trimmed;
}

function roundUpSigFig(number: string, firstInsignificant: string): string {
    if (["5", "6", "7", "8", "9"].includes(firstInsignificant)) {
        const digitToIncrease = parseInt(number[number.length - 1]);
        const increasedDigit = digitToIncrease + 1;
        if (increasedDigit === 10) {
            // carry over
            let i = number.length - 1;
            while (i >= 0) {
                if (number[i] === ".") {
                    i--;
                    continue;
                }
                const digit = parseInt(number[i]);
                if (digit === 9) {
                    number =
                        number.substring(0, i) + "0" + number.substring(i + 1);
                    i--;
                } else {
                    number =
                        number.substring(0, i) +
                        (digit + 1).toString() +
                        number.substring(i + 1);
                    break;
                }
            }
            if (i === -1) {
                number = "1" + number;
            }
        } else {
            number =
                number.substring(0, number.length - 1) +
                increasedDigit.toString();
        }
    }
    return number;
}
