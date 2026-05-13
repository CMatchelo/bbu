### Team Practice

APply plays familiarity in possession result

## Config

For this spec, use branch CL-0010/Team Practice
Always create a plan and present it to me before running the changes

## New feature

1. On teamSelection, the playType will have a total new funcionality

- C:\Users\cmatc\OneDrive\Documents\pp\bbu\src\pages\team-selection\components\PlayTypeSelection.tsx

- Do not select by shotTYpe anymore, but select by OffensePlayType and DefensePlayTYpe
- DIsplay Name and familiarity with each playTYpe

2. The order of each playType (offense and defense) should be saved for be used in possessionREsult

3. In each possession, the offensive and defensive playTYpe will be selected according to the order in the list, following the table
| Position | Chance |
| -------- | ------ |
| 1st      | 35%    |
| 2nd      | 25%    |
| 3rd      | 18%    |
| 4th      | 12%    |
| 5th      | 7%     |
| 6th      | 3%     |

4. After selection both offensive and defensive playTYpes for both teams, the following table should be applied to the final formula of the possession result

| Offense ↓   | Man-to-Man | Zone | Perimeter Pressure | Full Court Press | Switch Everything | Packed Paint |
| ----------- | ---------- | ---- | ------------------ | ---------------- | ----------------- | ------------ |
| Pick & Roll | 0          | +2   | -2                 | +2               | -4                | +2           |
| Motion      | +2         | -2   | 0                  | +2               | -2                | +2           |
| Isolation   | 0          | +2   | -2                 | -2               | -4                | +2           |
| 5-Out       | +2         | +4   | -4                 | -2               | -2                | +4           |
| Post-Up     | -2         | +2   | +4                 | -2               | 0                 | -4           |
| Fast Break  | +2         | -2   | 0                  | -4               | +2                | +2           |

  - Offesne has Pick & Roll
  - Defense has Zone
  - Bonus 0.02 for rawProb (+0.02) (table value/100)

  - Offesne has Pick & Roll
  - Defense has Switch Everything
  - Penalty of 0.04 for rawProb (-0.04) (table value/100)

5. After applying the first bonus or penalty, now it should calculate the familiarity of the teams with the selected playType

- Offensive will use Post-Up, the team has familiarity of 70
- Defense will use perimeter, the team has familiarity of 50
- The offense has a bonus of +0.01 ((offense - defense)/2000)

- Offensive will use Post-Up, the team has familiarity of 30
- Defense will use perimeter, the team has familiarity of 60
- The offense has a penalty of -0.015 ((offense - defense)/2000)

- Add the result to rawProb

6. The total of bonus or penalty summed should be between the interval of (-0.1 and +0.1)

7. After selecting the offensive playTYpe, The current playOrder (that will now be called shotOrder) in possessionResult will now have the following of percentage
| System      | THREE | TWO | LAYUP |
| ----------- | ----- | --- | ----- |
| Pick & Roll | 30    | 25  | 45    |
| Motion      | 35    | 30  | 35    |
| Isolation   | 20    | 45  | 35    |
| 5-Out       | 55    | 15  | 30    |
| Post-Up     | 10    | 35  | 55    |
| Fast Break  | 25    | 10  | 65    |

- Currently hard-coded
if (r < 50) playType = playOrder[0];
  else if (r < 85) playType = playOrder[1];
  else playType = playOrder[2];

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. No need

## Libraries

1. No need
