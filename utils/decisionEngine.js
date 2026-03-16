import { benefitEngine } from '../src/services/BenefitEngine.js';

/**
 * 医疗省钱导航：高召回率规则匹配引擎 (v2: Robust Benefit Engine)
 * @param {Object} profileData - 用户填写的问卷快照 (来自 WizardView)
 * @returns {Object} 引擎算出的最终匹配结果，包含 eligible 和 clarification 状态
 */
export function runDecisionEngine(profileData) {
  // 1. 将前端问卷的松散数据映射为引擎需要的严格 Schema (UserProfile)
  const structuredProfile = mapFormDataToProfile(profileData || {});
  
  // 2. 运行强类型规则引擎
  const evaluationResult = benefitEngine.evaluate(structuredProfile);
  
  // 3. 将结果重新分组给前端渲染 (保持兼容原有的 UI 分组逻辑，但数据来源变严格)
  const groupedResults = {
    urgent: [],      // 紧急必须做的 (门特、PAP)
    financial: [],   // 找钱筹钱的 (免息分期、工会互助)
    insurance: [],   // 保险理赔的 (商保、惠民保)
    health: [],      // 健康羊毛 (筛查、EAP、PSP)
    clarification: evaluationResult.needsClarification.map(item => item.benefit.id) // 留给 AI 追问的单子
  };

  // 为兼容 UI 分组，根据 benefit_type 分发
  evaluationResult.eligible.forEach(benefit => {
    switch (benefit.benefit_type) {
      case 'insurance_reimbursement':
        if (benefit.id === 'men_te') groupedResults.urgent.push(benefit.id);
        else groupedResults.insurance.push(benefit.id);
        break;
      case 'financial_assistance':
        groupedResults.financial.push(benefit.id);
        break;
      case 'drug_discount':
        if (benefit.id === 'pap_a') groupedResults.urgent.push(benefit.id);
        else groupedResults.health.push(benefit.id);
        break;
      case 'social_service':
      case 'diagnostic_support':
        groupedResults.health.push(benefit.id);
        break;
    }
  });

  return groupedResults;
}

/**
 * 将前端 WizardView 表单数据映射到 BenefitEngine 需要的 UserProfile 格式
 */
function mapFormDataToProfile(formData) {
  const profile = {
    insurance: [],
    diseases: [],
    location: 'national',
    age: null,
    monthly_income: null,
    special_status: []
  };

  // 映射医保类型 (q4 -> insurance)
  const rawInsurance = formData.insurance || formData.q4 || '';
  if (rawInsurance.includes('职工')) profile.insurance.push('employee_basic');
  if (rawInsurance.includes('居民') || rawInsurance.includes('新农合')) profile.insurance.push('resident_basic');
  if (rawInsurance.includes('无基本医保')) profile.insurance.push('none');

  // 映射疾病 (q1 -> diseases)
  const rawDisease = formData.disease || formData.q1 || '';
  if (rawDisease.includes('恶性肿瘤')) profile.diseases.push('malignant_tumor', 'lung_cancer', 'breast_cancer');
  if (rawDisease.includes('慢性病')) profile.diseases.push('chronic_disease', 'diabetes', 'hypertension');

  // 映射特殊身份 (q5 -> special_status) - 仅限兼容老表单测试数据，新表单把这些留给AI补充
  const rawStatus = formData.q5 || [];
  if (rawStatus.includes('北京市总工会会员')) profile.special_status.push('union_member');
  if (rawStatus.includes('属于困难群体 (低保/特困/边缘)')) profile.special_status.push('low_income', 'poverty_stricken');
  if (rawStatus.includes('患病前有购买商业保险')) profile.insurance.push('commercial_health', 'commercial_critical_illness');

  return profile;
}