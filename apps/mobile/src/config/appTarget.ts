// Detect compile-time or injected target role: 'citizen' | 'asha' | 'doctor' | null (unified)
const envTarget = import.meta.env.VITE_APP_ROLE as string | undefined;

export type AppTargetRole = 'citizen' | 'asha' | 'doctor' | null;

export const APP_TARGET_ROLE: AppTargetRole = 
  envTarget === 'citizen' ? 'citizen' :
  envTarget === 'asha' ? 'asha' :
  envTarget === 'doctor' ? 'doctor' :
  null; // null means Unified App (can switch desks)

export const IS_STANDALONE = APP_TARGET_ROLE !== null;
