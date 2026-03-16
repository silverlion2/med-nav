/**
 * Deterministic rules engine to filter benefits based on a structured UserProfile.
 * This guarantees robustness and prevents the LLM from hallucinating eligibility.
 */
export class BenefitEngine {
  constructor(data) {
    if (!data) throw new Error("BenefitEngine requires JSON data upon initialization");
    this.benefits = data;
  }

  /**
   * Evaluates a user profile against the dictionary to find eligible benefits.
   * @param {Object} userProfile - The structured user data gathered (e.g., from the questionnaire or LLM extraction)
   * @param {string[]} userProfile.insurance - ['employee_basic', 'resident_basic', 'commercial_health', 'none']
   * @param {string[]} userProfile.diseases - ['lung_cancer', 'diabetes', 'hypertension', etc.]
   * @param {string} userProfile.location - e.g., 'national', 'beijing'
   * @param {number} userProfile.age - Current age
   * @param {number} userProfile.monthly_income - Estimated monthly income in CNY
   * @param {string[]} userProfile.special_status - ['low_income', 'corporate_employee', 'union_member', etc.]
   * @returns {Object} - An object containing arrays of matched benefits grouped by status.
   */
  evaluate(userProfile) {
    const results = {
      eligible: [],
      needsClarification: [],
      ineligible: []
    };

    // Normalize profile to handle missing fields gracefully
    const profile = {
      insurance: userProfile.insurance || [],
      diseases: userProfile.diseases || [],
      location: userProfile.location || 'unknown',
      age: typeof userProfile.age === 'number' ? userProfile.age : null,
      monthly_income: typeof userProfile.monthly_income === 'number' ? userProfile.monthly_income : null,
      special_status: userProfile.special_status || []
    };

    for (const benefit of this.benefits) {
      const evaluation = this._evaluateBenefit(benefit, profile);
      
      if (evaluation.status === 'eligible') {
        results.eligible.push(evaluation.benefit);
      } else if (evaluation.status === 'clarify') {
        results.needsClarification.push({
          benefit: evaluation.benefit,
          missingFields: evaluation.missingFields
        });
      } else {
        results.ineligible.push(evaluation.benefit);
      }
    }

    return results;
  }

  _evaluateBenefit(benefit, profile) {
    const rules = benefit.eligibility_rules;
    const missingFields = [];
    let isEligible = true;

    // 1. Insurance Check
    if (!this._arrayIntersectsOrAny(profile.insurance, rules.required_insurance_types)) {
      if (profile.insurance.length === 0) missingFields.push('insurance'); else isEligible = false;
    }

    // 2. Disease Check
    if (!this._arrayIntersectsOrAny(profile.diseases, rules.disease_tags)) {
      // If profile has no diseases listed, we might need clarification, unless the disease requirement is very specific
      if (profile.diseases.length === 0 && rules.disease_tags[0] !== 'any') missingFields.push('diseases'); 
      else isEligible = false;
    }

    // 3. Demographics - Age
    if (rules.demographics.min_age > 0 || rules.demographics.max_age < 200) {
      if (profile.age === null) {
        missingFields.push('age');
      } else if (profile.age < rules.demographics.min_age || profile.age > rules.demographics.max_age) {
        isEligible = false;
      }
    }

    // 4. Special Status Check
    if (rules.special_status_required.length > 0) {
      // Must have at least one of the required special statuses
      const hasStatus = profile.special_status.some(status => rules.special_status_required.includes(status));
      if (!hasStatus) {
         // If no special status provided, we don't know, need clarification
        if (profile.special_status.length === 0) missingFields.push('special_status'); else isEligible = false;
      }
    }

    // Determine final status
    if (!isEligible) {
      return { status: 'ineligible', benefit };
    } else if (missingFields.length > 0) {
      return { status: 'clarify', benefit, missingFields };
    } else {
      return { status: 'eligible', benefit };
    }
  }

  _arrayIntersectsOrAny(userArr, ruleArr) {
    if (ruleArr.includes('any')) return true;
    return userArr.some(item => ruleArr.includes(item));
  }
}

