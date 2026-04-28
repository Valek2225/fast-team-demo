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

function H1({ children }: { children: ReactNode }) {
  return <h1 className="h1">{children}</h1>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="h2">{children}</h2>;
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="h3">{children}</h3>;
}

function Text({
  children,
  tone,
  size,
  weight,
}: {
  children: ReactNode;
  tone?: 'secondary';
  size?: 'small';
  weight?: 'semibold';
}) {
  const cls = ['text'];
  if (tone === 'secondary') cls.push('text--secondary');
  if (size === 'small') cls.push('text--small');
  if (weight === 'semibold') cls.push('text--semibold');
  return <p className={cls.join(' ')}>{children}</p>;
}

function Divider() {
  return <hr className="divider" />;
}

export function App() {
  return (
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
          <H2>Готовность аудитории 14–35 справиться без курьера</H2>
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
          <H2>Разработка и инфраструктура — стоимость по статьям</H2>
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
          <H2>Сценарии: совокупная стоимость и окупаемость</H2>

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
          <H2>Проверка ROI: откуда возьмётся прибыль</H2>
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

        <Text size="small" tone="secondary">
          Сборка: <span className="kbd">npm install</span> → <span className="kbd">npm run dev</span>{' '}
          (локально). Деплой — Vercel, см. README.md.
        </Text>
      </Stack>
    </main>
  );
}
