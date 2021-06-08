import React from "react";

import RadioGroup from "@material-ui/core/RadioGroup";
import UiCustomRadio from "../UiCustomRadio";

import visaImage from "../../img/icons/payment/Visa.png";
import mastercardImage from "../../img/icons/payment/MasterCard.png";
import amexImage from "../../img/icons/payment/AmericanExpress.png";
import paypalImage from "../../img/icons/payment/Paypal.png";
import applePayImage from "../../img/icons/payment/Apple.png";

export default function PaymentMethod({ value, changeHandler }) {
  const paymentOptions = [
    {
      method: "card",
      formText: "Credit/Debit Card",
      formImage: false,
      disabled: false,
    },
    {
      method: "paypal",
      formText: false,
      formImage: paypalImage,
      disabled: true,
    },
    {
      method: "applePay",
      formText: false,
      formImage: applePayImage,
      disabled: true,
    },
  ];

  return (
    <>
      <div className="row">
        <h5> How would you like to pay? </h5>
      </div>
      <div className="row gy-2">
        <RadioGroup
          id="paymentMethod"
          aria-label="payment method"
          name="paymentMethod"
          value={value}
          onChange={changeHandler}
          row
        >
          {paymentOptions.map((payment) => {
            return (
              <UiCustomRadio
                chosenValue={value}
                value={payment.method}
                formText={payment.formText}
                formImage={payment.formImage}
                disabled={payment.disabled}
                key={payment.method}
              />
            );
          })}
        </RadioGroup>
      </div>
      <div className="row gy-2">
        <div className="col-12">We accept the following debit/credit cards</div>
        <div className="col-12">
          <img className="radio-border-box" src={visaImage} alt="" />
          <img className="radio-border-box" src={mastercardImage} alt="" />
          <img className="radio-border-box" src={amexImage} alt="" />
        </div>
      </div>
    </>
  );
}
