import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import clsx from "clsx";
import { useFormik } from "formik";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "../../components/Button";
import UiInput from "../../components/UiInput";
import UiInputDate from "../../components/UiInputDate";
import PaymentMethod from "../../components/PaymentMethod";

import paymentSchema from "./Payment-schema";

import withCheckoutLayout from "../../hoc/withCheckoutLayout";
import CheckoutContext from "../../context/checkout-context";

import CVV from "../../img/icons/payment/CVV.svg";
import sslIcon from "../../img/icons/payment/ssl.svg";
import CreditCard from "../../components/CreditCard";

function Payment() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { updateCheckoutContext } = useContext(CheckoutContext);
  const [flip, setFlip] = useState(false);

  const formik = useFormik({
    initialValues: {
      paymentMethod: "card",
      carholderName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      cardAgreement: false,
    },
    validationSchema: paymentSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      updateCheckoutContext(values);
      setTimeout(() => {
        setHasSubmitted(true);
      }, 500);
    },
  });

  function handleFlip() {
    return flip ? setFlip(false) : setFlip(true);
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="row">
            <h3>Payment Details</h3>
            <hr />
            <PaymentMethod
              value={formik.values.paymentMethod}
              changeHandler={formik.handleChange}
            />
            <div className="row gy-4">
              <div className="col-6">
                <UiInput
                  id="carholderName"
                  label="Cardholder name"
                  name="carholderName"
                  className="mb-3"
                  value={formik.values.carholderName}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  hasErrorMessage={formik.touched.carholderName}
                  errorMessage={formik.errors.carholderName}
                  required
                />
                <UiInput
                  id="cardNumber"
                  label="Card number"
                  name="cardNumber"
                  className="mb-3"
                  value={formik.values.cardNumber}
                  handleChange={formik.handleChange}
                  handleBlur={formik.handleBlur}
                  hasErrorMessage={formik.touched.cardNumber}
                  errorMessage={formik.errors.cardNumber}
                  type="number"
                  required
                />
                <div className="row">
                  <div className="col-5">
                    <UiInputDate
                      id="cardExpiry"
                      label="Card expiry date"
                      name="cardExpiry"
                      className="mb-3"
                      value={formik.values.cardExpiry}
                      handleChange={formik.handleChange}
                      handleBlur={formik.handleBlur}
                      hasErrorMessage={formik.touched.cardExpiry}
                      errorMessage={formik.errors.cardExpiry}
                      required
                    />
                  </div>
                  <div className="col-5">
                    <UiInput
                      id="cardCvv"
                      label="CVV Code"
                      name="cardCvv"
                      className="mb-3"
                      value={formik.values.cardCvv}
                      handleChange={formik.handleChange}
                      handleBlur={formik.handleBlur}
                      handleFlip={handleFlip}
                      hasErrorMessage={formik.touched.cardCvv}
                      errorMessage={formik.errors.cardCvv}
                      type="number"
                      required
                    />
                  </div>
                  <div className="col-2">
                    <img src={CVV} alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={formik.handleChange}
                          inputProps={{ "aria-label": "primary checkbox" }}
                          name="cardAgreement"
                          value={formik.values.cardAgreement}
                          id="cardAgreement"
                        />
                      }
                      className={clsx({
                        "is-invalid":
                          formik.touched.cardAgreement &&
                          formik.errors.cardAgreement,
                      })}
                      label="I have read and I accept the conditions, general terms and
                    privacy policy."
                    />
                    {formik.touched.cardAgreement && (
                      <p className="invalid-feedback">
                        You must accept the conditions to continue.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <CreditCard
                  flip={flip}
                  cardNumber={formik.values.cardNumber}
                  cardCvv={formik.values.cardCvv}
                  cardExpiry={formik.values.cardExpiry}
                  carholderName={formik.values.carholderName}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-1">
                <img src={sslIcon} alt="SSL icon" />
              </div>
              <div className="col">
                <p className="mt-3">
                  We use secure SSL transmission and encrypted storage to
                  protect your personal information.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-12 mt-4 d-flex justify-content-center">
              <Button submitButton block>
                {formik.isSubmitting ? "Submitting..." : "Next page"}
              </Button>
            </div>
          </div>
          {hasSubmitted && <Redirect to="/" />}
        </div>
      </form>
    </>
  );
}

export default withCheckoutLayout(Payment);
