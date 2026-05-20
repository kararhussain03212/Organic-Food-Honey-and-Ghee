const CART_KEY = "swift-sign-cart";

const readCart = () => {
    try {
        const raw = window.localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const writeCart = (items) => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:updated"));
};

export const getCartItems = () => readCart();

export const addToCart = (item) => {
    const items = readCart();
    const existingIndex = items.findIndex(
        (entry) => entry.id === item.id && entry.variant === item.variant,
    );
    if (existingIndex >= 0) {
        items[existingIndex].qty += item.qty;
    } else {
        items.push({ ...item });
    }
    writeCart(items);
};

export const removeFromCart = (id, variant) => {
    const items = readCart().filter(
        (entry) => !(entry.id === id && entry.variant === variant),
    );
    writeCart(items);
};

export const clearCart = () => {
    writeCart([]);
};
