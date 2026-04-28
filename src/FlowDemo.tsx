import React, { useEffect, useMemo, useRef, useState } from 'react';

type Step =
  | 'cart'
  | 'confirmed'
  | 'mascotIntro'
  | 'lobbyArrival'
  | 'lobbyAutoScroll'
  | 'lobbyHint'
  | 'recommendsHunt'
  | 'foundItem'
  | 'claimed';

const STEP_ORDER: Step[] = [
  'cart',
  'confirmed',
  'mascotIntro',
  'lobbyArrival',
  'lobbyAutoScroll',
  'lobbyHint',
  'recommendsHunt',
  'foundItem',
  'claimed',
];

const STEP_LABEL: Record<Step, string> = {
  cart: '1 · Корзина',
  confirmed: '2 · Заказ оформлен',
  mascotIntro: '3 · Знакомство',
  lobbyArrival: '4 · Главное лобби',
  lobbyAutoScroll: '5 · Авто-скролл',
  lobbyHint: '6 · Подсказка',
  recommendsHunt: '7 · Ищем товар Толи',
  foundItem: '8 · Нашёл!',
  claimed: '9 · Стрик +1',
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
    <div className="iphone__screen iphone__screen--cart">
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
    <div className="iphone__screen iphone__screen--order">
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
    <div className="iphone__screen iphone__screen--mascot">
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
  shopId: string;
  shopColor: string;
  fromTolya?: boolean;
  badge?: string;
};

const RECOMMENDS: Recommend[] = [
  {
    id: 'r1',
    name: 'Вода минеральная "Рычал-Су"',
    weight: '1 л',
    price: '151 ₽',
    emoji: '💧',
    shopId: 'vv',
    shopColor: '#3aa948',
  },
  {
    id: 'r2',
    name: 'Тальятелле с курицей',
    weight: '240 г',
    price: '299 ₽',
    emoji: '🍝',
    shopId: 'vv',
    shopColor: '#3aa948',
    badge: 'Осталось 2',
  },
  {
    id: 'r3',
    name: 'Ролл Филадельфия',
    weight: '255 г',
    price: '616 ₽',
    emoji: '🍣',
    shopId: 'vv',
    shopColor: '#3aa948',
    badge: 'Осталось 1',
  },
  {
    id: 'r4',
    name: 'Эскимо Пломбир',
    weight: '80 г',
    price: '172 ₽',
    emoji: '🍦',
    shopId: 'vv',
    shopColor: '#3aa948',
  },
  {
    id: 'r5',
    name: 'Хлеб Бородинский',
    sub: 'нарезка, любимый',
    weight: '300 г',
    price: '79 ₽',
    emoji: '🍞',
    shopId: 'vv',
    shopColor: '#3aa948',
    fromTolya: true,
  },
  {
    id: 'r6',
    name: 'Бедро цыплёнка-бройлера',
    weight: '850 г',
    price: '499,80 ₽',
    emoji: '🍗',
    shopId: 'vv',
    shopColor: '#3aa948',
  },
  {
    id: 'r7',
    name: 'Блины с маскарпоне',
    weight: '210 г',
    price: '268 ₽',
    emoji: '🥞',
    shopId: 'vv',
    shopColor: '#3aa948',
    badge: 'Осталось 2',
  },
  {
    id: 'r8',
    name: 'Малина в белом шоколаде',
    weight: '130 г',
    price: '845 ₽',
    emoji: '🍫',
    shopId: 'vv',
    shopColor: '#3aa948',
  },
];

const TOLYA_INDEX = RECOMMENDS.findIndex((r) => r.fromTolya);

type LobbyProps = {
  step: Step;
  onItemFound?: () => void;
  onItemClaim: () => void;
  recommendsAnchorRef: React.RefObject<HTMLDivElement>;
  carouselRef: React.RefObject<HTMLDivElement>;
};

