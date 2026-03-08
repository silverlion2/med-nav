import React, { useState, useCallback } from 'react';
import { ChevronRight, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Phone, ExternalLink, Activity, Lock, Search, Landmark, ChevronDown, ChevronUp, Home, Heart, ShieldPlus, KeySquare } from 'lucide-react';

// --- 静态配置与数据模板 (充当本地轻量级福利知识库) ---

const benefitDetails = {
  // 重疾/肿瘤专属
  men_te: {
    title: '门特/门慢 资质申请',
    sponsor: '国家医疗保障局',
    savings: '约 1.5万元/年',
    target: '持有职工医保/居民医保，且确诊规定慢性病/重大疾病的患者。',
    timeline: '确诊后，【第一次门诊开药前】必须办理，否则无法追溯报销。',
    conditions: '需二级以上公立医院专科医生开具确诊证明，并符合当地医保局病种目录。',
    process: '1. 准备确诊病历资料\n2. 前往医院医保办盖章确认\n3. 在医保局窗口或官方小程序（如粤医保、浙里办）提交备案',
    materials: '身份证、社保卡、诊断书原件、近期相关检查报告。'
  },
  fen_qi: {
    title: '医疗消费免息分期',
    sponsor: '持牌金融机构联合药企',
    savings: '约省利息 4,500元',
    target: '需自费支付高昂药费/耗材费，且家庭短期现金流紧张的患者。',
    timeline: '在院外DTP特药药房【付款前】申请。',
    conditions: '患者或直系亲属信用记录良好，有还款能力。',
    process: '1. 在特药药房提出分期意向\n2. 扫描驻店金融人员的专属二维码\n3. 填写资料，通常10分钟内秒批额度',
    materials: '申请人身份证、处方单、关系证明（如代办）。'
  },
  pap_a: {
    title: '特定靶向药 PAP 慈善援助',
    sponsor: '中国初级卫生保健基金会',
    savings: '最高全免药费（数十万）',
    target: '符合特定基因突变（如EGFR阳性）的肺癌患者。',
    timeline: '🚨 绝对红线：必须在【第一次自费购药前】注册并提交材料！',
    conditions: '医学条件符合项目要求；低保户可申请全免，普通低收入家庭按“买二赠二”比例援助。',
    process: '1. 关注基金会公众号注册患者档案\n2. 提交医学与经济证明材料审核\n3. 审核通过后到指定药房领取赠药',
    materials: '病理/基因检测报告、处方、低保证明或收入证明。'
  },
  pap_b: {
    title: '免费基因检测(NGS)计划',
    sponsor: '中华慈善总会联合药企',
    savings: '约 1.2万元',
    target: '初诊肺癌或耐药后需寻找新方案的患者。',
    timeline: '在住院期间或首轮用药前由主治医生发起。',
    conditions: '需由合作的三甲医院病理科或肿瘤科医生推荐。',
    process: '1. 医生开具基因检测申请单\n2. 填写患者入组申请书\n3. 样本送至指定实验室检测',
    materials: '病理组织切片或血样、知情同意书。'
  },
  
  // 商业险与企业福利通用
  ins_geren: { title: '个人重疾险/百万医疗险理赔', sponsor: '商业保险公司', savings: '预计覆盖全部自费支出', target: '此前已购买过商业医疗保险的患者。', timeline: '确诊后【24小时内】拨打保司电话报案。', conditions: '保单在有效期内，且不属于免责范畴。', process: '1. 报案获得理赔号\n2. 申请“住院垫付”服务\n3. 留存所有发票清单', materials: '保单号、病历、发票清单。' },
  ins_qiye: { title: '企业补充医疗保险报销', sponsor: '用人单位(HR/工会)', savings: '报销医保内个人自付部分', target: '在职职工。', timeline: '出院结算完成后 30 天内。', conditions: '必须先通过基本医保报销。', process: '1. 向HR领取申请表\n2. 提交材料\n3. 等待打款', materials: '发票分割单、处方。' },
  ins_huimin: { title: '城市定制型惠民保配置与理赔', sponsor: '当地政府指导+保司承保', savings: '大病自费兜底 2-10万元', target: '所有人（尤其是无商业医疗险的老人、非标体人群）。', timeline: '健康期即可配置；生病自费达标后理赔。', conditions: '不限年龄、既往症可保可赔（部分免责）。', process: '1. 微信搜索“城市名+惠民保”\n2. 一键投保或申请理赔', materials: '身份证、医保卡。' },
  gong_hui: { title: '工会职工大病互助金', sponsor: '中华全国总工会', savings: '约 1-3万元', target: '缴纳了工会会费的正式在职员工及家属。', timeline: '年度结算期内提交。', conditions: '自费额度达到互助标准。', process: '1. 咨询工会负责人\n2. 填写救助表\n3. 提供发票挂号件', materials: '工会会员卡、发票分割单。' },

  // 亚健康/健康人群专属
  health_liangai: {
    title: '妇联/卫健委“两癌”免费筛查',
    sponsor: '国家卫生健康委 / 妇联',
    savings: '约省 500-1000元',
    target: '35-64周岁适龄妇女。',
    timeline: '健康期每年或每三年一次。',
    conditions: '具有当地户籍或常住证明。确诊困难群体可向妇联额外申请1万元救助金。',
    process: '1. 关注当地妇幼保健院公众号\n2. 预约免费筛查名额\n3. 携带证件前往检查',
    materials: '身份证、户口本或居住证。'
  },
  health_eap: {
    title: '企业工会 EAP 援助与疗休养',
    sponsor: '所在企业工会委员会',
    savings: '折合价值 2000-5000元',
    target: '大中型国企、互联网大厂、外企的正式工会会员。',
    timeline: '健康期/亚健康疲劳期均可申请。',
    conditions: '按公司职级、司龄或年度福利配额分配。',
    process: '1. 登录公司内网/行政系统\n2. 预约免费心理咨询热线或申请年度疗休养名额',
    materials: '员工工牌、内网账号。'
  },

  // 慢病(如糖尿病)专属
  psp_diabetes: {
    title: '慢病患者支持计划 (PSP) - 免费领仪器',
    sponsor: '拜耳 / 赛诺菲 等跨国药企',
    savings: '赠送原厂血糖仪及试纸 (约 500元)',
    target: '长期服用特定进口降糖药/胰岛素的糖尿病患者。',
    timeline: '日常门诊购药后。',
    conditions: '需上传正规医院或药房的购药小票及处方证明。',
    process: '1. 关注对应药企患者关爱公众号\n2. 注册并上传购药凭证\n3. 审核通过后免费邮寄到家',
    materials: '医院处方、购药发票/小票。'
  }
};

