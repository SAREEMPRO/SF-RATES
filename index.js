const exchangeRates = { usd: 1 };
const fromCurrency = document.querySelector(".converter-container #from");
const toCurrency = document.querySelector(".converter-container #to");
const inputAmount = document.querySelector(
  ".converter-container .input-amount"
);
const result = document.querySelector(".converter-container .result");
const swapBtn = document.querySelector(".converter-container .swap-btn");

const init = async () => {
  try {
    const res = await fetch(`http://www.floatrates.com/daily/usd.json`);
    const data = await res.json();

    if (res.ok) {
      console.log(data);  // Check if data is fetched correctly

      for (const currencyCode in data) {
        const currencyInfo = data[currencyCode];
        const { code, name } = currencyInfo;

        exchangeRates[currencyCode] = currencyInfo.rate;

        const option1 = new Option(`${code} - ${name}`, code);
        const option2 = new Option(`${code} - ${name}`, code);

        fromCurrency.add(option1);
        toCurrency.add(option2);
      }

      toCurrency.value = toCurrency.options[1].value;
      convert();

      // Initialize Select2 on the select elements
      $('.select-container select').select2();
    }
  } catch (error) {
    console.log("Error loading currency data", error);
  }
};



const convert = () => {
  const inputValue = parseFloat(inputAmount.value);
  const fromCurrencyValue = fromCurrency.value.toLowerCase();
  const toCurrencyValue = toCurrency.value.toLowerCase();

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
