# 🚀 RevRescue AI

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Buildathon-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

**Autonomous Revenue Recovery & Smart Dunning Engine** built for the **Razorpay AI Builder Internship 2026 (Track 3: AI Revenue Recovery)**.

---

## 🛑 The Problem
Indian B2B SaaS and subscription merchants lose between 7% to 11% of ARR to **involuntary churn** (e.g., insufficient funds, bank server timeouts, RBI e-mandate limits). 
Traditional payment gateways use "blind retries" (pinging a card every 24 or 48 hours). This approach triggers excessive bank penalty fees, frustrates users, and often results in permanently lost revenue.

## 💡 The Solution
**RevRescue AI** is an autonomous revenue recovery engine. It intercepts failed payment webhooks, diagnoses the root cause, calculates the exact Net Yield of different interventions, validates the decision against strict merchant policies, and executes the optimal recovery workflow to prevent involuntary churn.

---

## 🧠 Core Architecture Pipeline

RevRescue operates on a strictly bounded autonomous loop:

```text
[Webhook Failure] 
       ↓ 
[1. AI Diagnosis] ─────── (Is failure Temporary or Permanent?)
       ↓
[2. Risk Engine] ──────── (Evaluate Customer LTV & Churn Probability)
       ↓
[3. Economics Math] ───── (Expected Recovery = Invoice * Prob - Intervention Cost)
       ↓
[4. Policy Guardrail] ─── (Does the proposed discount exceed Merchant's 5% limit?)
       ↓
[5. Execution] ────────── (Trigger Payday Retry, Notification, or Update Portal)
