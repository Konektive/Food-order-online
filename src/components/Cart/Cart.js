import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckOut, setIsCheckout] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;

  const hasItems = cartCtx.items.length > 0;

  const handleCartRemove = (id) => {
    cartCtx.removeItem(id);
  };

  const handleAddToCart = (item) => {
    cartCtx.addItem(item);
  };
  const handleOrder = () => {
    setIsCheckout(true);
  };

  const handleOrderSubmit = async (userData) => {
    setIsSubmiting(true);
    await fetch(
      "https://food-new-5a1ed-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          deliveryData: userData,
          Meals: cartCtx.items,
        }),
      }
    );
    setIsSubmiting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={handleCartRemove.bind(null, item.id)}
          onAdd={handleAddToCart.bind(null, item)}
        />
      ))}
    </ul>
  );

  const actions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={handleOrder}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <Checkout handleOrder={handleOrderSubmit} onCancel={props.onClose} />
      )}
      {!isCheckOut && actions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending Order data...</p>;

  const didSubmitModalContent = (
    <React.Fragment>
      <p>Succesfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmiting && !didSubmit && cartModalContent}
      {isSubmiting && isSubmittingModalContent}
      {!isSubmiting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
