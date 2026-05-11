# Home Assistant Dependencies

Этот проект — кастомная Lovelace карточка для Home Assistant.

## 1) Build dependencies (для разработки карточки)

Используются через `package.json`:
- `lit`
- `typescript`
- `tsup`

## 2) Home Assistant requirements

- Home Assistant c поддержкой Lovelace Custom Cards
- Подключение JS ресурса карточки через Dashboard Resources

## 3) Entity dependencies (данные в HA)

Для каждого узла карточка может использовать следующие сущности:
- `power` (W)
- `current` (A)
- `voltage` (V)
- `state` (on/off/fault/...)

Поддерживаемые источники:
- сеть (`grid`)
- автоматы/реле
- солнечные панели (`solar`)
- гибридный инвертор (`inverter`)
- аккумулятор (`battery`)
- нагрузки (`load`) с типом нагрузки (`load_kind`)

## 4) Рекомендуемые сенсоры в HA

- `sensor.*_power`
- `sensor.*_current`
- `sensor.*_voltage`
- `binary_sensor.*_state` или `sensor.*_status`

## 5) Фазность

Для однофазной сети задавайте `phase: L1`.
Для трехфазной сети маркируйте узлы/линии как `L1`, `L2`, `L3`.
Карточка покажет суммарную мощность по фазам и KPI дисбаланса.
