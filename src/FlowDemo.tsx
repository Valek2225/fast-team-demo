import React, { useEffect, useMemo, useRef, useState } from 'react';

type Step =
  | 'cart'
  | 'confirmed'
  | 'mascotIntro'
  | 'lobbyArrival'
  | 'lobbyAutoScroll'
  | 'lobbyHint'
  | 'fullList'
  | 'foundItem'
  | 'crediting'
  | 'claimed'
  | 'done';

const STEP_ORDER: Step[] = [
  'cart',
  'confirmed',
  'mascotIntro',
  'lobbyArrival',
  'lobbyAutoScroll',
  'lobbyHint',
  'fullList',
  'foundItem',
  'crediting',
  'claimed',
  'done',
];

const STEP_LABEL: Record<Step, string> = {
  cart: '1 · Корзина',
  confirmed: '2 · Заказ оформлен',
  mascotIntro: '3 · Знакомство',
  lobbyArrival: '4 · Главное лобби',
  lobbyAutoScroll: '5 · Авто-скролл',
  lobbyHint: '6 · Жми «Все»',
  fullList: '7 · Полная лента',
  foundItem: '8 · Нашёл Толю',
  crediting: '9 · Начисляем стрик',
  claimed: '10 · Стрик +1',
  done: '11 · Готово',
};

/* ============================================================
   SVG bits
   ============================================================ */

function FoxFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Лис Толя">
      <defs>
        <radialGradient id={`fox-body-${size}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb070" />
          <stop offset="60%" stopColor="#ff7a3a" />
          <stop offset="100%" stopColor="#e85a1a" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="78" rx="40" ry="34" fill={`url(#fox-body-${size})`} />
      <path d="M22 50 L30 80 L42 70 Z" fill="#ff7a3a" />
      <path d="M98 50 L90 80 L78 70 Z" fill="#ff7a3a" />
      <path d="M28 56 L33 73 L40 68 Z" fill="#fff1e6" />
      <path d="M92 56 L87 73 L80 68 Z" fill="#fff1e6" />
      <ellipse cx="60" cy="86" rx="22" ry="16" fill="#fff5ec" />
      <circle cx="48" cy="74" r="4" fill="#1a1a1a" />
      <circle cx="72" cy="74" r="4" fill="#1a1a1a" />
      <circle cx="49" cy="73" r="1.4" fill="#fff" />
      <circle cx="73" cy="73" r="1.4" fill="#fff" />
      <ellipse cx="60" cy="86" rx="3.5" ry="2.6" fill="#1a1a1a" />
      <path
        d="M52 92 Q60 99 68 92"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function CheckIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#30d158" strokeWidth="2.5" />
      <path
        d="M12 20.5 L17.5 26 L28 14"
        stroke="#30d158"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function GiftIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="9" width="18" height="11" rx="2" stroke="#ffd24a" strokeWidth="1.8" />
      <path d="M3 13 H21" stroke="#ffd24a" strokeWidth="1.8" />
      <path d="M12 9 V20" stroke="#ffd24a" strokeWidth="1.8" />
      <path
        d="M12 9 C9 9 6 6.5 7.5 4.5 C9 3 12 5.5 12 9 Z"
        stroke="#ffd24a"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M12 9 C15 9 18 6.5 16.5 4.5 C15 3 12 5.5 12 9 Z"
        stroke="#ffd24a"
        strokeWidth="1.8"
        fill="none"
      />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="#7d8390" strokeWidth="1.6" />
      <path d="M11 11 L14 14" stroke="#7d8390" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path
        d="M5 2.5 L15 2.5 L15 17 L12 15.5 L10 17 L8 15.5 L5 17 Z"
        stroke="#3da9ff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.5 7 H12.5" stroke="#3da9ff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.5 10 H12.5" stroke="#3da9ff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   iPhone shell (как в /mobile, чуть переиспользуем)
   ============================================================ */

function StatusBar({ tBank = false }: { tBank?: boolean }) {
  return (
    <div className="iphone__statusbar iphone__statusbar--flow">
      <span className="iphone__time">22:14</span>
      {tBank ? (
        <div className="iphone__notch-wrap">
          <div className="iphone__tbank-pill">Т-БАНК</div>
        </div>
      ) : (
        <div className="iphone__notch-wrap">
          <div className="iphone__dynamic-island" />
        </div>
      )}
      <div className="iphone__icons">
        <span className="iphone__signal" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="iphone__wifi" aria-hidden />
        <span className="iphone__battery" aria-hidden>
          <span className="iphone__battery-fill" />
        </span>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="iphone__home" aria-hidden>
      <div className="iphone__home-bar" />
    </div>
  );
}

/* ============================================================
   Cart screen (Шаг 1)
   ============================================================ */

const CART_ITEMS: { name: string; sub: string; price: number; emoji: string; qty: number }[] = [
  {
    name: 'Вода минеральная "Рычал-Су"',
    sub: '1 л',
    price: 151,
    emoji: '💧',
    qty: 1,
  },
  {
    name: 'Тальятелле с курицей в сырном соусе',
    sub: '240 г · осталось 2',
    price: 299,
    emoji: '🍝',
    qty: 1,
  },
  {
    name: 'Эскимо Пломбир шоколадный',
    sub: '80 г',
    price: 172,
    emoji: '🍦',
    qty: 1,
  },
];

const CART_TOTAL = 622;

function ScreenCart({ onCheckout }: { onCheckout: () => void }) {
  return (
    <div className="iphone__screen iphone__screen--cart iphone__screen--locked">
      <div className="m-app m-app--lobby">
        <div className="lobby-top">
          <button className="lobby-top__close">Закрыть</button>
          <div className="lobby-top__addr">
            <span className="lobby-top__addr-line">деревня Новая Купавна</span>
            <span className="lobby-top__addr-main">Сиреневая улица, 21 ▾</span>
          </div>
          <button className="lobby-top__receipt" aria-label="Чеки">
            <ReceiptIcon />
          </button>
        </div>

        <h2 className="cart-title">Корзина · ВкусВилл</h2>
        <p className="cart-sub">Завтра с 07:00</p>

        <ul className="cart-list">
          {CART_ITEMS.map((it) => (
            <li key={it.name} className="cart-item">
              <span className="cart-item__emoji" aria-hidden>
                {it.emoji}
              </span>
              <div className="cart-item__text">
                <span className="cart-item__name">{it.name}</span>
                <span className="cart-item__sub">{it.sub}</span>
              </div>
              <div className="cart-item__qty">
                <span>−</span>
                <span className="cart-item__qty-num">{it.qty}</span>
                <span>+</span>
              </div>
              <span className="cart-item__price">{it.price} ₽</span>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <div className="cart-summary__row">
            <span>Товары</span>
            <span>{CART_TOTAL} ₽</span>
          </div>
          <div className="cart-summary__row">
            <span>Доставка</span>
            <span className="m-summary__free">Бесплатно</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Итого</span>
            <span>{CART_TOTAL} ₽</span>
          </div>
        </div>
      </div>

      <button className="m-cta m-cta--gold m-cta--cart" onClick={onCheckout}>
        <span>Оформить заказ · {CART_TOTAL} ₽</span>
        <span className="m-cta__arrow">→</span>
      </button>
    </div>
  );
}

/* ============================================================
   Order confirmed (Шаг 2)
   ============================================================ */

function ScreenOrderConfirmed({ onUnpack }: { onUnpack: () => void }) {
  return (
    <div className="iphone__screen iphone__screen--order iphone__screen--locked">
      <div className="m-app">
        <div className="m-app__topnav">
          <button className="m-app__back" aria-label="Назад">
            <span />
          </button>
          <span className="m-app__title">Заказ оформлен</span>
          <span className="m-app__placeholder" />
        </div>

        <div className="m-success">
          <div className="m-success__icon">
            <CheckIcon />
          </div>
          <h1 className="m-success__title">Спасибо!</h1>
          <p className="m-success__sub">Заказ № 87 245 · ВкусВилл</p>
          <div className="m-success__eta">
            <span className="m-success__eta-label">Курьер</span>
            <span className="m-success__eta-value">придёт завтра с 07:00</span>
          </div>
        </div>

        <div className="m-card m-card--gift">
          <div className="m-card__head">
            <GiftIcon />
            <span className="m-card__head-title">Вам подарок</span>
            <span className="m-card__badge">первый заказ</span>
          </div>
          <p className="m-card__text">
            За первый заказ в Т-Городе мы дарим вам маскота — он будет помогать ловить лучшие
            предложения каждый день.
          </p>
          <button className="m-cta m-cta--gold" onClick={onUnpack}>
            <span>Распаковать подарок</span>
            <span className="m-cta__arrow">→</span>
          </button>
        </div>

        <div className="m-card m-card--soft">
          <span className="m-card__head-title">Курьер на пути</span>
          <div className="m-courier">
            <div className="m-courier__dot" />
            <div className="m-courier__line">
              <div className="m-courier__progress" />
            </div>
            <div className="m-courier__dot m-courier__dot--end" />
          </div>
          <div className="m-courier__labels">
            <span>Собирают</span>
            <span>В пути</span>
            <span>У вас</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Mascot intro (Шаг 3)
   ============================================================ */

function ScreenMascotIntro({ onCatch }: { onCatch: () => void }) {
  return (
    <div className="iphone__screen iphone__screen--mascot iphone__screen--locked">
      <div className="m-app m-app--mascot">
        <div className="m-app__topnav">
          <button className="m-app__back" aria-label="Закрыть">
            <span className="m-app__back-x" />
          </button>
          <span className="m-app__title">Знакомство</span>
          <span className="m-app__placeholder" />
        </div>

        <div className="m-mascot-stage">
          <div className="m-mascot-stage__halo" />
          <div className="m-mascot-stage__halo m-mascot-stage__halo--inner" />
          <div className="m-mascot-stage__fox">
            <FoxFace size={150} />
          </div>
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--a" />
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--b" />
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--c" />
        </div>

        <div className="m-mascot-text">
          <h1 className="m-mascot-text__title">Привет! Я Лис Толя</h1>
          <p className="m-mascot-text__sub">
            Каждый день буду оставлять для тебя одно классное предложение в твоей ленте «Подобрали
            для вас». Поймаешь — продлишь стрик. Пропустишь день — я посплю, не обижусь.
          </p>
        </div>

        <div className="m-mascot-card">
          <div className="m-mascot-card__head">
            <span className="m-mascot-card__tag">День 1</span>
            <span className="m-mascot-card__streak">🔥 0 дней подряд</span>
          </div>
          <div className="m-streak-track">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`m-streak-day ${i === 0 ? 'm-streak-day--active' : ''}`}>
                <span className="m-streak-day__num">{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="m-mascot-card__hint">
            Поймай первое предложение в ленте, чтобы запустить стрик.
          </p>
        </div>

        <button className="m-cta m-cta--gold m-cta--sticky" onClick={onCatch}>
          <span>Поймать первое предложение</span>
          <span className="m-cta__arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Lobby screen (Шаги 4..7)
   ============================================================ */

const SHOPS: { id: string; name: string; eta: string; bg: string; logo: string; logoColor: string }[] = [
  { id: 'vv', name: 'ВкусВилл', eta: 'Завтра с 07:00', bg: '#3aa948', logo: 'BB', logoColor: '#fff' },
  { id: 'pk', name: 'Перекрёсток', eta: '30 – 45 мин', bg: '#0d4f2a', logo: '✿', logoColor: '#fff' },
  { id: 'ash', name: 'Ашан', eta: 'Завтра с 11:30', bg: '#d63333', logo: '🐦', logoColor: '#fff' },
  { id: 'metro', name: 'METRO', eta: 'Завтра с 10:00', bg: '#0e3b8c', logo: 'M', logoColor: '#ffd400' },
  { id: 'globus', name: 'Глобус', eta: 'Завтра с 09:00', bg: '#f59425', logo: 'globus', logoColor: '#005ea6' },
  { id: 'sgr', name: 'Сгоряча ВкусВи…', eta: 'Завтра с 07:00', bg: '#dc224a', logo: 'C', logoColor: '#fff' },
];

type Recommend = {
  id: string;
  name: string;
  sub?: string;
  weight: string;
  price: string;
  emoji: string;
  fromTolya?: boolean;
  badge?: string;
};

// Горизонтальная карусель в Main Lobby — обычные товары, БЕЗ Толи.
const LOBBY_RECOMMENDS: Recommend[] = [
  { id: 'lr1', name: 'Вода минеральная "Рычал-Су"', weight: '1 л', price: '151 ₽', emoji: '💧' },
  { id: 'lr2', name: 'Тальятелле с курицей', weight: '240 г', price: '299 ₽', emoji: '🍝', badge: 'Осталось 2' },
  { id: 'lr3', name: 'Ролл Филадельфия', weight: '255 г', price: '616 ₽', emoji: '🍣', badge: 'Осталось 1' },
  { id: 'lr4', name: 'Эскимо Пломбир', weight: '80 г', price: '172 ₽', emoji: '🍦' },
  { id: 'lr5', name: 'Авокадо Хасс', weight: '360 г', price: '180 ₽', emoji: '🥑' },
];

// Полная вертикальная лента — открывается по тапу «Все». Толя на 11 позиции (Row 4 центр).
// Чтобы увидеть карточку, пользователю нужно проскроллить ленту вниз ~ на 1 ряд — эффект «ищу».
const FULL_RECOMMENDS: Recommend[] = [
  { id: 'f1', name: 'Вода минеральная "Рычал-Су"', weight: '1 л', price: '151 ₽', emoji: '💧' },
  { id: 'f2', name: 'Тальятелле с курицей в сырном соусе', weight: '240 г', price: '299 ₽', emoji: '🍝', badge: 'Осталось 2' },
  { id: 'f3', name: 'Эскимо Пломбир шоколадный в молочном шоколаде', weight: '80 г', price: '172 ₽', emoji: '🍦' },
  { id: 'f4', name: 'Бедро цыплёнка-бройлера бескостное', weight: '850 г', price: '499,80 ₽', emoji: '🍗' },
  { id: 'f5', name: 'Блины шоколадные с маскарпоне и вишней', weight: '210 г', price: '268 ₽', emoji: '🥞', badge: 'Осталось 2' },
  { id: 'f6', name: 'Малина в белом шоколаде «Фрамбуа»', weight: '130 г', price: '845 ₽', emoji: '🍫' },
  { id: 'f7', name: 'Сыр Гауда 42%', weight: '200 г', price: '199 ₽', emoji: '🧀' },
  { id: 'f8', name: 'Шампиньоны королевские', weight: '500 г', price: '159 ₽', emoji: '🍄', badge: 'Осталось 3' },
  { id: 'f9', name: 'Йогурт греческий натуральный', weight: '300 г', price: '149 ₽', emoji: '🥛' },
  { id: 'f10', name: 'Кофе в зёрнах средняя обжарка', weight: '250 г', price: '349 ₽', emoji: '☕' },
  { id: 'f11', name: 'Хлеб Бородинский нарезка', sub: 'твой любимый', weight: '300 г', price: '79 ₽', emoji: '🍞', fromTolya: true },
  { id: 'f12', name: 'Авокадо Хасс спелые', weight: '360 г', price: '180 ₽', emoji: '🥑' },
];

const TOLYA_FULL_INDEX = FULL_RECOMMENDS.findIndex((r) => r.fromTolya);

type LobbyProps = {
  step: Step;
  onOpenFullList: () => void;
  recommendsAnchorRef: React.RefObject<HTMLDivElement>;
  carouselRef: React.RefObject<HTMLDivElement>;
};

function ScreenLobby({
  step,
  onOpenFullList,
  recommendsAnchorRef,
  carouselRef,
}: LobbyProps) {
  const moreActive = step === 'lobbyHint';
  // Пока ждём авто-скролл к «Подобрали для вас» и тап по «Все» — блокируем скролл экрана,
  // чтобы не сбить анимацию и не увести фокус с CTA.
  const scrollLocked =
    step === 'lobbyArrival' || step === 'lobbyAutoScroll' || step === 'lobbyHint';
  return (
    <div
      className={`iphone__screen iphone__screen--lobby${
        scrollLocked ? ' iphone__screen--locked' : ''
      }`}
    >
      <div className="lobby-content">
        <div className="lobby-top">
          <button className="lobby-top__close">Закрыть</button>
          <div className="lobby-top__addr">
            <span className="lobby-top__addr-line">деревня Новая Купавна</span>
            <span className="lobby-top__addr-main">Сиреневая улица, 21 ▾</span>
          </div>
          <button className="lobby-top__receipt" aria-label="Чеки">
            <ReceiptIcon />
          </button>
        </div>

        <div className="lobby-search">
          <SearchIcon />
          <span className="lobby-search__placeholder">Поиск по продуктам</span>
        </div>

        <h3 className="lobby-section-title">Магазины</h3>
        <div className="lobby-shops">
          {SHOPS.map((s) => (
            <div key={s.id} className="lobby-shop">
              <div className="lobby-shop__tile" style={{ background: s.bg }}>
                <span className="lobby-shop__discount">15%</span>
                {s.id === 'pk' && (
                  <span className="lobby-shop__discount lobby-shop__discount--big">40%</span>
                )}
                {s.id !== 'pk' && null}
                <span
                  className="lobby-shop__logo"
                  style={{ color: s.logoColor }}
                  data-logo={s.logo}
                >
                  {s.logo}
                </span>
              </div>
              <div className="lobby-shop__name">{s.name}</div>
              <div className="lobby-shop__eta">{s.eta}</div>
            </div>
          ))}
        </div>

        <h3 className="lobby-section-title">Бесплатная доставка</h3>
        <div className="lobby-free">
          <div className="lobby-shop">
            <div className="lobby-shop__tile lobby-shop__tile--big" style={{ background: '#3aa948' }}>
              <span className="lobby-shop__discount">15%</span>
              <span className="lobby-shop__logo lobby-shop__logo--big">BB</span>
            </div>
            <div className="lobby-shop__name">ВкусВилл</div>
            <div className="lobby-shop__eta">Завтра с 07:00</div>
          </div>
        </div>

        <div ref={recommendsAnchorRef} className="lobby-anchor" />
        <div
          className={`lobby-recommends-head ${
            step === 'lobbyHint' ? 'lobby-recommends-head--pulse' : ''
          }`}
        >
          <h3 className="lobby-section-title">Подобрали для вас</h3>
          <button
            type="button"
            className={`lobby-recommends-head__more${moreActive ? ' lobby-recommends-head__more--pulse' : ''}`}
            onClick={onOpenFullList}
          >
            Все
            {moreActive && <span className="lobby-more-badge" aria-hidden />}
          </button>
        </div>

        {step === 'lobbyHint' && (
          <div className="lobby-hint">
            <span className="lobby-hint__fox">
              <FoxFace size={28} />
            </span>
            <div className="lobby-hint__text">
              <span className="lobby-hint__title">Толя оставил для тебя предложение</span>
              <span className="lobby-hint__sub">
                Открой полную ленту — нажми «Все», там его карточка
              </span>
            </div>
          </div>
        )}

        <div className="lobby-recommends-tabs">
          <div className="lobby-recommends-tab lobby-recommends-tab--active">
            <span className="lobby-recommends-tab__avatar" style={{ background: '#3aa948' }}>
              BB
            </span>
            <div className="lobby-recommends-tab__text">
              <span>ВкусВилл</span>
              <span className="lobby-recommends-tab__sub">Завтра с 07:00</span>
            </div>
          </div>
          <div className="lobby-recommends-tab">
            <span
              className="lobby-recommends-tab__avatar"
              style={{ background: '#0d4f2a', color: '#fff' }}
            >
              ✿
            </span>
            <div className="lobby-recommends-tab__text">
              <span>Перекрёсток</span>
              <span className="lobby-recommends-tab__sub">30 – 45 мин</span>
            </div>
          </div>
        </div>

        <div ref={carouselRef} className="lobby-carousel">
          {LOBBY_RECOMMENDS.map((r, i) => (
            <div key={r.id} className="lobby-card" data-index={i}>
              <div className="lobby-card__media">
                {r.badge && <span className="lobby-card__badge">{r.badge}</span>}
                <span className="lobby-card__emoji" aria-hidden>
                  {r.emoji}
                </span>
              </div>
              <div className="lobby-card__price">{r.price}</div>
              <div className="lobby-card__name">{r.name}</div>
              <div className="lobby-card__bottom">
                <span className="lobby-card__weight">{r.weight}</span>
                <button className="lobby-card__plus" aria-label="Добавить">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="lobby-section-title">Алкоголь</h3>
        <div className="lobby-alcohol">
          <div className="lobby-alcohol__tile">🍷 ВинЛаб</div>
        </div>
      </div>

      <div className="lobby-bottom">
        <span className="lobby-bottom__shop">ВкусВилл</span>
        <span className="lobby-bottom__total">{CART_TOTAL} ₽</span>
      </div>
    </div>
  );
}

/* ============================================================
   Full vertical recommendations list (Шаги 7..10)
   ============================================================ */

type FullListProps = {
  step: Step;
  scrollRef: React.RefObject<HTMLDivElement>;
  tolyaCardRef: React.RefObject<HTMLDivElement>;
  onBack: () => void;
  onClaim: () => void;
  onOpenTolyaMenu: () => void;
};

function ScreenFullList({
  step,
  scrollRef,
  tolyaCardRef,
  onBack,
  onClaim,
  onOpenTolyaMenu,
}: FullListProps) {
  const isFocused = step === 'foundItem' || step === 'crediting' || step === 'claimed';
  const showTolyaBadge = step === 'done' || step === 'claimed' || step === 'crediting';
  const backLocked = step !== 'fullList';

  return (
    <div
      ref={scrollRef}
      className={`iphone__screen iphone__screen--fulllist${
        isFocused ? ' iphone__screen--locked' : ''
      }`}
    >
      <div className="full-list">
        <div className="full-list__topnav">
          <button
            className="full-list__back"
            onClick={backLocked ? undefined : onBack}
            aria-label="Назад"
            disabled={backLocked}
          >
            <span className="full-list__back-arrow" />
          </button>
          <h2 className="full-list__title">Подобрали для вас</h2>
          {showTolyaBadge ? (
            <button
              className={`full-list__tolya-pill${step === 'done' ? ' full-list__tolya-pill--pulse' : ''}`}
              onClick={onOpenTolyaMenu}
              aria-label="Открыть меню Толи"
            >
              🔥 1
            </button>
          ) : (
            <button className="full-list__search" aria-label="Поиск">
              <SearchIcon size={20} />
            </button>
          )}
        </div>

        <div className="lobby-recommends-tabs full-list__tabs">
          <div className="lobby-recommends-tab lobby-recommends-tab--active">
            <span className="lobby-recommends-tab__avatar" style={{ background: '#3aa948' }}>
              BB
            </span>
            <div className="lobby-recommends-tab__text">
              <span>ВкусВилл</span>
              <span className="lobby-recommends-tab__sub">Завтра с 07:00</span>
            </div>
          </div>
          <div className="lobby-recommends-tab">
            <span
              className="lobby-recommends-tab__avatar"
              style={{ background: '#0d4f2a', color: '#fff' }}
            >
              ✿
            </span>
            <div className="lobby-recommends-tab__text">
              <span>Перекрёсток</span>
              <span className="lobby-recommends-tab__sub">30 – 45 мин</span>
            </div>
          </div>
        </div>

        <div className="full-list__grid">
          {FULL_RECOMMENDS.map((r) => {
            const isTolya = !!r.fromTolya;
            const isTolyaFocused = isTolya && isFocused;
            return (
              <div
                key={r.id}
                ref={isTolya ? tolyaCardRef : undefined}
                className={`full-card${isTolya ? ' full-card--tolya' : ''}${
                  isTolyaFocused ? ' full-card--focused' : ''
                }`}
                data-tolya={isTolya ? '1' : undefined}
                onClick={() => {
                  if (isTolya && step === 'foundItem') onClaim();
                }}
              >
                <div className="full-card__media">
                  {r.badge && <span className="full-card__badge">{r.badge}</span>}
                  <span className="full-card__emoji" aria-hidden>
                    {r.emoji}
                  </span>
                  {isTolya && (
                    <span className="full-card__tolya-mark">
                      <FoxFace size={26} />
                    </span>
                  )}
                </div>
                <div className="full-card__price">{r.price}</div>
                <div className="full-card__name">{r.name}</div>
                <div className="full-card__bottom">
                  <span className="full-card__weight">{r.weight}</span>
                  <button className="full-card__plus" aria-label="Добавить">
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lobby-bottom">
        <span className="lobby-bottom__shop">ВкусВилл</span>
        <span className="lobby-bottom__total">{CART_TOTAL} ₽</span>
      </div>

      {step === 'fullList' && (
        <div className="full-list__hunt-hint">
          <span className="full-list__hunt-hint-fox">
            <FoxFace size={26} />
          </span>
          <span className="full-list__hunt-hint-text">
            Листай вниз, пока не увидишь товар Толи
          </span>
        </div>
      )}
    </div>
  );
}

function ClaimModal() {
  return (
    <div className="claim-modal" role="dialog" aria-modal="true">
      <div className="claim-modal__card">
        <div className="claim-modal__fox">
          <FoxFace size={72} />
        </div>
        <h3 className="claim-modal__title">🎉 Стрик обновлён!</h3>
        <p className="claim-modal__sub">Встретимся завтра!</p>
        <p className="claim-modal__status">Стрик продлён</p>
        <div className="claim-modal__streak">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`m-streak-day ${i === 0 ? 'm-streak-day--active' : ''}`}
            >
              <span className="m-streak-day__num">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreditFx() {
  return (
    <div className="credit-fx-screen" aria-hidden>
      <div className="credit-fx-screen__ring" />
      <div className="credit-fx-screen__chip">🔥 Огонёк +1</div>
    </div>
  );
}

function TolyaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="tolya-menu" role="dialog" aria-modal="true">
      <div className="tolya-menu__card">
        <button className="tolya-menu__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        <div className="tolya-menu__fox">
          <FoxFace size={72} />
        </div>
        <h3 className="tolya-menu__title">Меню Толи</h3>
        <p className="tolya-menu__sub">Текущий стрик: 🔥 1 день</p>
        <div className="tolya-menu__items">
          <button className="tolya-menu__item">Мой стрик</button>
          <button className="tolya-menu__item">Предложение дня</button>
          <button className="tolya-menu__item">Правила стрика</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FlowDemo — корневой компонент
   ============================================================ */

export function FlowDemo() {
  const [step, setStep] = useState<Step>('cart');
  const [tolyaMenuOpen, setTolyaMenuOpen] = useState(false);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const recommendsAnchorRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const fullListScrollRef = useRef<HTMLDivElement | null>(null);
  const tolyaCardRef = useRef<HTMLDivElement | null>(null);

  const goto = (next: Step) => setStep(next);
  const reset = () => {
    setTolyaMenuOpen(false);
    setStep('cart');
  };

  const skipNext = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1]);
  };
  const skipPrev = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  };

  // Авто-скролл при попадании в лобби
  useEffect(() => {
    if (step !== 'lobbyArrival') return;
    const t1 = setTimeout(() => goto('lobbyAutoScroll'), 700);
    return () => clearTimeout(t1);
  }, [step]);

  useEffect(() => {
    if (step !== 'lobbyAutoScroll') return;
    const screen = screenRef.current?.querySelector('.iphone__screen--lobby') as HTMLElement | null;
    const anchor = recommendsAnchorRef.current;
    if (!screen || !anchor) return;
    const top = anchor.offsetTop - 24;
    screen.scrollTo({ top, behavior: 'smooth' });
    const t2 = setTimeout(() => goto('lobbyHint'), 1400);
    return () => clearTimeout(t2);
  }, [step]);

  // Авто-закрытие claim-модала: повисел и сам улетел.
  useEffect(() => {
    if (step !== 'crediting') return;
    const t = setTimeout(() => {
      setStep((s) => (s === 'crediting' ? 'claimed' : s));
    }, 850);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'claimed') return;
    const t = setTimeout(() => {
      setStep((s) => (s === 'claimed' ? 'done' : s));
    }, 2400);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'done') setTolyaMenuOpen(false);
  }, [step]);

  // Слежение в полной ленте: IntersectionObserver на карточке Толи в её скролл-контейнере
  useEffect(() => {
    if (step !== 'fullList') return;
    const root = fullListScrollRef.current;
    const target = tolyaCardRef.current;
    if (!root || !target) return;

    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!triggered && entry.intersectionRatio >= 0.5) {
            triggered = true;
            // Сначала плавно центрируем карточку, затем переключаем state
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              setStep((s) => (s === 'fullList' ? 'foundItem' : s));
            }, 380);
            observer.disconnect();
          }
        });
      },
      { root, threshold: [0.5, 0.7] },
    );
    observer.observe(target);

    // Fallback: если юзер не доскроллил за 14 сек — система мягко доведёт сама
    const fallback = setTimeout(() => {
      if (triggered) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 14000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [step]);

  const stepContent = useMemo(() => {
    switch (step) {
      case 'cart':
        return <ScreenCart onCheckout={() => goto('confirmed')} />;
      case 'confirmed':
        return <ScreenOrderConfirmed onUnpack={() => goto('mascotIntro')} />;
      case 'mascotIntro':
        return <ScreenMascotIntro onCatch={() => goto('lobbyArrival')} />;
      case 'lobbyArrival':
      case 'lobbyAutoScroll':
      case 'lobbyHint':
        return (
          <ScreenLobby
            step={step}
            onOpenFullList={() => goto('fullList')}
            recommendsAnchorRef={recommendsAnchorRef}
            carouselRef={carouselRef}
          />
        );
      case 'fullList':
      case 'foundItem':
      case 'crediting':
      case 'claimed':
      case 'done':
        return (
          <ScreenFullList
            step={step}
            scrollRef={fullListScrollRef}
            tolyaCardRef={tolyaCardRef}
            onBack={() => goto('lobbyHint')}
            onClaim={() => goto('crediting')}
            onOpenTolyaMenu={() => setTolyaMenuOpen(true)}
          />
        );
      default:
        return null;
    }
  }, [step]);

  // Прогресс
  const stepIdx = STEP_ORDER.indexOf(step);
  const progress = (stepIdx / (STEP_ORDER.length - 1)) * 100;

  return (
    <div className="flow-demo">
      <header className="flow-demo__top">
        <a href="/mobile" className="flow-demo__back">
          ← К статичному мокапу
        </a>
        <div className="flow-demo__intro">
          <span className="flow-demo__eyebrow">Demo flow · интерактивный сценарий</span>
          <h1 className="flow-demo__title">
            Корзина → заказ → знакомство → ловим первое предложение
          </h1>
          <p className="flow-demo__sub">
            Один iPhone, один сквозной флоу. Кликаем «Оформить заказ» в корзине → дальше всё ведёт
            себя само: подарок → знакомство с Лисом Толей → попадаем в лобби → авто-скролл к ленте
            «Подобрали для вас» → подсказка «листайте» → ищем товар Толи в карусели → серый
            оверлей с акцентом → клейм → стрик +1.
          </p>
        </div>
      </header>

      <div className="flow-demo__controls">
        <button className="flow-demo__ctrl" onClick={reset} disabled={step === 'cart'}>
          ⟲ Сначала
        </button>
        <div className="flow-demo__progress">
          <div className="flow-demo__progress-bar" style={{ width: `${progress}%` }} />
          <span className="flow-demo__progress-label">{STEP_LABEL[step]}</span>
        </div>
        <button
          className="flow-demo__ctrl"
          onClick={skipPrev}
          disabled={step === 'cart'}
        >
          ← Шаг
        </button>
        <button
          className="flow-demo__ctrl"
          onClick={skipNext}
          disabled={step === 'claimed' || step === 'crediting'}
        >
          Шаг →
        </button>
      </div>

      <div className="flow-demo__stage" ref={screenRef}>
        <div className="iphone iphone--flow">
          <div className="iphone__frame">
            <StatusBar tBank />
            {stepContent}
            <HomeIndicator />

            {(step === 'foundItem' || step === 'crediting' || step === 'claimed') && (
              <div className="iphone__dim" />
            )}
            {step === 'crediting' && <CreditFx />}
            {step === 'claimed' && <ClaimModal />}
            {step === 'done' && tolyaMenuOpen && <TolyaMenu onClose={() => setTolyaMenuOpen(false)} />}
          </div>
        </div>
      </div>

      <div className="flow-demo__notes">
        <h2 className="flow-demo__notes-title">Что важно в этом flow</h2>
        <ul className="mobile-demo__notes-list">
          <li>
            <strong>Подарок появляется только после первого заказа.</strong> Не на онбординге, не
            «случайно». Маскот = награда, а не очередной поп-ап.
          </li>
          <li>
            <strong>Авто-скролл к «Подобрали для вас» в Main Lobby.</strong> Система мягко
            подводит юзера до ленты и подсказывает: «Толя оставил для тебя предложение —
            нажми Все». Кнопка «Все» пульсирует.
          </li>
          <li>
            <strong>Блокировка скролла на «обязательных» шагах.</strong> На экранах с главным
            действием (корзина → оформить, заказ → распаковать, знакомство → поймать) и в лобби на
            шагах 4–6 вертикальный скролл выключен — нельзя сбить авто-скролл и случайно увести
            фокус с кнопки «Все».
          </li>
          <li>
            <strong>Полная вертикальная лента, 3 колонки.</strong> Товар Толи — на 11-й позиции
            (4-й ряд, центр). При первом рендере он не виден: чтобы его поймать, нужно
            проскроллить вниз пару рядов — эффект «ищу, но не напрягаюсь».
          </li>
          <li>
            <strong>IntersectionObserver на ≥50%.</strong> Как только карточка Толи попадает в
            зону видимости на половину — система мгновенно центрирует её, накладывает тёмный
            оверлей <code>rgba(0,0,0,0.65)</code> и блокирует скролл/тапы. Активна только сама
            карточка.
          </li>
          <li>
            <strong>Анимация начисления и продления.</strong> После тапа по карточке сначала идёт
            короткая вспышка «🔥 Огонёк +1» на затемнённом фоне, затем появляется тост с
            плашкой «Стрик продлён» и анимированной ячейкой дня в шкале. Тост закрывается сам,
            после чего оверлей снимается, лента возвращается в обычный вид.
          </li>
        </ul>
        <p className="flow-demo__note-suffix">
          Активный шаг прогресс-бара = {STEP_LABEL[step]}. Толин товар — позиция{' '}
          {TOLYA_FULL_INDEX + 1} из {FULL_RECOMMENDS.length}.
        </p>
      </div>
    </div>
  );
}
