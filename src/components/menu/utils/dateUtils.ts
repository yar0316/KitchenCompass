/**
 * 日付操作に関するユーティリティ関数
 */

/**
 * 週の開始日を取得（月曜日を週の開始日とする）
 */
export const getStartOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const diff = day === 0 ? -6 : 1 - day; // Monday is start of week
  newDate.setDate(newDate.getDate() + diff);
  return newDate;
};

/**
 * 二つの日付が同じ日かどうかを判定
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2) return false;
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 日付を 'YYYY-MM-DD' 形式の文字列に変換
 */
export const toYMDString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 指定された日付から7日後の日付を取得
 */
export const addWeek = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 7);
  return newDate;
};

/**
 * 指定された日付から7日前の日付を取得
 */
export const subtractWeek = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - 7);
  return newDate;
};

/**
 * 指定された日付から指定された日数後の日付を取得
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

/**
 * 指定された開始日から7日分の日付配列を生成
 */
export const generateWeekDays = (startDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

export const dateUtils = {
  getStartOfWeek,
  isSameDay,
  toYMDString,
  addWeek,
  subtractWeek,
  addDays,
  generateWeekDays
};