import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateRecoveryStrategy(invoice: any, user: any) {
  // BASE ECONOMICS & DETERMINISTIC FALLBACK
  const interventionCost = 15; // fixed base intervention cost in INR
  let baseRecoveryProb = 0.30;
  let action = 'DELAYED_RETRY';
  let discount = 0;
  let classification = 'TEMPORARY';
  let reason = '';
  let confidence = 0.85;

  if (invoice.gatewayErrorCode === 'INSUFFICIENT_FUNDS') {
    baseRecoveryProb = 0.72;
    action = 'PAYDAY_RETRY';
    reason = 'Customer historically completes payments near the first of the month. Delaying retry to payroll window maximizes recovery.';
  } else if (invoice.gatewayErrorCode === 'BANK_TIMEOUT' || invoice.gatewayErrorCode === 'GATEWAY_DOWNTIME') {
    baseRecoveryProb = 0.91;
    action = 'DELAYED_RETRY';
    reason = 'Temporary bank server timeout. Historical success window for this issuer is 02:00-04:00 AM.';
  } else if (invoice.gatewayErrorCode === 'EXPIRED_CARD') {
    baseRecoveryProb = 0.81;
    action = 'PAYMENT_METHOD_UPDATE';
    classification = 'PERMANENT';
    reason = 'Card expiration is a permanent failure. Bypassing retries and routing to secure update portal.';
  }

  // INCENTIVE OPTIMIZER (High LTV + High Churn Risk)
  const churnProb = user.ltv > 50000 && invoice.retryCount > 0 ? 0.85 : 0.40;
  if (churnProb > 0.80 && classification === 'TEMPORARY' && invoice.gatewayErrorCode === 'INSUFFICIENT_FUNDS') {
    action = 'RETENTION_INCENTIVE';
    discount = 3; // 3% discount
    baseRecoveryProb = 0.88;
    reason = `High LTV (₹${user.ltv}) and high churn risk. Offering 3% discount increases recovery probability from 38% to 88%.`;
  }

  const expectedRecovery = invoice.amount * baseRecoveryProb;
  const discountCost = invoice.amount * (discount / 100);
  const expectedNet = expectedRecovery - interventionCost - discountCost;

  const structuredDecision = {
    failure_type: invoice.gatewayErrorCode,
    classification,
    recovery_probability: baseRecoveryProb,
    churn_probability: churnProb,
    recommended_action: action,
    confidence,
    reason,
    economics: {
      intervention_cost: interventionCost,
      discount_cost: discountCost,
      expected_recovery: expectedRecovery,
      expected_net: expectedNet
    },
    is_fallback: !openai // True if using deterministic fallback
  };

  return structuredDecision;
}
