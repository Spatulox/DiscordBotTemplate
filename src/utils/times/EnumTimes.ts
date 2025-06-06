/**
 * Values are in miliseconds
 */
enum Milliseconds {
  MS_100 = 100,
  MS_200 = 200,
  MS_500 = 500,
  MS_800 = 500,
  MS_1_SEC = 1000,
}

/**
 * Values are in seconds
 */
enum Seconds {
  SEC_01 = 1,
  SEC_02 = 2,
  SEC_03 = 3,
  SEC_04 = 4,
  SEC_05 = 5,
  SEC_06 = 6,
  SEC_07 = 7,
  SEC_08 = 8,
  SEC_09 = 9,
  SEC_10 = 10,
  SEC_11 = 11,
  SEC_12 = 12,
  SEC_13 = 13,
  SEC_14 = 14,
  SEC_15 = 15,
  SEC_16 = 16,
  SEC_17 = 17,
  SEC_18 = 18,
  SEC_19 = 19,
  SEC_20 = 20,
  SEC_21 = 21,
  SEC_22 = 22,
  SEC_23 = 23,
  SEC_24 = 24,
  SEC_25 = 25,
  SEC_26 = 26,
  SEC_27 = 27,
  SEC_28 = 28,
  SEC_29 = 29,
  SEC_30 = 30,
  SEC_31 = 31,
  SEC_32 = 32,
  SEC_33 = 33,
  SEC_34 = 34,
  SEC_35 = 35,
  SEC_36 = 36,
  SEC_37 = 37,
  SEC_38 = 38,
  SEC_39 = 39,
  SEC_40 = 40,
  SEC_41 = 41,
  SEC_42 = 42,
  SEC_43 = 43,
  SEC_44 = 44,
  SEC_45 = 45,
  SEC_46 = 46,
  SEC_47 = 47,
  SEC_48 = 48,
  SEC_49 = 49,
  SEC_50 = 50,
  SEC_51 = 51,
  SEC_52 = 52,
  SEC_53 = 53,
  SEC_54 = 54,
  SEC_55 = 55,
  SEC_56 = 56,
  SEC_57 = 57,
  SEC_58 = 58,
  SEC_59 = 59,
  SEC_60 = 60,
}

/**
 * Values are in minutes
 */
enum Minutes {
  MIN_01 = 1,
  MIN_02 = 2,
  MIN_03 = 3,
  MIN_04 = 4,
  MIN_05 = 5,
  MIN_10 = 10,
  MIN_15 = 15,
  MIN_20 = 20,
  MIN_25 = 25,
  MIN_30 = 30,
  MIN_35 = 35,
  MIN_40 = 40,
  MIN_45 = 45,
  MIN_50 = 50,
  MIN_55 = 55,
  MIN_60 = 60,
}

/**
 * Values are in minutes
 */
enum Hours {
  HOUR_01 = 60,
  HOUR_02 = 120,
  HOUR_03 = 180,
  HOUR_04 = 240,
  HOUR_05 = 300,
  HOUR_06 = 360,
  HOUR_07 = 420,
  HOUR_08 = 480,
  HOUR_09 = 540,
  HOUR_10 = 600,
  HOUR_11 = 660,
  HOUR_12 = 720,
  HOUR_13 = 780,
  HOUR_14 = 840,
  HOUR_15 = 900,
  HOUR_16 = 960,
  HOUR_17 = 1020,
  HOUR_18 = 1080,
  HOUR_19 = 1140,
  HOUR_20 = 1200,
  HOUR_21 = 1260,
  HOUR_22 = 1320,
  HOUR_23 = 1380,
  HOUR_24 = 1440,
}

/**
 * Values are in minutes
 */
enum Days {
  DAY_01 = 1440,
  DAY_02 = 2880,
  DAY_03 = 4320,
  DAY_04 = 5760,
  DAY_05 = 7200,
  DAY_06 = 8640,
  DAY_07 = 10080,
  DAY_08 = 11520,
  DAY_09 = 12960,
  DAY_10 = 14400,
}

export const Time = {
    miliseconds: Milliseconds,
    secondes: Seconds,
    minutes: Minutes,
    hours: Hours,
    days: Days
}