import React, { useState, useCallback } from 'react';
import { ChevronRight, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Phone, ExternalLink, Activity, Lock, Search, Landmark, ChevronDown, ChevronUp, Home, Heart, ShieldPlus, KeySquare } from 'lucide-react';

// --- 静态配置与数据模板 (充当本地轻量级福利知识库) ---
const benefitDetails = {
  men_te: { title: '门特/门慢 资质申请', sponsor: '国家医疗保障局', savings: '约 1.5万元/年', target: '持有职工医保/居民医保，且确诊规定慢性病/重大疾病的患者。', timeline: '确诊后，【第一次门诊开药前】必须办理，否则无法追溯报销。', conditions: '需二级以上公立医院专科医生开具确诊证明，并符合当地医保局病种目录。', process: '1. 准备确诊病历资料\n2. 前往医院医保办盖章确认\n3. 在医保局窗口或官方小程序（如粤医保、浙里办）提交备案', materials: '身份证、社保卡、诊断书原件、近期相关检查报告。' },
  fen_qi: { title: '医疗消费免息分期', sponsor: '持牌金融机构联合药企', savings: '约省利息 4,500元', target: '需自费支付高昂药费/耗材费，且家庭短期现金流紧张的患者。', timeline: '在院外DTP特药药房【付款前】申请。', conditions: '患者或直系亲属信用记录良好，有还款能力。', process: '1. 在特药药房提出分期意向\n2. 扫描驻店金融人员的专属二维码\n3. 填写资料，通常10分钟内秒批额度', materials: '申请人身份证、处方单、关系证明（如代办）。' },
  pap_a: { title: '特定靶向药 PAP 慈善援助', sponsor: '中国初级卫生保健基金会', savings: '最高全免药费（数十万）', target: '符合特定基因突变（如EGFR阳性）的肺癌患者。', timeline: '🚨 绝对红线：必须在【第一次自费购药前】注册并提交材料！', conditions: '医学条件符合项目要求；低保户可申请全免，普通低收入家庭按“买二赠二”比例援助。', process: '1. 关注基金会公众号注册患者档案\n2. 提交医学与经济证明材料审核\n3. 审核通过后到指定药房领取赠药', materials: '病理/基因检测报告、处方、低保证明或收入证明。' },
  pap_b: { title: '免费基因检测(NGS)计划', sponsor: '中华慈善总会联合药企', savings: '约 1.2万元', target: '初诊肺癌或耐药后需寻找新方案的患者。', timeline: '在住院期间或首轮用药前由主治医生发起。', conditions: '需由合作的三甲医院病理科或肿瘤科医生推荐。', process: '1. 医生开具基因检测申请单\n2. 填写患者入组申请书\n3. 样本送至指定实验室检测', materials: '病理组织切片或血样、知情同意书。' },
  ins_geren: { title: '个人重疾险/百万医疗险理赔', sponsor: '商业保险公司', savings: '预计覆盖全部自费支出', target: '此前已购买过商业医疗保险的患者。', timeline: '确诊后【24小时内】拨打保司电话报案。', conditions: '保单在有效期内，且不属于免责范畴。', process: '1. 报案获得理赔号\n2. 申请“住院垫付”服务\n3. 留存所有发票清单', materials: '保单号、病历、发票清单。' },
  ins_qiye: { title: '企业补充医疗保险报销', sponsor: '用人单位(HR/工会)', savings: '报销医保内个人自付部分', target: '在职职工。', timeline: '出院结算完成后 30 天内。', conditions: '必须先通过基本医保报销。', process: '1. 向HR领取申请表\n2. 提交材料\n3. 等待打款', materials: '发票分割单、处方。' },
  ins_huimin: { title: '城市定制型惠民保配置与理赔', sponsor: '当地政府指导+保司承保', savings: '大病自费兜底 2-10万元', target: '所有人（尤其是无商业医疗险的老人、非标体人群）。', timeline: '健康期即可配置；生病自费达标后理赔。', conditions: '不限年龄、既往症可保可赔（部分免责）。', process: '1. 微信搜索“城市名+惠民保”\n2. 一键投保或申请理赔', materials: '身份证、医保卡。' },
  gong_hui: { title: '工会职工大病互助金', sponsor: '中华全国总工会', savings: '约 1-3万元', target: '缴纳了工会会费的正式在职员工及家属。', timeline: '年度结算期内提交。', conditions: '自费额度达到互助标准。', process: '1. 咨询工会负责人\n2. 填写救助表\n3. 提供发票挂号件', materials: '工会会员卡、发票分割单。' },
  health_liangai: { title: '妇联/卫健委“两癌”免费筛查', sponsor: '国家卫生健康委 / 妇联', savings: '约省 500-1000元', target: '35-64周岁适龄妇女。', timeline: '健康期每年或每三年一次。', conditions: '具有当地户籍或常住证明。确诊困难群体可向妇联额外申请1万元救助金。', process: '1. 关注当地妇幼保健院公众号\n2. 预约免费筛查名额\n3. 携带证件前往检查', materials: '身份证、户口本或居住证。' },
  health_eap: { title: '企业工会 EAP 援助与疗休养', sponsor: '所在企业工会委员会', savings: '折合价值 2000-5000元', target: '大中型国企、互联网大厂、外企的正式工会会员。', timeline: '健康期/亚健康疲劳期均可申请。', conditions: '按公司职级、司龄或年度福利配额分配。', process: '1. 登录公司内网/行政系统\n2. 预约免费心理咨询热线或申请年度疗休养名额', materials: '员工工牌、内网账号。' },
  psp_diabetes: { title: '慢病患者支持计划 (PSP) - 免费领仪器', sponsor: '拜耳 / 赛诺菲 等跨国药企', savings: '赠送原厂血糖仪及试纸 (约 500元)', target: '长期服用特定进口降糖药/胰岛素的糖尿病患者。', timeline: '日常门诊购药后。', conditions: '需上传正规医院或药房的购药小票及处方证明。', process: '1. 关注对应药企患者关爱公众号\n2. 注册并上传购药凭证\n3. 审核通过后免费邮寄到家', materials: '医院处方、购药发票/小票。' }
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

  const [matchedBenefits, setMatchedBenefits] = useState(null);

  // --- 鉴权与合规状态 ---
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // --- 老用户找回状态 ---
  const [showRetrieveModal, setShowRetrieveModal] = useState(false);
  const [retrievePhone, setRetrievePhone] = useState('');
  const [retrieveCode, setRetrieveCode] = useState('');
  const [retrieveError, setRetrieveError] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);

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

  // 🛡️ 深度优化版的建档接口（精准捕获 Vercel 报错）
  const handleGenerateCode = async () => {
    if (phone.length !== 11) { setAuthError('请输入正确的11位手机号码'); return; }
    if (!isAgreed) { setAuthError('请先阅读并勾选同意《隐私保护声明》'); return; }
    
    setAuthError('正在向云端数据库安全建档...');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setUniqueCode(code);
    
    try {
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, profileData: formData })
      });

      // 💡 诊断环境问题
      if (res.status === 404) {
        setAuthError('⚠️ 错误(404)：当前处于本地环境或API未部署，请推送代码至Vercel线上测试！');
        return;
      }
      if (res.status === 500) {
        setAuthError('⚠️ 错误(500)：Vercel 连不上数据库！请检查 Vercel 的 DATABASE_URL 环境变量，或执行 npx prisma db push 建表！');
        return;
      }

      const data = await res.json();
      
      if (!data.success) {
        setAuthError(`服务器提示：${data.message || '建档失败，请稍后再试'}`);
        return;
      }

      setMatchedBenefits(data.engineResult);
      setShowAuthModal(false);
      setShowCodeModal(true);
    } catch (error) {
      console.error('Fetch Error:', error);
      setAuthError(`⚠️ 网络请求阻断：${error.message}。请刷新页面或检查代理设置。`);
    }
  };

  const unlockReport = () => {
    setShowCodeModal(false);
    setStep('report');
  };

  // 🔍 找回接口同样优化报错
  const handleRetrieve = async () => {
    if (retrievePhone.length !== 11) { setRetrieveError('请输入正确的11位手机号码'); return; }
    if (retrieveCode.length !== 4) { setRetrieveError('请输入4位专属查询码'); return; }
    
    setRetrieveError('');
    setIsRetrieving(true);

    try {
      const res = await fetch('/api/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: retrievePhone, code: retrieveCode })
      });

      if (res.status === 404) { setRetrieveError('⚠️ 错误：API不存在，请推送到 Vercel 在线测试！'); setIsRetrieving(false); return; }
      if (res.status === 500) { setRetrieveError('⚠️ 错误：数据库连接异常，请检查 Vercel DATABASE_URL。'); setIsRetrieving(false); return; }

      const data = await res.json();

      if (data.success) {
        setFormData(data.profileData || {});
        setMatchedBenefits(data.engineResult);
        setPhone(retrievePhone);
        setShowRetrieveModal(false);
        setStep('report');
      } else {
        setRetrieveError(data.message || '查询不到该档案');
      }
    } catch (error) {
      setRetrieveError('网络异常，请推送到 Vercel 线上环境测试');
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleFeedback = useCallback((e, itemId, status) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFeedback(prev => ({ ...prev, [itemId]: status }));

    fetch('/api/save-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: phone || 'anonymous-user', feedbackData: { benefitId: itemId, action: status, time: new Date().toISOString() }})
    }).catch(error => console.error('埋点失败:', error));
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
    setShowRetrieveModal(false);
    setRetrievePhone('');
    setRetrieveCode('');
    setRetrieveError('');
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

  // --- 核心：动态生成卡片引擎 ---
  const renderBenefitCard = (itemId, lineColor = 'bg-gray-300', borderColor = 'border-gray-200') => {
    const item = benefitDetails[itemId];
    if (!item) return null;

    return (
      <div key={itemId} className={`relative pl-6 mb-8 border-l-2 ${borderColor}`}>
        <div className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full ${lineColor} shadow-sm`}></div>
        <div className={`text-sm font-bold mb-2 ${lineColor.replace('bg-', 'text-')}`}>
          ⏰ {item.timeline.split('，')[0]}
        </div>
        <div className={`p-4 rounded-xl shadow-sm border relative cursor-pointer transition-all duration-300 ${feedback[itemId] === '不感兴趣' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 active:bg-gray-50'}`} onClick={() => setActiveDetail(item)}>
           <div className="text-[10px] text-blue-700 bg-blue-50 inline-flex items-center px-1.5 py-0.5 rounded mb-1.5"><Landmark size={10} className="mr-1" /> {item.sponsor}</div>
           <div className="flex justify-between items-start mb-2">
             <h3 className="font-bold text-gray-800 leading-tight pr-2">{item.title}</h3>
             <span className="text-orange-500 font-bold text-xs bg-orange-50 px-1 py-0.5 rounded shrink-0">💰 {item.savings}</span>
           </div>
           <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.target}</p>
           <FeedbackButtons itemId={itemId} />
        </div>
      </div>
    );
  };

  const renderDynamicTimeline = () => {
    if (!matchedBenefits) {
      return <div className="text-center text-gray-400 py-10 animate-pulse">正在从云端读取算力结果...</div>;
    }

    const hasUrgent = matchedBenefits.urgent && matchedBenefits.urgent.length > 0;
    const hasFinancial = matchedBenefits.financial && matchedBenefits.financial.length > 0;
    const hasInsurance = matchedBenefits.insurance && matchedBenefits.insurance.length > 0;
    const hasHealth = matchedBenefits.health && matchedBenefits.health.length > 0;

    if (!hasUrgent && !hasFinancial && !hasInsurance && !hasHealth) {
      return <div className="text-center text-gray-500 py-10">抱歉，系统暂未匹配到对应的福利支持。</div>;
    }

    return (
      <>
        {hasUrgent && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-red-500 mb-6 flex items-center"><AlertTriangle size={20} className="mr-2" /> 绝对红线：掏钱前必须申请</h2>
            {matchedBenefits.urgent.map(id => renderBenefitCard(id, 'bg-red-500', 'border-red-200'))}
          </div>
        )}
        {hasFinancial && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-lg font-bold text-orange-500 mb-6 flex items-center"><Activity size={20} className="mr-2" /> 资金破局：大额支付兜底</h2>
            {matchedBenefits.financial.map(id => renderBenefitCard(id, 'bg-orange-500', 'border-orange-200'))}
          </div>
        )}
        {hasInsurance && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-700">
            <h2 className="text-lg font-bold text-blue-500 mb-6 flex items-center"><ShieldCheck size={20} className="mr-2" /> 商业理赔与补充报销</h2>
            {matchedBenefits.insurance.map(id => renderBenefitCard(id, 'bg-blue-500', 'border-blue-200'))}
          </div>
        )}
        {hasHealth && (
          <div className="mb-10 animate-in slide-in-from-bottom-2 duration-1000">
            <h2 className="text-lg font-bold text-green-500 mb-6 flex items-center"><Heart size={20} className="mr-2" /> 羊毛专区：日常健康维护</h2>
            {matchedBenefits.health.map(id => renderBenefitCard(id, 'bg-green-500', 'border-green-200'))}
          </div>
        )}
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
            <button onClick={() => setShowRetrieveModal(true)} className="w-full bg-transparent text-orange-600 font-bold py-3.5 rounded-xl border-2 border-orange-200 active:bg-orange-50 transition-colors mt-4 flex justify-center items-center">
               👉 老用户：凭专属码找回报告
            </button>
            <button onClick={() => setStep('health_benefits')} className="w-full bg-white text-green-600 border-2 border-green-100 font-bold py-4 rounded-xl shadow-sm flex justify-center items-center active:scale-95 transition-transform mt-4">
              <Heart size={20} className="mr-2" /> 浏览全民通用健康福利
            </button>
          </div>

          {/* 弹窗：老用户找回 */}
          {showRetrieveModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center"><Search className="text-orange-500 mr-2" size={20} /> 找回专属医疗档案</h3>
                  <button onClick={() => setShowRetrieveModal(false)} className="text-gray-400 p-1">✕</button>
                </div>
                <div className="space-y-4 mb-6">
                  <input type="tel" placeholder="请输入预留手机号" value={retrievePhone} onChange={(e) => setRetrievePhone(e.target.value.replace(/\D/g, '').slice(0, 11))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500 transition-colors text-sm" />
                  <input type="text" placeholder="请输入4位专属码" value={retrieveCode} onChange={(e) => setRetrieveCode(e.target.value.replace(/\D/g, '').slice(0, 4))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500 transition-colors tracking-widest font-mono text-lg text-center" />
                </div>
                {retrieveError && <div className="text-xs text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{retrieveError}</div>}
                <button onClick={handleRetrieve} disabled={isRetrieving} className={`w-full text-white font-bold py-3.5 rounded-xl flex justify-center items-center ${isRetrieving ? 'bg-orange-300' : 'bg-orange-500 active:scale-95'}`}>
                  {isRetrieving ? '努力查询中...' : '一键找回报告'}
                </button>
              </div>
            </div>
          )}
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

      {/* --- Hook Page --- */}
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

          {/* 弹窗：填写手机号 */}
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
                  <span className="text-[11px] text-gray-500 leading-tight">我已阅读并同意《隐私保护声明》，已知悉本平台仅提供财务补助信息整合，不提供任何临床医疗建议。</span>
                </label>

                {authError && <div className="text-[11px] text-red-500 mb-3 text-center bg-red-50 p-2 rounded">{authError}</div>}

                <button onClick={handleGenerateCode} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 flex justify-center items-center">
                  <KeySquare size={18} className="mr-2"/> 免费生成专属查询码
                </button>
              </div>
            </div>
          )}

          {/* 弹窗：展示专属码 */}
          {showCodeModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 border border-gray-700">
                <div className="p-8 text-center text-white">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">档案创建成功！</h3>
                  <p className="text-sm text-gray-400 mb-6">这是您的专属找回凭证，请务必截图保存：</p>
                  
                  <div className="bg-black/50 border border-gray-600 rounded-xl p-4 mb-6 relative">
                    <div className="text-[10px] text-gray-500 absolute top-2 left-3">手机号 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
                    <div className="text-4xl font-mono font-bold tracking-[0.2em] text-orange-400 mt-2">{uniqueCode}</div>
                  </div>

                  <button onClick={unlockReport} className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl shadow-lg active:scale-95">我已截图保存，立刻看报告</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Report Page --- */}
      {step === 'report' && (
        <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
          <div className={`p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0 bg-gradient-to-r from-gray-800 to-gray-700`}>
            <div className="flex justify-between items-start mb-1">
              <div className="text-sm opacity-80">专属档案：{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</div>
              <button onClick={resetToHome} className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm"><Home size={16} /></button>
            </div>
            <h1 className="text-2xl font-bold mb-4">医疗财务规划与省钱指南</h1>
            <div className="bg-white/20 p-3 rounded-lg flex items-start border border-white/30 backdrop-blur-sm">
              <AlertTriangle size={20} className="text-yellow-200 mr-2 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-100 leading-relaxed">请严格遵循以下时间轴节点申请，防止因错过时机导致无法报销。</div>
            </div>
          </div>

          <div className="p-6 flex-1">
            {renderDynamicTimeline()}
          </div>

          <div className="px-6 pb-6 text-center shrink-0">
             <button onClick={resetToHome} className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 mb-4 shadow-sm active:bg-gray-50 flex justify-center items-center">
               <Home size={18} className="mr-2" /> 重新测算 / 返回主页
             </button>
             <p className="text-[10px] text-gray-400">本报告基于规则引擎动态生成。不构成临床医疗用药建议。</p>
          </div>
        </div>
      )}

      {/* --- 全新：健康福利页面 --- */}
      {step === 'health_benefits' && (
        <div className="flex-1 w-full bg-gray-50 flex flex-col overflow-y-auto relative pb-10">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 pt-10 text-white rounded-b-3xl shadow-md shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">全民日常健康福利</h1>
                <p className="text-sm opacity-90">亚健康预防与常规筛查的“免费午餐”</p>
              </div>
              <button onClick={resetToHome} className="bg-white/20 p-2 rounded-full"><Home size={20} /></button>
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
            <button onClick={resetToHome} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center">
               <Home size={18} className="mr-2" /> 返回导航主页
            </button>
          </div>
        </div>
      )}

      {/* --- Detail Modal --- */}
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
              <button onClick={() => setActiveDetail(null)} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 mb-3">我已了解，返回清单</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}