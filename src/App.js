import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";

import Home from "./pages/Home";
import NewProduct from "./pages/NewProduct";
import Detail from "./pages/Detail";
import Payment from "./pages/Payment";
import Address from "./pages/Address";

import * as api from "./api";

import useLocalStorage from "./hooks/useLocalStorage";
import loadLocalStorageItems from "./utils/loadLocalStorageItems";
import { CheckoutContextProvider } from "./context/checkout-context";
import AuthContextProvider from "./components/AuthContextProvider";

import { getPageIndex } from "./helpers/order-pages";
import { theme } from "./constants/materialUiColors";

import {
  HOME,
  NEW_PRODUCT,
  DETAIL,
  PAYMENT,
  ADDRESS,
  SUMMARY,
  AUTH,
} from "./constants/routes";
import Summary from "./pages/Summary";
import AuthPage from "./pages/AuthPage/AuthPage";

function buildNewCartItem(cartItem) {
  if (cartItem.quantity >= cartItem.unitsInStock) {
    return cartItem;
  }

  return {
    id: cartItem.id,
    title: cartItem.title,
    img: cartItem.img,
    price: cartItem.price,
    unitsInStock: cartItem.unitsInStock,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
    quantity: cartItem.quantity + 1,
  };
}

const PRODUCTS_LOCAL_STORAGE_KEY = "react-sc-state-products";
const CART_ITEMS_LOCAL_STORAGE_KEY = "react-sc-state-cart-items";

function App() {
  const [products, setProducts] = useState(() =>
    loadLocalStorageItems(PRODUCTS_LOCAL_STORAGE_KEY, []),
  );
  const [cartItems, setCartItems] = useState(() =>
    loadLocalStorageItems(CART_ITEMS_LOCAL_STORAGE_KEY, []),
  );

  useLocalStorage(products, PRODUCTS_LOCAL_STORAGE_KEY);
  useLocalStorage(cartItems, CART_ITEMS_LOCAL_STORAGE_KEY);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    if (products.length === 0) {
      setIsLoading(true);

      api
        .getProducts()
        .then((data) => {
          setProducts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHasError(true);
          setLoadingError(error.message);
        });
    }
  }, []);

  function handleAddToCart(productId) {
    const prevCartItem = cartItems.find((item) => item.id === productId);
    const foundProduct = products.find((product) => product.id === productId);

    if (prevCartItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= item.unitsInStock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      });

      setCartItems(updatedCartItems);
      return;
    }

    const updatedProduct = buildNewCartItem(foundProduct);
    setCartItems((prevState) => [...prevState, updatedProduct]);
  }

  function handleChange(event, productId) {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId && item.quantity <= item.unitsInStock) {
        return {
          ...item,
          quantity: Number(event.target.value),
        };
      }

      return item;
    });

    setCartItems(updatedCartItems);
  }

  function handleRemove(productId) {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);

    setCartItems(updatedCartItems);
  }

  function handleDownVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.downVotes.currentValue <
          product.votes.downVotes.lowerLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            downVotes: {
              ...product.votes.downVotes,
              currentValue: product.votes.downVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function handleUpVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.upVotes.currentValue < product.votes.upVotes.upperLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            upVotes: {
              ...product.votes.upVotes,
              currentValue: product.votes.upVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function handleSetFavorite(productId) {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          isFavorite: !product.isFavorite,
        };
      }

      return product;
    });

    setProducts(updatedProducts);
  }

  function saveNewProduct(newProduct) {
    setProducts((prevState) => [newProduct, ...prevState]);
  }

  return (
    <ThemeProvider theme={theme}>
      <CheckoutContextProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <Switch>
              <Route path={NEW_PRODUCT}>
                <NewProduct saveNewProduct={saveNewProduct} />
              </Route>
              <Route path={DETAIL}>
                <Detail
                  cartItems={cartItems}
                  handleRemove={handleRemove}
                  handleChange={handleChange}
                  page={getPageIndex(DETAIL)}
                />
              </Route>
              <Route path={ADDRESS}>
                <Address
                  cartItems={cartItems}
                  handleRemove={handleRemove}
                  handleChange={handleChange}
                  page={getPageIndex(ADDRESS)}
                />
              </Route>
              <Route path={PAYMENT}>
                <Payment
                  cartItems={cartItems}
                  handleRemove={handleRemove}
                  handleChange={handleChange}
                  page={getPageIndex(PAYMENT)}
                />
              </Route>
              <Route path={SUMMARY}>
                <Summary
                  cartItems={cartItems}
                  date={new Date().toLocaleDateString()}
                  page={getPageIndex(SUMMARY)}
                />
              </Route>
              <Route path={AUTH}>
                <AuthPage />
              </Route>
              <Route path={HOME}>
                <Home
                  fullWidth
                  cartItems={cartItems}
                  products={products}
                  isLoading={isLoading}
                  hasError={hasError}
                  loadingError={loadingError}
                  handleDownVote={handleDownVote}
                  handleUpVote={handleUpVote}
                  handleSetFavorite={handleSetFavorite}
                  handleAddToCart={handleAddToCart}
                  handleRemove={handleRemove}
                  handleChange={handleChange}
                />
              </Route>
            </Switch>
          </BrowserRouter>
        </AuthContextProvider>
      </CheckoutContextProvider>
    </ThemeProvider>
  );
}

export default App;
