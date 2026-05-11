# House Power Flow Card

Конструктор кастомной карточки Home Assistant для визуализации энергосистемы дома:
- сеть (grid)
- солнечные панели (solar)
- гибридный инвертор (inverter)
- аккумуляторы (battery)
- автоматы/реле
- щитки с позициями
- нагрузки разных типов

## Что уже есть

- Жесткая модель `parent -> child` для расчета топологии
- Суммирование мощности/тока по дереву
- `grid` автоматически считает потребление как сумму дочерних веток
- Поддержка однофазной и трехфазной схемы (`L1/L2/L3`)
- KPI дисбаланса фаз (`Phase Δ`)
- Явные связи между слотами внутри щитка
- Динамические точки потока по линиям
  - чем выше ток/мощность — тем выше скорость
  - поддержка двухнаправленной линии (например инвертор ↔ аккумулятор)
- KPI по энергии:
  - `PV Gen`
  - `Battery +` (разряд)
  - `Battery -` (заряд)
  - `Grid Import`
  - `Grid Export`

## Конфигуратор щита (новое)

- Кнопка `Open Configurator` включает режим редактирования.
- В этом режиме можно перетаскивать устройства по слотам внутри щитков.
- Если бросить устройство в занятый слот, устройства поменяются местами.
- Внизу карточки появляется `Configurator YAML Preview` с обновленной структурой `panels/nodes`.

## Типы узлов

- `grid`
- `solar`
- `inverter`
- `battery`
- `main_breaker`
- `breaker`
- `relay`
- `load`
- `line`, `bus`, `input`, `device`

## Типы нагрузок (`load_kind`)

- `boiler`
- `pump`
- `fridge`
- `tv`
- `router`
- `heater`
- `lighting`
- `socket`
- `other`

Дополнительно можно задать:
- `rated_power` (паспортная мощность)
- `phase` (`L1`/`L2`/`L3`)
- `bidirectional_with_parent: true` для двунаправленной связи

## Зависимости

- Build/runtime зависимости в [package.json](/Users/alexeisakovich/Projects/energy_flow/package.json)
- Требования к Home Assistant и сенсорам в [HA_DEPENDENCIES.md](/Users/alexeisakovich/Projects/energy_flow/HA_DEPENDENCIES.md)

## Пример конфигурации

```yaml
type: custom:house-power-flow-card
title: Энергосистема дома
root_id: grid_in
min_active_power: 20
line_width: 4
max_expected_power: 12000

panels:
  - id: board_main
    name: Главный щит
    slots: 12
    columns: 6

nodes:
  - id: grid_in
    name: Сеть
    type: grid
    phase: L1

  - id: pv_array
    parent: grid_in
    name: Солнечные панели
    type: solar
    power: sensor.pv_power
    current: sensor.pv_current
    voltage: sensor.pv_voltage
    phase: L1

  - id: inverter
    parent: grid_in
    name: Гибридный инвертор
    type: inverter
    power: sensor.hybrid_inverter_power
    current: sensor.hybrid_inverter_current
    phase: L1

  - id: battery_1
    parent: inverter
    name: Аккумулятор #1
    type: battery
    power: sensor.battery_1_power
    current: sensor.battery_1_current
    bidirectional_with_parent: true
    panel_id: board_main
    panel_slot: 3
    phase: L1

  - id: boiler_load
    parent: inverter
    name: Бойлер
    type: load
    load_kind: boiler
    rated_power: 1800
    power: sensor.boiler_power
    current: sensor.boiler_current
    panel_id: board_main
    panel_slot: 6
    phase: L2
```
