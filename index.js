const exchangeRates = { usd: 1 };
const fromCurrency = document.querySelector(".converter-container #from");
const toCurrency = document.querySelector(".converter-container #to");
const inputAmount = document.querySelector(".converter-container .input-amount");
const result = document.querySelector(".converter-container .result");
const swapBtn = document.querySelector(".converter-container .swap-btn");

const init = async () => {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest");
    const data = await res.json();

    if (res.ok) {
      for (const currencyCode in data.rates) {
        const rate = data.rates[currencyCode];
        const option1 = createOption(currencyCode, rate);
        const option2 = createOption(currencyCode, rate);

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);

        exchangeRates[currencyCode] = rate;
      }

      toCurrency.value = toCurrency.options[1].value;
      convert();
    }
  } catch (error) {
    console.log("Error loading currency data", error);
  }
};

const createOption = (code, rate) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = `${code} - ${rate}`;
  return option;
};

init();

const convert = () => {
  const inputValue = parseFloat(inputAmount.value);
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  const convertedValue =
    (inputValue * exchangeRates[toCurrencyValue]) /
    exchangeRates[fromCurrencyValue];

  const resultValue = `<span class='result-currency'>${toCurrencyValue}</span> ${convertedValue.toFixed(
    2
  )}`;

  result.innerHTML = isNaN(convertedValue) ? "Invalid Input" : resultValue;
};

toCurrency.addEventListener("change", convert);
fromCurrency.addEventListener("change", convert);
inputAmount.addEventListener("input", convert);

swapBtn.addEventListener("click", () => {
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  fromCurrency.value = toCurrencyValue;
  toCurrency.value = fromCurrencyValue;

  convert();
});
