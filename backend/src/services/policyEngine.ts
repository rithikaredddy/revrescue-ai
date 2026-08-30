export function validatePolicy(strategy: any, policy: any) {
  if (!policy.autopilotEnabled) return { status: 'REJECTED', reason: 'Autopilot disabled. Requires human approval.' };
  
  const discount = strategy.economics?.discount_cost ? (strategy.economics.discount_cost / strategy.expected_recovery) * 100 : 0;
  
  if (discount > policy.maxDiscount) {
    return { status: 'REJECTED', reason: `Discount exceeds merchant policy limit of ${policy.maxDiscount}%.` };
  }
  
  if ((strategy.recovery_probability * 100) < policy.minRecoveryProb) {
    return { status: 'REJECTED', reason: `Recovery probability (${Math.round(strategy.recovery_probability*100)}%) is below minimum threshold (${policy.minRecoveryProb}%).` };
  }
  
  return { status: 'APPROVED', reason: 'Passed all merchant safety and economic guardrails.' };
}
