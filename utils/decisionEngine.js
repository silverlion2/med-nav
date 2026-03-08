import { createRequire } from 'module';

// 🚀 修复 Vercel Node.js 环境下导入 JSON 报错的问题
const require = createRequire(import.meta.url);
const benefitsDB = require('./mock_benefits_data.json');

/**
 * 辅助函数：判断用户的回答是否命中了规则数组
 * @param {String|Array} userValue - 用户的回答 (如 "肺癌" 或 ["工会会员", "退役军人"])
 * @param {Array} conditionArray - 规则配置的数组 (如 ["工会会员", "持有商业保险"])
 * @returns {Boolean} 是否命中
 */
function isMatch(userValue, conditionArray) {
  if (!userValue || conditionArray.length === 0) return false;
  
  if (Array.isArray(userValue)) {
    return userValue.some(val => conditionArray.includes(val));
  }
  return conditionArray.includes(userValue);
}

/**
 * 医疗省钱导航：高召回率规则匹配引擎
 * @param {Object} profileData - 用户填写的问卷快照
 * @returns {Object} 按分类和优先级排好序的福利项目 IDs
 */
export function runDecisionEngine(profileData) {
  const results = {
    urgent: [],      // 紧急必须做的 (门特、PAP)
    financial: [],   // 找钱筹钱的 (免息分期、工会互助)
    insurance: [],   // 保险理赔的 (商保、惠民保)
    health: []       // 健康羊毛 (筛查、EAP、PSP)
  };

  benefitsDB.forEach(benefit => {
    const { must_include, exclude, should_include } = benefit.conditions;
    
    // 1. 拦截网关 1：检查 Exclude (踩雷即出局)
    let isExcluded = false;
    for (const key in exclude) {
      if (exclude[key].length > 0 && isMatch(profileData[key], exclude[key])) {
        isExcluded = true;
        break; 
      }
    }
    if (isExcluded) return; 

    // 2. 拦截网关 2：检查 Must Include (缺少即出局)
    let isMustPassed = true;
    for (const key in must_include) {
      if (must_include[key].length > 0 && !isMatch(profileData[key], must_include[key])) {
        isMustPassed = false;
        break; 
      }
    }
    if (!isMustPassed) return;

    // 3. 加分项计算：检查 Should Include (算排名)
    let score = 0;
    for (const key in should_include) {
      if (should_include[key].length > 0 && isMatch(profileData[key], should_include[key])) {
        score += 1; 
      }
    }

    benefit.score = score;
    if (results[benefit.type]) {
      results[benefit.type].push(benefit);
    }
  });

  // 4. 最终排序：按 Score 降序排列并剥离出纯 ID
  for (const type in results) {
    results[type].sort((a, b) => b.score - a.score);
    results[type] = results[type].map(b => b.id);
  }

  return results;
}