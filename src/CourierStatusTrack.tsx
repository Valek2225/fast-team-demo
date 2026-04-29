/** Этап доставки: 1 — в сборке, 2 — в пути, 3 — доставлено. Отрезки между точками только 0% или 100%. */
export type CourierStage = 1 | 2 | 3;

function dotClass(idx: CourierStage, stage: CourierStage) {
  if (stage < idx) return 'm-courier__dot m-courier__dot--todo';
  if (stage === idx) return 'm-courier__dot m-courier__dot--current';
  return 'm-courier__dot m-courier__dot--done';
}

export function CourierStatusTrack({ stage = 1 }: { stage?: CourierStage }) {
  const segAfterFirstDone = stage >= 2;
  const segAfterSecondDone = stage >= 3;

  return (
    <>
      <div
        className="m-courier m-courier--discrete"
        role="img"
        aria-label={`Статус: этап ${stage} из 3`}
      >
        <div className="m-courier__wing m-courier__wing--left">
          <div className={dotClass(1, stage)} />
          <div className="m-courier__segment">
            <div className="m-courier__segment-inner">
              <div
                className={`m-courier__segment-fill ${segAfterFirstDone ? 'm-courier__segment-fill--full' : ''}`}
              />
            </div>
          </div>
        </div>
        <div className="m-courier__center">
          <div className={dotClass(2, stage)} />
        </div>
        <div className="m-courier__wing m-courier__wing--right">
          <div className="m-courier__segment">
            <div className="m-courier__segment-inner">
              <div
                className={`m-courier__segment-fill ${segAfterSecondDone ? 'm-courier__segment-fill--full' : ''}`}
              />
            </div>
          </div>
          <div className={dotClass(3, stage)} />
        </div>
      </div>
      <div className="m-courier__labels">
        <span>В сборке</span>
        <span>В пути</span>
        <span>Доставлено</span>
      </div>
    </>
  );
}
