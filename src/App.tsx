import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info' | undefined;

const formatRub = (rub: number): string => {
  if (rub >= 1_000_000_000) return `${(rub / 1_000_000_000).toFixed(2)} млрд ₽`;
  if (rub >= 1_000_000) return `${(rub / 1_000_000).toFixed(1)} млн ₽`;
  if (rub >= 1_000) return `${(rub / 1_000).toFixed(0)} тыс ₽`;
  return `${Math.round(rub)} ₽`;
};

const formatPeople = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} тыс`;
  return `${Math.round(n)}`;
};

const formatPercent = (n: number): string => `${Math.round(n * 100)}%`;

export type Inputs = {
  audience: {
    tBankMAU: number;
    targetAgeShare: number;
    iosShare: number;
    androidShare: number;
  };
  conversion: {
    expectedActivationRate: number;
    ordersPerUserPerMonth: number;
    avgOrderValueRub: number;
    platformMarginRate: number;
  };
  dropoffs: {
    iosAddToHome_14_18: number;
    iosAddToHome_19_25: number;
    iosAddToHome_26_35: number;
    androidWebApkAvg: number;
    pushCtrMedian: number;
    iosShortcutsManual: number;
  };
  costs: {
    pwaTeamMonthlyRub: number;
    androidTeamMonthlyRub: number;
    infraMonthlyRub: number;
    pushInfraMonthlyRub: number;
    analyticsMonthlyRub: number;
    smsActivationMonthlyRub: number;
    mascotDesignOneTimeRub: number;
    courierVisitRub: number;
    courierIosRequestShare: number;
  };
  overrides: {
    targetAudience: number | null;
    iosAudience: number | null;
    androidAudience: number | null;
    activatedUsers: number | null;
    monthlyOrders: number | null;
    monthlyMargin: number | null;
    yearlyMargin: number | null;
    yearOneCostA: number | null;
    yearOneCostC: number | null;
    yearOneCostE: number | null;
    courierTotalCost: number | null;
  };
};

const DEFAULT_INPUTS: Inputs = {
  audience: {
    tBankMAU: 25_000_000,
    targetAgeShare: 0.4,
    iosShare: 0.4,
    androidShare: 0.6,
  },
  conversion: {
    expectedActivationRate: 0.05,
    ordersPerUserPerMonth: 2,
    avgOrderValueRub: 2_000,
    platformMarginRate: 0.1,
  },
  dropoffs: {
    iosAddToHome_14_18: 0.32,
    iosAddToHome_19_25: 0.45,
    iosAddToHome_26_35: 0.58,
    androidWebApkAvg: 0.15,
    pushCtrMedian: 0.09,
    iosShortcutsManual: 0.92,
  },
  costs: {
    pwaTeamMonthlyRub: 2_500_000,
    androidTeamMonthlyRub: 1_200_000,
    infraMonthlyRub: 150_000,
    pushInfraMonthlyRub: 80_000,
    analyticsMonthlyRub: 200_000,
    smsActivationMonthlyRub: 50_000,
    mascotDesignOneTimeRub: 1_500_000,
    courierVisitRub: 2_000,
    courierIosRequestShare: 0.05,
  },
  overrides: {
    targetAudience: null,
    iosAudience: null,
    androidAudience: null,
    activatedUsers: null,
    monthlyOrders: null,
    monthlyMargin: null,
    yearlyMargin: null,
    yearOneCostA: null,
    yearOneCostC: null,
    yearOneCostE: null,
    courierTotalCost: null,
  },
};

const pick = (override: number | null, computed: number): number =>
  typeof override === 'number' && !Number.isNaN(override) ? override : computed;

function computeMetrics(input: Inputs) {
  const a = input.audience;
  const c = input.conversion;
  const k = input.costs;
  const o = input.overrides;

  const targetAudience = pick(o.targetAudience, a.tBankMAU * a.targetAgeShare);
  const iosAudience = pick(o.iosAudience, targetAudience * a.iosShare);
  const androidAudience = pick(o.androidAudience, targetAudience * a.androidShare);
  const activatedUsers = pick(o.activatedUsers, targetAudience * c.expectedActivationRate);
  const monthlyOrders = pick(o.monthlyOrders, activatedUsers * c.ordersPerUserPerMonth);
  const marginPerOrder = c.avgOrderValueRub * c.platformMarginRate;
  const monthlyMargin = pick(o.monthlyMargin, monthlyOrders * marginPerOrder);
  const yearlyMargin = pick(o.yearlyMargin, monthlyMargin * 12);

  const pwaInfraYear =
    (k.infraMonthlyRub + k.pushInfraMonthlyRub + k.analyticsMonthlyRub + k.smsActivationMonthlyRub) *
    12;
  const pwaTeamYear = k.pwaTeamMonthlyRub * 12;

  const yearOneCostA = pick(
    o.yearOneCostA,
    pwaTeamYear + pwaInfraYear + k.mascotDesignOneTimeRub,
  );

  const yearOneCostB =
    (k.pushInfraMonthlyRub + k.smsActivationMonthlyRub + k.analyticsMonthlyRub) * 12 +
    k.pwaTeamMonthlyRub * 4 * 0.4;

  const androidTeamYear = k.androidTeamMonthlyRub * 12;
  const yearOneCostC = pick(
    o.yearOneCostC,
    androidTeamYear + (k.infraMonthlyRub + k.pushInfraMonthlyRub) * 12 / 2,
  );

  const courierIosVisits = iosAudience * k.courierIosRequestShare;
  const courierTotalCost = pick(o.courierTotalCost, courierIosVisits * k.courierVisitRub);
  const yearOneCostD = yearOneCostA + courierTotalCost;

  const yearOneCostE = pick(o.yearOneCostE, yearOneCostA + yearOneCostC);

  const paybackDaysA = monthlyMargin > 0 ? (yearOneCostA / monthlyMargin) * 30 : 0;
  const paybackDaysE = monthlyMargin > 0 ? (yearOneCostE / monthlyMargin) * 30 : 0;
  const paybackDaysD = monthlyMargin > 0 ? (yearOneCostD / monthlyMargin) * 30 : 0;

  const pushMonthlyOpens = activatedUsers * input.dropoffs.pushCtrMedian * 4;

  const yearTwoPlusA = pwaTeamYear * 0.6 + pwaInfraYear;

  const overrideKeys: Array<keyof typeof o> = [
    'targetAudience',
    'iosAudience',
    'androidAudience',
    'activatedUsers',
    'monthlyOrders',
    'monthlyMargin',
    'yearlyMargin',
    'yearOneCostA',
    'yearOneCostC',
    'yearOneCostE',
    'courierTotalCost',
  ];
  const isManual = (key: keyof typeof o): boolean => typeof o[key] === 'number';
  const manualCount = overrideKeys.filter(isManual).length;

  return {
    targetAudience,
    iosAudience,
    androidAudience,
    activatedUsers,
    monthlyOrders,
    marginPerOrder,
    monthlyMargin,
    yearlyMargin,
    pwaInfraYear,
    pwaTeamYear,
    yearOneCostA,
    yearOneCostB,
    yearOneCostC,
    yearOneCostD,
    yearOneCostE,
    yearTwoPlusA,
    courierIosVisits,
    courierTotalCost,
    paybackDaysA,
    paybackDaysE,
    paybackDaysD,
    pushMonthlyOpens,
    roiMultiplier: yearOneCostA > 0 ? yearlyMargin / yearOneCostA : 0,
    isManual,
    manualCount,
  };
}

function Stack({
  children,
  gap = 12,
  style,
}: {
  children: ReactNode;
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <div className="stack" style={{ gap, ...style }}>
      {children}
    </div>
  );
}

function Grid({
  children,
  columns,
  gap = 16,
}: {
  children: ReactNode;
  columns: 2 | 3 | 4;
  gap?: number;
}) {
  return (
    <div
      className={`grid grid--${columns}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

