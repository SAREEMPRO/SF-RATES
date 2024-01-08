const exchangeRates = { usd: 1 };
const fromCurrency = document.querySelector("#from");
const toCurrency = document.querySelector("#to");
const inputAmount = document.querySelector(".input-amount");
const result = document.querySelector(".result");
const swapBtn = document.querySelector(".swap-btn");

const fetchData = async () => {
  try {
    const res = await fetch("http://www.floatrates.com/daily/usd.json");
    const data = await res.json();

    if (res.ok) {
      populateCurrencyOptions(data);
      setDefaultToCurrency();
      convert();
    }
  } catch (error) {
    console.log("Error loading currency data");
  }
};

const populateCurrencyOptions = (data) => {
  for (const currencyCode in data) {
    const currencyInfo = data[currencyCode];
    const { code, name } = currencyInfo;

    exchangeRates[currencyCode] = currencyInfo.rate;

    const option1 = createOption(code, name);
    const option2 = createOption(code, name);

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  }
};

const createOption = (code, name) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = `${code} - ${name}`;
  return option;
};

const setDefaultToCurrency = () => {
  toCurrency.value = toCurrency.options.length > 1 ? toCurrency.options[1].value : toCurrency.value;
};

const convert = () => {
  const inputValue = parseFloat(inputAmount.value);
  const fromCurrencyValue = fromCurrency.value.toLowerCase();
  const toCurrencyValue = toCurrency.value.toLowerCase();

  const convertedValue =
    (inputValue * exchangeRates[toCurrencyValue]) / exchangeRates[fromCurrencyValue];

  const resultValue = `<span class='result-currency'>${toCurrencyValue}</span> ${convertedValue.toFixed(2)}`;

  result.innerHTML = isNaN(convertedValue) ? "Invalid Input" : resultValue;
};

const swapCurrencies = () => {
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  fromCurrency.value = toCurrencyValue;
  toCurrency.value = fromCurrencyValue;

  convert();
};

// Event listeners
toCurrency.addEventListener("change", convert);
fromCurrency.addEventListener("change", convert);
inputAmount.addEventListener("input", convert);
swapBtn.addEventListener("click", swapCurrencies);

// Initialize the currency converter
fetchData();
