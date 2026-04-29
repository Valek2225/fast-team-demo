import React from 'react';
import {
  IphoneStatusBarIconsSvg,
  IphoneStatusBarIslandSvg,
  IphoneStatusBarTimeSvg,
} from './IphoneStatusBarGraphic';
import { CourierStatusTrack } from './CourierStatusTrack';

const FOX_MASCOT_PNG_URL = new URL('../iphone_ui_kit/Untitled.png', import.meta.url).href;

function StatusBar() {
  return (
    <div className="iphone__statusbar iphone__statusbar--kit">
      <div className="iphone-statusbar-kit__side iphone-statusbar-kit__side--left">
        <IphoneStatusBarTimeSvg />
      </div>
      <div className="iphone__notch-wrap">
        <IphoneStatusBarIslandSvg />
      </div>
      <div className="iphone-statusbar-kit__side iphone-statusbar-kit__side--right">
        <IphoneStatusBarIconsSvg />
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
    <img
      src={FOX_MASCOT_PNG_URL}
      width={size}
      height={size}
      alt="Лис Толя"
      style={{ display: 'block', objectFit: 'contain' }}
      draggable={false}
    />
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
          <button type="button" className="m-cta m-cta--gold m-cta--attention">
            <span>Забрать подарок</span>
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
          <span className="m-card__head-title">Статус</span>
          <CourierStatusTrack stage={1} />
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
            Поймаешь — продлишь серию. Пропустишь день — я поспи́, не обижусь.
          </p>
        </div>

        <div className="m-mascot-card">
          <div className="m-mascot-card__head">
            <span className="m-mascot-card__tag">День 1</span>
            <span className="m-mascot-card__series">🔥 0 дней подряд</span>
          </div>
          <div className="m-series-track">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`m-series-day ${i === 0 ? 'm-series-day--active' : ''}`}
              >
                <span className="m-series-day__num">{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="m-mascot-card__hint">
            Поймай первое предложение, чтобы запустить серию.
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

        <button type="button" className="m-cta m-cta--gold m-cta--attention m-cta--sticky">
          <span>Поймать первое предложение</span>
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
          <a href="/mobile" className="mobile-demo__cta-flow">
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
            <a className="mobile-demo__inline-link" href="/mobile">
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
          caption="Юзер тапнул «Забрать подарок» — встречает Лиса Толю и стартует серию."
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
            <strong>Переход.</strong> Тап «Забрать подарок» → подарочная коробка лопается, лис
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
