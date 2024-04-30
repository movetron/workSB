<script lang="ts">
  import { onMount } from "svelte";
  // import axios from "axios";

  import currencyData from "../data/currencyData.json";
  import CurrencyInput from "./CurrencyInput.svelte";
  import CurrencySelector from "./CurrencySelector.svelte";
  import Output from "./Output.svelte";
  import axios from "axios";

// Определите конечную точку API
const API_ENDPOINT = "https://v6.exchangerate-api.com/v6/b6bdb109610d3cdeb2448e99/latest/USD";

// Функция для вызова API и обновления курсов валют
const updateCurrencyRates = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    const data = response.data; // Получите данные из ответа
    const currencyRates = data.conversion_rates; 
    // Обновите интерфейс, используя полученные данные
    // Например, можно обновить currencyData, используя полученные курсы валют
    Object.assign(currencyData.eur, currencyRates);  // Предположим, что данные обновляются для евро
  } catch (error) {
    console.error("Error fetching currency rates: ", error);
  }
};

// Вызовите функцию при загрузке компонента
onMount(() => {
  updateCurrencyRates();
});
  // let currencies = ["SEK", "GBP", "USD"];
  // const { VITE_CURRENCY_API_ENDPOINT } = import.meta.env;

  // onMount(() => {
  //   const getCurrencies = async () =>
  //     await axios.get(VITE_CURRENCY_API_ENDPOINT);
  //   if (currencies.length === 0)
  //     getCurrencies()
  //       .then(({ data }) => (currencies = data))
  //       .catch((e) => console.error("Error fetching currencies: ", e));
  // });

  const fields = [
    {
      id: "1",
      currency: "eur",
      value: 1,
    },
    {
      id: "2",
      currency: "sek",
      value: 0,
    },
  ];

  const [firstField, secondField] = fields;

  const compareCurrencies = (rate1, rate2) => rate1 / rate2;

  onMount(() => {
    const currencyValue = getCurrentValue(secondField.currency);
    secondField.value = compareCurrencies(currencyValue, firstField.value);
  });

  const getCurrentValue = (c: string) => {
    let curValue = 0;
    Object.entries(currencyData.eur).forEach(([currency, value]) => {
      if (c === currency) curValue = value;
    });
    return curValue;
  };

  const onInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let currentField = fields.find((field) => field.id === target.id);
    let otherField = fields.find((field) => field.id !== target.id);

    currentField.value = Number(target.value);

    const currencyValue = getCurrentValue(
      firstField.id === currentField.id
        ? otherField.currency
        : currentField.currency,
    );

    firstField.id === currentField.id
      ? (secondField.value = currencyValue * currentField.value)
      : (firstField.value = compareCurrencies(
          currentField.value,
          currencyValue,
        ));
  };

  const onCurrencyChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let currentField = fields.find((field) => field.id === target.id);
    let otherField = fields.find((field) => field.id !== target.id);

    currentField.currency = target.value;
    const currencyValue = getCurrentValue(
      firstField.id === currentField.id
        ? otherField.currency
        : currentField.currency,
    );
    firstField.id === currentField.id
      ? (secondField.value = currencyValue * currentField.value)
      : (firstField.value = compareCurrencies(
          currentField.value,
          currencyValue,
        ));
  };
</script>

<div class="currency">
  {#each ["1", "2"] as id}
    <div>
      <CurrencySelector
        {id}
        currencies={Object.keys(currencyData.eur)}
        selectedCurrency={id === "1"
          ? firstField.currency
          : secondField.currency}
        on:change={(e) => onCurrencyChange(e)}
      />
      <CurrencyInput
        {id}
        num={id === "1" ? firstField.value : secondField.value}
        on:change={(e) => onInputChange(e)}
      />
    </div>
  {/each}
</div>

<div class="output">
  <Output sum={secondField.value} />
</div>

<style>
  .currency {
    display: flex;
    flex-direction: column;
  }
</style>