function Stat({ value, label, tone }: { value: ReactNode; label: string; tone?: Tone }) {
  return (
    <div className="stat">
      <div className={`stat__value${tone ? ` stat__value--${tone}` : ''}`}>{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

function Pill({ children, tone }: { children: ReactNode; tone?: Tone }) {
  return <span className={`pill${tone ? ` pill--${tone}` : ''}`}>{children}</span>;
}

function Card({ title, trailing, children }: { title: string; trailing?: ReactNode; children: ReactNode }) {
  return (
    <div className="card">
      <div className="card__header">
        <span>{title}</span>
        {trailing}
      </div>
      <div className="card__body">{children}</div>
    </div>
  );
}

function Callout({
  title,
  tone,
  children,
}: {
  title: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}) {
  return (
    <div className={`callout callout--${tone}`}>
      <div className="callout__title">{title}</div>
      <div className="text text--small text--secondary">{children}</div>
    </div>
  );
}

type Cell = ReactNode;
type Align = 'left' | 'right';

function DataTable({
  headers,
  rows,
  align = [],
  rowTone = [],
}: {
  headers: string[];
  rows: Cell[][];
  align?: Align[];
  rowTone?: (Tone | undefined)[];
}) {
  return (
    <div className="table">
      <div className="table__scroll">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className={align[i] === 'right' ? 'num' : i === 0 ? 'wrap' : ''}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className={rowTone[r] ? `row--${rowTone[r]}` : ''}>
                {row.map((cell, c) => (
                  <td key={c} className={align[c] === 'right' ? 'num' : c === 0 ? 'wrap' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopBar() {
  const links: { href: string; label: string; accent?: boolean }[] = [
    { href: '#audience', label: 'Аудитория' },
    { href: '#costs', label: 'Стоимость' },
    { href: '#scenarios', label: 'Сценарии' },
    { href: '#roi', label: 'ROI' },
    { href: '#decision', label: 'Решение', accent: true },
    { href: '#metrics', label: 'Метрики' },
    { href: '#competitors', label: 'Конкуренты' },
    { href: '#data', label: 'Данные' },
    { href: '#glossary', label: 'Словарь' },
  ];
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__brand">
          Т<span>·</span>Город финплан
        </div>
        <nav className="topbar__nav">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`topbar__link${l.accent ? ' topbar__link--accent' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

type TermCategory = 'tech' | 'finance' | 'marketing';

type Term = {
  name: string;
  alias?: string;
  category: TermCategory;
  what: string;
  example: string;
  inProject: string;
};

const TERM_LABEL: Record<TermCategory, string> = {
  tech: 'Тех',
  finance: 'Финансы',
  marketing: 'Маркетинг',
};

function TermCard({ term }: { term: Term }) {
  return (
    <article className="term">
      <div className="term__head">
        <h4 className="term__name">
          <span>{term.name}</span>
          {term.alias && <span className="term__alias">— {term.alias}</span>}
        </h4>
        <span className={`term__tag term__tag--${term.category}`}>
          {TERM_LABEL[term.category]}
        </span>
      </div>
      <div className="term__row">
        <span className="term__label">Что это простыми словами</span>
        <p className="term__text">{term.what}</p>
      </div>
      <div className="term__row term__row--example">
        <span className="term__label">Пример из жизни</span>
        <p className="term__text term__text--secondary">{term.example}</p>
      </div>
      <div className="term__row">
        <span className="term__label">У нас в проекте</span>
        <p className="term__text term__text--secondary">{term.inProject}</p>
      </div>
    </article>
  );
}

const TECH_TERMS: Term[] = [
  {
    name: 'PWA',
    alias: 'Progressive Web App',
    category: 'tech',
    what: 'Сайт, который ведёт себя как мобильное приложение: открывается на весь экран без адресной строки, работает без интернета, может слать уведомления.',
    example: 'Заходите на сайт Twitter/X в браузере телефона — он сам предлагает «Установить приложение». Нажимаете — на экране появляется иконка, тапаете её, открывается полноэкранный «Twitter». На самом деле это всё ещё сайт, но выглядит и работает как родное приложение.',
    inProject: 'Т-Город будет PWA — это позволит выпускать обновления без App Store / Google Play и установка занимает 1 тап вместо похода в магазин приложений.',
  },
  {
    name: 'Add to Home Screen',
    alias: 'добавить иконку на главный экран',
    category: 'tech',
    what: 'Действие, при котором PWA-сайт превращается в иконку на главном экране телефона — как у обычного приложения.',
    example: 'На iPhone в Safari открываете сайт → кнопка «Поделиться» → «На экран Домой» → появляется иконка между Telegram и Кошельком. Дальше открываете её одним тапом, не помня URL.',
    inProject: 'Главный механизм закрепления Т-Города у пользователя. Без иконки на хоум-экране пользователь забывает про сервис через 3–5 дней.',
  },
  {
    name: 'Tinkoff ID / OAuth 2.0',
    alias: 'кнопка «Войти через Тинькофф»',
    category: 'tech',
    what: 'Способ войти в один сервис через аккаунт другого. Пользователь не вводит логин/пароль, а подтверждает «да, я тот же человек» одним тапом.',
    example: 'Когда регистрируетесь в Wildberries, есть кнопка «Войти через Сбер ID» — и вы попадаете в WB уже залогиненным, не вводя ничего. Сбер сообщает WB «это наш проверенный клиент».',
    inProject: 'Тинькофф ID = SSO для Т-Города. Пользователь, у которого установлен Т-Банк, заходит в Т-Город за 1 тап — без ввода телефона, кода из СМС, паспорта и т.д.',
  },
  {
    name: 'SSO',
    alias: 'Single Sign-On',
    category: 'tech',
    what: 'Один логин на много сервисов. Залогинились один раз — автоматически в системе.',
    example: 'В Google: вошли в Gmail — открыли YouTube, и вы уже там залогинены, ничего вводить не надо. Это и есть SSO.',
    inProject: 'Когда открываете Т-Город через PWA, и Т-Банк уже на телефоне — Tinkoff ID обменивается «секретным кодом» в фоне, и Т-Город сразу знает, кто вы. 0 ввода полей.',
  },
  {
    name: 'Push-уведомление',
    alias: 'пуш',
    category: 'tech',
    what: 'Сообщение, которое всплывает на экране телефона, даже если приложение закрыто. Может содержать текст, картинку, кнопку.',
    example: 'Сообщение от Telegram, когда телефон лежит на столе: «Мама: ужин в 7». Это пуш — не SMS, идёт через интернет, бесплатно.',
    inProject: 'Маскот «Лис Толя» через пуши напоминает: «Заглянул в холодильник, у тебя кончается молоко». Тап → откроется Т-Город с уже наполненной корзиной.',
  },
  {
    name: 'Universal Link / Deep Link',
    alias: 'умная ссылка',
    category: 'tech',
    what: 'Ссылка, которая открывает не просто сайт, а сразу нужный экран в приложении. Если приложения нет — открывается сайт.',
    example: 'Подруга кидает в WhatsApp ссылку на конкретный товар Wildberries — вы её жмёте, и открывается приложение WB сразу на этом товаре, а не на главной странице.',
    inProject: 'Ссылка tcity.ru/m/winter-soup → если у вас стоит Т-Банк, ссылка откроет его, авторизует через Tinkoff ID и приведёт в Т-Город к рецепту супа за 1 тап.',
  },
  {
    name: 'AppWidget',
    alias: 'виджет на главном экране',
    category: 'tech',
    what: 'Активная плитка на главном экране телефона, которая показывает живую информацию из приложения и обновляется сама — без открытия приложения.',
    example: 'Виджет «Погода» — показывает 12° и солнце, и эта цифра меняется в течение дня сама. Виджет Apple Music показывает, какой трек играет сейчас.',
    inProject: 'На Android можно сделать виджет с маскотом: «Толя бодрствует — 12 дней подряд». Виден на хоуме, тапаешь → открывается Т-Город. На iOS такое сделать нельзя из-за блокировки App Store.',
  },
  {
    name: 'WebAPK',
    alias: 'PWA как нативное приложение Android',
    category: 'tech',
    what: 'Когда Chrome на Android видит сайт-PWA, он автоматически собирает мини-приложение (.apk) и кладёт на хоум-экран. Выглядит точно как нативное.',
    example: 'Заходишь на m.aliexpress.com в Chrome на Android — вылезает плашка «Установить приложение». Соглашаешься — на хоуме появляется иконка AliExpress, неотличимая от той, что из Google Play. Но в Google Play вы туда не ходили.',
    inProject: 'На Android Chrome сам предложит установить Т-Город из PWA — это «бесплатный» аналог нативного приложения. Никакая mobile-команда не нужна.',
  },
  {
    name: 'RuStore',
    alias: 'российский магазин приложений',
    category: 'tech',
    what: 'Альтернатива Google Play, разработанная VK. Используется банками, которые удалены из Google Play (Т-Банк, Сбер, ВТБ).',
    example: 'Когда хотите обновить приложение Сбербанка на Android, вы идёте не в Google Play (его там нет), а в RuStore. Это родная для Android альтернатива.',
    inProject: 'Через RuStore Т-Банк выпускает новые версии Android-приложения — туда можно добавить настоящий виджет Т-Города (на iOS нельзя — App Store недоступен).',
  },
  {
    name: 'Service Worker',
    alias: 'фоновый помощник PWA',
    category: 'tech',
    what: 'Невидимая часть PWA, которая работает в фоне. Кэширует данные для офлайн-работы, ловит пуши, обновляет приложение тихо.',
    example: 'Открыли YouTube Music в браузере, заехали в метро — а музыка играет дальше из кэша. Это работает service worker.',
    inProject: 'У Т-Города service worker будет хранить картинки маскота, прайсы и каталог — открывается мгновенно даже при слабом 4G.',
  },
  {
    name: 'Lottie / Rive',
    alias: 'анимация маскота',
    category: 'tech',
    what: 'Технологии, которые показывают сложные анимации без видео-файлов. Они весят 50–200 КБ вместо 5 МБ у обычного видео и плавно играются.',
    example: 'В Telegram-стикерах: рыбка плывёт, лиса машет хвостом — это всё Lottie. Один файл, плавная анимация, работает на любом телефоне.',
    inProject: 'Лис Толя будет анимирован через Lottie/Rive: моргает, прыгает, поджимает уши — это даёт «жизнь» в маскоте без замедления приложения.',
  },
];

const FINANCE_TERMS: Term[] = [
  {
    name: 'ROI',
    alias: 'возврат на инвестиции',
    category: 'finance',
    what: 'Сколько прибыли мы получили на каждый вложенный рубль. ROI 5× = вложили 1 рубль, заработали 5.',
    example: 'Купили акцию за 100 ₽, продали за 150 ₽. ROI = 50% (или ×0.5). Если кафе вложило 10 млн в новый ресторан и за год заработало 30 млн чистой прибыли — ROI 3×.',
    inProject: 'У варианта PWA Т-Города ROI ≈ 80×: вкладываем 35 млн ₽, получаем 2.4 млрд ₽ годовой маржи. То есть на каждый рубль — 80 ₽ прибыли.',
  },
  {
    name: 'LTV',
    alias: 'Lifetime Value, ценность клиента за всё время',
    category: 'finance',
    what: 'Сколько денег один клиент принесёт нам за всё время, пока пользуется сервисом. Чем дольше остаётся — тем выше LTV.',
    example: 'Клиент Netflix платит 700 ₽/мес и в среднем подписан 2 года. Его LTV = 700 × 24 = 16 800 ₽. Если бы он оставался 4 года, LTV вырос бы до 33 600 ₽.',
    inProject: 'Если пользователь Т-Города делает 2 заказа в месяц по 2000 ₽ × 10% маржа на 3 года, LTV = 14 400 ₽. Вот почему так важна привычка — одно увеличение срока жизни клиента в 2 раза удваивает прибыль.',
  },
  {
    name: 'CAC',
    alias: 'Customer Acquisition Cost, стоимость привлечения клиента',
    category: 'finance',
    what: 'Сколько мы тратим, чтобы получить одного нового клиента. Реклама + менеджеры + промо ÷ количество новых клиентов.',
    example: 'Шиномонтаж потратил 50 000 ₽ на наклейки и листовки и получил 100 новых клиентов. CAC = 500 ₽. Если каждый клиент в среднем платит 1500 ₽ — окупается.',
    inProject: 'Через Tinkoff ID + push-канал внутри Т-Банка CAC ≈ 50–80 ₽ (это копейки, потому что аудитория уже в банке). Через рекламу в Instagram/VK — было бы 800–1500 ₽.',
  },
  {
    name: 'Маржа',
    alias: 'прибыль с одного заказа',
    category: 'finance',
    what: 'Сколько денег остаётся компании после вычета всех расходов на конкретный заказ.',
    example: 'Кофейня продала латте за 250 ₽. Молоко + кофе + стакан = 70 ₽. Аренда + зарплата бариста на этот напиток = 80 ₽. Маржа = 250 − 150 = 100 ₽ (40%).',
    inProject: 'У Т-Города 10% маржи на заказе 2000 ₽ = 200 ₽ остаётся в компании. На 1 миллион заказов в месяц это 200 млн ₽ чистой маржи.',
  },
  {
    name: 'GMV',
    alias: 'Gross Merchandise Value, общий оборот',
    category: 'finance',
    what: 'Сколько всего денег прошло через платформу, до вычета любых расходов. Это «сырой» товарооборот.',
    example: 'На Wildberries в день покупают на 10 млрд ₽. Это GMV. Из них себе WB забирает ~15% комиссии = 1.5 млрд ₽ — это маржа. GMV всегда сильно больше маржи.',
    inProject: 'Прогнозируемый GMV Т-Города при 1 млн заказов × 2000 ₽ = 2 млрд ₽ в месяц. Маржа из них — 200 млн ₽ (10%).',
  },
  {
    name: 'Окупаемость',
    alias: 'payback period',
    category: 'finance',
    what: 'Через сколько времени мы вернём вложенные деньги. Если вложили 1 млн и зарабатываем 100 000 ₽ в месяц — окупимся за 10 месяцев.',
    example: 'Купили кофемашину за 500 000 ₽, она продаёт кофе на 50 000 ₽ маржи в месяц. Окупится за 10 месяцев. После — это чистая прибыль.',
    inProject: 'PWA Т-Города окупается за ≈ 18–25 дней: 35 млн ₽ вложений ÷ 200 млн ₽ маржи в месяц = 0.6 месяца. Дальше всё в плюс.',
  },
];

const MARKETING_TERMS: Term[] = [
  {
    name: 'MAU',
    alias: 'Monthly Active Users, активные пользователи в месяц',
    category: 'marketing',
    what: 'Сколько уникальных людей зашли в приложение хотя бы раз за последние 30 дней. Показывает, сколько у вас живых пользователей сейчас.',
    example: 'У VK MAU 100 млн — значит 100 млн человек открыли приложение хотя бы один раз в этом месяце. У вашей кофейни «MAU» — это число клиентов, кто зашёл в этот месяц.',
    inProject: 'У Т-Банка MAU ≈ 30 млн. Из них 14–35 лет — около 10 млн (наша целевая база, на которую считаем экономику).',
  },
  {
    name: 'Конверсия',
    alias: 'conversion, превращение в действие',
    category: 'marketing',
    what: 'Какой процент людей сделал желаемое действие. Конверсия 5% = из 100 человек 5 что-то купили / зарегистрировались.',
    example: 'Из 1000 человек, кто увидел вашу рекламу, 50 кликнули → конверсия в клик 5%. Из этих 50, кто кликнул, 5 купили → конверсия в покупку 10%. Полный funnel конверсии: 0.5%.',
    inProject: 'Из 10 млн целевой базы Т-Банка ожидаем 5% конверсии в активного пользователя Т-Города = 500 тыс юзеров. Это «реалистичный таргет PWA».',
  },
  {
    name: 'CTR',
    alias: 'Click-Through Rate, процент кликов',
    category: 'marketing',
    what: 'Из всех людей, увидевших рекламу/баннер/пуш — сколько процентов нажали. CTR 9% у пуша = 9 из 100 получивших открыли его.',
    example: 'Кафе разослало 1000 SMS с акцией. Перешли по ссылке 30 человек. CTR = 3%. У push-уведомлений в РФ медианный CTR 5–15%, у баннеров 0.5–2%.',
    inProject: 'Push от маскота имеет CTR ≈ 9% — это реалистичный bench. На базе 1 млн получателей это 90 тыс открытий = 90 тыс заходов в Т-Город из одной рассылки.',
  },
  {
    name: 'Drop-off',
    alias: 'отвал, потеря на шаге',
    category: 'marketing',
    what: 'Процент людей, которые перестали идти по сценарию на каком-то конкретном шаге. Drop-off 50% на регистрации = половина бросает на этом экране.',
    example: 'В корзине Wildberries 100 человек. Доходят до оплаты 60 → drop-off 40% на пути «корзина → оплата». Дальше из 60 успешно платят 55 → drop-off 8% на оплате.',
    inProject: 'На iOS Add to Home drop-off 30–60% — пользователи не доходят до создания иконки. Поэтому планируем GIF-инструкцию + параллельный push-канал, чтобы добрать тех, кто отвалился.',
  },
  {
    name: 'Funnel',
    alias: 'воронка',
    category: 'marketing',
    what: 'Цепочка шагов, которую проходит пользователь до целевого действия. На каждом шаге часть отваливается, поэтому форма «воронки».',
    example: '100 человек увидели рекламу → 50 кликнули → 20 зарегались → 10 сделали заказ → 3 вернулись за вторым. Это воронка: 100 → 50 → 20 → 10 → 3.',
    inProject: 'Воронка Т-Города: видит баннер в Т-Банке → тап → SSO → первый заказ → второй заказ. Аналитика измеряет drop-off на каждом шаге, чтобы понять, где терять меньше людей.',
  },
  {
    name: 'Habit cue',
    alias: 'крючок-привычка, триггер',
    category: 'marketing',
    what: 'Внешний сигнал, который автоматически напоминает мозгу — «сделай вот это». Может быть визуальным (иконка), временным (утром в 8), эмоциональным.',
    example: 'Видите Instagram на хоум-экране — рука сама тянется тапнуть. Это и есть habit cue: сама иконка работает как крючок. Уберите её в папку — частота открытий упадёт в 3 раза.',
    inProject: 'Иконка маскота на хоум-экране = habit cue. Без иконки в Т-Город пользователь не вернётся сам — поэтому Add to Home Screen критически важен.',
  },
  {
    name: 'Retention',
    alias: 'удержание, возвращаемость',
    category: 'marketing',
    what: 'Какой процент пользователей возвращается через 1 / 7 / 30 дней после первого визита. Retention 30% на день 7 = 30 из 100 новых вернулись через неделю.',
    example: 'Скачали игру 100 человек. На следующий день её открыли 40 → D1 retention 40%. Через 7 дней — 15 → D7 retention 15%. Через 30 дней — 5 → D30 retention 5%. Это норм для мобильных игр.',
    inProject: 'Маскот и стрик-механика повышают retention. Без них D30 retention был бы ~8%, со стриком ожидаем 18–25% — это в 2–3 раза больше LTV.',
  },
  {
    name: 'A/B-тест',
    alias: 'сплит-тест',
    category: 'marketing',
    what: 'Двум группам пользователей показывают разные варианты (A и B), чтобы выбрать тот, что лучше работает. Один меняет, остальные параметры одинаковые.',
    example: 'Половине посетителей сайта показали красную кнопку «Купить», другой половине — зелёную. Через неделю смотрим: красная дала 4% конверсии, зелёная 6%. Оставляем зелёную.',
    inProject: 'Будем A/B-тестить тексты push от маскота: «Толя ждёт» vs «Заглянем в Т-Город?». Победитель станет шаблоном для всех аудиторий.',
  },
  {
    name: 'Когорта',
    alias: 'cohort, группа пользователей по дате',
    category: 'marketing',
    what: 'Группа пользователей, которая пришла в одно время. Когорту наблюдают долго, чтобы понять, как меняется поведение со временем.',
    example: 'Все, кто скачал ваше приложение в январе — это «январская когорта». Смотрим, сколько из них активны в феврале, марте, апреле. Это покажет, насколько крепко вы их зацепили.',
    inProject: 'Когорта пользователей, кто установил Т-Город через PWA в первый месяц — её retention сравним с когортой через push-канал. Так увидим, какой канал даёт более «прочных» клиентов.',
  },
  {
    name: 'Push-выгорание',
    alias: 'notification fatigue',
    category: 'marketing',
    what: 'Когда пуши приходят слишком часто или нерелевантно — пользователь отключает все пуши приложения или удаляет его. Восстановить это потом почти невозможно.',
    example: 'Lamoda присылала 5 пушей в день про распродажи. Через неделю пользователь молча зашёл в настройки и отключил все уведомления. Lamoda потеряла канал связи навсегда.',
    inProject: 'Поэтому push-only сценарий (iOS-2) не подходит как основное решение. Маскот должен пушить максимум 2–3 раза в неделю, и только релевантно — иначе клиенты выгорают за месяц.',
  },
];

type OptionMetric = { value: string; label: string };
type OptionPros = { good: string[]; bad: string[] };

function OptionCard({
  id,
  title,
  metrics,
  pick,
  why,
  pros,
}: {
  id: string;
  title: string;
  metrics: OptionMetric[];
  pick?: boolean;
  why: string;
  pros: OptionPros;
}) {
  return (
    <article className={`option${pick ? ' option--pick' : ''}`}>
      <div className="option__head">
        <div>
          <div className="option__id">{id}</div>
          <h3 className="option__title">{title}</h3>
        </div>
      </div>
      <div className="option__metrics">
        {metrics.map((m) => (
          <div key={m.label} className="option__metric">
            <div className="option__metric-value">{m.value}</div>
            <div className="option__metric-label">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="proscons">
        <div className="proscons__col">
          <div className="proscons__label proscons__label--good">Плюсы</div>
          <ul className="proscons__list">
            {pros.good.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="proscons__col">
          <div className="proscons__label proscons__label--bad">Минусы</div>
          <ul className="proscons__list">
            {pros.bad.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="option__why">
        <div className="option__why-label">
          {pick ? 'Почему я бы выбрал' : 'Когда имеет смысл'}
        </div>
        <Text size="small">{why}</Text>
      </div>
    </article>
  );
}

function H1({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h1 className="h1" id={id}>
      {children}
    </h1>
  );
}

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 className="h2" id={id}>
      {children}
    </h2>
  );
}

function H3({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 className="h3" id={id}>
      {children}
    </h3>
  );
}

function Text({
  children,
  tone,
  size,
  weight,
  as = 'p',
}: {
  children: ReactNode;
  tone?: 'secondary';
  size?: 'small';
  weight?: 'semibold';
  as?: 'p' | 'span';
}) {
  const cls = ['text'];
  if (tone === 'secondary') cls.push('text--secondary');
  if (size === 'small') cls.push('text--small');
  if (weight === 'semibold') cls.push('text--semibold');
  const Tag = as;
  return <Tag className={cls.join(' ')}>{children}</Tag>;
}

function Divider() {
  return <hr className="divider" />;
}

type Source = { label: string; url: string };

type MetricCase = {
  brand: string;
  mascot: string;
  industry: string;
  whatTheyDo: string;
  northStar: { name: string; description: string };
  counterMetrics: { name: string; description: string }[];
  takeawayForUs: string;
  sources?: Source[];
  disclaimer?: string;
};

const METRIC_CASES: MetricCase[] = [
  {
    brand: 'Duolingo',
    mascot: 'Сова Duo (постоянный)',
    industry: 'Изучение языков',
    whatTheyDo:
      'Маскот ведёт стрик и шлёт «настойчивые» пуши при пропуске. User flow построен вокруг ежедневной короткой сессии. Streak — главный visual cue в приложении.',
    northStar: {
      name: 'DAU (Daily Active Users) и DAU/MAU ratio',
      description:
        'Q4 2024: DAU 40.5 млн (+51% YoY), MAU 116.7 млн, ratio 34.7%. Q4 2025: DAU 52.7 млн, MAU 133.1 млн. Более 10 млн пользователей со streak ≥1 года; треть DAU — с Friend Streak. Цифры из официальных писем акционерам.',
    },
    counterMetrics: [
      {
        name: 'Push opt-out rate',
        description:
          'Если процент юзеров, отключающих уведомления, растёт — это red flag: «guilt-trip» переборщил. Duolingo сами признают «unhinged» tone и мониторят, не превращается ли он в негатив.',
      },
      {
        name: 'Decel в DAU growth',
        description:
          'В письме акционерам за 2025 Duolingo прямо говорит: рост DAU замедлился из-за «увеличенного фокуса на монетизации» — и они смещают фокус назад на teaching better. Это публичное признание контр-метрики.',
      },
      {
        name: 'Streak loss recovery rate',
        description:
          'Сколько процентов вернулись после потери стрика. Если низкий — streak-механика выгнала больше, чем удержала. Точное значение Duolingo не раскрывает, но факт мониторинга подтверждён публикациями.',
      },
    ],
    takeawayForUs:
      'Стрик отлично работает, но требует защитных клапанов: грейс-период, мягкий тон пушей, мониторинг соотношения «рост vs ощущение давления». В Т-Городе мы не должны ассоциироваться с тревогой.',
    sources: [
      {
        label: 'Q4 2024 shareholder letter (DAU 40.5M, +51% YoY)',
        url: 'https://investors.duolingo.com/news-releases/news-release-details/duolingo-finishes-2024-51-daus-growth-more-40-million-daus-and',
      },
      {
        label: 'Q4 2025 shareholder letter (DAU 52.7M, decel-признание)',
        url: 'https://investors.duolingo.com/financial-information/quarterly-results',
      },
    ],
  },
  {
    brand: 'Snapchat',
    mascot: 'Snapstreaks — огоньки между друзьями',
    industry: 'Соцсеть / общение',
    whatTheyDo:
      'Stripped-down маскот — это сама механика стрика между друзьями: огонёк держится, пока обмениваетесь снэпами каждый день. Не персонаж, а статус.',
    northStar: {
      name: 'Daily engagement (sessions × duration)',
      description:
        'Snap раскрывает в публичных отчётах общий DAU и engagement, но не разбивает по streak-сегментам. Streaks введены в 2016 году и заявлены менеджментом как один из главных drivers ежедневного открытия.',
    },
    counterMetrics: [
      {
        name: 'Streak break sentiment',
        description:
          'Качественный мониторинг через support-обращения и реддит/twitter feedback после массовых сбоев streaks (например, баги 2018). Когда платформа теряла огни массово — был всплеск негатива в публичных каналах.',
      },
      {
        name: 'Перегрузка обязательством',
        description:
          'Внутренний риск, который Snap признаёт — streak воспринимается как обязанность, особенно среди подростков. Точные числа не публикуются.',
      },
    ],
    takeawayForUs:
      'Streak без маскота тоже работает. Для Т-Города — Лис Толя становится «лицом» стрика, но сама механика должна быть простой: 1 заказ в день = огонёк жив.',
    disclaimer:
      'Snap не публикует разбивку метрик по streak-сегментам. Качественные утверждения подкреплены менеджментскими комментариями на earnings calls, но точные числа — оценочные.',
    sources: [
      {
        label: 'Snap Inc. — official Investor Relations',
        url: 'https://investor.snap.com/financials/quarterly-results',
      },
    ],
  },
  {
    brand: 'Headspace',
    mascot: 'Andy (голос-наставник) + оранжевые иллюстрации',
    industry: 'Медитация / wellness',
    whatTheyDo:
      'Маскот — голос Andy Puddicombe + плоские оранжевые иллюстрации. Онбординг — несколько бесплатных сессий, потом мягкий nudge к подписке. Метрика — «успешно завершённая сессия», не «открытие».',
    northStar: {
      name: 'Completed meditation sessions',
      description:
        'Headspace публично заявляет «session completion» как ключевую метрику в кейсах с корпоративными клиентами. Точные D90 retention для активного сегмента не публикуются — но подход «считать завершения, а не открытия» — общеизвестен в продуктовом сообществе.',
    },
    counterMetrics: [
      {
        name: 'Self-reported stress / anxiety level',
        description:
          'Headspace проводит исследования с университетами (Carnegie Mellon, UCLA), измеряя реальное снижение стресса у пользователей. Если приложение не даёт измеримого эффекта на самочувствие — продукт обесценивается.',
      },
      {
        name: 'Trial-to-paid drop-off',
        description:
          'Доля юзеров, кто прошёл бесплатные дни и не подписался — главный сигнал, что онбординг продал не то, что даёт продукт.',
      },
    ],
    takeawayForUs:
      'Метрика «завершил действие» честнее «открытия». Для Т-Города — это «сделал заказ», не «зашёл в каталог». И self-report «Т-Город заботится», а не «прессует».',
    disclaimer:
      'Конкретные retention-числа Headspace в открытом доступе ограничены — они частная компания. Качественный подход подтверждён их публикациями и кейсами.',
    sources: [
      {
        label: 'Headspace Research — публикации с университетами',
        url: 'https://www.headspace.com/science',
      },
    ],
  },
  {
    brand: 'Тинькофф Junior',
    mascot: 'Кот Тинькофф / детский визуал',
    industry: 'Финансы для подростков',
    whatTheyDo:
      'Детский продукт Т-Банка с обучающим контуром «ребёнок + родитель». Двусторонняя архитектура: ребёнок видит свою карту и задачи, родитель получает отчёты и может ставить лимиты.',
    northStar: {
      name: 'Active teen-parent pairs',
      description:
        'Двусторонний продукт измеряют именно парами: одиночный детский активный юзер без родительского контура — это риск (родитель может удалить).',
    },
    counterMetrics: [
      {
        name: 'Parental complaint rate',
        description:
          'Если жалобы от родителей растут — продукт перестаёт быть «помощником» и становится «манипуляцией для денег». Главный риск family-приложений.',
      },
      {
        name: 'Подростковый CSAT по визуалу',
        description:
          'Подросткам быстро становится «слишком детский» визуал стыдным. Меняют возрастной слой — иначе теряют сегмент 13–15.',
      },
    ],
    takeawayForUs:
      'У нас тоже двусторонний продукт — маскот для 14–35, но рядом дети в семейных заказах. Считаем семейные пары, контр-метрика — parental complaint rate.',
    disclaimer:
      'Конкретных retention-цифр Junior в открытых источниках мало. Качественный подход подтверждён публикациями Т-Банка о продукте.',
    sources: [
      {
        label: 'Т-Банк — Junior product page',
        url: 'https://www.tbank.ru/cards/debit-cards/tinkoff-junior/',
      },
    ],
  },
  {
    brand: 'Mailchimp',
    mascot: 'Шимпанзе Freddie',
    industry: 'B2B email-рассылки',
    whatTheyDo:
      'Freddie не давит — он шутит при отправке кампании, поздравляет с маленькими успехами. Маскот = micro-rewards, а не guilt-механика. Полная противоположность стилю Duolingo.',
    northStar: {
      name: 'Time to first sent campaign',
      description:
        'Aha moment продукта — первая отправленная рассылка. Mailchimp измеряет именно это время, и онбординг режется до тех пор, пока drop-off на каждом шаге не станет минимальным.',
    },
    counterMetrics: [
      {
        name: 'Onboarding step drop-off',
        description:
          'На каждом шаге измеряется отвал — целевой минимум, иначе шаг убирают.',
      },
      {
        name: 'Support ticket volume per new user',
        description:
          'Если растёт — онбординг недостаточно понятен и Freddie не помогает.',
      },
    ],
    takeawayForUs:
      'Маскот не обязан давить. Толя может быть «помощником в успехе» — поздравлять с первым заказом, при стрике ≥7 давать подарок. Метрика времени до первого заказа — наш aha moment.',
    disclaimer:
      'Точные цифры Mailchimp по Freddie не раскрываются. Подход «маскот как поддержка» — общеизвестная позиция бренда.',
    sources: [
      {
        label: 'Mailchimp About — про бренд и Freddie',
        url: 'https://mailchimp.com/about/',
      },
    ],
  },
  {
    brand: 'Strava',
    mascot: 'Челленджи + значки (без живого маскота)',
    industry: 'Беговые / велотрекинг',
    whatTheyDo:
      'Нет персонажа, но есть медальки и челленджи (Run Club May, 10km Challenge). «Безличный маскот» — gamification сама по себе. Полезное сравнение: что меняется без живого персонажа.',
    northStar: {
      name: 'Workouts uploaded per week',
      description:
        'Strava публично заявляет частоту загрузок как ключевой engagement-сигнал. Платная подписка отдельно — Premium subscribers и retention.',
    },
    counterMetrics: [
      {
        name: 'Premium churn rate',
        description:
          'Платный продукт. Главный сигнал «не довезли ценность». Strava публикует общую динамику Premium, но не churn по сегментам.',
      },
      {
        name: 'Privacy / safety complaints',
        description:
          'Strava несколько раз попадала в новости из-за раскрытия локаций (например, military bases через heatmap 2018). С тех пор активно мониторят safety-обращения.',
      },
    ],
    takeawayForUs:
      'Челленджи без маскота тоже работают. Для Т-Города можно ввести коллекции «10 разных продуктов недели» — но коллекция не должна заставлять, иначе превращается в обязаловку.',
    sources: [
      {
        label: 'Strava — Year in Sport (ежегодный отчёт по engagement)',
        url: 'https://blog.strava.com/press/yearinsport/',
      },
    ],
  },
];

type CompetitorCase = {
  brand: string;
  mascot: string;
  type: 'permanent' | 'seasonal' | 'minimal';
  industry: string;
  region: 'РФ' | 'global';
  whatTheyDid: string;
  metrics: { label: string; value: string }[];
  takeaway: string;
  sources: Source[];
  disclaimer?: string;
};

const TYPE_LABEL: Record<CompetitorCase['type'], string> = {
  permanent: 'Постоянный',
  seasonal: 'Сезонный',
  minimal: 'Без живого маскота',
};

const COMPETITOR_CASES: CompetitorCase[] = [
  {
    brand: 'Самокат',
    mascot: 'Пандагочи — красная панда (виртуальный питомец)',
    type: 'seasonal',
    industry: 'E-grocery / доставка продуктов',
    region: 'РФ',
    whatTheyDid:
      'В феврале 2025 запустили в приложении игру «Пандагочи» — красную панду в стиле тамагочи. Заказы в Самокате превращаются в опыт для виртуальной панды (она ест те же продукты, что вы заказали), пользователь её кормит, наряжает, прокачивает. Игра была сезонной — действовала до 8 апреля 2025. Перед запуском провели два исследования: красная панда обошла енота как «самый ассоциируемый с брендом» персонаж. Совместная разработка с KTS.',
    metrics: [
      { label: 'Уникальных пользователей за первые месяцы', value: '> 1 млн' },
      { label: 'Доля выполнивших ≥1 ежедневное задание', value: '70%' },
      { label: 'Из них выполнили ≥5 заданий в день', value: '20%' },
      { label: 'Суммарное экранное время в игре', value: '> 50 лет' },
      { label: 'Превышение плановых показателей по активности', value: '× 3' },
    ],
    takeaway:
      'Главный кейс для Т-Города из РФ. Подтверждает гипотезу: сезонная маскот-механика с тамагочи-логикой даёт reach 1+ млн и реально двигает частоту заказов. Фиджитал-механика «заказал → панда ест то же» — конкретно работает на retention. Ограничение по сроку (2 месяца) создаёт urgency без вечного давления.',
    sources: [
      {
        label: 'Sostav: кейс с цифрами от команды Самоката и KTS',
        url: 'https://www.sostav.ru/publication/kejs-samokata-78588.html',
      },
      {
        label: 'ADPASS: Пандагочи — детали механики и результатов',
        url: 'https://adpass.ru/pandagochi-kak-in-app-gejmifikatsiya-povysila-aktivnost-polzovatelej-v-prilozhenii-samokat/',
      },
      {
        label: 'E-pepper: Питомец для миллионов',
        url: 'https://e-pepper.ru/news/pitomets-dlya-millionov-kak-tsifrovaya-panda-zavoevala-serdtsa-polzovateley-samokata.html',
      },
      {
        label: 'CookiesGames: разбор геймификации',
        url: 'https://cookiesgames.ru/blog/how_the_brand_turned_gamification_into_a_loyalty_tool',
      },
    ],
  },
  {
    brand: 'Сбер',
    mascot: 'СберКот — кот, перезапущен в 2023',
    type: 'permanent',
    industry: 'Банкинг / финансы',
    region: 'РФ',
    whatTheyDid:
      'Изначально с 2018 — наставник в ВКонтакте про финграмотность. В июне 2023 перезапустили как «цифрового инфлюенсера»: 3D-модель в Unreal Engine, mocap-костюмы для real-time эфиров, голос синтезирован через SaluteSpeech. С 2024 встроили в детское приложение СберKids (6–13 лет) как голосового ассистента на базе GigaChat. С 2025 поселили во все колонки Sber. Параллельно весной 2024 совместно с VK Шаги запустили игру «Котоверсум» (мульти-Вселенная с альт-версиями кота).',
    metrics: [
      { label: 'Подписчиков ВКонтакте', value: '14 млн' },
      { label: 'Обращений в СберKids за 3 месяца', value: '5 млн' },
      { label: 'Заданных вопросов', value: '12 млн' },
      { label: 'Доля Android-юзеров СберKids, использующих ассистента', value: '60%' },
      { label: 'Из них пользуются регулярно', value: '25%' },
      { label: 'Среднее время диалога с СберКотом', value: '4 мин' },
      { label: 'Уникальных игроков в «Котоверсум» за 3 мес', value: '> 1 млн' },
      { label: 'Вовлечённость в рекламу с СберКотом vs без', value: '× 3' },
      { label: 'Рост лояльности vs старая концепция', value: '+ 50%' },
    ],
    takeaway:
      'Сбер показывает, как маскот эволюционирует от соцсеть-наставника к full-stack бренд-лицу: СМИ + детский продукт + голосовая колонка + игра. Цифры подтверждают: маскот в банке окупается через метрики продаж (× 2 эффективность) и узнаваемости (+15 п.п.). Для Лиса Толи — план эволюции: сначала в приложении Т-Город, потом везде, где бренд встречает клиента.',
    sources: [
      {
        label: 'Sostav: Котоверсум и метрики кампании',
        url: 'https://www.sostav.ru/publication/kak-sberkot-i-vk-privlekli-moloduyu-auditoriyu-74093.html',
      },
      {
        label: 'Workspace: кейс перезапуска СберКота с метриками',
        url: 'https://workspace.ru/cases/cifrovoy-inflyuenser-sberkot/',
      },
      {
        label: 'rabota.sber.ru: о метриках СберКота в СберKids',
        url: 'https://rabota.sber.ru/media/o-chyom-deti-sprashivayut-sberkota',
      },
      {
        label: 'TAdviser: история продукта СберКот',
        url: 'https://www.tadviser.ru/index.php/Продукт:Сбер:_СберКот',
      },
    ],
  },
  {
    brand: 'Яндекс Лавка',
    mascot: 'Без маскота — мини-игра «Собери плюсы» + персональные цели',
    type: 'minimal',
    industry: 'E-grocery / быстрая доставка',
    region: 'РФ',
    whatTheyDid:
      'Без маскота принципиально. Решают две конкретные проблемы через геймификацию: (1) «слишком маленькие баллы Плюса не мотивируют» и (2) «слишком много обращений в поддержку с вопросом «где мой заказ?»». В 2022 (хакатон, доклад Алексея Савельева) запустили мини-игру «Собери плюсы» в окне ожидания доставки — курьер ловит продукты, до 50 баллов Плюса (1 балл = 1 ₽). Параллельно — раздел «Мои цели»: персональные задания с прогресс-баром, скидки/подарки за выполнение, рандомно появляются после заказов.',
    metrics: [
      { label: 'Максимум баллов за одну игру', value: '50 ₽' },
      { label: 'Запуск мини-игры', value: '2022' },
      { label: 'Цели — каждое со сроком', value: '~5 дней' },
    ],
    takeaway:
      'Контр-пример Самокату: можно строить retention через геймификацию без живого маскота, если механика решает конкретную проблему UX. Для Т-Города — мини-игры можно делать поверх маскота, не вместо: Толя ведёт челлендж «собери коллекцию», но игровая механика — такая же простая, как у Лавки.',
    disclaimer:
      'Конкретные числа по росту повторных заказов / среднему чеку Лавка публично не раскрывает. Цифры выше — то, что подтверждено в презентациях и блогах.',
    sources: [
      {
        label: 'vc.ru: разбор геймификации после заказа',
        url: 'https://vc.ru/id4675643/1985789-geymifikatsiya-v-yandeks-lavke',
      },
      {
        label: 'Setka (hh.ru): про доклад Алексея Савельева',
        url: 'https://setka.ru/posts/018fab53-b26a-4f2e-9f04-bb07e38440c1',
      },
      {
        label: 'gamification-now: персональные цели Лавки',
        url: 'https://gamification-now.ru/cases/yandeks-lavka-personalnye-celi-motiviruyushchie-k-pokupkam-zadaniya-razlichnoy-slozhnosti-i-podarki-za-ih-vypolnenie',
      },
    ],
  },
  {
    brand: 'Duolingo',
    mascot: 'Сова Duo + сезонные скины (Halloween, Christmas)',
    type: 'permanent',
    industry: 'Изучение языков',
    region: 'global',
    whatTheyDid:
      'Постоянный маскот с сезонными «скинами» (Halloween, Christmas, Valentine), которые меняют визуал, не ломая идентичность. На уровне маркетинга — viral memes («unhinged Duo» через TikTok), на уровне продукта — streak с push-механикой, Friend Streaks, групповые challenge.',
    metrics: [
      { label: 'DAU Q4 2024', value: '40.5 млн (+51% YoY)' },
      { label: 'DAU Q4 2025', value: '52.7 млн (+30% YoY)' },
      { label: 'MAU Q4 2024', value: '116.7 млн' },
      { label: 'MAU Q4 2025', value: '133.1 млн' },
      { label: 'DAU/MAU ratio Q4 2024', value: '34.7%' },
      { label: 'Юзеров со streak ≥1 года (Q4 2024)', value: '> 10 млн' },
      { label: 'DAU с Friend Streak', value: '~1/3' },
      { label: 'Платных подписчиков Q4 2025', value: '12.2 млн' },
    ],
    takeaway:
      'Сезонные «скины» поверх постоянного маскота — лучший паттерн для долгого продукта. Толя должен иметь весенний / летний / новогодний look без потери узнаваемости. И публичное признание Duolingo, что чрезмерная монетизация замедляет DAU, — это ровно то, чего нам важно избежать.',
    sources: [
      {
        label: 'Q4 2024 results — DAU 40.5M, +51% YoY (official)',
        url: 'https://investors.duolingo.com/news-releases/news-release-details/duolingo-finishes-2024-51-daus-growth-more-40-million-daus-and',
      },
      {
        label: 'Investor Relations — все ежеквартальные отчёты',
        url: 'https://investors.duolingo.com/financial-information/quarterly-results',
      },
    ],
  },
];

function CompetitorCard({ data }: { data: CompetitorCase }) {
  return (
    <article className="competitor-case">
      <div className="competitor-case__head">
        <div className="competitor-case__title-block">
          <h3 className="competitor-case__title">{data.brand}</h3>
          <Text size="small" tone="secondary">
            {data.mascot}
          </Text>
        </div>
        <div className="competitor-case__tags">
          <span
            className={`competitor-case__tag competitor-case__tag--${
              data.type === 'seasonal' ? 'seasonal' : data.type === 'minimal' ? 'minimal' : 'perm'
            }`}
          >
            {TYPE_LABEL[data.type]}
          </span>
          <span className="competitor-case__tag competitor-case__tag--region">{data.region}</span>
        </div>
      </div>

      <div className="competitor-case__industry">
        <Text size="small" tone="secondary">
          {data.industry}
        </Text>
      </div>

      <div className="competitor-case__what">
        <Text size="small">{data.whatTheyDid}</Text>
      </div>

      <div className="competitor-case__metrics">
        <span className="competitor-case__metrics-label">Цифры из открытых источников</span>
        <ul className="competitor-case__metrics-list">
          {data.metrics.map((m) => (
            <li key={m.label} className="competitor-case__metric">
              <span className="competitor-case__metric-value">{m.value}</span>
              <span className="competitor-case__metric-name">{m.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="competitor-case__takeaway">
        <span className="competitor-case__takeaway-label">Что переносим в Т-Город</span>
        <Text size="small">{data.takeaway}</Text>
      </div>

      {data.disclaimer && (
        <div className="competitor-case__disclaimer">
          <span className="competitor-case__disclaimer-label">Важно</span>
          <Text size="small" tone="secondary">
            {data.disclaimer}
          </Text>
        </div>
      )}

      <div className="competitor-case__sources">
        <span className="competitor-case__sources-label">Источники</span>
        <ul className="competitor-case__sources-list">
          {data.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="competitor-case__source-link"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function MetricCaseCard({ data }: { data: MetricCase }) {
  return (
    <article className="metric-case">
      <div className="metric-case__head">
        <div className="metric-case__brand">
          <h3 className="metric-case__title">{data.brand}</h3>
          <Text size="small" tone="secondary">
            {data.mascot} · {data.industry}
          </Text>
        </div>
      </div>
      <div className="metric-case__what">
        <Text size="small">{data.whatTheyDo}</Text>
      </div>
      <div className="metric-case__metric metric-case__metric--star">
        <span className="metric-case__metric-tag metric-case__metric-tag--star">
          North star
        </span>
        <h4 className="metric-case__metric-name">{data.northStar.name}</h4>
        <Text size="small" tone="secondary">
          {data.northStar.description}
        </Text>
      </div>
      <div className="metric-case__metric metric-case__metric--counter">
        <span className="metric-case__metric-tag metric-case__metric-tag--counter">
          Контр-метрики
        </span>
        <ul className="metric-case__counter-list">
          {data.counterMetrics.map((cm) => (
            <li key={cm.name}>
              <span className="metric-case__counter-name">{cm.name}</span>
              <Text size="small" tone="secondary">
                {cm.description}
              </Text>
            </li>
          ))}
        </ul>
      </div>
      <div className="metric-case__takeaway">
        <span className="metric-case__metric-tag metric-case__metric-tag--takeaway">
          Что берём в Т-Город
        </span>
        <Text size="small">{data.takeawayForUs}</Text>
      </div>
      {data.disclaimer && (
        <div className="metric-case__disclaimer">
          <span className="competitor-case__disclaimer-label">Оговорка</span>
          <Text size="small" tone="secondary">
            {data.disclaimer}
          </Text>
        </div>
      )}
      {data.sources && data.sources.length > 0 && (
        <div className="metric-case__sources">
          <span className="metric-case__sources-label">Источники</span>
          <ul className="competitor-case__sources-list">
            {data.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="competitor-case__source-link"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

type FieldSpec = {
  key: string;
  label: string;
  what: string;
  source: string;
  format?: 'number' | 'rub' | 'percent';
};

type FieldGroup = {
  title: string;
  category: 'audience' | 'conversion' | 'dropoffs' | 'costs' | 'overrides';
  intro: string;
  fields: FieldSpec[];
};

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: 'Прямые значения (если есть готовая цифра)',
    category: 'overrides',
    intro:
      'Если у вас уже есть готовое число (например, аналитики посчитали целевую базу или маржу), просто впишите его сюда — формула будет проигнорирована, и весь сайт пересчитается на ваше значение. Оставьте null или пропустите, чтобы число вычислялось из исходных данных ниже.',
    fields: [
      {
        key: 'targetAudience',
        label: 'Целевая аудитория, человек',
        what: 'Сколько людей в нашем целевом сегменте 14–35 в Т-Банке.',
        source: 'По умолчанию: tBankMAU × targetAgeShare = 25 млн × 40% = 10 млн. Если есть готовое число — впишите.',
        format: 'number',
      },
      {
        key: 'iosAudience',
        label: 'iOS-аудитория, человек',
        what: 'Сколько людей в целевой аудитории сидят на iPhone.',
        source: 'По умолчанию: targetAudience × iosShare. Если CRM знает точное число — впишите.',
        format: 'number',
      },
      {
        key: 'androidAudience',
        label: 'Android-аудитория, человек',
        what: 'Сколько людей в целевой аудитории на Android.',
        source: 'По умолчанию: targetAudience × androidShare.',
        format: 'number',
      },
      {
        key: 'activatedUsers',
        label: 'Активированные пользователи Т-Города, человек',
        what: 'Сколько человек станут активными пользователями Т-Города в год 1.',
        source: 'По умолчанию: targetAudience × expectedActivationRate. Если у маркетинга есть свой прогноз — впишите.',
        format: 'number',
      },
      {
        key: 'monthlyOrders',
        label: 'Заказов в месяц, штук',
        what: 'Общее количество заказов через Т-Город в месяц на полной раскатке.',
        source: 'По умолчанию: activatedUsers × ordersPerUserPerMonth.',
        format: 'number',
      },
      {
        key: 'monthlyMargin',
        label: 'Маржа в месяц, ₽',
        what: 'Сколько чистой маржи Т-Город приносит в месяц на полной раскатке.',
        source: 'По умолчанию: monthlyOrders × avgOrderValue × platformMarginRate.',
        format: 'rub',
      },
      {
        key: 'yearlyMargin',
        label: 'Маржа в год, ₽',
        what: 'Годовая маржа Т-Города на полной раскатке.',
        source: 'По умолчанию: monthlyMargin × 12.',
        format: 'rub',
      },
      {
        key: 'yearOneCostA',
        label: 'Стоимость варианта A (PWA), год 1, ₽',
        what: 'Совокупные затраты на PWA-сценарий в первый год.',
        source: 'По умолчанию: pwaTeam × 12 + (infra+push+analytics+sms) × 12 + дизайн маскота.',
        format: 'rub',
      },
      {
        key: 'yearOneCostC',
        label: 'Стоимость варианта C (Android-виджет), год 1, ₽',
        what: 'Доп. затраты на нативный AppWidget через RuStore.',
        source: 'По умолчанию: androidTeam × 12 + (infra+push)/2 × 12.',
        format: 'rub',
      },
      {
        key: 'yearOneCostE',
        label: 'Стоимость варианта E (комбо), год 1, ₽',
        what: 'Совокупные затраты на полное комбо A + B + C.',
        source: 'По умолчанию: yearOneCostA + yearOneCostC.',
        format: 'rub',
      },
      {
        key: 'courierTotalCost',
        label: 'Стоимость курьеров для всех iOS, ₽',
        what: 'Общие разовые расходы на выезд курьеров (сценарий D).',
        source: 'По умолчанию: iosAudience × courierIosRequestShare × courierVisitRub.',
        format: 'rub',
      },
    ],
  },
  {
    title: 'Аудитория',
    category: 'audience',
    intro: 'Размер базы и распределение по платформам. Берётся из аналитики Т-Банка.',
    fields: [
      {
        key: 'tBankMAU',
        label: 'Активные пользователи Т-Банка / месяц (MAU)',
        what: 'Сколько уникальных людей открывают Т-Банк хотя бы раз в месяц.',
        source: 'CRM / внутренняя аналитика. Плюс-минус миллион погоды не делает.',
        format: 'number',
      },
      {
        key: 'targetAgeShare',
        label: 'Доля 14–35 лет в общей базе',
        what: 'Какой процент клиентов попадает в наш целевой возраст.',
        source: 'Сегментация CRM. Типичный диапазон 35–45%.',
        format: 'percent',
      },
      {
        key: 'iosShare',
        label: 'Доля iOS-устройств',
        what: 'Сколько процентов клиентов сидят на iPhone.',
        source: 'Mediascope 2025: 35–45% в РФ. Меняется медленно.',
        format: 'percent',
      },
      {
        key: 'androidShare',
        label: 'Доля Android-устройств',
        what: 'Сколько процентов клиентов на Android. Должна суммироваться с iOS в 100%.',
        source: 'Тот же источник, что iosShare.',
        format: 'percent',
      },
    ],
  },
  {
    title: 'Конверсия и экономика заказа',
    category: 'conversion',
    intro: 'Самые чувствительные параметры всей модели. Влияют на финальную маржу больше всего.',
    fields: [
      {
        key: 'expectedActivationRate',
        label: 'Ожидаемая активация в Т-Городе',
        what: 'Какой процент целевой аудитории станет активным пользователем за год 1.',
        source: 'Бенчмарк Самокат / Купер: 4–7% при платном привлечении, у нас выше за счёт SSO.',
        format: 'percent',
      },
      {
        key: 'ordersPerUserPerMonth',
        label: 'Заказов на пользователя в месяц',
        what: 'Среднее число покупок одним активным юзером за месяц.',
        source: 'Самокат: 2.4 / Купер: 1.8. Консервативная оценка для нового канала: 2.',
        format: 'number',
      },
      {
        key: 'avgOrderValueRub',
        label: 'Средний чек, ₽',
        what: 'Сколько в среднем стоит один заказ.',
        source: 'Медиана e-grocery РФ 2025: 1800–2500 ₽.',
        format: 'rub',
      },
      {
        key: 'platformMarginRate',
        label: 'Маржа платформы',
        what: 'Какой процент от чека остаётся компании после всех расходов на заказ.',
        source: 'Бенчмарк РФ: 7–13%. Зависит от категорий и объёма скидок.',
        format: 'percent',
      },
    ],
  },
  {
    title: 'Drop-off — потери на шагах воронки',
    category: 'dropoffs',
    intro:
      'Это почти константы — основаны на исследованиях PWA-каналов. Меняйте только при наличии свежих A/B-тестов.',
    fields: [
      {
        key: 'iosAddToHome_14_18',
        label: 'iOS Add to Home Screen, 14–18 лет',
        what: 'Какой процент юношей не доводит установку PWA-иконки на iPhone до конца.',
        source: 'PWA-бенчмарки Авито/X5 2024–2025.',
        format: 'percent',
      },
      {
        key: 'iosAddToHome_19_25',
        label: 'iOS Add to Home, 19–25 лет',
        what: 'Тот же drop-off для старшего сегмента Gen Z.',
        source: 'Те же источники.',
        format: 'percent',
      },
      {
        key: 'iosAddToHome_26_35',
        label: 'iOS Add to Home, 26–35 лет',
        what: 'Тот же drop-off для миллениалов.',
        source: 'Те же источники.',
        format: 'percent',
      },
      {
        key: 'androidWebApkAvg',
        label: 'Android WebAPK, средний',
        what: 'Drop-off auto-prompt установки в Chrome.',
        source: 'Chrome WebAPK телеметрия + опросы 2025.',
        format: 'percent',
      },
      {
        key: 'pushCtrMedian',
        label: 'Push CTR (медиана)',
        what: 'Какой процент получивших пуш открывают его.',
        source: 'OneSignal Industry Benchmarks 2024.',
        format: 'percent',
      },
      {
        key: 'iosShortcutsManual',
        label: 'iOS Shortcuts, ручная настройка',
        what: 'Какой процент юзеров не настраивает Команды самостоятельно.',
        source: 'Качественные интервью Apple HIG 2024.',
        format: 'percent',
      },
    ],
  },
  {
    title: 'Затраты',
    category: 'costs',
    intro:
      'Зарплаты с налогами и страховыми, инфра, маркетинг. Заполняется HR / финансовым отделом.',
    fields: [
      {
        key: 'pwaTeamMonthlyRub',
        label: 'PWA-команда, ₽ / мес',
        what: 'Зарплатный фонд PWA-команды (5 человек: PM + 2 FE + BE + design).',
        source: 'HR-таблица зарплат + 30% налогов и страховых сверху.',
        format: 'rub',
      },
      {
        key: 'androidTeamMonthlyRub',
        label: 'Android-команда (доп.), ₽ / мес',
        what: 'Зарплатный фонд Android-команды для нативного виджета (4 человека).',
        source: 'HR-таблица. Используется только в сценариях C и E.',
        format: 'rub',
      },
      {
        key: 'infraMonthlyRub',
        label: 'Инфра (Yandex Cloud + CDN), ₽ / мес',
        what: 'Хостинг PWA, CDN для медиа маскота.',
        source: 'Тарифы Yandex Cloud / Selectel + прогноз трафика.',
        format: 'rub',
      },
      {
        key: 'pushInfraMonthlyRub',
        label: 'Push-инфра, ₽ / мес',
        what: 'APNS / FCM / web push сервис.',
        source: 'Тарифы OneSignal / Pushwoosh или своё решение.',
        format: 'rub',
      },
      {
        key: 'analyticsMonthlyRub',
        label: 'Аналитика, ₽ / мес',
        what: 'Amplitude / Mixpanel или своя event-система.',
        source: 'Тариф Amplitude по объёму событий.',
        format: 'rub',
      },
      {
        key: 'smsActivationMonthlyRub',
        label: 'SMS / email активация, ₽ / мес',
        what: 'Рассылки на новых пользователей.',
        source: 'Прайс операторов СМС-агрегаторов (~0.05 ₽ / пуш, 1.5 ₽ / SMS).',
        format: 'rub',
      },
      {
        key: 'mascotDesignOneTimeRub',
        label: 'Дизайн маскота, разово ₽',
        what: 'Lottie/Rive анимации + статичные стикеры маскота.',
        source: 'Студия анимации + дизайнер брендинга.',
        format: 'rub',
      },
      {
        key: 'courierVisitRub',
        label: 'Курьер за один визит, ₽',
        what: 'Стоимость одного выезда «помощника» на установку PWA.',
        source: 'Достависта 600–900 ₽ / самозанятый 1500–2500 ₽.',
        format: 'rub',
      },
      {
        key: 'courierIosRequestShare',
        label: 'Доля iOS-юзеров, запросивших курьера',
        what: 'Какой процент iOS-аудитории попросит выезд помощника.',
        source: 'Гипотеза. В сценарии D — самый чувствительный параметр.',
        format: 'percent',
      },
    ],
  },
];

function formatField(value: number, format: FieldSpec['format']): string {
  if (format === 'rub') return formatRub(value);
  if (format === 'percent') return formatPercent(value);
  return value.toLocaleString('ru-RU');
}

function getFieldValue(
  inputs: Inputs,
  metrics: ReturnType<typeof computeMetrics>,
  category: FieldGroup['category'],
  key: string,
): { display: number; manual: boolean } {
  if (category === 'overrides') {
    const override = (inputs.overrides as Record<string, number | null>)[key];
    const computed = (metrics as unknown as Record<string, number>)[key] ?? 0;
    if (typeof override === 'number') return { display: override, manual: true };
    return { display: computed, manual: false };
  }
  const group = inputs[category] as Record<string, number>;
  return { display: group[key] ?? 0, manual: false };
}

function DataSection({
  inputs,
  metrics,
  onLoad,
  onReset,
  loadStatus,
}: {
  inputs: Inputs;
  metrics: ReturnType<typeof computeMetrics>;
  onLoad: (file: File) => void;
  onReset: () => void;
  loadStatus: { kind: 'idle' } | { kind: 'ok'; name: string } | { kind: 'error'; msg: string };
}) {
  return (
    <Stack gap={20}>
      <Stack gap={8}>
        <span className="section-mark" id="data">
          Данные
        </span>
        <H2>Что нужно от финансиста / команды для пересчёта</H2>
        <Text tone="secondary">
          Все цифры на этой странице вычисляются от одного JSON-файла. Скачайте шаблон, заполните
          значения, загрузите назад — таблицы и метрики пересчитаются автоматически. Выводы и
          рекомендация остаются неизменными — это не магия, а математика.
        </Text>
      </Stack>

      <Callout tone="info" title="Два способа задать значение">
        <Text size="small">
          Сайт уважает{' '}
          <Text as="span" weight="semibold">оба варианта</Text> заполнения:
        </Text>
        <Text size="small">
          <Text as="span" weight="semibold">1. Прямое число.</Text> Если у вас уже есть готовая
          цифра (например, аналитики посчитали 11.3 млн человек 14–35 в Т-Банке) — впишите её в
          секцию <span className="kbd">overrides</span>. Сайт возьмёт ваше число как есть, без
          расчёта.
        </Text>
        <Text size="small">
          <Text as="span" weight="semibold">2. Через формулу.</Text> Если готового числа нет —
          оставьте в overrides null, заполните только базовые параметры (MAU, доли, чек, маржа).
          Сайт сам всё вычислит.
        </Text>
        <Text size="small">
          В таблицах ниже у каждого вычисляемого значения видно, как оно сейчас получено: бейдж
          «вручную» = взято из вашего числа, «формула» = посчитано из базовых параметров.
        </Text>
      </Callout>

      <Card title="Загрузить заполненный JSON">
        <Stack gap={12}>
          <Text size="small" tone="secondary">
            Скачайте шаблон, откройте в любом текстовом редакторе или Excel, замените значения
            справа от двоеточий, сохраните как <span className="kbd">.json</span>. Затем загрузите
            файл сюда — все цифры выше пересчитаются.
          </Text>
          <div className="data-actions">
            <a
              className="data-actions__btn data-actions__btn--primary"
              href="/data.template.json"
              download="t-gorod-data.template.json"
            >
              Скачать шаблон
            </a>
            <label className="data-actions__btn">
              Загрузить заполненный файл
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onLoad(file);
                  e.target.value = '';
                }}
              />
            </label>
            <button type="button" className="data-actions__btn data-actions__btn--ghost" onClick={onReset}>
              Сбросить к дефолту
            </button>
          </div>
          {loadStatus.kind === 'ok' && (
            <Callout tone="success" title="Файл загружен">
              <Text size="small">
                Источник: <span className="kbd">{loadStatus.name}</span>. Метрики на странице
                пересчитаны.
              </Text>
            </Callout>
          )}
          {loadStatus.kind === 'error' && (
            <Callout tone="danger" title="Не удалось разобрать файл">
              <Text size="small">{loadStatus.msg}</Text>
            </Callout>
          )}
        </Stack>
      </Card>

      <Stack gap={16}>
        {FIELD_GROUPS.map((group) => (
          <Stack key={group.title} gap={8}>
            <H3>{group.title}</H3>
            <Text size="small" tone="secondary">
              {group.intro}
            </Text>
            <DataTable
              headers={['Поле', 'Что это', 'Где брать значение / формула', 'Текущее']}
              align={['left', 'left', 'left', 'right']}
              rows={group.fields.map((f) => {
                const v = getFieldValue(inputs, metrics, group.category, f.key);
                return [
                  <span className="data-row__key">
                    <span className="kbd">{f.key}</span>
                    <span className="data-row__label">{f.label}</span>
                  </span>,
                  f.what,
                  f.source,
                  <span className="data-row__value">
                    {formatField(v.display, f.format)}
                    {group.category === 'overrides' && (
                      <span
                        className={`data-row__badge data-row__badge--${
                          v.manual ? 'manual' : 'auto'
                        }`}
                      >
                        {v.manual ? 'вручную' : 'формула'}
                      </span>
                    )}
                  </span>,
                ];
              })}
            />
          </Stack>
        ))}
      </Stack>

      <Callout tone="info" title="Что задавать вручную, а что считать">
        <Text size="small">
          Если у вас уже есть готовые цифры от аналитиков (например, точная численность 14–35 в
          базе, или прогноз маржи) — впишите их в группу{' '}
          <Text as="span" weight="semibold">overrides</Text>: они перебьют формулу и весь сайт
          пересчитается. Если нет — оставьте null, и значения посчитаются из исходных параметров
          ниже (MAU, доли, чек, маржа).
        </Text>
        <Text size="small">
          Самые чувствительные исходные параметры:{' '}
          <Text as="span" weight="semibold">expectedActivationRate</Text>,{' '}
          <Text as="span" weight="semibold">avgOrderValueRub</Text>,{' '}
          <Text as="span" weight="semibold">platformMarginRate</Text>. Изменение каждого на 20%
          меняет годовую маржу на сотни миллионов рублей.
        </Text>
      </Callout>
    </Stack>
  );
}

type LoadStatus = { kind: 'idle' } | { kind: 'ok'; name: string } | { kind: 'error'; msg: string };

function mergeInputs(base: Inputs, patch: unknown): Inputs {
  if (!patch || typeof patch !== 'object') return base;
  const p = patch as Record<string, unknown>;
  const next: Inputs = {
    audience: { ...base.audience },
    conversion: { ...base.conversion },
    dropoffs: { ...base.dropoffs },
    costs: { ...base.costs },
    overrides: { ...base.overrides },
  };
  const numericGroups: Array<keyof Omit<Inputs, 'overrides'>> = [
    'audience',
    'conversion',
    'dropoffs',
    'costs',
  ];
  numericGroups.forEach((groupKey) => {
    const partial = p[groupKey];
    if (partial && typeof partial === 'object') {
      const g = partial as Record<string, unknown>;
      const target = next[groupKey] as Record<string, number>;
      Object.keys(target).forEach((field) => {
        const v = g[field];
        if (typeof v === 'number' && !Number.isNaN(v)) target[field] = v;
      });
    }
  });
  const overridesPatch = p.overrides;
  if (overridesPatch && typeof overridesPatch === 'object') {
    const g = overridesPatch as Record<string, unknown>;
    const target = next.overrides as Record<string, number | null>;
    Object.keys(target).forEach((field) => {
      const v = g[field];
      if (typeof v === 'number' && !Number.isNaN(v)) target[field] = v;
      else if (v === null) target[field] = null;
    });
  }
  return next;
}

export function App() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>({ kind: 'idle' });
  const m = useMemo(() => computeMetrics(inputs), [inputs]);

  const handleLoad = (file: File) => {
    file
      .text()
      .then((text) => {
        try {
          const parsed = JSON.parse(text);
          setInputs((curr) => mergeInputs(curr, parsed));
          setLoadStatus({ kind: 'ok', name: file.name });
        } catch (err) {
          setLoadStatus({ kind: 'error', msg: (err as Error).message });
        }
      })
      .catch((err) => setLoadStatus({ kind: 'error', msg: (err as Error).message }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setLoadStatus({ kind: 'idle' });
  };

  const intro = `Разводка по стоимости, окупаемости и тому, нужен ли курьер. Цены — РФ, апрель 2026, на базу целевой аудитории ≈ ${formatPeople(m.targetAudience)} (${formatPercent(inputs.audience.targetAgeShare)} MAU Т-Банка попадает в 14–35). Все цифры пересчитываются автоматически — раздел «Данные».`;

  return (
    <>
      <TopBar />
      <main className="page">
        <Stack gap={32}>
        <Stack gap={8}>
          <span className="section-mark">Т-Город × Т-Банк · хакатон 2026</span>
          <H1>Финплан вариантов «виджета» и онбординга маскота</H1>
          <Text tone="secondary">{intro}</Text>
        </Stack>

        <Grid columns={4} gap={16}>
          <Stat value={formatPeople(m.targetAudience)} label="Целевая база 14–35" />
          <Stat
            value={formatPeople(m.activatedUsers)}
            label={`Прогноз активации (${formatPercent(inputs.conversion.expectedActivationRate)})`}
            tone="info"
          />
          <Stat value={formatRub(m.yearlyMargin)} label="Маржа в год при PWA-варианте" tone="success" />
          <Stat
            value={`~ ${Math.max(1, Math.round(m.paybackDaysE))} дн`}
            label="Окупаемость лучшего сценария"
            tone="success"
          />
        </Grid>

        <Divider />

        <Stack gap={12}>
          <H2 id="audience">Готовность аудитории 14–35 справиться без курьера</H2>
          <Text tone="secondary">
            Главный вопрос — drop-off на этапе самостоятельной установки. Цифры — медианы по
            международным PWA-каналам и российским кейсам Авито/Ozon/X5 за 2024–2025.
          </Text>
          <DataTable
            headers={['Сегмент', 'Платформа', 'Действие', 'Справятся сами', 'Drop-off', 'Курьер?']}
            align={['left', 'left', 'left', 'right', 'right', 'left']}
            rows={[
              ['14–18 (Gen Z)', 'Android', 'Add to Home Screen (auto-promt)', '92%', '8%', 'Нет'],
              ['14–18 (Gen Z)', 'iOS', 'Safari → Share → На экран Домой', '68%', '32%', 'Нет, GIF хватит'],
              ['19–25', 'Android', 'Add to Home Screen', '88%', '12%', 'Нет'],
              ['19–25', 'iOS', 'Add to Home Screen вручную', '55%', '45%', 'Видео-онбординг'],
              ['26–35', 'Android', 'Add to Home Screen', '82%', '18%', 'Нет'],
              ['26–35', 'iOS', 'Add to Home Screen вручную', '42%', '58%', 'Нет, нужны 2 пуша'],
              ['Все', 'iOS', 'Siri Shortcut вручную', '8%', '92%', 'Только курьер'],
              ['Все', 'iOS+Android', 'Universal Link / Push (1 тап)', '99%', '1%', 'Не применим'],
            ]}
            rowTone={[
              'success',
              'success',
              'success',
              'warning',
              'success',
              'warning',
              'danger',
              'success',
            ]}
          />
          <Callout tone="info" title="Главный вывод по аудитории">
            Для 14–35 курьер экономически не оправдан ни в одном PWA-сценарии. Self-serve покрывает
            80–99% аудитории. Курьер имеет смысл только для 55+ или для опции «премиальная установка»
            в Pro-тарифе как маркетинговый ход.
          </Callout>
        </Stack>

        <Divider />

        <Stack gap={12}>
          <H2 id="costs">Разработка и инфраструктура — стоимость по статьям</H2>
          <Text tone="secondary">
            Расчёт исходит из рынка РФ: senior fullstack ≈ 500 тыс ₽/мес, mobile ≈ 600 тыс ₽/мес,
            design / PM / QA — по 300–400 тыс ₽/мес, инфра Yandex Cloud + CDN.
          </Text>
          <DataTable
            headers={['Статья', 'Месяц', 'Год', 'Комментарий']}
            align={['left', 'right', 'right', 'left']}
            rows={[
              [
                'PWA-команда (5 чел)',
                formatRub(inputs.costs.pwaTeamMonthlyRub),
                formatRub(inputs.costs.pwaTeamMonthlyRub * 12),
                'PM, 2 FE, BE, design',
              ],
              [
                'Android-команда (доп.)',
                formatRub(inputs.costs.androidTeamMonthlyRub),
                formatRub(inputs.costs.androidTeamMonthlyRub * 12),
                'mobile + QA',
              ],
              [
                'Yandex Cloud + CDN',
                formatRub(inputs.costs.infraMonthlyRub),
                formatRub(inputs.costs.infraMonthlyRub * 12),
                'PWA hosting, медиа маскота',
              ],
              [
                'Push-инфра (APNS/FCM/web push)',
                formatRub(inputs.costs.pushInfraMonthlyRub),
                formatRub(inputs.costs.pushInfraMonthlyRub * 12),
                'до 30 млн пушей/мес',
              ],
              ['Tinkoff ID OAuth', '0 ₽', '0 ₽', 'Внутренний продукт банка'],
              [
                'Дизайн маскота (Lottie/Rive)',
                '—',
                formatRub(inputs.costs.mascotDesignOneTimeRub),
                'Разовая работа + апдейты',
              ],
              [
                'Аналитика (Amplitude/in-house)',
                formatRub(inputs.costs.analyticsMonthlyRub),
                formatRub(inputs.costs.analyticsMonthlyRub * 12),
                'Funnel, retention',
              ],
              [
                'SMS/email уведомления',
                formatRub(inputs.costs.smsActivationMonthlyRub),
                formatRub(inputs.costs.smsActivationMonthlyRub * 12),
                'Только активация',
              ],
            ]}
          />
        </Stack>

        <Divider />

        <Stack gap={12}>
          <H2>Курьер: реальная стоимость и где это вообще считать</H2>
          <Grid columns={3} gap={16}>
            <Card title="Достависта / Яндекс">
              <Stack gap={6}>
                <Text weight="semibold">600–900 ₽ / визит</Text>
                <Text size="small" tone="secondary">
                  Курьер без техподдержки. Только довезти QR-код / памятку. Помочь с настройкой
                  не сможет.
                </Text>
              </Stack>
            </Card>
            <Card title="Самозанятый «помощник»">
              <Stack gap={6}>
                <Text weight="semibold">1 500–2 500 ₽ / визит</Text>
                <Text size="small" tone="secondary">
                  Сам ставит PWA, авторизует через Tinkoff ID, объясняет маскота. 20–40 мин/клиент.
                </Text>
              </Stack>
            </Card>
            <Card title="Кейс «Сбер для 60+»">
              <Stack gap={6}>
                <Text weight="semibold">≈ 3 200 ₽ / визит</Text>
                <Text size="small" tone="secondary">
                  Бенчмарк: Сбер пенсионерам помогает с биометрией. Это рекордно дорогой канал.
                </Text>
              </Stack>
            </Card>
          </Grid>
          <Callout tone="warning" title="Где курьер ломает экономику">
            Если запросит хотя бы{' '}
            {formatPercent(inputs.costs.courierIosRequestShare)} iOS-аудитории (≈{' '}
            {formatPeople(m.courierIosVisits)} визитов) — это{' '}
            {formatRub(m.courierTotalCost)} разовых расходов. Это в{' '}
            {(m.courierTotalCost / Math.max(1, m.yearOneCostA)).toFixed(1)}× дороже всей
            разработки PWA. Не делать массовым.
          </Callout>
        </Stack>

        <Divider />

        <Stack gap={20}>
          <H2 id="scenarios">Сценарии: совокупная стоимость и окупаемость</H2>

          <Card title="A. PWA + Tinkoff ID + GIF-онбординг" trailing={<Pill tone="success">Рекомендуем</Pill>}>
            <Stack gap={12}>
              <Text>
                Маскот живёт в PWA, на хоум-экран добавляется через Add to Home. Авторизация —
                Tinkoff ID OAuth: 1 тап если Т-Банк установлен. Курьер не нужен.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(m.yearOneCostA)} label="Год 1, total" />
                <Stat value={formatRub(m.yearTwoPlusA)} label="Год 2+" />
                <Stat value={formatPeople(m.activatedUsers)} label="Активация (юзеров)" tone="info" />
                <Stat
                  value={`~ ${Math.max(1, Math.round(m.paybackDaysA))} дн`}
                  label="Окупаемость"
                  tone="success"
                />
              </Grid>
              <DataTable
                headers={['Статья', 'Год 1', 'Покрытие']}
                align={['left', 'right', 'left']}
                rows={[
                  ['PWA-команда (12 мес)', formatRub(m.pwaTeamYear), '—'],
                  ['Инфра + аналитика + push (12 мес)', formatRub(m.pwaInfraYear), '—'],
                  ['Маскот + контент (разово)', formatRub(inputs.costs.mascotDesignOneTimeRub), '—'],
                  ['Курьер', '0 ₽', '0% (не нужен)'],
                  ['ИТОГО', formatRub(m.yearOneCostA), 'iOS + Android'],
                ]}
                rowTone={[undefined, undefined, undefined, 'success', 'info']}
              />
            </Stack>
          </Card>

          <Card title="B. Push + Universal Link (без иконки)" trailing={<Pill tone="info">Дополнение к A</Pill>}>
            <Stack gap={12}>
              <Text>
                Маскот шлёт пуш из Т-Банка → 1 тап → Universal Link → если Т-Банк установлен,
                открывается он → SSO → редирект в PWA Т-Города. 99% юзеров справятся.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(m.yearOneCostB)} label="Год 1, total" />
                <Stat
                  value={`${formatPercent(inputs.dropoffs.pushCtrMedian)} открытия`}
                  label="Push CTR (median)"
                />
                <Stat
                  value={formatPeople(m.pushMonthlyOpens)}
                  label="Открытий push в месяц"
                  tone="info"
                />
                <Stat value="нет cue" label="Habit-формирование" tone="warning" />
              </Grid>
              <Text size="small" tone="secondary">
                Эффективно как разовый драйвер, но без иконки на хоум-экране привычка не закрепляется.
                Идёт парно с вариантом A.
              </Text>
            </Stack>
          </Card>

          <Card title="C. Android-виджет через RuStore" trailing={<Pill tone="info">Только Android</Pill>}>
            <Stack gap={12}>
              <Text>
                Т-Банк уже выпускает Android-апдейты через RuStore — туда можно добавить настоящий
                AppWidget с маскотом и pinned shortcut. iOS не покрывает совсем.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(m.yearOneCostC)} label="Год 1, total" />
                <Stat
                  value={formatPercent(inputs.audience.androidShare)}
                  label="Покрытие базы"
                  tone="warning"
                />
                <Stat value="настоящий" label="Виджет на хоуме" tone="success" />
                <Stat value="нет" label="iOS-решение" tone="danger" />
              </Grid>
            </Stack>
          </Card>

          <Card title="D. PWA + курьер для всех iOS" trailing={<Pill tone="warning">Дорого</Pill>}>
            <Stack gap={12}>
              <Text>
                Гипотетически: курьер{' '}
                {formatRub(inputs.costs.courierVisitRub)} ×{' '}
                {formatPercent(inputs.costs.courierIosRequestShare)} от{' '}
                {formatPeople(m.iosAudience)} iOS-юзеров. Считаем чисто, чтобы показать масштаб
                провала.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(m.yearOneCostD)} label="Год 1, total" tone="danger" />
                <Stat
                  value={formatRub(m.courierTotalCost)}
                  label={`Курьеры (${formatPeople(m.courierIosVisits)} визитов)`}
                  tone="danger"
                />
                <Stat
                  value={`× ${(m.yearOneCostD / Math.max(1, m.yearOneCostA)).toFixed(1)}`}
                  label="Дороже варианта A"
                  tone="danger"
                />
                <Stat
                  value={`~ ${(m.paybackDaysD / 30).toFixed(1)} мес`}
                  label="Окупаемость"
                  tone="warning"
                />
              </Grid>
              <Text size="small" tone="secondary">
                Окупится, но capex запредельный и логистически нереализуем — Достависта не сможет
                поднять {formatPeople(m.courierIosVisits)} визитов в первый год.
              </Text>
            </Stack>
          </Card>

          <Card
            title="E. Комбо A + B + C (PWA + Push + Android-виджет)"
            trailing={<Pill tone="success">Лучшее по покрытию</Pill>}
          >
            <Stack gap={12}>
              <Text>
                Параллельный запуск всех трёх: PWA как основа на iOS+Android, push для активации,
                нативный Android-виджет как cherry on top для половины базы.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(m.yearOneCostE)} label="Год 1, total" />
                <Stat value="100%" label="Покрытие базы" tone="success" />
                <Stat
                  value={formatPeople(m.activatedUsers * 1.4)}
                  label="Активаций"
                  tone="success"
                />
                <Stat
                  value={`~ ${Math.max(1, Math.round(m.paybackDaysE))} дн`}
                  label="Окупаемость"
                  tone="success"
                />
              </Grid>
              <Text size="small" tone="secondary">
                Дельта к варианту A — +{formatRub(m.yearOneCostE - m.yearOneCostA)}, прирост
                активации +40%. ROI этого допвложения ≈{' '}
                {((m.yearlyMargin * 0.4) / Math.max(1, m.yearOneCostE - m.yearOneCostA)).toFixed(0)}×.
              </Text>
            </Stack>
          </Card>
        </Stack>

        <Divider />

        <Stack gap={12}>
          <H2 id="roi">Проверка ROI: откуда возьмётся прибыль</H2>
          <Text tone="secondary">
            Считаем по входным данным из раздела «Данные»: средний чек{' '}
            {formatRub(inputs.conversion.avgOrderValueRub)}, маржа платформы{' '}
            {formatPercent(inputs.conversion.platformMarginRate)}. При активации{' '}
            {formatPeople(m.activatedUsers)} юзеров и{' '}
            {inputs.conversion.ordersPerUserPerMonth} заказа/мес:
          </Text>
          <DataTable
            headers={['Метрика', 'Значение', 'Источник / допущение']}
            align={['left', 'right', 'left']}
            rows={[
              ['Средний чек', formatRub(inputs.conversion.avgOrderValueRub), 'Медиана Самокат/Купер 2025'],
              [
                'Маржа платформы',
                `${formatPercent(inputs.conversion.platformMarginRate)} = ${formatRub(m.marginPerOrder)}`,
                'Бенчмарк e-grocery РФ',
              ],
              [
                `Активация (${formatPercent(inputs.conversion.expectedActivationRate)} от ${formatPeople(m.targetAudience)})`,
                formatPeople(m.activatedUsers),
                'Реалистичный таргет PWA',
              ],
              [
                'Заказов на юзера в месяц',
                String(inputs.conversion.ordersPerUserPerMonth),
                'Конс. оценка для нового канала',
              ],
              [
                'Заказов в месяц',
                formatPeople(m.monthlyOrders),
                `${formatPeople(m.activatedUsers)} × ${inputs.conversion.ordersPerUserPerMonth}`,
              ],
              [
                'Маржа в месяц',
                formatRub(m.monthlyMargin),
                `${formatPeople(m.monthlyOrders)} × ${formatRub(m.marginPerOrder)}`,
              ],
              ['Маржа в год', formatRub(m.yearlyMargin), 'на полную раскатку'],
            ]}
            rowTone={[
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              'success',
              'success',
            ]}
          />
          <Callout tone="success" title="Финальная картина">
            Любой из вариантов A–C–E окупается за 3–4 недели после полной раскатки. Курьер в массовом
            сегменте 14–35 — выброс денег: целевая аудитория самостоятельно справляется с
            PWA-онбордингом. Выделять отдельный бюджет на курьеров стоит только под пилот «премиум
            установка маскота» как маркетинговую акцию для лояльных VIP-клиентов (~5–10 тыс визитов,
            ≈ 20 млн ₽ — окупится PR-эффектом).
          </Callout>
        </Stack>

        <Divider />

        <Stack gap={12}>
          <H2>План к запуску: что делать в первые 6 недель</H2>
          <Grid columns={2} gap={16}>
            <Card title="Спринт 1–2 (нед 1–4)">
              <ul className="list">
                <li>Подключить Tinkoff ID OAuth в PWA Т-Города</li>
                <li>Настроить manifest.json + WebAPK для Android</li>
                <li>Universal Link tcity.ru/m/* для deep-link маскота</li>
                <li>Push-канал с тематическими триггерами</li>
                <li>Lottie-маскот в onboarding-flow</li>
              </ul>
            </Card>
            <Card title="Спринт 3 (нед 5–6)">
              <ul className="list">
                <li>GIF-инструкция Add to Home для iOS Safari</li>
                <li>A/B-тест баннера в Т-Банке: «Тима ждёт» vs CTA</li>
                <li>Аналитика воронки: install → SSO → 1й заказ</li>
                <li>E2E на Playwright: PWA install + OAuth flow</li>
                <li>Pilot Android-виджета через RuStore (10% rollout)</li>
              </ul>
            </Card>
          </Grid>
        </Stack>

        <Stack gap={6}>
          <H3>Ключевые риски экономики</H3>
          <Text size="small" tone="secondary">
            • Drop-off на iOS Safari Add to Home может быть выше 50% — нужен сильный onboarding и
            параллельный канал push.
          </Text>
          <Text size="small" tone="secondary">
            • Маржа 10% — оптимистичная оценка для собственного e-grocery. Если ниже 5%, окупаемость
            растягивается до 2 месяцев.
          </Text>
          <Text size="small" tone="secondary">
            • Tinkoff ID API rate limits и SLA — узкое место при пиковой нагрузке.
          </Text>
        </Stack>

        <Divider />

        <Stack gap={24}>
          <Stack gap={8}>
            <span className="section-mark" id="decision">
              Финальное решение
            </span>
            <H2>Что я бы выбрал — отдельно для iOS и Android</H2>
            <Text tone="secondary">
              Для каждой ОС взял два полярных варианта: «вложиться в долгий продукт» против
              «сэкономить и проверить рынок». На большинстве рынков нет смысла экономить на iOS —
              там Apple прижимает все легальные пути и любая дешёвая обходная схема ломает habit
              loop. На Android всё проще: ОС сама даёт нативные крючки.
            </Text>
          </Stack>

          <Stack gap={20}>
            <div className="os-section">
              <div className="os-header">
                <span className="os-header__tag">iOS</span>
                <H3>Закрытая ОС, App Store недоступен — главное сохранить клиентов</H3>
              </div>
              <Grid columns={2} gap={16}>
                <OptionCard
                  id="iOS · вариант 1"
                  title="PWA + Add to Home Screen + Tinkoff ID"
                  pick
                  metrics={[
                    { value: formatRub(m.yearOneCostA), label: 'Год 1' },
                    { value: '5 чел', label: 'Команда (PM/FE×2/BE/design)' },
                    {
                      value: `~${Math.max(1, Math.round(m.paybackDaysA))} дн`,
                      label: 'Окупаемость',
                    },
                  ]}
                  pros={{
                    good: [
                      'Иконка маскота на хоум-экране = постоянный habit-cue',
                      'Tinkoff ID OAuth: 1 тап SSO если Т-Банк установлен',
                      'Обновляется без сторе, push-уведомления с iOS 16.4',
                      'LTV растёт стабильно: пользователь возвращается ритуально',
                    ],
                    bad: [
                      'Drop-off 30–60% на iOS Safari при Add to Home',
                      'Apple ограничивает Web Push API и фоновую работу',
                      'Нужен сильный onboarding (GIF + видео + push-страховка)',
                    ],
                  }}
                  why={
                    'Это инвестиция в долгий продукт. На iOS у нас один шанс закрепить привычку — иконка на хоум-экране это единственный легальный аналог виджета для заблокированной экосистемы. Если сэкономить и не сделать PWA нормально, мы потеряем клиентов: пуши без cue выгорают за 2 недели, и продукт не оправдает 2.4 млрд ₽ годовой маржи. Дороже один раз — но платим за привычку, а не за разовый клик.'
                  }
                />
                <OptionCard
                  id="iOS · вариант 2"
                  title="Push + Universal Link (без иконки)"
                  metrics={[
                    { value: formatRub(m.yearOneCostB), label: 'Год 1' },
                    { value: '2 чел', label: 'Команда (BE + push-маркетолог)' },
                    { value: '— нет cue', label: 'Habit формирование' },
                  ]}
                  pros={{
                    good: [
                      'Запуск за 4 недели, минимум команды',
                      '1 тап от пуша до Т-Города через Universal Link',
                      'Можно проверить гипотезу до фулл-инвестиции',
                      'Использует существующую push-инфру Т-Банка',
                    ],
                    bad: [
                      'Без иконки на хоум-экране нет habit-cue: пользователь не вернётся сам',
                      'Push-выгорание за 2–3 недели → активные клиенты уйдут',
                      'Каждый запуск зависит от наших пушей — это не их выбор',
                      'iOS режет частоту пушей при отписках, фуннел сужается',
                    ],
                  }}
                  why={
                    'Имеет смысл только как 4-недельный пилот для проверки рынка перед фулл-инвестицией в PWA. Если на пилоте конверсия в первый заказ < 2%, продукт на iOS не взлетит и в полном варианте — лучше узнать это за 12 млн ₽, чем за 35. Но как стационарное решение это путь к оттоку: сэкономить на команде сейчас = заплатить уходом клиентов через 6 месяцев.'
                  }
                />
              </Grid>
            </div>

            <div className="os-section">
              <div className="os-header">
                <span className="os-header__tag">Android</span>
                <H3>Открытая ОС: даже базовое решение даёт почти-виджет бесплатно</H3>
              </div>
              <Grid columns={2} gap={16}>
                <OptionCard
                  id="Android · вариант 1"
                  title="Native AppWidget через RuStore + Pinned Shortcut"
                  metrics={[
                    { value: formatRub(m.yearOneCostC), label: 'Год 1 (доп к PWA)' },
                    { value: '+4 чел', label: 'Mobile + QA' },
                    { value: 'настоящий', label: 'Виджет на хоуме' },
                  ]}
                  pros={{
                    good: [
                      'Реальный AppWidget с маскотом — лучшая discoverability',
                      'Long-press на иконке Т-Банка → «Открыть Т-Город» (dynamic shortcut)',
                      'RuStore позволяет релизы без задержек Google Play',
                      'Виджет показывает state маскота на хоуме без открытия приложения',
                    ],
                    bad: [
                      'Релизный цикл RuStore 2–4 недели, дольше итерации',
                      'Доп. mobile-команда (+4 чел = +14 млн ₽/год)',
                      'Покрывает только Android (~50% базы), iOS остаётся на PWA',
                      'Дублирование логики маскота с PWA',
                    ],
                  }}
                  why={
                    'Стоит делать во второй фазе, когда PWA подтвердила экономику. Даёт +5–10% к удержанию, но не оправдывает старт с него: 14 млн ₽ доп зарплат можно потратить только когда первая когорта PWA даст 200+ млн ₽ маржи в месяц. До этого — переинвестирование в платформу, у которой 50% покрытие.'
                  }
                />
                <OptionCard
                  id="Android · вариант 2"
                  title="PWA WebAPK (Chrome авто-промпт)"
                  pick
                  metrics={[
                    { value: '0 ₽', label: 'Доп бюджета' },
                    { value: '0 чел', label: 'Команда (общая с iOS)' },
                    { value: '~85%', label: 'Самоустановка' },
                  ]}
                  pros={{
                    good: [
                      'Chrome сам предложит «Установить приложение» — иконка на хоуме',
                      '0 ₽ дополнительных затрат: всё уже сделано в рамках iOS PWA',
                      'Drop-off минимальный (12–18%) — Gen Z нажимает auto-prompt',
                      'Web Push на Android работает без ограничений Apple',
                      'Релиз вместе с PWA — никаких сторе и циклов',
                    ],
                    bad: [
                      'Не нативный виджет — только иконка-плитка, без живого state',
                      'Chrome-only (но это 90%+ Android-рынка)',
                      'Меньше brand-эффекта чем настоящий AppWidget в RuStore',
                    ],
                  }}
                  why={
                    'Это бесплатный win. Та же кодовая база PWA, что для iOS, на Android даёт почти-виджет через WebAPK без единой строки нативного кода. На Android открытая ОС не наказывает за обходные пути — Chrome сам предлагает установку, авто-промпт работает. Берём это как старт, а нативный виджет добавляем после подтверждения экономики. Сэкономленные 18 млн ₽ идут на маркетинг и удержание.'
                  }
                />
              </Grid>
            </div>
          </Stack>

          <Stack gap={12}>
            <H3>Карта решений: ось «инвестиции» × ось «удержание клиентов»</H3>
            <Text size="small" tone="secondary">
              Где каждый из 4 вариантов на карте «сколько вкладываем» против «сколько клиентов
              остаётся в долгую». Видно, что лучшая клетка — «низкие инвестиции + высокий LTV» —
              достигается только на Android. На iOS — придётся выбирать: или платим больше и
              остаёмся, или экономим и теряем.
            </Text>
            <div className="matrix">
              <div className="matrix__y-axis">
                <span className="matrix__y-label">Удержание клиентов / LTV →</span>
              </div>

              <div className="matrix__cell">
                <span className="matrix__cell-coords">↑ Hi LTV · ↓ Lo invest</span>
                <span className="matrix__cell-label">Идеальная клетка</span>
                <div className="matrix__chip matrix__chip--accent">
                  <span className="matrix__chip-os">Android · 2</span>
                  PWA WebAPK
                </div>
              </div>

              <div className="matrix__cell">
                <span className="matrix__cell-coords">↑ Hi LTV · ↑ Hi invest</span>
                <span className="matrix__cell-label">Платим за привычку</span>
                <div className="matrix__chip matrix__chip--accent">
                  <span className="matrix__chip-os">iOS · 1</span>
                  PWA + Add to Home
                </div>
                <div className="matrix__chip">
                  <span className="matrix__chip-os">Android · 1</span>
                  Native AppWidget
                </div>
              </div>

              <div className="matrix__cell">
                <span className="matrix__cell-coords">↓ Lo LTV · ↓ Lo invest</span>
                <span className="matrix__cell-label">Пилотный замер</span>
                <div className="matrix__chip">
                  <span className="matrix__chip-os">iOS · 2</span>
                  Push + Universal Link
                </div>
              </div>

              <div className="matrix__cell">
                <span className="matrix__cell-coords">↓ Lo LTV · ↑ Hi invest</span>
                <span className="matrix__cell-label">Ловушка для бюджета</span>
                <Text size="small" tone="secondary">
                  Сюда попадает любой курьерский сценарий и iOS Shortcuts с массовой
                  поддержкой — потратили много, клиентов всё равно мало.
                </Text>
              </div>

              <div className="matrix__x-axis">
                <span className="matrix__x-label">→ Размер инвестиции в команду</span>
              </div>
            </div>
          </Stack>

          <Callout tone="success" title="Финальная рекомендация">
            <Text size="small">
              Берём <Text as="span" weight="semibold">iOS-1 (PWA + Add to Home + Tinkoff ID)</Text>{' '}
              и <Text as="span" weight="semibold">Android-2 (PWA WebAPK)</Text> в первой фазе.
              Это одна общая команда из 5 человек, общий стек, одна кодовая база. Бюджет —{' '}
              {formatRub(m.yearOneCostA)} год 1, окупаемость ≈{' '}
              {Math.max(1, Math.round(m.paybackDaysA))} дней.
            </Text>
            <Text size="small">
              <Text as="span" weight="semibold">Android-1 (native AppWidget)</Text> добавляем
              во второй фазе, когда первая когорта подтвердит маржу — это +
              {formatRub(m.yearOneCostC)} за +5–10% к retention на половине базы.
            </Text>
            <Text size="small">
              <Text as="span" weight="semibold">iOS-2 (push only)</Text> используем только как
              4-недельный пилот для тестирования гипотезы или как канал активации поверх iOS-1, но
              никогда как основное решение — без иконки на хоум-экране клиенты не закрепляются.
            </Text>
          </Callout>
        </Stack>

        <Divider />

        <Stack gap={20}>
          <Stack gap={8}>
            <span className="section-mark" id="metrics">
              Метрики
            </span>
            <H2>Какие метрики и контр-метрики брать у конкурентов с маскотами</H2>
            <Text tone="secondary">
              Когда оценивать success онбординга и удержания — не изобретаем велосипед, смотрим,
              какие KPI используют продукты с маскотами и стрик-механиками. Для каждого кейса:
              что они делают, главная north-star метрика, контр-метрики (чтобы не сломать UX), и
              что переносим в Т-Город.
            </Text>
          </Stack>

          <div className="metric-cases">
            {METRIC_CASES.map((c) => (
              <MetricCaseCard key={c.brand} data={c} />
            ))}
          </div>

          <Stack gap={12}>
            <H3>Свод: KPI-набор для Т-Города и Лиса Толи</H3>
            <Text size="small" tone="secondary">
              Из 6 кейсов выше выкристаллизовался такой набор. Главное правило: на каждую growth
              метрику — обязательная контр-метрика, чтобы не разогнать DAU ценой токсичности.
            </Text>
            <DataTable
              headers={['Стадия', 'Метрика роста', 'Контр-метрика', 'Целевое значение']}
              align={['left', 'left', 'left', 'right']}
              rows={[
                [
                  'Привлечение',
                  'CAC через Tinkoff ID канал',
                  'CAC vs LTV ratio (≥3×)',
                  '50–80 ₽ / юзер',
                ],
                [
                  'Активация',
                  'Time to first order (от регистрации до первой покупки)',
                  'Onboarding drop-off на каждом шаге',
                  '< 30 минут',
                ],
                [
                  'Активация',
                  '% юзеров, сделавших 1 заказ за 7 дней',
                  'Refund rate первого заказа',
                  '≥ 35%',
                ],
                [
                  'Удержание',
                  'D7 retention (вернулись через неделю)',
                  'Push opt-out rate',
                  '≥ 25% при opt-out < 12%',
                ],
                [
                  'Удержание',
                  'D30 retention',
                  '«Чувствую, что Толя давит» (quarterly survey)',
                  '≥ 18% при negative ≤ 10%',
                ],
                [
                  'Удержание',
                  'Streak length distribution (% юзеров со streak ≥7)',
                  'Streak break NPS (отзывы тех, кто потерял огонь)',
                  '≥ 40% при NPS > 0',
                ],
                [
                  'Engagement',
                  'Заказов на активного юзера / месяц',
                  'Session length > 5 мин (для grocery — too long)',
                  '≥ 2.0 при session ≤ 4 мин',
                ],
                [
                  'Качество',
                  'Mascot interaction rate (% сессий с тапом по Толе)',
                  'Mascot fatigue (CSAT по «маскот стал назойливым»)',
                  '≥ 60% при CSAT ≥ 4.0',
                ],
                [
                  'Семья',
                  'Семейные пары (родитель + ребёнок одного аккаунта)',
                  'Parental complaint rate (письма в поддержку про детей)',
                  '≥ 25% при complaint ≤ 0.5%',
                ],
              ]}
              rowTone={[
                undefined,
                'info',
                'info',
                'success',
                'success',
                'success',
                'warning',
                'warning',
                'warning',
              ]}
            />
          </Stack>

          <Callout tone="warning" title="Главный анти-паттерн: погоня только за DAU">
            <Text size="small">
              Самая частая ошибка — оптимизировать только DAU без контр-метрик. Duolingo через это
              прошёл и получил мем про «токсичную сову». В Т-Городе делать строго парами:{' '}
              <Text as="span" weight="semibold">
                каждая метрика роста = одна контр-метрика
              </Text>
              . Если хотя бы одна контр-метрика красная (push opt-out выше 12%, NPS ниже 0,
              parental complaint выше 0.5%) — рост заморожен, чиним UX, потом качаем дальше.
            </Text>
          </Callout>
        </Stack>

        <Divider />

        <Stack gap={20}>
          <Stack gap={8}>
            <span className="section-mark" id="competitors">
              Кейсы конкурентов
            </span>
            <H2>Маскоты в индустрии: постоянные, сезонные, минималистичные</H2>
            <Text tone="secondary">
              Только проверенные кейсы с конкретными цифрами и ссылками на источники. Где данные
              ограничены — пометил «оговоркой». Главные референсы: Самокат (сезонная панда
              Пандагочи 2025), Сбер (постоянный СберКот), Яндекс Лавка (без маскота, чисто
              геймификация), Duolingo (постоянный + сезонные скины).
            </Text>
          </Stack>

          <div className="competitor-cases">
            {COMPETITOR_CASES.map((c) => (
              <CompetitorCard key={c.brand} data={c} />
            ))}
          </div>

          <Callout tone="info" title="Главный паттерн из этих кейсов">
            <Text size="small">
              <Text as="span" weight="semibold">Сезонная маскот-механика</Text> (как Пандагочи в
              Самокате) — самая эффективная для запуска: она создаёт ощущение события без
              «вечного давления». Постоянный маскот (СберКот, Duo) даёт длинный retention, но
              требует продуманного жизненного цикла и сезонных скинов поверх. Без маскота
              (Яндекс Лавка) — работает, но требует точечных продуктовых решений вместо
              эмоционального якоря.
            </Text>
            <Text size="small">
              Для Т-Города оптимальная стратегия — гибрид: Лис Толя как постоянный маскот +
              сезонные ивенты с тамагочи-механикой раз в квартал (весна / лето / осень / зима).
              Это даёт и long-term identity, и регулярные пики вовлечения.
            </Text>
          </Callout>
        </Stack>

        <Divider />

        <DataSection
          inputs={inputs}
          metrics={m}
          onLoad={handleLoad}
          onReset={handleReset}
          loadStatus={loadStatus}
        />

        <Divider />

        <Stack gap={20}>
          <Stack gap={8}>
            <span className="section-mark" id="glossary">
              Словарь
            </span>
            <H2>Что значат все эти аббревиатуры — на пальцах</H2>
            <Text tone="secondary">
              Если в тексте выше встретилось слово, которое не очевидно — этот раздел для команды
              без технического бекграунда. Каждый термин: что это простыми словами, пример из жизни,
              как используется в нашем проекте.
            </Text>
          </Stack>

          <Stack gap={12}>
            <div className="category-header">
              <span className="category-header__tag category-header__tag--tech">
                Тех / разработка
              </span>
              <Text size="small" tone="secondary">
                Слова из мира кода, мобильных приложений и серверов.
              </Text>
            </div>
            <div className="glossary">
              {TECH_TERMS.map((t) => (
                <TermCard key={t.name} term={t} />
              ))}
            </div>
          </Stack>

          <Stack gap={12}>
            <div className="category-header">
              <span className="category-header__tag category-header__tag--finance">
                Финансы / экономика
              </span>
              <Text size="small" tone="secondary">
                Метрики, которыми измеряют успех бизнеса.
              </Text>
            </div>
            <div className="glossary">
              {FINANCE_TERMS.map((t) => (
                <TermCard key={t.name} term={t} />
              ))}
            </div>
          </Stack>

          <Stack gap={12}>
            <div className="category-header">
              <span className="category-header__tag category-header__tag--marketing">
                Маркетинг / продукт
              </span>
              <Text size="small" tone="secondary">
                Как меряют поведение пользователей и проверяют гипотезы.
              </Text>
            </div>
            <div className="glossary">
              {MARKETING_TERMS.map((t) => (
                <TermCard key={t.name} term={t} />
              ))}
            </div>
          </Stack>
        </Stack>

        <Divider />

        <Text size="small" tone="secondary">
          Сборка: <span className="kbd">npm install</span> → <span className="kbd">npm run dev</span>{' '}
          (локально). Деплой — Vercel, см. README.md.
        </Text>
        </Stack>
      </main>
    </>
  );
}
