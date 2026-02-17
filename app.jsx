const { useEffect, useMemo, useState } = React;

const items = [
  { id: 1, name: 'Masala Crostini Chaat', desc: 'Crisp bites with mint yogurt', price: 220, category: 'snacks' },
  { id: 2, name: 'Royal Mithai Box', desc: 'Assorted handcrafted sweets', price: 690, category: 'combos' },
  { id: 3, name: 'Saffron Rabri Jar', desc: 'Slow reduced milk indulgence', price: 280, category: 'sweets' },
  { id: 4, name: 'Rose Cold Cocoa', desc: 'Chocolate shake with gulkand', price: 190, category: 'beverages' },
  { id: 5, name: 'Dahi Puri Velvet', desc: 'Tangy and creamy signature', price: 210, category: 'snacks' },
  { id: 6, name: 'Evening Tasting Duo', desc: 'Savory + sweet curated combo', price: 420, category: 'combos' },
  { id: 7, name: 'Pista Kunafa Bite', desc: 'Crisp layers with pistachio cream', price: 320, category: 'sweets' },
  { id: 8, name: 'Kesar Badam Latte', desc: 'Warm comfort with saffron aroma', price: 210, category: 'beverages' }
];

const categories = ['all', 'snacks', 'combos', 'sweets', 'beverages'];
const featured = [
  { cls: 'flavor-rose', title: 'Rose Pistachio Truffle', desc: 'Silky couverture with floral notes.' },
  { cls: 'flavor-kesar', title: 'Kesar Milk Cake', desc: 'Slow-cooked richness with saffron bloom.' },
  { cls: 'flavor-hazelnut', title: 'Dark Hazelnut Dome', desc: 'Bold cocoa layered with crunch.' },
  { cls: 'flavor-mango', title: 'Mango Ras Delight', desc: 'Seasonal fruit cream in velvet sponge.' }
];

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredItems = useMemo(
    () => (activeCategory === 'all' ? items : items.filter((item) => item.category === activeCategory)),
    [activeCategory]
  );

  const cartEntries = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(() => cartEntries.reduce((sum, { item, qty }) => sum + item.price * qty, 0), [cartEntries]);

  const addToCart = (id) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    setCart((prev) => ({ ...prev, [id]: { item, qty: (prev[id]?.qty ?? 0) + 1 } }));
  };

  const stepCart = (id, step) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const nextQty = current.qty + step;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...current, qty: nextQty } };
    });
  };

  return (
    <>
      <div className="page-fade" />
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#home" className="brand"><span className="brand-mark">DC</span><span>DesiCrunch</span></a>
        <button className="menu-toggle" aria-label="Open navigation" onClick={() => setNavOpen((s) => !s)}>☰</button>
        <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
          {['home', 'menu', 'about', 'orders', 'contact'].map((name) => (
            <a key={name} href={`#${name}`} onClick={() => setNavOpen(false)}>{name[0].toUpperCase() + name.slice(1)}</a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero reveal" id="home">
          <div>
            <p className="eyebrow">Handcrafted · Curated · Fresh</p>
            <h1>A Luxury Dessert Boutique for Desi Cravings.</h1>
            <p className="hero-copy">Discover signature mithai bites, cloud-soft cakes, and curated snacks made with authentic ingredients and a modern touch.</p>
            <a href="#menu" className="btn">View Menu</a>
          </div>
          <div className="hero-image-wrap"><div className="hero-image" /></div>
        </section>

        <section className="featured reveal">
          <h2>Signature Picks</h2>
          <div className="featured-row">
            {featured.map((f) => (
              <article className="featured-item" key={f.title}><div className={`featured-circle ${f.cls}`} /><h3>{f.title}</h3><p>{f.desc}</p></article>
            ))}
          </div>
        </section>

        <section className="menu-section reveal" id="menu">
          <div className="section-head">
            <h2>Curated Menu</h2>
            <div className="filters">
              {categories.map((cat) => (
                <button key={cat} className={`filter ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat[0].toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image" />
                <div className="food-content">
                  <h3>{item.name}</h3><p>{item.desc}</p>
                  <div className="food-row"><strong>₹{item.price}</strong><div>
                    <button className="btn" onClick={() => setModalItem(item)}>Details</button>
                    <button className="btn" onClick={() => addToCart(item.id)}>Add</button>
                  </div></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="story reveal" id="about">
          <div className="story-image" />
          <div className="story-copy"><p className="eyebrow">Our Story</p><h2>Homemade heart. Boutique finish.</h2>
            <p>Every DesiCrunch creation starts with authentic regional recipes and is elevated through premium ingredients, refined plating, and thoughtful craftsmanship.</p>
            <p>From festive sweets to late-night comfort bites, each batch is made fresh, made gently, and made with love.</p>
          </div>
        </section>

        <section className="orders reveal" id="orders">
          <div className="order-list"><h2>Your Order Box</h2>
            {cartEntries.length === 0 ? <p className="empty-state">Your box is empty. Add signature bites to begin.</p> :
              cartEntries.map(({ item, qty }) => (
                <div className="order-item" key={item.id}><div className="thumb" />
                  <div><strong>{item.name}</strong><p>₹{item.price}</p></div>
                  <div className="order-actions"><button className="stepper" onClick={() => stepCart(item.id, -1)}>-</button><span>{qty}</span><button className="stepper" onClick={() => stepCart(item.id, 1)}>+</button></div>
                </div>
              ))}
          </div>
          <aside className="summary-card"><h3>Order Summary</h3><dl>
            <div><dt>Subtotal</dt><dd>₹{subtotal}</dd></div>
            <div><dt>Delivery</dt><dd>₹90</dd></div>
            <div className="total-row"><dt>Total</dt><dd>₹{subtotal + 90}</dd></div>
          </dl><a href="#checkout" className="btn wide">Checkout</a></aside>
        </section>

        <section className="checkout reveal" id="checkout">
          <h2>Checkout</h2>
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <textarea placeholder="Delivery Address" rows="3" required />
            <textarea placeholder="Notes (optional)" rows="2" />
            <div className="payments"><label><input type="radio" name="pay" defaultChecked /> UPI</label><label><input type="radio" name="pay" /> Card</label><label><input type="radio" name="pay" /> COD</label></div>
            <button type="submit" className="btn wide">Place Order</button>
          </form>
        </section>
      </main>

      <button className="mobile-order-btn" onClick={() => document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth' })}>View Order</button>

      <footer id="contact">
        <div><h3>DesiCrunch</h3><p>Handcrafted luxury bites.</p></div>
        <div><a href="#menu">Menu</a><a href="#about">About</a><a href="#orders">Orders</a></div>
        <div><p>Instagram: @desicrunch</p><p>+91 98765 43210</p><p>Delhi NCR · 10am to 11pm</p></div>
      </footer>

      {modalItem && <dialog className="product-modal" open><article>
        <button className="close-modal" onClick={() => setModalItem(null)}>✕</button>
        <div className="modal-image" style={{ filter: `hue-rotate(${modalItem.id * 22}deg)` }} />
        <h3>{modalItem.name}</h3><p>{modalItem.desc}</p><p className="modal-price">₹{modalItem.price}</p>
        <button className="btn wide" onClick={() => { addToCart(modalItem.id); setModalItem(null); }}>Add to Order</button>
      </article></dialog>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