const questions = [
  { id: 'relation', title: '请问您是为谁查询本次医疗费用指南？', options: ['我自己', '父母', '伴侣', '孩子', '其他亲友'] },
  { id: 'location', title: '患者的参保所在地是？', options: ['北上广深等一线城市', '新一线或省会城市', '普通地级市', '县城或乡镇农村'] },
  { id: 'insurance', title: '患者的参保状态与职业圈层是？', options: ['职工医保 (国企/央企)', '职工医保 (普通企业)', '居民医保 (新农合)', '无医保'] },
  { id: 'special_status', title: '是否有以下隐形资产或特殊身份？(可多选)', options: ['工会会员', '退役军人', '低保户/特困', '持有商业保险', '均无'], multi: true },
  { id: 'disease', title: '患者目前的健康状况？', options: ['身体健康 (看体检/保险)', '肺癌 (拟用靶向药)', '糖尿病 (长期服药)', '突发意外伤害'] },
  { id: 'stage', title: '当前正处于就医的哪个阶段？', options: ['尚未生病/刚拿体检单', '刚拿到确诊单', '正准备自费买昂贵药', '准备出院结账'] }
];

export default function App() {
  const [step, setStep] = useState('landing');
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loadingText, setLoadingText] = useState('正在初始化匹配引擎...');
  
  const [papExpanded, setPapExpanded] = useState(false);
  const [insExpanded, setInsExpanded] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [activeDetail, setActiveDetail] = useState(null);

  // --- 鉴权与合规状态 ---
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // --- 逻辑处理 ---

  const handleOptionSelect = (qId, option, isMulti) => {
    if (isMulti) {
      const current = formData[qId] || [];
      const updated = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
      setFormData({ ...formData, [qId]: updated });
    } else {
      setFormData({ ...formData, [qId]: option });
      setTimeout(() => {
        if (wizardStep < questions.length - 1) setWizardStep(wizardStep + 1);
        else startCalculation();
      }, 300);
    }
  };

  const startCalculation = () => {
    setStep('calculating');
    setTimeout(() => setLoadingText('正在基于逻辑树匹配福利...'), 800);
    setTimeout(() => setLoadingText('正在进行医学与经济排雷...'), 1600);
    setTimeout(() => setLoadingText('正在生成专属智能时间轴...'), 2400);
    setTimeout(() => setStep('hook'), 3200);
  };

  // 🛡️ 生成专属码与留资验证逻辑，并对接后端 API
  const handleGenerateCode = () => {
    if (phone.length !== 11) {
      setAuthError('请输入正确的11位手机号码');
      return;
    }
    if (!isAgreed) {
      setAuthError('请先阅读并勾选同意《隐私保护声明》');
      return;
    }
    
    // 生成一个随机 4 位专属码
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setUniqueCode(code);
    
    console.log("正在为您建档...", { phone, code, formData });

    // 🚀 发送建档请求到后端数据库 (create-profile)
    fetch('/api/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        code: code,
        profileData: formData
      })
    }).catch(error => console.error('建档请求失败:', error));

    // 隐藏填写框，展示大扇窗专属码
    setShowAuthModal(false);
    setShowCodeModal(true);
  };

  const unlockReport = () => {
    setShowCodeModal(false);
    setStep('report');
  };

  // ✅ 埋点收集：带上真实的手机号
  const handleFeedback = useCallback((e, itemId, status) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFeedback(prev => ({ ...prev, [itemId]: status }));

    fetch('/api/save-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: phone || 'anonymous-user',
        feedbackData: {
          benefitId: itemId,
          action: status,
          time: new Date().toISOString()
        }
      })
    }).catch(error => console.error('数据埋点上传失败:', error));

  }, [phone]);

  const resetToHome = () => {
    setStep('landing');
    setWizardStep(0);
    setFormData({});
    setFeedback({});
    setActiveDetail(null);
    setPapExpanded(false);
    setInsExpanded(false);
    setPhone('');
    setIsAgreed(false);
    setShowAuthModal(false);
    setShowCodeModal(false);
    setAuthError('');
  };

  const goToHealthBenefits = () => {
    setActiveDetail(null);
    setStep('health_benefits');
  };

  // --- 局部交互组件 ---
  const FeedbackButtons = useCallback(({ itemId }) => {
    const currentStatus = feedback[itemId];
    return (
      <div className="flex gap-1.5 mt-2">
        <button onClick={(e) => handleFeedback(e, itemId, '不感兴趣')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '不感兴趣' ? 'bg-gray-500 text-white border-gray-500 shadow-inner font-bold' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 font-medium'}`}>不感兴趣</button>
        <button onClick={(e) => handleFeedback(e, itemId, '准备申请')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '准备申请' ? 'bg-orange-500 text-white border-orange-500 shadow-md font-bold' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 font-bold'}`}>准备申请</button>
        <button onClick={(e) => handleFeedback(e, itemId, '已激活')} className={`flex-1 py-1.5 rounded text-[11px] transition-all duration-200 border ${currentStatus === '已激活' ? 'bg-green-500 text-white border-green-500 shadow-inner font-bold' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 font-medium'}`}>已激活</button>
      </div>
    );
  }, [feedback, handleFeedback]);

  // --- 核心：基于画像的动态报告生成器 (Rule Engine) ---
  const renderDynamicTimeline = () => {
    const disease = formData.disease || '';
    const isHealthy = disease === '身体健康 (看体检/保险)';
    const isChronic = disease === '糖尿病 (长期服药)';
    // 默认为大病/意外逻辑
    const isCancer = disease === '肺癌 (拟用靶向药)' || (!isHealthy && !isChronic);

    // 场景一：健康/亚健康人群
    if (isHealthy) {
      return (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><ShieldPlus size={20} className="mr-2 text-green-500" /> 健康资产管理与防漏时间轴</h2>
          
          <div className="relative pl-6 mb-8 border-l-2 border-green-200">
            <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></div>
            <div className="text-sm font-bold text-green-600 mb-2">STEP 1: 基础保障防线构建</div>
            <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['ins_huimin'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['ins_huimin'])}>
               {feedback['ins_huimin'] !== '已激活' && <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">🛡️ 防大病致贫</div>}
               <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 政府指导+保司承保</div>
               <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">配置城市定制惠民保</h3><span className="text-green-600 font-bold text-xs bg-green-50 px-1 py-0.5 rounded">💰 仅约百元/年</span></div>
               <div className={`overflow-hidden transition-all duration-300 ${feedback['ins_huimin'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                 <p className="text-xs text-gray-500 mb-2">系统强烈建议：如果您或家人（特别是长辈）由于年龄或结节问题无法购买常规商业险，务必配置惠民保作为大病医保外自费的兜底。</p>
                 <div className="text-xs text-blue-500 font-medium mb-3 flex items-center"><ChevronRight size={14} /> 查看详情</div>
               </div>
               <FeedbackButtons itemId="ins_huimin" />
            </div>
          </div>

          <div className="relative pl-6 mb-8 border-l-2 border-gray-200">
            <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="text-sm font-bold text-gray-700 mb-2">STEP 2: 预防性公共福利申领</div>
            <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['health_liangai'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['health_liangai'])}>
               <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 卫健委/妇联</div>
               <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">妇联免费“两癌”筛查</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 免费检查</span></div>
               <div className={`overflow-hidden transition-all duration-300 ${feedback['health_liangai'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                 <p className="text-xs text-gray-500 mb-2">国家向适龄女性提供免费筛查。这是预防高发肿瘤的最有效手段，千万别浪费名额！</p>
               </div>
               <FeedbackButtons itemId="health_liangai" />
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="text-sm font-bold text-gray-700 mb-2">STEP 3: 隐形企业福利激活</div>
            <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['health_eap'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['health_eap'])}>
               <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 企业工会委员会</div>
               <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">EAP 援助与年度疗休养</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 价值数千元</span></div>
               <div className={`overflow-hidden transition-all duration-300 ${feedback['health_eap'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                 <p className="text-xs text-gray-500 mb-2">系统检测您可能有工会身份。许多大中型企业工会每年配有免费疗休养及员工全家可用的 EAP 心理咨询热线。</p>
               </div>
               <FeedbackButtons itemId="health_eap" />
            </div>
          </div>
        </>
      );
    }

    // 场景二：慢病人群
    if (isChronic) {
      return (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Activity size={20} className="mr-2 text-blue-500" /> 慢病长期管理与减负时间轴</h2>
          
          <div className="relative pl-6 mb-8 border-l-2 border-blue-200">
            <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div>
            <div className="text-sm font-bold text-blue-600 mb-2">STEP 1: 门诊吃药“打折卡”</div>
            <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['men_te'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['men_te'])}>
               {feedback['men_te'] !== '已激活' && <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">✨ 专属隐藏福利</div>}
               <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 国家医疗保障局 指导</div>
               <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">办理【门特/门慢】资质</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 约省 1.5万/年</span></div>
               <div className={`overflow-hidden transition-all duration-300 ${feedback['men_te'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                 <p className="text-xs text-gray-500 mb-2">糖尿病属于典型的门慢病种，申请资质后，以后去门诊开胰岛素/降糖药即可享受高比例报销，不用全掏现金！</p>
                 <div className="text-xs text-blue-500 font-medium mb-3 flex items-center"><ChevronRight size={14} /> 点击查看详细指南</div>
               </div>
               <FeedbackButtons itemId="men_te" />
            </div>
          </div>

          <div className="relative pl-6 mb-8 border-l-2 border-gray-200">
            <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="text-sm font-bold text-gray-700 mb-2">STEP 2: 药企羊毛库</div>
            <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['psp_diabetes'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['psp_diabetes'])}>
               <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 跨国药厂专区</div>
               <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">药企 PSP 关爱计划</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 免费送原厂血糖仪</span></div>
               <div className={`overflow-hidden transition-all duration-300 ${feedback['psp_diabetes'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                 <p className="text-xs text-gray-500 mb-2">系统匹配到：如果您正在长期服用进口降糖药，凭处方小票去官方打卡，可直接免费领取正品仪器与试纸包。</p>
               </div>
               <FeedbackButtons itemId="psp_diabetes" />
            </div>
          </div>
        </>
      );
    }

    // 场景三：大病重疾人群
    return (
      <>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Activity size={20} className="mr-2 text-orange-500" /> 天价医疗支付旅程时间轴</h2>

        <div className="relative pl-6 mb-8 border-l-2 border-orange-200">
          <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]"></div>
          <div className="text-sm font-bold text-orange-500 mb-2">STEP 1: 门诊当下的“定性”</div>
          <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback['men_te'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['men_te'])}>
             {feedback['men_te'] !== '已激活' && <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">✨ 专属隐藏福利</div>}
             <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 国家医疗保障局 指导</div>
             <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">办理【门特/门慢】资质</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 约省 1.5万/年</span></div>
             <div className={`overflow-hidden transition-all duration-300 ${feedback['men_te'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
               <p className="text-xs text-gray-500 mb-2">确诊后切勿直接普通门诊买药，务必先在医院医保办申请此资质，可享住院同等比例报销。</p>
               <div className="text-xs text-blue-500 font-medium mb-3 flex items-center"><ChevronRight size={14} /> 点击查看详细指南</div>
             </div>
             <FeedbackButtons itemId="men_te" />
          </div>
        </div>

        <div className="relative pl-6 mb-8 border-l-2 border-gray-200">
          <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-700 mb-2">STEP 2: 天价药费筹资破局</div>
          
          <div className={`p-4 rounded-xl shadow-sm border mb-3 cursor-pointer transition-all duration-300 ${feedback['fen_qi'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['fen_qi'])}>
             <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 持牌金融机构 联合提供</div>
             <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">医疗消费免息分期</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 约省利息 4.5k</span></div>
             <div className={`overflow-hidden transition-all duration-300 ${feedback['fen_qi'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
               <p className="text-xs text-gray-500 mb-3">若现金流紧张，可申请药企贴息贷款，最高 12 期免息。</p>
             </div>
             <FeedbackButtons itemId="fen_qi" />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] border border-green-200 relative">
             <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">🚨 必须首次自费前申请</div>
             <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 涵盖多家顶级基金会</div>
             <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">靶向药 PAP 慈善援助</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 最高全免药费</span></div>
             <p className="text-xs text-gray-500 mb-3">为您检索到 2 项专属援助，折叠展示：</p>
             <button onClick={() => setPapExpanded(!papExpanded)} className="w-full flex items-center justify-center bg-green-50 text-green-700 py-2 rounded text-xs font-bold mb-3 border border-green-100">{papExpanded ? <><ChevronUp size={14} className="mr-1"/> 收起援助</> : <><ChevronDown size={14} className="mr-1"/> 展开查看援助明细</>}</button>
             
             {papExpanded && (
               <div className="space-y-3 mb-2 animate-in slide-in-from-top-2 duration-300">
                 <div className={`border p-3 rounded cursor-pointer transition-all duration-300 ${feedback['pap_a'] === '不感兴趣' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-green-100 active:bg-gray-100'}`} onClick={() => setActiveDetail(benefitDetails['pap_a'])}>
                   <div className="font-bold text-xs text-gray-800 mb-1 flex justify-between">援助A：初级卫生保健基金会赠药 <ChevronRight size={14} className="text-blue-500" /></div>
                   <div className={`overflow-hidden transition-all duration-300 ${feedback['pap_a'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
                     <div className="text-[10px] text-gray-500 mb-2">首轮“买二赠二”，低保户可申请全免。</div>
                   </div>
                   <FeedbackButtons itemId="pap_a" />
                 </div>
                 <div className={`border p-3 rounded cursor-pointer transition-all duration-300 ${feedback['pap_b'] === '不感兴趣' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-green-100 active:bg-gray-100'}`} onClick={() => setActiveDetail(benefitDetails['pap_b'])}>
                   <div className="font-bold text-xs text-gray-800 mb-1 flex justify-between">援助B：免费基因检测(NGS)计划 <ChevronRight size={14} className="text-blue-500" /></div>
                   <div className={`overflow-hidden transition-all duration-300 ${feedback['pap_b'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
                     <div className="text-[10px] text-gray-500 mb-2">价值万元的靶点检测服务，用药前必做。</div>
                   </div>
                   <FeedbackButtons itemId="pap_b" />
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="relative pl-6 mb-8 border-l-2 border-gray-200">
          <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-700 mb-2">STEP 3: 商保与企业福利理赔</div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
             <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">🛡️ 多元支付防线</div>
             <div className="flex justify-between items-start mb-1 mt-2"><h3 className="font-bold text-gray-800">商保与职工补充福利</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 覆盖医保外支出</span></div>
             <p className="text-xs text-gray-500 mb-3">排查以下多重理赔通道，防止福利漏报：</p>
             <button onClick={() => setInsExpanded(!insExpanded)} className="w-full flex items-center justify-center bg-blue-50 text-blue-700 py-2 rounded text-xs font-bold mb-3 border border-blue-100">{insExpanded ? <><ChevronUp size={14} className="mr-1"/> 收起理赔清单</> : <><ChevronDown size={14} className="mr-1"/> 展开查看理赔通道</>}</button>
             
             {insExpanded && (
               <div className="space-y-3 mb-2">
                 <div className={`border p-3 rounded cursor-pointer transition-all duration-300 ${feedback['ins_geren'] === '不感兴趣' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-blue-100 active:bg-gray-100'}`} onClick={() => setActiveDetail(benefitDetails['ins_geren'])}>
                   <div className="font-bold text-xs text-gray-800 mb-1 flex justify-between">通道A：个人商业保险 <ChevronRight size={14} className="text-blue-500" /></div>
                   <FeedbackButtons itemId="ins_geren" />
                 </div>
                 <div className={`border p-3 rounded cursor-pointer transition-all duration-300 ${feedback['ins_qiye'] === '不感兴趣' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-blue-100 active:bg-gray-100'}`} onClick={() => setActiveDetail(benefitDetails['ins_qiye'])}>
                   <div className="font-bold text-xs text-gray-800 mb-1 flex justify-between">通道B：企业补充医疗保险 <ChevronRight size={14} className="text-blue-500" /></div>
                   <FeedbackButtons itemId="ins_qiye" />
                 </div>
                 <div className={`border p-3 rounded cursor-pointer transition-all duration-300 ${feedback['ins_huimin'] === '不感兴趣' ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-gray-50 border-blue-100 active:bg-gray-100'}`} onClick={() => setActiveDetail(benefitDetails['ins_huimin'])}>
                   <div className="font-bold text-xs text-gray-800 mb-1 flex justify-between">通道C：城市定制型惠民保 <ChevronRight size={14} className="text-blue-500" /></div>
                   <FeedbackButtons itemId="ins_huimin" />
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-700 mb-2">STEP 4: 隐形资产找钱</div>
          <div className={`p-4 rounded-xl shadow-sm border cursor-pointer transition-all duration-300 ${feedback['gong_hui'] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(benefitDetails['gong_hui'])}>
             <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1"><Landmark size={10} className="mr-1" /> 中华全国总工会 指导</div>
             <div className="flex justify-between items-start mb-1"><h3 className="font-bold text-gray-800">工会职工大病互助金</h3><span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded">💰 约省 1-3万</span></div>
             <div className={`overflow-hidden transition-all duration-300 ${feedback['gong_hui'] === '不感兴趣' ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
               <p className="text-xs text-gray-500 mb-2">凭发票分割单向工会申请互助金报销，别漏报！</p>
             </div>
             <FeedbackButtons itemId="gong_hui" />
          </div>
        </div>
      </>
    );
  };

  const q = questions[wizardStep] || questions[0];
  const progress = ((wizardStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto h-[100dvh] bg-gray-100 shadow-2xl relative overflow-hidden flex flex-col font-sans">
      
      {/* --- Landing Page --- */}
      {step === 'landing' && (
        <div className="flex-1 w-full bg-orange-50 p-6 relative overflow-x-hidden overflow-y-auto flex flex-col">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-200 rounded-full opacity-50 blur-2xl z-0"></div>
          <div className="flex-1 flex flex-col justify-center relative z-10 pb-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-orange-500 shrink-0">
              <Activity size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">医疗省钱导航 <br/><span className="text-orange-500 text-2xl">您的智能财务规划助手</span></h1>
            <p className="text-gray-600 mb-8">打破医疗信息差，整合全社会医保、公卫、商保与药企援助资金。不卖药，只教您薅政策羊毛。</p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center text-sm text-gray-700 bg-white/60 p-3 rounded-lg"><CheckCircle2 size={18} className="text-green-500 mr-2" /> 纯结构化画像，动态生成专属方案</div>
              <div className="flex items-center text-sm text-gray-700 bg-white/60 p-3 rounded-lg"><CheckCircle2 size={18} className="text-green-500 mr-2" /> 毫秒级匹配上千项福利政策</div>
            </div>
            <button onClick={() => setStep('wizard')} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center active:scale-95 transition-transform">
              立即免费测算 <ArrowRight className="ml-2" size={20} />
            </button>
            <button onClick={() => setStep('health_benefits')} className="w-full bg-white text-green-600 border-2 border-green-100 font-bold py-4 rounded-xl shadow-sm flex justify-center items-center active:scale-95 transition-transform mt-3">
              <Heart size={20} className="mr-2" /> 浏览全民通用健康福利
            </button>
          </div>
        </div>
      )}

      {/* --- Wizard Page --- */}
      {step === 'wizard' && (
        <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto">
          <div className="h-1.5 bg-gray-200 w-full shrink-0 sticky top-0 z-10">
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="p-6 flex-1 flex flex-col relative">
            <button onClick={resetToHome} className="absolute top-4 right-6 text-gray-400 p-2 bg-white rounded-full shadow-sm active:bg-gray-100"><Home size={16} /></button>
            <div className="text-sm text-orange-500 font-medium mb-2 shrink-0">Step {wizardStep + 1} of {questions.length}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-snug pr-8">{q.title}</h2>
            <div className="space-y-3 flex-1 pb-6">
              {q.options.map((opt, idx) => {
                const isSelected = q.multi ? (formData[q.id] || []).includes(opt) : formData[q.id] === opt;
                return (
                  <button key={idx} onClick={() => handleOptionSelect(q.id, opt, q.multi)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'}`}>
                    <span className="font-medium">{opt}</span>
                    {isSelected && <CheckCircle2 size={20} className="text-orange-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {q.multi && <button onClick={() => wizardStep < questions.length - 1 ? setWizardStep(wizardStep + 1) : startCalculation()} className="mt-4 w-full bg-gray-800 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform">下一步</button>}
          </div>
        </div>
      )}

      {/* --- Calculating Page --- */}
      {step === 'calculating' && (
        <div className="flex-1 w-full bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
          <div className="relative w-48 h-48 mb-8 animate-pulse border-4 border-orange-500/20 rounded-full flex items-center justify-center">
            <Search size={40} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">AI 引擎分析中</h2>
          <p className="text-gray-400 text-sm animate-pulse">{loadingText}</p>
        </div>
      )}

      {/* --- Hook Page (带合规门禁与专属码生成) --- */}
      {step === 'hook' && (
        <div className="flex-1 w-full bg-gray-50 relative flex flex-col overflow-hidden">
          <div className="p-6 filter blur-md opacity-40 flex-1"><div className="h-20 bg-white rounded-xl mb-4"></div><div className="h-32 bg-white rounded-xl mb-4"></div></div>
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-10 animate-slide-up">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mb-3">✨ 分析完成！</div>
              <h2 className="text-xl font-bold text-gray-800 leading-snug mb-2">系统基于逻辑树匹配了<br/>专属福利与防坑防漏指南</h2>
            </div>
            <button onClick={() => setShowAuthModal(true)} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center"><Phone size={18} className="mr-2" /> 建立档案并解锁报告</button>
          </div>

          {/* 弹窗：填写手机号与隐私打钩 */}
          {showAuthModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center"><ShieldCheck className="text-green-500 mr-2" size={20} /> 建立专属医疗档案</h3>
                  <button onClick={() => setShowAuthModal(false)} className="text-gray-400">✕</button>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">为方便您日后查阅报告及接收政策更新，请输入手机号。我们将为您生成免密专属查询码。</p>
                
                <input 
                  type="tel" 
                  placeholder="请输入真实的 11 位手机号码" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 outline-none focus:border-orange-500 transition-colors"
                />
                
                <label className="flex items-start gap-2 mb-4 p-2 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-1 shrink-0 accent-orange-500 w-4 h-4" />
                  <span className="text-[11px] text-gray-500 leading-tight">
                    我已阅读并同意《隐私保护声明》，已知悉本平台仅提供财务补助信息整合，不涉及任何临床医疗诊断，且不会泄露个人身份信息。
                  </span>
                </label>

                {authError && <div className="text-xs text-red-500 mb-3 text-center">{authError}</div>}

                <button onClick={handleGenerateCode} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 active:scale-95 transition-transform flex justify-center items-center">
                  <KeySquare size={18} className="mr-2"/> 免费生成专属查询码
                </button>
              </div>
            </div>
          )}

          {/* 弹窗：展示生成的专属码 */}
          {showCodeModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative border border-gray-700">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <div className="p-8 text-center text-white">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">档案创建成功！</h3>
                  <p className="text-sm text-gray-400 mb-6">这是您的专属找回凭证，请务必截图保存：</p>
                  
                  <div className="bg-black/50 border border-gray-600 rounded-xl p-4 mb-6 relative group">
                    <div className="text-[10px] text-gray-500 absolute top-2 left-3">手机号 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
                    <div className="text-4xl font-mono font-bold tracking-[0.2em] text-orange-400 mt-2">{uniqueCode}</div>
                  </div>

                  <p className="text-xs text-gray-400 mb-6 bg-white/5 p-3 rounded-lg text-left">
                    💡 提示：本平台不发验证码。日后您在任何设备上，输入手机号和上面这 4 位数字，即可随时调出本报告。
                  </p>

                  <button onClick={unlockReport} className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
                    我已截图保存，立刻看报告
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- Report Page --- */}
      {step === 'report' && (
        <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
          <div className={`p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0 ${formData.disease === '身体健康 (看体检/保险)' ? 'bg-gradient-to-r from-green-500 to-green-400' : (formData.disease === '糖尿病 (长期服药)' ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-orange-500 to-orange-400')}`}>
            <div className="flex justify-between items-start mb-1">
              <div className="text-sm opacity-80">专属档案：{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
              <button onClick={resetToHome} className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm active:bg-white/30"><Home size={16} /></button>
            </div>
            <h1 className="text-2xl font-bold mb-4">医疗财务规划与省钱指南</h1>
            <div className="bg-white/20 p-3 rounded-lg flex items-start border border-white/30 backdrop-blur-sm">
              <AlertTriangle size={20} className="text-yellow-200 mr-2 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-yellow-100">系统核实：</span>
                {formData.disease === '身体健康 (看体检/保险)' ? '您的状况极佳！请务必查收以下属于您的健康防漏清单，勿浪费权益。' : '根据您的就诊阶段，请务必严格遵循以下时间轴，防止福利漏报！'}
              </div>
            </div>
          </div>

          <div className="p-6 flex-1">
            {/* 核心：动态渲染匹配的时间轴结构 */}
            {renderDynamicTimeline()}
          </div>

          <div className="px-6 pb-6 text-center shrink-0">
             <button onClick={resetToHome} className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 mb-4 shadow-sm active:bg-gray-50 transition-colors flex justify-center items-center">
               <Home size={18} className="mr-2" /> 重新测算 / 返回主页
             </button>
             <p className="text-[10px] text-gray-400">本报告基于规则引擎生成。不构成临床医疗用药建议。</p>
          </div>
        </div>
      )}

      {/* --- 全新：健康福利页面 (所有人可见) --- */}
      {step === 'health_benefits' && (
        <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">全民日常健康福利</h1>
                <p className="text-sm opacity-90">亚健康预防与常规筛查的“免费午餐”</p>
              </div>
              <button onClick={resetToHome} className="bg-white/20 p-2 rounded-full backdrop-blur-sm active:bg-white/30"><Home size={20} /></button>
            </div>
          </div>

          <div className="p-6 flex-1 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
               <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">👩‍⚕️ 妇联/卫健委</div>
               <h3 className="font-bold text-gray-800 mb-1 mt-2">免费“两癌”筛查</h3>
               <p className="text-xs text-gray-500 mb-2">政府向适龄妇女免费提供乳腺癌、宫颈癌筛查。符合条件的确诊困难群体，还可向当地妇联申请 1 万元专属救助金。</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
               <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">🏢 企业工会/HR</div>
               <h3 className="font-bold text-gray-800 mb-1 mt-2">EAP 心理援助与疗休养</h3>
               <p className="text-xs text-gray-500 mb-2">大中型企业工会通常会提供免费的年度疗休养名额，以及覆盖员工全家的 24 小时 EAP 免费心理咨询热线。</p>
            </div>
          </div>

          <div className="px-6 pb-6 shrink-0">
            <button onClick={resetToHome} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center active:scale-95 transition-transform">
               <Home size={18} className="mr-2" /> 返回导航主页
            </button>
          </div>
        </div>
      )}

      {/* --- Detail Modal (Bottom Sheet) --- */}
      {activeDetail && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setActiveDetail(null)}></div>
          <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col animate-slide-up relative z-10">
            <div className="flex items-center justify-between p-5 border-b shrink-0"><div className="font-bold text-gray-800 text-lg">福利项目详情指南</div><button onClick={() => setActiveDetail(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">✕</button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div><h2 className="text-2xl font-bold text-gray-800 mb-2">{activeDetail.title}</h2><div className="text-orange-500 font-bold text-sm bg-orange-50 inline-block px-2 py-1 rounded">💰 预计节省: {activeDetail.savings}</div></div>
              <div><div className="text-xs font-bold text-gray-400 mb-1 uppercase">⏰ 核心时间节点要求</div><div className="text-sm text-red-700 font-medium bg-red-50 p-3 rounded-lg">{activeDetail.timeline}</div></div>
              <div><div className="text-xs font-bold text-gray-400 mb-1 uppercase">👣 申请执行流程</div><div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{activeDetail.process}</div></div>
              <div><div className="text-xs font-bold text-gray-400 mb-1 uppercase">📁 需准备材料</div><div className="text-sm text-gray-800">{activeDetail.materials}</div></div>
            </div>
            
            <div className="p-5 border-t shrink-0 bg-white pb-8">
              <button onClick={() => setActiveDetail(null)} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 active:scale-95 transition-transform mb-3">
                我已了解，返回清单
              </button>
              <button onClick={goToHealthBenefits} className="w-full bg-green-50 text-green-700 font-bold py-3.5 rounded-xl border border-green-200 active:bg-green-100 transition-colors flex justify-center items-center">
                <Heart size={16} className="mr-2" /> 查看所有人的通用健康福利
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}