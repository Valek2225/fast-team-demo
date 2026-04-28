import type { CSSProperties, ReactNode } from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info' | undefined;

const formatRub = (rub: number): string => {
  if (rub >= 1_000_000_000) return `${(rub / 1_000_000_000).toFixed(2)} млрд ₽`;
  if (rub >= 1_000_000) return `${(rub / 1_000_000).toFixed(1)} млн ₽`;
  if (rub >= 1_000) return `${(rub / 1_000).toFixed(0)} тыс ₽`;
  return `${rub} ₽`;
};

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

export function App() {
  return (
    <>
      <TopBar />
      <main className="page">
        <Stack gap={32}>
        <Stack gap={8}>
          <span className="section-mark">Т-Город × Т-Банк · хакатон 2026</span>
          <H1>Финплан вариантов «виджета» и онбординга маскота</H1>
          <Text tone="secondary">
            Разводка по стоимости, окупаемости и тому, нужен ли курьер. Цены — РФ, апрель 2026,
            на базу целевой аудитории ≈ 10 млн (40% MAU Т-Банка попадает в 14–35).
          </Text>
        </Stack>

        <Grid columns={4} gap={16}>
          <Stat value="10 млн" label="Целевая база 14–35" />
          <Stat value="500 тыс" label="Прогноз активации (5%)" tone="info" />
          <Stat value="2.4 млрд ₽" label="Маржа в год при PWA-варианте" tone="success" />
          <Stat value="~ 3 нед" label="Окупаемость лучшего варианта" tone="success" />
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
              ['PWA-команда (5 чел)', formatRub(2_500_000), formatRub(30_000_000), 'PM, 2 FE, BE, design'],
              ['Android-команда (доп.)', formatRub(1_200_000), formatRub(14_400_000), 'mobile + QA'],
              ['Yandex Cloud + CDN', formatRub(150_000), formatRub(1_800_000), 'PWA hosting, медиа маскота'],
              ['Push-инфра (APNS/FCM/web push)', formatRub(80_000), formatRub(960_000), 'до 30 млн пушей/мес'],
              ['Tinkoff ID OAuth', '0 ₽', '0 ₽', 'Внутренний продукт банка'],
              ['Дизайн маскота (Lottie/Rive)', '—', formatRub(1_500_000), 'Разовая работа + апдейты'],
              ['Аналитика (Amplitude/in-house)', formatRub(200_000), formatRub(2_400_000), 'Funnel, retention'],
              ['SMS/email уведомления (1 млн)', formatRub(50_000), formatRub(600_000), 'Только активация'],
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
            Если запросит хотя бы 5% iOS-аудитории (≈ 75 тыс визитов) — это 150 млн ₽
            разовых расходов. Это в 5 раз дороже всей разработки PWA. Не делать массовым.
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
                <Stat value={formatRub(35_000_000)} label="Год 1, total" />
                <Stat value={formatRub(20_000_000)} label="Год 2+" />
                <Stat value="500 тыс" label="Активация (юзеров)" tone="info" />
                <Stat value="~ 18 дней" label="Окупаемость" tone="success" />
              </Grid>
              <DataTable
                headers={['Статья', 'Год 1', 'Покрытие']}
                align={['left', 'right', 'left']}
                rows={[
                  ['Разработка PWA (3 мес × команда)', formatRub(7_500_000), '—'],
                  ['Инфра + аналитика', formatRub(5_000_000), '—'],
                  ['Поддержка (полгода × 50%)', formatRub(15_000_000), '—'],
                  ['Маскот + контент', formatRub(2_500_000), '—'],
                  ['Активация (push + SMS)', formatRub(5_000_000), '—'],
                  ['Курьер', '0 ₽', '0% (не нужен)'],
                  ['ИТОГО', formatRub(35_000_000), 'iOS + Android'],
                ]}
                rowTone={[undefined, undefined, undefined, undefined, undefined, 'success', 'info']}
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
                <Stat value={formatRub(12_000_000)} label="Год 1, total" />
                <Stat value="9% открытия" label="Push CTR (median)" />
                <Stat value="180 тыс" label="Активаций в месяц" tone="info" />
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
                <Stat value={formatRub(18_000_000)} label="Год 1, total" />
                <Stat value="~50%" label="Покрытие базы" tone="warning" />
                <Stat value="настоящий" label="Виджет на хоуме" tone="success" />
                <Stat value="нет" label="iOS-решение" tone="danger" />
              </Grid>
            </Stack>
          </Card>

          <Card title="D. PWA + курьер для всех iOS" trailing={<Pill tone="warning">Дорого</Pill>}>
            <Stack gap={12}>
              <Text>
                Гипотетически: курьер 2 000 ₽ × 5% от 4 млн iOS-юзеров. Считаем чисто, чтобы
                показать масштаб провала.
              </Text>
              <Grid columns={4} gap={12}>
                <Stat value={formatRub(435_000_000)} label="Год 1, total" tone="danger" />
                <Stat value={formatRub(400_000_000)} label="Курьеры (200 тыс визитов)" tone="danger" />
                <Stat value="× 12" label="Дороже варианта A" tone="danger" />
                <Stat value="~ 8 мес" label="Окупаемость" tone="warning" />
              </Grid>
              <Text size="small" tone="secondary">
                Окупится, но capex запредельный и логистически нереализуем — Достависта не сможет
                поднять 200 тыс визитов в первый год.
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
                <Stat value={formatRub(58_000_000)} label="Год 1, total" />
                <Stat value="100%" label="Покрытие базы" tone="success" />
                <Stat value="700 тыс" label="Активаций" tone="success" />
                <Stat value="~ 25 дней" label="Окупаемость" tone="success" />
              </Grid>
              <Text size="small" tone="secondary">
                Дельта к варианту A — +23 млн ₽, прирост активации +40%. ROI этого допвложения ≈ 30×.
              </Text>
            </Stack>
          </Card>
        </Stack>

        <Divider />

        <Stack gap={12}>
          <H2 id="roi">Проверка ROI: откуда возьмётся прибыль</H2>
          <Text tone="secondary">
            Считаем по средним цифрам российского food-tech 2025: средний чек 2 000 ₽, маржа платформы
            10% (Самокат, Купер). При активации 500 тыс юзеров и 2 заказа/мес:
          </Text>
          <DataTable
            headers={['Метрика', 'Значение', 'Источник / допущение']}
            align={['left', 'right', 'left']}
            rows={[
              ['Средний чек', '2 000 ₽', 'Медиана Самокат/Купер 2025'],
              ['Маржа платформы', '10% = 200 ₽', 'Бенчмарк e-grocery РФ'],
              ['Активация (5% от 10 млн)', '500 000', 'Реалистичный таргет PWA'],
              ['Заказов на юзера в месяц', '2', 'Конс. оценка для нового канала'],
              ['Заказов в месяц', '1 000 000', '500к × 2'],
              ['Маржа в месяц', formatRub(200_000_000), '1 млн × 200 ₽'],
              ['Маржа в год', formatRub(2_400_000_000), 'на полную раскатку'],
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
                    { value: formatRub(35_000_000), label: 'Год 1' },
                    { value: '5 чел', label: 'Команда (PM/FE×2/BE/design)' },
                    { value: '~18 дн', label: 'Окупаемость' },
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
                    { value: formatRub(12_000_000), label: 'Год 1' },
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
                    { value: formatRub(18_000_000), label: 'Год 1 (доп к PWA)' },
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
              Это одна общая команда из 5 человек, общий стек, одна кодовая база. Бюджет — 35 млн ₽
              год 1, окупаемость ≈ 18 дней.
            </Text>
            <Text size="small">
              <Text as="span" weight="semibold">Android-1 (native AppWidget)</Text> добавляем
              во второй фазе, когда первая когорта подтвердит маржу — это +18 млн ₽ за +5–10% к
              retention на половине базы.
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
