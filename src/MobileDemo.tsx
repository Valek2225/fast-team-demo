import React from 'react';

function StatusBar() {
  return (
    <div className="iphone__statusbar">
      <span className="iphone__time">9:41</span>
      <div className="iphone__notch-wrap">
        <div className="iphone__dynamic-island" />
      </div>
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

function FoxMascot({ size = 96 }: { size?: number }) {
  return (
    <svg
      className="fox"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Лис Толя"
    >
      <defs>
        <radialGradient id="fox-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffb070" />
          <stop offset="60%" stopColor="#ff7a3a" />
          <stop offset="100%" stopColor="#e85a1a" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="78" rx="40" ry="34" fill="url(#fox-body)" />
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

function CheckIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
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

const ORDER_ITEMS: { name: string; sub: string; price: string; emoji: string }[] = [
  { name: 'Авокадо', sub: '2 шт · 360 г', price: '180 ₽', emoji: '🥑' },
  { name: 'Йогурт греческий', sub: '300 г · натуральный', price: '149 ₽', emoji: '🥛' },
  { name: 'Хлеб бородинский', sub: '300 г · нарезка', price: '79 ₽', emoji: '🍞' },
  { name: 'Кофе в зёрнах', sub: '250 г · средняя обжарка', price: '349 ₽', emoji: '☕' },
];

function ScreenOrderConfirmed() {
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
          <p className="m-success__sub">Заказ № 87 245 в Т-Городе</p>
          <div className="m-success__eta">
            <span className="m-success__eta-label">Курьер</span>
            <span className="m-success__eta-value">придёт к 18:30</span>
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
          <button className="m-cta m-cta--gold">
            <span>Распаковать подарок</span>
            <span className="m-cta__arrow" aria-hidden>→</span>
          </button>
        </div>

        <div className="m-card">
          <div className="m-card__head m-card__head--simple">
            <span className="m-card__head-title">В корзине</span>
            <span className="m-card__sub">{ORDER_ITEMS.length} товара · 757 ₽</span>
          </div>
          <ul className="m-order-list">
            {ORDER_ITEMS.map((it) => (
              <li key={it.name} className="m-order-item">
                <span className="m-order-item__emoji" aria-hidden>
                  {it.emoji}
                </span>
                <div className="m-order-item__text">
                  <span className="m-order-item__name">{it.name}</span>
                  <span className="m-order-item__sub">{it.sub}</span>
                </div>
                <span className="m-order-item__price">{it.price}</span>
              </li>
            ))}
          </ul>
          <div className="m-summary">
            <div className="m-summary__row">
              <span>Товары</span>
              <span>757 ₽</span>
            </div>
            <div className="m-summary__row">
              <span>Доставка</span>
              <span className="m-summary__free">Бесплатно</span>
            </div>
            <div className="m-summary__row m-summary__row--total">
              <span>Итого</span>
              <span>757 ₽</span>
            </div>
          </div>
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

function ScreenMascotIntro() {
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
            <FoxMascot size={150} />
          </div>
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--a" />
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--b" />
          <div className="m-mascot-stage__sparkle m-mascot-stage__sparkle--c" />
        </div>

        <div className="m-mascot-text">
          <h1 className="m-mascot-text__title">Привет! Я Лис Толя</h1>
          <p className="m-mascot-text__sub">
            Буду каждый день приносить тебе одно классное предложение в ленту «Наш выбор».
            Поймаешь — продлишь стрик. Пропустишь день — я поспи́, не обижусь.
          </p>
        </div>

        <div className="m-mascot-card">
          <div className="m-mascot-card__head">
            <span className="m-mascot-card__tag">День 1</span>
            <span className="m-mascot-card__streak">🔥 0 дней подряд</span>
          </div>
          <div className="m-streak-track">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`m-streak-day ${i === 0 ? 'm-streak-day--active' : ''}`}
              >
                <span className="m-streak-day__num">{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="m-mascot-card__hint">
            Поймай первое предложение, чтобы запустить стрик.
          </p>
        </div>

        <div className="m-mascot-collection">
          <div className="m-mascot-collection__head">
            <span className="m-mascot-collection__title">Коллекция</span>
            <span className="m-mascot-collection__count">1 / 12</span>
          </div>
          <div className="m-mascot-collection__grid">
            <div className="m-collect-cell m-collect-cell--owned">
              <FoxMascot size={36} />
            </div>
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="m-collect-cell m-collect-cell--locked">
                <span>?</span>
              </div>
            ))}
          </div>
        </div>

        <button className="m-cta m-cta--gold m-cta--sticky">
          <span>Поймать первое предложение</span>
          <span className="m-cta__arrow" aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function IPhone({
  label,
  children,
  caption,
}: {
  label: string;
  children: React.ReactNode;
  caption?: string;
}) {
  return (
    <div className="iphone-stage">
      <div className="iphone-stage__label">{label}</div>
      <div className="iphone">
        <div className="iphone__frame">
          <StatusBar />
          {children}
          <HomeIndicator />
        </div>
      </div>
      {caption && <div className="iphone-stage__caption">{caption}</div>}
    </div>
  );
}

export function MobileDemo() {
  return (
    <div className="mobile-demo">
      <div className="mobile-demo__top">
        <div className="mobile-demo__top-row">
          <a href="/" className="mobile-demo__back">
            ← Назад к презентации
          </a>
          <a href="/flow" className="mobile-demo__cta-flow">
            ▶ Запустить интерактивный flow
          </a>
        </div>
        <div className="mobile-demo__intro">
          <span className="mobile-demo__eyebrow">Demo UI · статичный мокап</span>
          <h1 className="mobile-demo__title">Заказ оформлен → знакомство с Лисом Толей</h1>
          <p className="mobile-demo__sub">
            Два экрана сразу после первого заказа в Т-Городе. Свёрстано блоками — поверх
            можно подключить Lottie/Rive и реальные данные. Без скриншотов: всё живой
            HTML+CSS, готовый к анимации.
          </p>
          <p className="mobile-demo__sub">
            Хотите сквозной сценарий «корзина → заказ → знакомство → ловим первое предложение
            в ленте» в одном iPhone — нажмите{' '}
            <a className="mobile-demo__inline-link" href="/flow">
              «Запустить интерактивный flow»
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mobile-demo__stage">
        <IPhone
          label="Экран 1"
          caption="Сразу после оплаты — благодарность, статус курьера и тизер подарка."
        >
          <ScreenOrderConfirmed />
        </IPhone>
        <IPhone
          label="Экран 2"
          caption="Юзер тапнул «Распаковать подарок» — встречает Лиса Толю и стартует стрик."
        >
          <ScreenMascotIntro />
        </IPhone>
      </div>

      <div className="mobile-demo__notes">
        <h2 className="mobile-demo__notes-title">Что сюда дальше встанет анимация</h2>
        <ul className="mobile-demo__notes-list">
          <li>
            <strong>Экран 1.</strong> Галочка success — рисуется stroke-by-stroke. Карточка
            подарка — pulse 2 раза, потом успокаивается. Курьер-прогресс — ползёт от точки к
            точке.
          </li>
          <li>
            <strong>Переход.</strong> Тап «Распаковать» → подарочная коробка лопается, лис
            выпрыгивает (Lottie/Rive). Длительность ≤ 1.2 с, можно скипнуть тапом.
          </li>
          <li>
            <strong>Экран 2.</strong> Лис idle-breath, моргание раз в 5–7 с. Halo пульсирует
            slow. На «Поймать» — лис делает point-gesture на CTA.
          </li>
          <li>
            <strong>prefers-reduced-motion.</strong> Все анимации заменяются на мгновенные
            cross-fade. Логика и состояния — не ломаются.
          </li>
        </ul>
      </div>
    </div>
  );
}
