<template>
  <div class="calc" @submit.prevent.self>
    <div class="row radio-group">
      <div class="radio" v-for="item in programs" :key="item">
        <input type="radio" class="form-radio" name="creditProgram" :value="item.value" :id="item.value" v-model="programs.value"/>
        <label :for="item.value"><strong>{{ item.label }}</strong></label>
      </div>
    </div>
    <div class="row" :class="{ disabled: isDisabled}">
      <div class="form-select field-group">
        <div class="label">Выберите продукт</div>
        <select class="form-field" v-model="selected">
          <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.name }}</option>
        </select>
        <div class="icon">
          <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.20266 0L0.635254 1.48966L6.64364 7.2L12.652 1.48966L11.0846 0L6.64364 4.22069L2.20266 0Z" fill="#262626"/></svg>
        </div>
      </div>
    </div>
    <div class="row" :class="{ disabled: isDisabled}">
      <div class="field-group">
        <div class="label">{{ carPrice.label }}</div>
        <number v-bind="number" class="form-field" v-model="carPrice.value"></number>
        <span class="text-md currency__symbol"></span>
      </div>
      <input type="range" class="form-range" :min="carPrice.min" :max="carPrice.max" :step="carPrice.step" v-model="carPrice.value" tabindex="-1"/>
    </div>
    <div class="row" :class="{ disabled: isDisabled}">
      <div class="field-group">
        <div class="label">{{ initialFee.label }}</div>
        <number v-bind="number" class="form-field" v-model="initialFee.value"></number>
        <span class="text-md percent__symbol">{{ initialFeePercent }}</span>
      </div>
      <input type="range" class="form-range" :min="initialFee.min" :max="initialFee.max" :step="initialFee.step" v-model="initialFee.value" tabindex="-1"/>
    </div>
    <div class="row" :class="{ disabled: isDisabled}">
      <div class="field-group">
        <div class="label">{{ creditTerm.label }}</div>
        <input type="number" class="form-field" v-model="creditTerm.value" :min="creditTerm.min" :max="creditTerm.max"/>
        <span class="text-md">мес.</span>
      </div>
      <input type="range" class="form-range" :min="creditTerm.min" :max="creditTerm.max" :step="creditTerm.step" v-model="creditTerm.value" tabindex="-1"/>
    </div>
    <div class="row full-width">
      <div id="total">
        <div class="col">
          <div class="amount currency__symbol"><strong>{{ creditAmount.toLocaleString() }}</strong></div>
          <div class="label">Сумма кредита</div>
        </div>
        <div class="col">
          <div class="amount currency__symbol"><strong>{{ payment.value.toLocaleString() }}</strong></div>
          <div class="label">{{ payment.label }}</div>
        </div>
        <div class="col">
          <button type="button" class="btn" @click="reset">Сбросить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { component as number } from "@coders-tm/vue-number-format";
export default {
  components: { number },
  data: () => ({
    number: {
      separator: " ",
      prefix: "",
      precision: 2,
      masked: false,
      nullValue: "0",
    },
    programs: [
      { label: "С подтверждением дохода", value: 1 },
      { label: "Без подтверждением дохода", value: 2 },
    ],
    selected: "newAuto",
    options: [
      { name: "Новые автомобили", value: "newAuto" },
      { name: "Автомобили с пробегом", value: "oldAuto" },
    ],
    isDisabled: true,
    carPrice: {
      id: "carPrice",
      label: "Стоимость авто",
      value: 0,
      min: 0,
      max: 60000000,
      step: 10000,
    },
    initialFee: {
      id: "initialFee",
      label: "Первоначальный взнос",
      value: 0,
      min: 0,
      max: 0,
      step: 10000,
    },
    creditTerm: {
      id: "creditTerm",
      label: "Срок займа",
      value: 12,
      min: 12,
      max: 84,
      step: 1,
    },
    initialFeePercent: 0,
    creditAmount: 0,
    payment: { value: 0, label: "Ежемесячный платеж" },
    ratePOI: { newAuto: 20.5, oldAuto: 24.7 },
    rateNoPOI: { newAuto: 22.4, oldAuto: 28 },
    i: null,
  }),

  methods: { 
    toggleDisabled() { 
      this.isDisabled = this.programs.value === ""; 
    }, 
    calculateInitialFeePercent() {
  const carPrice = parseFloat(this.carPrice.value);
  if (carPrice === 0) {
    this.initialFeePercent = 0;
  } else {
    this.initialFeePercent = Math.round(
      (this.initialFee.value * 100) / carPrice
    );
  }
    },
    calculateMonthlyPayment() { 
      const koef = 
        (this.i * Math.pow(1 + this.i, this.creditTerm.value)) / 
        (Math.pow(1 + this.i, this.creditTerm.value) - 1); 
      this.payment.value = Math.round(this.creditAmount * koef); 
    }, 
    calculateCoefficient() { 
      if (this.programs.value === 1) { 
        this.i = this.selected === "newAuto" 
          ? this.ratePOI.newAuto / 12 / 100 
          : this.ratePOI.oldAuto / 12 / 100; 
      } else if (this.programs.value === 2) { 
        this.i = this.selected === "newAuto" 
          ? this.rateNoPOI.newAuto / 12 / 100 
          : this.rateNoPOI.oldAuto / 12 / 100; 
      } 
    }, 
    validate() { 
      const carPrice = parseFloat(this.carPrice.value); 
      const initialFee = parseFloat(this.initialFee.value); 
      if ( 
        isNaN(carPrice) || 
        isNaN(initialFee) || 
        initialFee > carPrice || 
        initialFee < 0 || 
        carPrice < 0 || 
        initialFee > carPrice || 
        this.programs.value === "" 
      ) { 
        return false; 
      } 
      return true; 
    }, 
    getCreditAmount() { 
      if (this.validate()) { // Проверка на валидность 
        this.creditAmount = this.carPrice.value - this.initialFee.value; 
        this.calculateInitialFeePercent(); 
        this.calculateCoefficient(); 
        this.calculateMonthlyPayment(); 
      } else { 
        this.creditAmount = 0; 
        this.initialFee.value = 0; 
        this.payment.value = 0; 
        this.initialFeePercent = 0; 
      } 
      this.initialFee.max = this.carPrice.value; 
    }, 
    reset() { 
      Object.assign(this.$data, this.$options.data.call(this)); 
    }, 
  }, 
  watch: {
    'programs.value': ['toggleDisabled', 'getCreditAmount'],
    'selected': ['getCreditAmount'],
    'carPrice.value': ['getCreditAmount'],
    'initialFee.value': ['getCreditAmount'],
    'creditTerm.value': ['getCreditAmount']
  }
};
</script>