function ScreenLobby({
  step,
  onItemClaim,
  recommendsAnchorRef,
  carouselRef,
}: LobbyProps) {
  return (
    <div className="iphone__screen iphone__screen--lobby">
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
            step === 'lobbyHint' || step === 'recommendsHunt'
              ? 'lobby-recommends-head--pulse'
              : ''
          }`}
        >
          <h3 className="lobby-section-title">Подобрали для вас</h3>
          <span className="lobby-recommends-head__more">Все</span>
        </div>

        {(step === 'lobbyHint' || step === 'recommendsHunt') && (
          <div className="lobby-hint">
            <span className="lobby-hint__fox">
              <FoxFace size={28} />
            </span>
            <div className="lobby-hint__text">
              <span className="lobby-hint__title">Толя оставил для тебя предложение</span>
              <span className="lobby-hint__sub">
                {step === 'lobbyHint'
                  ? 'Листай ленту вправо — найди карточку с лисом'
                  : 'Листай дальше — карточка где-то рядом'}
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

        <div ref={carouselRef} className="lobby-carousel" data-step={step}>
          {RECOMMENDS.map((r, i) => {
            const isTolya = !!r.fromTolya;
            const isFoundTarget = isTolya && (step === 'foundItem' || step === 'claimed');
            return (
              <div
                key={r.id}
                className={`lobby-card${isTolya ? ' lobby-card--tolya' : ''}${
                  isFoundTarget ? ' lobby-card--found' : ''
                }`}
                data-index={i}
                onClick={() => {
                  if (isFoundTarget && step === 'foundItem') onItemClaim();
                }}
              >
                <div className="lobby-card__media">
                  {r.badge && <span className="lobby-card__badge">{r.badge}</span>}
                  <span className="lobby-card__emoji" aria-hidden>
                    {r.emoji}
                  </span>
                  {isTolya && (
                    <span className="lobby-card__tolya-mark">
                      <FoxFace size={28} />
                    </span>
                  )}
                </div>
                <div className="lobby-card__price">{r.price}</div>
                <div className="lobby-card__name">{r.name}</div>
                {r.sub && <div className="lobby-card__sub">{r.sub}</div>}
                <div className="lobby-card__bottom">
                  <span className="lobby-card__weight">{r.weight}</span>
                  <button className="lobby-card__plus" aria-label="Добавить">
                    +
                  </button>
                </div>
                {isTolya && <div className="lobby-card__tolya-strip">От Толи · день 1</div>}
                {isFoundTarget && step === 'foundItem' && (
                  <div className="lobby-card__found-bubble">
                    <span className="lobby-card__found-title">Это от Толи</span>
                    <span className="lobby-card__found-sub">Нажми, чтобы поймать</span>
                  </div>
                )}
              </div>
            );
          })}
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
   FlowDemo — корневой компонент
   ============================================================ */

export function FlowDemo() {
  const [step, setStep] = useState<Step>('cart');
  const screenRef = useRef<HTMLDivElement | null>(null);
  const recommendsAnchorRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const goto = (next: Step) => setStep(next);
  const reset = () => setStep('cart');

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

  useEffect(() => {
    if (step !== 'lobbyHint') return;
    const t3 = setTimeout(() => goto('recommendsHunt'), 2300);
    return () => clearTimeout(t3);
  }, [step]);

  // Слежение за горизонтальной каруселью
  useEffect(() => {
    if (step !== 'recommendsHunt') return;
    const car = carouselRef.current;
    if (!car) return;
    let triggered = false;
    const onScroll = () => {
      const cards = Array.from(car.querySelectorAll<HTMLElement>('.lobby-card'));
      if (cards.length === 0) return;
      const carRect = car.getBoundingClientRect();
      const carCenter = carRect.left + carRect.width / 2;
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const dist = Math.abs(center - carCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      setActiveCardIndex(closestIdx);
      if (closestIdx === TOLYA_INDEX && !triggered) {
        triggered = true;
        setTimeout(() => {
          setStep((s) => (s === 'recommendsHunt' ? 'foundItem' : s));
        }, 350);
      }
    };
    car.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // Fallback: если за 12 сек пользователь не нашёл — мягко довести до карточки сами
    const fallback = setTimeout(() => {
      if (triggered) return;
      const card = car.querySelector<HTMLElement>(`.lobby-card[data-index="${TOLYA_INDEX}"]`);
      card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 12000);
    return () => {
      car.removeEventListener('scroll', onScroll);
      clearTimeout(fallback);
    };
  }, [step]);

  // Если нашёл сам — делаем мягкий зум-в-карточку
  useEffect(() => {
    if (step !== 'foundItem') return;
    const car = carouselRef.current;
    if (!car) return;
    const card = car.querySelector<HTMLElement>(`.lobby-card[data-index="${TOLYA_INDEX}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [step]);

  // Авто-вернуться на cart после claimed (по желанию — оставим вручную)
  // Не делаем, чтобы пользователь сам решил.

  const stepContent = useMemo(() => {
    switch (step) {
      case 'cart':
        return <ScreenCart onCheckout={() => goto('confirmed')} />;
      case 'confirmed':
        return <ScreenOrderConfirmed onUnpack={() => goto('mascotIntro')} />;
      case 'mascotIntro':
        return <ScreenMascotIntro onCatch={() => goto('lobbyArrival')} />;
      default:
        return (
          <ScreenLobby
            step={step}
            onItemFound={() => goto('foundItem')}
            onItemClaim={() => goto('claimed')}
            recommendsAnchorRef={recommendsAnchorRef}
            carouselRef={carouselRef}
          />
        );
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
          disabled={step === 'claimed'}
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

            {step === 'foundItem' && <div className="iphone__dim" />}

            {step === 'claimed' && (
              <div className="flow-claimed">
                <div className="flow-claimed__halo" />
                <div className="flow-claimed__fox">
                  <FoxFace size={120} />
                </div>
                <h2 className="flow-claimed__title">Стрик +1</h2>
                <p className="flow-claimed__sub">Толя доволен. День 1 пойман.</p>
                <div className="flow-claimed__streak">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`m-streak-day ${i === 0 ? 'm-streak-day--active' : ''}`}
                    >
                      <span className="m-streak-day__num">{i + 1}</span>
                    </div>
                  ))}
                </div>
                <button className="m-cta m-cta--gold" onClick={reset}>
                  <span>Пройти сценарий заново</span>
                  <span className="m-cta__arrow">↺</span>
                </button>
              </div>
            )}
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
            <strong>Авто-скролл к «Подобрали для вас».</strong> Пользователю не приходится самому
            догадываться — система мягко доставляет его до ленты, потом пульс-подсветка и
            подсказка «листай».
          </li>
          <li>
            <strong>Товар Толи на 5-й позиции.</strong> Не первый и не последний — нужно сделать
            пару свайпов. Лента имеет scroll-snap, чтобы её нельзя было прошвырнуть как ленту в
            ленте — карточки чётко защёлкиваются. Эффект «всматривается, но не напрягается».
          </li>
          <li>
            <strong>Серый оверлей + акцент на найденной карточке.</strong> Когда товар Толи
            оказывается в центре экрана, контекст вокруг приглушается — фокус только на нужном.
            Активный CTA — нажать на карточку.
          </li>
          <li>
            <strong>Финальный экран — короткий праздник, потом возврат к ленте.</strong> Не
            запираем юзера на success-страницу — стрик отмечен, продукт продолжает работать.
          </li>
        </ul>
        <p className="flow-demo__note-suffix">
          Активный шаг прогресс-бара = {STEP_LABEL[step]}. Активная карточка в карусели:{' '}
          {step === 'recommendsHunt' || step === 'foundItem'
            ? `${activeCardIndex + 1} из ${RECOMMENDS.length}`
            : '—'}
          .
        </p>
      </div>
    </div>
  );
}
