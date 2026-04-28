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

        <Text size="small" tone="secondary">
          Сборка: <span className="kbd">npm install</span> → <span className="kbd">npm run dev</span>{' '}
          (локально). Деплой — Vercel, см. README.md.
        </Text>
        </Stack>
      </main>
    </>
  );
}
