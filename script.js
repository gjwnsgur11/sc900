/**
 * [SC-900 합격 마스터] 메인 스크립트
 * 버그 수정 완료: 타이머 작동, 초기화 로직, 버튼 표시 조건 완벽 해결
 * 작성자: 30년차 장인
 */

// --------------------------------------------------------------------------------
// [Part 1] 메인 앱 로직 (문제 데이터 및 상태 관리)
// --------------------------------------------------------------------------------

// 데이터는 건드리지 말라고 했으니 원본 그대로 유지할게.
const allQuestions = [
    // --- 1회 ---
    { id: "1-1", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["시스템 업데이트 적용은 Azure Security Center(현재 Defender for Cloud)에서 조직의 보안 점수를 증가시킨다.", "Azure Security Center의 보안 점수(Secure Score)는 여러 Azure 구독(subscription)에 걸쳐 있는 리소스를 평가할 수 있다.", "다중 요소 인증(MFA)을 활성화하면 Azure Security Center의 조직 보안 점수가 증가한다."], ans: ["Y", "Y", "Y"] },
    { id: "1-2", type: "radio", q: "하이브리드 ID 모델에서, Active Directory Domain Services(AD DS)와 Azure Active Directory(Azure AD) 간의 ID를 동기화하기 위해 무엇을 사용할 수 있는가?", ans: "C", opts: ["Active Directory Federation Services (AD FS)", "Azure Sentinel", "Azure AD Connect", "Azure AD Privileged Identity Management (PIM)"] },
    { id: "1-3", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["외부 이메일 주소(external email address)는 사용자 본인의 비밀번호 재설정(SSPR)을 인증하는 데 사용할 수 있다.", "Microsoft Authenticator 앱으로 전송되는 알림(notification)은 SSPR 인증 방법으로 사용할 수 있다.", "SSPR(Self-Service Password Reset)을 수행하려면 사용자가 이미 Azure AD에 로그인되어 인증된 상태여야 한다."], ans: ["Y", "N", "N"] },
    { id: "1-4", type: "check", q: "Microsoft Cloud Adoption Framework for Azure에서, Ready 단계 이전에 수행되는 두 단계는 무엇인가?", ans: ["A", "E"], opts: ["Plan", "Manage", "Adopt", "Govern", "Define Strategy"] },
    { id: "1-5", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\nWhen using multi-factor authentication (MFA), a password is considered something you ______.", ans: "C", opts: ["are", "have", "know", "share"] },
    { id: "1-6", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하시오.\n\nAzure DDoS Protection Standard can be used to protect ______.", ans: "D", opts: ["Azure Active Directory (Azure AD) applications", "Azure Active Directory (Azure AD) users", "resource groups", "virtual networks"] },
    { id: "1-7", type: "check", q: "하나의 가상 네트워크(VNet)만 사용하는 대신 여러 개의 가상 네트워크를 배포해야 하는 두 가지 이유는 무엇인가?", ans: ["B", "C"], opts: ["예산 관리를 위해", "거버넌스 정책을 준수하기 위해", "리소스를 격리하기 위해", "여러 유형의 리소스를 연결하기 위해"] },
    { id: "1-8", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft 365의 Advanced Audit 기능을 사용하여 청구(Billing) 세부 정보를 확인할 수 있다.", "Microsoft 365의 Advanced Audit 기능을 사용하여 이메일 메시지의 내용을 볼 수 있다.", "Microsoft 365의 Advanced Audit 기능을 사용하여 사용자가 Outlook 웹 버전에서 메일박스 항목을 검색할 때 검색창을 사용한 시점을 식별할 수 있다."], ans: ["N", "N", "Y"] },
    { id: "1-9", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Defender for Endpoint는 Android 기기를 보호할 수 있다.", "Microsoft Defender for Endpoint는 Windows 10이 실행 중인 Azure 가상 머신을 보호할 수 있다.", "Microsoft Defender for Endpoint는 SharePoint Online 사이트와 콘텐츠를 바이러스로부터 보호할 수 있다."], ans: ["Y", "Y", "N"] },
    { id: "1-10", type: "radio", q: "Microsoft Intune으로 관리되는 디바이스가 기업 리소스에 접근하지 못하도록 제한하려면, Azure Active Directory(Azure AD)의 어떤 기능을 사용해야 하는가?", ans: "C", opts: ["Network Security Groups (NSGs)", "Azure AD Privileged Identity Management (PIM)", "Conditional access policies", "Resource locks"] },
    { id: "1-11", type: "radio", q: "당신은 Azure 구독을 가지고 있다.\n승인(approval)이 필요한 시간 제한(Time-bound) 관리자 역할 활성화를 구현해야 한다.\n무엇을 사용해야 하는가?", ans: "C", opts: ["Microsoft Entra ID Protection", "Microsoft Entra Conditional Access", "Microsoft Entra Privileged Identity Management", "Microsoft Entra Access Reviews"] },
    { id: "1-12", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\nMicrosoft Purview Compliance Manager는 조직의 컴플라이언스 데이터를 ______ 평가한다.", ans: "A", opts: ["continually (지속적으로)", "monthly (월 단위로)", "on-demand (요청 시)", "quarterly (분기별로)"] },
    { id: "1-13", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Sentinel은 Logic Apps를 사용하여 여러 리소스 간의 이상(anomalies)을 식별한다.", "Microsoft Sentinel은 워크북(Workbooks)을 사용하여 경고(Alert)를 사건(Incident)으로 상관 분석한다.", "Microsoft Sentinel의 헌팅(Hunting) 검색 및 쿼리 도구는 MITRE ATT&CK 프레임워크를 기반으로 한다."], ans: ["N", "N", "Y"] },
    { id: "1-14", type: "radio", q: "Core eDiscovery 워크플로우에서, 콘텐츠(content)를 검색(search)하기 전에 반드시 해야 하는 작업은 무엇인가?", ans: "A", opts: ["eDiscovery 보류(eDiscovery hold) 생성", "Express Analysis 실행", "변호사-의뢰인 특권 탐지 구성", "결과를 내보내고 다운로드"] },
    { id: "1-15", type: "check", q: "Microsoft 365의 데이터 손실 방지(DLP) 정책을 사용하여 수행할 수 있는 두 가지 작업은 무엇인가?", ans: ["A", "C"], opts: ["조직의 정책을 위반하려는 사용자에게 Policy Tip(경고 메시지)을 표시하기", "엔드포인트에서 디스크 암호화를 활성화하기", "민감한 정보를 포함한 OneDrive 문서를 보호하기", "디바이스에 보안 기준(Security Baseline)을 적용하기"] },
    { id: "1-16", type: "check", q: "다음 중 Azure Active Directory(Azure AD) Identity Protection을 사용하여 수행할 수 있는 작업은 어떤 세 가지입니까?", ans: ["B", "C", "D"], opts: ["파트너 조직에 대한 외부 액세스를 구성한다.", "위험 탐지 정보를 타사(Third-party) 유틸리티로 내보낸다.", "ID 기반 위험의 감지 및 수정(자동 완화)을 자동화한다.", "사용자 인증과 관련된 위험을 조사한다.", "데이터에 민감도 레이블을 생성하고 자동으로 적용한다."] },
    { id: "1-17", type: "radio", q: "Azure SQL Managed Instance에 대한 위협 탐지(Threat Detection) 기능을 제공하기 위해 무엇을 사용할 수 있습니까?", ans: "C", opts: ["Microsoft Secure Score", "Application Security Groups", "Microsoft Defender for Cloud", "Azure Bastion"] },
    { id: "1-18", type: "radio", q: "Azure Bastion은 어떤 유형의 리소스에 대해 보안 액세스(Secure Access)를 제공할 수 있습니까?", ans: "C", opts: ["Azure Files", "Azure SQL Managed Instances", "Azure Virtual Machines", "Azure App Service"] },
    { id: "1-19", type: "radio", q: "Microsoft Entra ID Governance에 포함된 기능은 무엇입니까?", ans: "D", opts: ["Verifiable credentials", "Permissions Management", "Identity Protection", "Privileged Identity Management"] },
    { id: "1-20", type: "radio", q: "이메일 첨부 파일을 스캔하고, 악성코드가 없을 경우에만 해당 첨부 파일을 수신자에게 전달하려면 어떤 서비스를 사용할 수 있습니까?", ans: "A", opts: ["Microsoft Defender for Office 365", "Microsoft Defender Antivirus", "Microsoft Defender for Identity", "Microsoft Defender for Endpoint"] },
    { id: "1-21", type: "radio", q: "Azure 배포에서의 공유 책임 모델(Shared Responsibility Model)에 따르면, Microsoft가 단독으로 책임지는 항목은 무엇입니까?", ans: "C", opts: ["Azure에 저장된 사용자 데이터의 권한 관리", "사용자 계정의 생성 및 관리", "물리적 하드웨어의 관리", "모바일 디바이스의 관리"] },
    { id: "1-22", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하십시오:\n\n______는 Azure 서비스를 보호하기 위한 벤치마크 권장 사항과 가이던스를 제공합니다.", ans: "D", opts: ["Azure Application Insights", "Azure Network Watcher", "Log Analytics workspaces", "Security baselines for Azure"] },
    { id: "1-23", type: "radio", q: "Microsoft 365 Endpoint Data Loss Prevention (Endpoint DLP)는 어떤 운영체제에서 사용할 수 있습니까?", ans: "C", opts: ["Windows 10 이상만", "Windows 10 이상 + Android만", "Windows 10 이상 + macOS만", "Windows 10 이상, Android, macOS"] },
    { id: "1-24", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["통제권(Control)은 Microsoft의 주요 프라이버시 원칙이다.", "투명성(Transparency)은 Microsoft의 주요 프라이버시 원칙이다.", "공유 책임(Shared Responsibility)은 Microsoft의 주요 프라이버시 원칙이다."], ans: ["Y", "Y", "N"] },
    { id: "1-25", type: "radio", q: "Compliance Manager에서 assessment(평가)란 무엇입니까?", ans: "A", opts: ["특정 규정, 표준 또는 정책에서 나온 컨트롤을 묶어놓은 그룹", "조직이 내부 표준에 맞도록 정렬하는 데 도움을 주는 권장 가이드라인", "회사 문서에서 허용되지 않는 단어들의 사전", "여러 정책을 포함하는 정책 이니셔티브"] },
    { id: "1-26", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n______(은)는 모바일 전화로 전송되는 인증 코드와 같은 추가 검증(additional verification)을 요구한다.", ans: "A", opts: ["Multi-factor authentication (MFA)", "Pass-through authentication (PTA)", "Password writeback", "Single sign-on (SSO)"] },
    { id: "1-27", type: "radio", q: "Microsoft 365 감지(민감도) 레이블(sensitivity labels)에서 지정할 수 있는 것은 무엇인가?", ans: "C", opts: ["파일을 얼마나 오래 보존해야 하는지", "이메일 메시지를 언제 보관할지", "파일에 어떤 워터마크(watermark)를 추가할지", "파일을 어디에 저장할지"] },
    { id: "1-28", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\nAzure Active Directory(Azure AD)에서 Security Defaults(보안 기본값)을 활성화하면, 모든 Azure AD 사용자에게 ______이 활성화된다.", ans: "C", opts: ["Azure AD Identity Protection", "Azure AD Privileged Identity Management (PIM)", "multi-factor authentication (MFA)", "SSO"] },
    { id: "1-29", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\n______ 파일은 해당 키를 가진 사용자만 그 파일의 데이터를 읽고 사용할 수 있게 만든다.", ans: "A", opts: ["Encryting", "Archiving", "Compressing", "Deduplicating"] },
    { id: "1-30", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\n______는 조사에 사용될 수 있는 전자 정보를 식별하고, 보존(hold)하며, 내보내기(export) 위해 사용된다.", ans: "C", opts: ["Customer Lockbox", "Data Loss Prevention (DLP)", "eDiscovery", "A resource lock"] },
    { id: "1-31", type: "radio", q: "조직 내 두 부서 구성원 간 소통과 정보 공유를 제한하려면 Microsoft 365의 어떤 기능을 사용해야 하는가?", ans: "C", opts: ["Sensitivity label policies", "Customer Lockbox", "Information Barriers", "Privileged Access Management (PAM)"] },
    { id: "1-32", type: "radio", q: "SaaS(Software as a Service) 클라우드 서비스 모델에서, 고객은 보안을 평가할 때 어떤 부분에 대해 책임이 있는가?", ans: "D", opts: ["애플리케이션", "네트워크 제어", "운영체제", "계정 및 ID"] },
    { id: "1-33", type: "radio", q: "다음 중 어떤 Microsoft Purview 솔루션이 데이터 유출(data leakage)을 식별하는 데 사용될 수 있는가?", ans: "A", opts: ["Insider Risk Management", "Compliance Manager", "Communication Compliance", "eDiscovery"] },
    { id: "1-34", type: "check", q: "Windows Hello for Business는 어떤 3가지 인증 방식을 지원하는가?", ans: ["A", "B", "C"], opts: ["지문(fingerprint)", "얼굴 인식(facial recognition)", "PIN", "이메일 인증(email verification)", "보안 질문(security question)"] },
    { id: "1-35", type: "check", q: "다음 중 Zero Trust(제로 트러스트)의 핵심 원칙을 정확하게 설명하는 3가지 문장은 무엇인가?", ans: ["B", "C", "D"], opts: ["물리적 위치로 경계를 정의한다.", "ID(정체성)를 주요 보안 경계로 사용한다.", "항상 사용자 권한을 명시적으로 확인한다.", "항상 사용자 시스템이 침해되었을 수 있다고 가정한다.", "네트워크를 주요 보안 경계로 사용한다."] },
    { id: "1-36", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\n______는 회사가 위험을 줄이기 위해 수행해야 하는 작업들을 얼마나 완료했는지를 측정한다.", ans: "A", opts: ["Compliance score", "Microsoft Purview compliance portal reports", "The Trust Center", "Trust Documents"] },
    { id: "1-37", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\nAzure Sentinel에서 일반적인 작업을 자동화하기 위해 사용할 수 있는 것은 ______이다.", ans: "C", opts: ["deep investigation tools", "hunting search-and-query tools", "Playbooks", "workbooks"] },
    { id: "1-38", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\nAzure Active Directory(Azure AD)는 인증 및 권한 부여에 사용되는 ______이다.", ans: "B", opts: ["an extended detection and response (XDR) system", "an Identity Provider", "a management group", "a security information and event management (SIEM) system"] },
    { id: "1-39", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Insider Risk Management 솔루션을 사용하여 피싱 공격을 탐지할 수 있다.", "Microsoft 365 컴플라이언스 센터에서 Insider Risk Management 솔루션에 접근할 수 있다.", "불만을 가진 직원에 의한 데이터 유출을 Insider Risk Management로 탐지할 수 있다."], ans: ["N", "Y", "Y"] },
    { id: "1-40", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure AD Connect는 하이브리드 ID를 구현하는 데 사용할 수 있다.", "하이브리드 ID는 2개의 Microsoft 365 테넌트 구현을 필요로 한다.", "하이브리드 ID는 AD DS와 Azure AD의 동기화를 의미한다."], ans: ["Y", "N", "Y"] },

    // --- 2회 ---
    { id: "2-1", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["문서에 디지털 서명을 하려면 개인 키(private key)가 필요하다.", "디지털 서명이 된 문서의 진위를 확인하려면 서명한 사람의 공개 키(public key)가 필요하다.", "디지털 서명이 된 문서의 진위를 확인하려면 서명한 사람의 개인 키(private key)가 필요하다."], ans: ["Y", "Y", "N"] },
    { id: "2-2", type: "radio", q: "당신은 리소스를 클라우드로 이동하려고 합니다.\nlaaS(서비스로서의 인프라), PaaS(서비스로서의 플랫폼), SaaS(서비스로서의 소프트웨어) 모델을 검토하고 있습니다.\n\n당신은 클라우드 기반 앱에서 데이터, 사용자 계정, 사용자 디바이스만 관리하려고 합니다. 이 경우 어떤 클라우드 모델을 사용해야 할까요?", ans: "B", opts: ["IaaS", "SaaS", "PaaS"] },
    { id: "2-3", type: "radio", q: "다음 문장을 완성하기 위해 가장 알맞은 답을 선택하세요.\n\nMicrosoft Defender for Cloud의 기능은 악성코드(malware) 및 원치 않는 애플리케이션을 차단하고, Azure 가상 머신의 네트워크 공격 표면(attack surface)을 줄이는 기능을 제공한다.", ans: "A", opts: ["access and application control", "Cloud Security Posture Management (CSPM)", "container security", "vulnerability assessment"] },
    { id: "2-4", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft 365의 Advanced Audit을 사용하면, 이메일 항목이 언제 액세스되었는지 확인할 수 있다.", "Microsoft 365의 Advanced Audit은 기본(Core) 감사와 동일한 감사 로그 보존 기간을 지원한다.", "Microsoft 365의 Advanced Audit은 감사 데이터에 접근할 때 고객 전용 대역폭을 할당한다."], ans: ["Y", "N", "Y"] },
    { id: "2-5", type: "radio", q: "Azure Sentinel(현재 명칭: Microsoft Sentinel)의 XDR(Extended Detection and Response) 기능을 제공하는 것은 무엇인가?", ans: "C", opts: ["Microsoft 365 컴플라이언스 센터와의 통합", "위협 헌팅(threat hunting) 지원", "Microsoft 365 Defender와의 통합", "Azure Monitor Workbooks 지원"] },
    { id: "2-6", type: "match", q: "Azure 네트워크 서비스(Azure Bastion, Azure Firewall, NSG)를 오른쪽의 설명과 올바르게 매칭하세요.", pairs: [ {t:"Azure Bastion", a:"Azure VM에 안전하고 끊김 없는 RDP(Remote Desktop) 연결을 제공한다."}, {t:"Azure Firewall", a:"네트워크 주소 변환(NAT) 서비스를 제공한다."}, {t:"NSG", a:"가상 네트워크의 특정 NIC(네트워크 인터페이스 카드)에 적용되는 트래픽 필터링을 제공한다."} ], ans: ["Azure VM에 안전하고 끊김 없는 RDP(Remote Desktop) 연결을 제공한다.", "네트워크 주소 변환(NAT) 서비스를 제공한다.", "가상 네트워크의 특정 NIC(네트워크 인터페이스 카드)에 적용되는 트래픽 필터링을 제공한다."] }, 
    { id: "2-7", type: "radio", q: "Azure에서 사용자가 2시간 동안만 관리 작업(administrative task)을 수행할 수 있도록 하려면 어떤 기능을 사용해야 하는가?", ans: "A", opts: ["Azure AD Privileged Identity Management (PIM)", "Azure Multi-Factor Authentication (MFA)", "Azure AD Identity Protection", "Conditional Access policies"] },
    { id: "2-8", type: "radio", q: "Microsoft 클라우드 서비스가 ISO 같은 규제 표준(국제표준화기구)을 어떻게 준수하는지에 대한 정보를 제공하는 Microsoft 포털은 무엇인가?", ans: "C", opts: ["Microsoft Endpoint Manager 관리자 센터", "Azure Cost Management + Billing", "Microsoft Service Trust Portal", "Azure Active Directory 관리자 센터"] },
    { id: "2-9", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n사용자가 로그인할 때, ______(은)는 사용자의 자격 증명을 확인하여 신원을 증명한다.", ans: "C", opts: ["administration", "auditing", "authentication", "authorization"] },
    { id: "2-10", type: "check", q: "Microsoft 365 Defender 포털에서 사용할 수 있는 카드(card) 두 가지는 무엇인가?", ans: ["A", "C"], opts: ["Users at risk", "Compliance Score", "Devices at risk", "Service Health", "User Management"] },
    { id: "2-11", type: "radio", q: "다음 중 어떤 점수가 조직이 데이터 보호 및 규제 준수 관련 위험을 줄이기 위해 수행해야 하는 작업의 진행 상황(progress)을 측정하는가?", ans: "D", opts: ["Microsoft Secure Score", "Productivity Score", "Secure score in Azure Security Center", "Compliance score"] },
    { id: "2-12", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Entra ID는 온프레미스 환경에 배포된다.", "Microsoft 365 구독에 Microsoft Entra ID가 포함되어 있다.", "Microsoft Entra ID는 ID 및 접근 관리 서비스이다."], ans: ["N", "Y", "Y"] },
    { id: "2-13", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["SaaS 환경에서는 애플리케이션에 서비스 팩(업데이트)을 적용하는 것은 조직의 책임이다.", "laaS 환경에서는 물리적 네트워크 관리는 클라우드 공급자의 책임이다.", "모든 Azure 클라우드 배포 모델(IaaS/PaaS/SaaS)에서 정보와 데이터 보안 관리는 조직의 책임이다."], ans: ["N", "Y", "Y"] },
    { id: "2-14", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["민감도 레이블(Sensitivity Labels)은 문서를 암호화하는 데 사용할 수 있다.", "민감도 레이블은 문서에 헤더와 푸터를 추가할 수 있다.", "민감도 레이블은 이메일에 워터마크를 적용할 수 있다."], ans: ["Y", "Y", "N"] },
    { id: "2-15", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 고르시오.\n\nMicrosoft 365 Security Center에서 동일한 공격과 관련된 알림(alerts)을 하나로 모아서 보려면 ______ 기능을 사용해야 한다.", ans: "D", opts: ["Reports", "Hunting", "Attack simulator", "Incidents"] },
    { id: "2-16", type: "radio", q: "다음 문장을 올바르게 완성하는 단어를 고르시오.\n\n페더레이션(Federation)은 조직 간에 ______를 구축하는 데 사용된다.", ans: "B", opts: ["multi-factor authentication (MFA)", "a trust relationship", "user account synchronization", "a VPN connection"] },
    { id: "2-17", type: "radio", q: "Active Directory Domain Services(AD DS)에서 생성할 수 있는 것은 무엇인가?", ans: "C", opts: ["모뎀 인증이 필요한 업무용(line-of-business, LOB) 애플리케이션", "모바일 장치(mob devices)", "컴퓨터 계정(computer accounts)", "모뎀 인증이 필요한 SaaS 애플리케이션"] },
    { id: "2-18", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["각 가상 네트워크(VNet)당 Bastion은 하나만 만들 수 있다.", "Azure Bastion은 RDP를 통해 보안 연결을 제공한다.", "Bastion은 Azure Portal을 통해 VM에 안전하게 접속할 수 있게 해준다."], ans: ["Y", "Y", "Y"] },
    { id: "2-19", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n______(은)는 Microsoft 직원, 파트너, 고객으로부터 나온 모범 사례(best practices)와 Azure 배포를 지원하기 위한 도구 및 지침을 제공한다.", ans: "C", opts: ["Azure Blueprints", "Azure Policy", "The Microsoft Cloud Adoption Framework for Azure", "A resource lock"] },
    { id: "2-20", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure 구독(Subscription)에 리소스 잠금(Resource Lock)을 추가할 수 있다.", "Azure 리소스 하나에는 오직 하나의 리소스 잠금만 추가할 수 있다.", "리소스 잠금이 설정된 리소스가 포함된 리소스 그룹은 삭제할 수 있다."], ans: ["Y", "N", "N"] },
    { id: "2-21", type: "radio", q: "Azure Active Directory(Azure AD) Password Protection의 목적은 무엇인가?", ans: "D", opts: ["사용자가 비밀번호를 얼마나 자주 변경해야 하는지 제어하기 위해", "MFA 없이 사용자가 로그인할 수 있는 디바이스를 식별하기 위해", "글로벌 암호화 표준을 사용해 비밀번호를 암호화하기 위해", "사용자가 특정 단어를 비밀번호에 사용하지 못하도록 하기 위해"] },
    { id: "2-22", type: "radio", q: "Microsoft 365 Compliance Center의 Information Protection 솔루션을 사용하면 무엇을 보호할 수 있는가?", ans: "D", opts: ["제로데이(Zero-day) 공격으로부터 컴퓨터 보호", "피싱 공격으로부터 사용자 보호", "악성코드와 바이러스로부터 파일 보호", "민감한 데이터가 무단 사용자에게 노출되는 것 방지"] },
    { id: "2-23", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Network Security Groups (NSGs)는 인터넷에서 들어오는 인바운드 트래픽을 차단할 수 있다.", "Network Security Groups(NSGs)는 인터넷으로 나가는 아웃바운드 트래픽을 차단할 수 있다.", "Network Security Groups (NSGs)는 IP 주소, 프로토콜, 포트 기반으로 트래픽을 필터링할 수 있다."], ans: ["Y", "Y", "Y"] },
    { id: "2-24", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Information Barriers(정보 차단)를 사용하여 Exchange Online 사용자 간의 커뮤니케이션을 제한할 수 있다.", "Information Barriers를 사용하여 SharePoint Online 사이트에 대한 접근을 제한할 수 있다.", "Information Barriers를 사용하여 Microsoft Teams에서 다른 사용자와 파일 공유를 막을 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "2-25", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["사용자는 민감도 레이블(Sensitivity Labels)을 수동으로 적용할 수 있다.", "하나의 파일에 여러 개의 민감도 레이블을 적용할 수 있다.", "민감도 레이블은 Microsoft Word 문서에 워터마크를 적용할 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "2-26", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n______(은)는 온프레미스 Active Directory의 신호를 활용하여 고급 위협을 식별하고, 탐지하고, 조사하는 클라우드 기반 솔루션이다.", ans: "C", opts: ["Microsoft Defender for Cloud Apps", "Microsoft Defender for Endpoint", "Microsoft Defender for Identity", "Microsoft Defender for Office 365"] },
    { id: "2-27", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n______ 시스템은 여러 시스템에서 데이터를 수집하고, 상관관계를 파악하거나 이상(anomalies)을 식별하며, 경고(alert)와 인시던트(incident)를 생성하는 도구이다.", ans: "A", opts: ["security information and event management (SIEM)", "A security orchestration automated response (SOAR)", "A Trusted Automated exchange of Indicator Information (TAXII)", "An attack surface reduction (ASR)"] },
    { id: "2-28", type: "radio", q: "Microsoft 365 Security Center에서 보안 트렌드를 확인하고 사용자(Identity) 보호 상태를 추적하려면 무엇을 사용해야 하는가?", ans: "B", opts: ["Attack simulator", "Reports", "Hunting", "Incidents"] },
    { id: "2-29", type: "radio", q: "사용자가 어떤 리소스에 접근했는지 추적하는 것과 관련된 Identity(신원 관리)의 요소는 무엇인가?", ans: "A", opts: ["Auditing (감사)", "Authorization (인가)", "Authentication (인증)", "Administration (관리)"] },
    { id: "2-30", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure Active Directory(Azure AD)에서는 사용자 지정(Custom) 역할을 만들 수 있다.", "Global administrator(전역 관리자)는 Azure Active Directory(Azure AD)의 역할(Role) 중 하나이다.", "하나의 Azure Active Directory(Azure AD) 사용자는 오직 하나의 역할만 가질 수 있다."], ans: ["Y", "Y", "N"] },
    { id: "2-31", type: "radio", q: "다음 중 Attack Simulation Training(공격 시뮬레이션 훈련) 기능을 포함하는 서비스는 무엇인가?", ans: "B", opts: ["Microsoft Defender for Cloud Apps", "Microsoft Defender for Office 365", "Microsoft Defender for Identity", "Microsoft Defender for SQL"] },
    { id: "2-32", type: "radio", q: "다음 중 Microsoft의 프라이버시 원칙을 나타내는 문장은 무엇인가?", ans: "D", opts: ["Microsoft는 고객 데이터를 전혀 수집하지 않는다.", "Microsoft는 광고 타겟팅을 위해 고객의 이메일·채팅 데이터를 사용한다.", "Microsoft는 고객을 대신하여 프라이버시 설정을 관리한다.", "Microsoft는 고객에게 적용되는 현지 개인정보보호법(local privacy laws)을 존중한다."] },
    { id: "2-33", type: "radio", q: "Azure Active Directory(Azure AD)에 애플리케이션을 등록하면, 어떤 유형의 ID(Identity)가 생성되는가?", ans: "D", opts: ["사용자 계정 (user account)", "사용자 할당 관리 ID (user-assigned managed identity)", "시스템 할당 관리 ID (system-assigned managed identity)", "서비스 주체 (service principal)"] },
    { id: "2-34", type: "radio", q: "당신은 Microsoft 365 E3 구독을 가지고 있다.\n통합 감사 로그(Unified Audit Log)와 Basic Audit 기능을 사용하여 사용자 활동을 감사하려고 한다.\n감사(Audit) 기록은 얼마나 오래 보존되는가?", ans: "C", opts: ["15일", "30일", "90일", "180일"] },
    { id: "2-35", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\nMicrosoft Defender for Identity는 고급 위협을 ______의 신호(signals)로부터 식별할 수 있다.", ans: "C", opts: ["Azure Active Directory (Azure AD)", "Azure AD Connect", "on-premises Active Directory Domain Services (AD DS)"] },
    { id: "2-36", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["조건부 액세스 정책은 전역 관리자(Global Administrator)에게도 적용될 수 있다.", "조건부 액세스 정책은 사용자가 인증(authenticated)되기 전에 평가된다.", "조건부 액세스 정책은 Android 또는 iOS 같은 디바이스 플랫폼을 신호(signal)로 사용할 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "2-37", type: "radio", q: "당신은 Azure Bastion을 사용하여 Azure 가상 머신(VM)에 연결해야 한다. 어떤 것을 사용해야 하는가?", ans: "C", opts: ["SSH 클라이언트", "PowerShell 리모팅", "Azure Portal", "원격 데스크톱 연결(RDP) 클라이언트"] },
    { id: "2-38", type: "radio", q: "Microsoft Defender for Cloud에서 Azure 구독의 전체 보안 상태를 표시하는 메트릭은 무엇인가?", ans: "B", opts: ["리소스 상태(Resource health)", "보안 점수(Secure score)", "권장 사항 상태(Status of recommendations)", "완료된 컨트롤(Completed controls)"] },
    { id: "2-39", type: "match", q: "당신은 Microsoft Purview Compliance Manager에서 컴플라이언스 점수를 평가하고 있습니다.\n컴플라이언스 점수의 액션 하위 범주(Action Subcategories)를 적절한 작업(Action)과 매칭하세요.", 
      pairs: [{t:"Encrypt data at rest", a:"Preventative (예방적 조치)"}, {t:"Perform a system access audit.", a:"Detective (탐지적 조치)"}, {t:"Make configuration changes in response to a security incident.", a:"Corrective (교정적 조치)"}],
      ans: ["Preventative (예방적 조치)", "Detective (탐지적 조치)", "Corrective (교정적 조치)"] },
    { id: "2-40", type: "radio", q: "여러 Azure 구독에 걸쳐 Azure 리소스를 일관된 방식으로 배포하려면 무엇을 사용해야 합니까?", ans: "D", opts: ["Microsoft Sentinel", "Microsoft Defender for Cloud", "Azure Policy", "Azure Blueprints"] },

    // --- 3회 ---
    { id: "3-1", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure DDoS Protection Standard는 중간자(MITM) 공격을 방어한다.", "Azure DDoS Protection Standard는 Azure 구독에서 기본적으로 활성화되어 있다.", "Azure DDoS Protection Standard는 프로토콜 기반 공격을 방어한다."], ans: ["N", "N", "Y"] },
    { id: "3-2", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\nAzure Active Directory(Azure AD)에 등록된 애플리케이션은 자동으로 ______와(과) 연결된다.", ans: "C", opts: ["guest account", "managed identity", "service principal", "user account"] },
    { id: "3-3", type: "radio", q: "다음 중 Azure 리소스를 관리하기 위해 '필요할 때만(Just-in-Time, JIT)' 관리자 권한을 제공할 수 있는 Azure AD 기능은 무엇인가요?", ans: "C", opts: ["조건부 액세스 정책(Conditional Access Policies)", "Azure AD Identity Protection", "Azure AD Privileged Identity Management(PIM)", "인증 방법 정책(Authentication Method Policies)"] },
    { id: "3-4", type: "check", q: "Azure Active Directory(Azure AD) 테넌트에서 Security Defaults(보안 기본값)를 활성화하면 다음 중 어떤 두 가지 요구 사항이 강제 적용되나요?", ans: ["B", "C"], opts: ["모든 사용자는 등록된 디바이스에서 인증해야 한다.", "관리자는 항상 Azure Multi-Factor Authentication(MFA)을 사용해야 한다.", "모든 사용자는 Azure MFA 등록을 완료해야 한다.", "모든 사용자는 비밀번호 없는 로그인(passwordless sign-in) 사용해야 한다.", "모든 사용자는 Windows Hello를 사용하여 인증해야 한다."] },
    { id: "3-5", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure AD Identity Protection은 사용자 위험 수준(user risk level)에 따라 사용자를 그룹에 추가할 수 있다.", "Azure AD Identity Protection은 사용자 자격 증명(credentials)이 유출되었는지 여부를 감지할 수 있다.", "Azure AD Identity Protection은 사용자 위험 수준에 따라 Multi-Factor Authentication(MFA)을 요구하도록 사용할 수 있다."], ans: ["N", "Y", "Y"] },
    { id: "3-6", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\nAzure 리소스는 Azure 서비스를 액세스하기 위해 system-assigned ______를 사용할 수 있다.", ans: "B", opts: ["Azure Active Directory (Azure AD) joined device", "managed identity", "service principal", "user identity"] },
    { id: "3-7", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure Defender는 Azure Storage의 취약점과 위협을 탐지할 수 있다.", "Cloud Security Posture Management(CSPM)는 모든 Azure 구독에서 사용할 수 있다.", "Azure Security Center는 Azure 또는 온프레미스에 배포된 워크로드의 보안을 평가할 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "3-8", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\n당신은 Microsoft Intune을 다음의 ______을 사용하여 관리할 수 있다.", ans: "D", opts: ["Azure Active Directory admin center", "Microsoft 365 compliance center", "Microsoft 365 security center", "Microsoft Endpoint Manager admin center"] },
    { id: "3-9", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Compliance Manager는 고객이 관리하는(control) 항목만 추적한다.", "Compliance Manager는 평가(assessment)를 만들기 위한 사전 정의된 템플릿을 제공한다.", "Compliance Manager는 특정 데이터 보호 규정(standards)에 데이터를 준수시키는지 평가하는 데 도움을 줄 수 있다."], ans: ["N", "Y", "Y"] },
    { id: "3-10", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\n______은 Microsoft 지원 엔지니어가 조직의 Exchange Online, SharePoint Online, OneDrive for Business에 저장된 데이터에 접근할 수 있도록 허용하는 데 사용된다.", ans: "A", opts: ["Customer Lockbox", "Information barriers", "Privileged Access Management (PAM)", "Sensitivity labels"] },
    { id: "3-11", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\n사용자가 애플리케이션 또는 서비스에 접근하려고 할 때, ______(이)가 그들의 접근 수준을 결정한다.", ans: "D", opts: ["administration", "auditing", "authentication", "authorization"] },
    { id: "3-12", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Exchange에서 Information Barriers(정보 장벽)을 사용할 수 있다.", "Microsoft SharePoint에서 Information Barriers를 사용할 수 있다.", "Microsoft Teams에서 Information Barriers를 사용할 수 있다."], ans: ["N", "Y", "Y"] },
    { id: "3-13", type: "radio", q: "다음 중 특정 조건에 따라 콘텐츠를 자동으로 암호화할 수 있는 Microsoft 365 컴플라이언스 기능은 무엇인가?", ans: "B", opts: ["Content Search", "Sensitivity labels", "Retention policies", "eDiscovery"] },
    { id: "3-14", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Sentinel의 데이터 커넥터는 Microsoft 서비스만 지원한다.", "Azure Monitor Workbooks를 사용하여 Microsoft Sentinel이 수집한 데이터를 모니터링할 수 있다.", "Hunting 기능은 경고(Alert)가 발생하기 전에 보안 위협을 식별할 수 있는 기능을 제공한다."], ans: ["N", "Y", "Y"] },
    { id: "3-15", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["모든 Azure Active Directory(Azure AD) 라이선스 에디션은 동일한 기능을 제공한다.", "Azure 포털을 사용하여 Azure Active Directory(Azure AD) 테넌트를 관리할 수 있다.", "Azure Active Directory(Azure AD) 테넌트를 호스팅하기 위해 Azure 가상 머신(Azure VM)을 배포해야 한다."], ans: ["N", "Y", "N"] },
    { id: "3-16", type: "radio", q: "여러 사용자가 사이트에서 파일을 삭제하더라도, Microsoft SharePoint 사이트에 있는 모든 파일의 사본을 1년 동안 유지해야 합니다.\n이를 위해 사이트에 어떤 정책을 적용해야 합니까?", ans: "B", opts: ["데이터 손실 방지(DLP) 정책", "보존(retention) 정책", "내부자 위험(insider risk) 정책", "민감도 레이블(sensitivity label) 정책"] },
    { id: "3-17", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Global administrator(전역 관리자)는 조건부 액세스 정책의 적용을 받지 않는다.", "조건부 액세스 정책은 사용자를 Azure Active Directory(Azure AD) 역할에 추가할 수 있다.", "조건부 액세스 정책은 클라우드 앱에 액세스할 때 다단계 인증(MFA) 사용을 강제할 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "3-18", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["소프트웨어 토큰(Software tokens)은 패스워드리스 인증(passwordless authentication)의 예이다.", "Windows Hello는 패스워드리스 인증의 예이다.", "FIDO2 보안 키(FIDO2 security keys)는 패스워드리스 인증의 예이다."], ans: ["N", "Y", "Y"] },
    { id: "3-19", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["명시적으로 검증(Verify explicitly)은 Zero Trust의 핵심 원칙 중 하나이다.", "침해(사고) 가정(Assume breach)은 Zero Trust의 핵심 원칙 중 하나이다.", "Zero Trust 보안 모델은 방화벽이 내부 네트워크를 외부 위협으로부터 보호한다고 가정한다."], ans: ["Y", "Y", "N"] },
    { id: "3-20", type: "check", q: "Azure Multi-Factor Authentication(MFA)에서 사용할 수 있는 세 가지 인증 방법은 무엇입니까?", ans: ["A", "B", "D"], opts: ["문자 메시지(SMS)", "Microsoft Authenticator 앱", "이메일 인증", "전화 통화", "보안 질문(Security question)"] },
    { id: "3-21", type: "radio", q: "Microsoft 365의 민감도 레이블(Sensitivity Label)의 특징은 무엇입니까?", ans: "A", opts: ["지속적이다(persistent)", "암호화된다(encrypted)", "미리 정의된 카테고리로만 제한된다(restricted to predefined categories)"] },
    { id: "3-22", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하시오.\n\n______(은)는 여러 ID 제공자(identity provider)에 걸쳐서 단일 로그인(SSO) 기능을 제공합니다.", ans: "D", opts: ["A domain controller", "Active Directory Domain Services (AD DS)", "Azure Active Directory (Azure AD) Privilege Identity Management (PIM)", "Federation"] },
    { id: "3-23", type: "radio", q: "Microsoft 365 컴플라이언스 센터에서, Microsoft SharePoint Online 사이트에 있는 문서들 중에서 특정 키워드가 포함된 모든 문서를 찾아내기 위해 어떤 기능을 사용해야 합니까?", ans: "C", opts: ["Audit (감사 로그)", "Compliance Manager", "Content Search (콘텐츠 검색)", "Alerts (알림)"] },
    { id: "3-24", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure AD Connect는 하이브리드 ID를 구현하는 데 사용할 수 있다.", "하이브리드 ID만 두개의 microsoft 365 테넌트 구현을 필요로 한다.", "하이브리드 ID는 Active Directory Domain Service (AD DS)와 Azure AD의 동기화를 필요로 한다."], ans: ["Y", "N", "Y"] },
    { id: "3-25", type: "radio", q: "Microsoft Secure Score for Devices(장치 보안 점수)를 확인하기 위해 어떤 Microsoft Defender 제품을 사용할 수 있습니까?", ans: "B", opts: ["Microsoft Defender for Cloud Apps", "Microsoft Defender for Endpoint", "Microsoft Defender for Identity", "Microsoft Defender for Office 365"] },
    { id: "3-26", type: "radio", q: "어떤 솔루션이 보안 평가(security assessment)를 수행하고, 취약점(vulnerability)이 발견되면 자동으로 경고(alert)를 생성합니까?", ans: "A", opts: ["CSPM (cloud security posture management)", "DevSecOps", "CWPP (cloud workload protection platform)", "SIEM (security information and event management)"] },
    { id: "3-27", type: "radio", q: "Microsoft 365에서 Information Barrier(정보 장벽) 정책을 구현하는 대표적인 사용 사례는 무엇입니까?", ans: "B", opts: ["인증되지 않은 사용자의 Microsoft 365 접근을 제한하기 위해", "조직 내 특정 그룹 간 Microsoft Teams 채팅을 제한하기 위해", "조직 내 특정 그룹 간 Microsoft Exchange Online 이메일을 제한하기 위해", "외부 이메일 수신자에게 데이터 공유를 제한하기 위해"] },
    { id: "3-28", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Conditional Access는 Microsoft Entra ID의 정책을 사용하여 구현된다.", "Conditional Access 정책은 사용자의 디바이스 플랫폼(예: iOS, Android, Windows)에 따라 Microsoft Entra ID 연결을 차단하거나 허용할 수 있다.", "Conditional Access 정책은 Microsoft 365 그룹에 직접 적용할 수 있다."], ans: ["Y", "Y", "N"] },
    { id: "3-29", type: "radio", q: "Conditional Access Session Controls(조건부 액세스 세션 제어)의 기능은 무엇인가?", ans: "B", opts: ["Multi-factor authentication(MFA)을 요청하는 것", "제한된 사용 경험 제공(예: 민감한 정보 다운로드 차단 등)", "디바이스 컴플라이언스 강제", "클라이언트 앱 컴플라이언스 강제"] },
    { id: "3-30", type: "radio", q: "문장을 올바르게 완성하는 답을 선택하세요.\n\nMicrosoft Purview 컴플라이언스 포털에서, 탐색 창에서 기능을 제거하기 위해 사용할 수 있는 것은 ______이다", ans: "B", opts: ["Compliance Manager", "Customize navigation", "Policies", "Settings"] },
    { id: "3-31", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 고르시오.\n\nMicrosoft 365 보안 센터에서 경고(alert)의 영향을 받은 디바이스를 식별하기 위해 사용할 수 있는 것은 무엇입니까?", ans: "B", opts: ["classifications", "incidents", "policies", "Secure score"] },
    { id: "3-32", type: "match", q: "Conditional Access 신호 유형을 올바른 정의와 매칭하시오.", 
      pairs: [
          {t:"User risk", a:"사용자의 ID 또는 계정이 손상되었을 가능성"}, 
          {t:"Sign-in risk", a:"인증 요청이 실제 사용자에 의해 발생한 것이 아닐 가능성"}
      ],
      leftOptions: ["Device", "Location", "Sign-in risk", "User risk"],
      ans: ["사용자의 ID 또는 계정이 손상되었을 가능성", "인증 요청이 실제 사용자에 의해 발생한 것이 아닐 가능성"] 
    },
    { id: "3-33", type: "radio", q: "다음 중 '저장 데이터 암호화(Encryption at rest)'의 예시는 무엇입니까?", ans: "B", opts: ["사이트 간 VPN을 사용하여 통신을 암호화하는 것", "가상 머신 디스크를 암호화하는 것", "HTTPS 암호화 연결을 사용하여 웹사이트에 접속하는 것", "암호화된 이메일을 보내는 것"] },
    { id: "3-34", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Microsoft Intune은 Android 디바이스를 관리하는 데 사용할 수 있다.", "Microsoft Intune은 Azure 구독을 프로비저닝(provision)하는 데 사용할 수 있다.", "Microsoft Intune은 조직 소유 디바이스와 개인 소유 디바이스를 모두 관리하는 데 사용할 수 있다."], ans: ["Y", "N", "Y"] },
    { id: "3-35", type: "radio", q: "직원들의 이력서(Resume) 문서를 식별하려면 어떤 Microsoft 365 컴플라이언스 기능을 사용해야 합니까?", ans: "A", opts: ["사전 학습된 분류기(pre-trained classifiers)", "콘텐츠 탐색기(Content explorer)", "활동 탐색기(Activity explorer)", "eDiscovery 포렌식"] },
    { id: "3-36", type: "radio", q: "문장을 완성하는 정답을 선택하세요.\n\n______(은)는 실시간으로 세션을 제어하기 위해 조건부 액세스 정책을 사용할 수 있습니다.", ans: "D", opts: ["Azure Active Directory (Azure AD) Privileged Identity Management (PIM)", "Microsoft Defender for Cloud", "Microsoft Sentinel", "Microsoft Defender for Cloud Apps"] },
    { id: "3-37", type: "radio", q: "다음 문장을 올바르게 완성하는 답을 선택하세요.\n\n______(은)는 정보 보호, 정보 거버넌스, 데이터 손실 방지(DLP) 정책을 관리하기 위한 중앙 위치를 제공합니다.", ans: "B", opts: ["Azure Defender", "The Microsoft 365 compliance center", "The Microsoft 365 security center", "Microsoft Endpoint Manager"] },
    { id: "3-38", type: "radio", q: "Microsoft Defender for Endpoint에서 공격 표면을 줄여 사이버 위협에 대한 1차 방어선을 제공하는 기능은 무엇인가?", ans: "D", opts: ["automated remediation", "automated investigation", "advanced hunting", "network protection"] },
    { id: "3-39", type: "yn", q: "다음 각 문장에 대해, 문장이 참이면 Yes, 거짓이면 No를 선택하세요.\n참고: 각 문항은 1점입니다.", items: ["Azure AD Identity Protection은 사용자가 인증된 후에 위험 탐지를 생성한다.", "Azure AD Identity Protection은 각 위험 이벤트에 Low, Medium, High의 위험 수준을 할당한다.", "Azure AD Identity Protection의 사용자 위험(User risk)은 특정 사용자 계정이 손상되었을 가능성을 나타낸다."], ans: ["Y", "Y", "Y"] },
    { id: "3-40", type: "check", q: "Microsoft Entra 사용자가 비밀번호를 재설정(SSPR)할 때 사용할 수 있는 인증 방법 3가지는 무엇인가?", ans: ["A", "C", "D"], opts: ["휴대폰 문자 메시지(SMS)", "인증서", "모바일 앱 알림", "보안 질문(Security questions)", "그림 암호(Picture password)"] }
];

let currentMode = '';
let currentQuestions = [];
let userAnswers = {}; 
let matchingState = {}; 
let questionStatus = []; 
let timerInterval;
let examIdNum = 0; 
let mobileCurrentIdx = 0;
let isSubmitted = false;
let isAutoGrade = false; 

function shuffle(array) {
    let copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function goHome() {
    clearInterval(timerInterval);
    document.body.classList.remove('exam-active');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('exam-area').classList.add('hidden');
    document.getElementById('result-modal').style.display = 'none';
    document.getElementById('map-modal').style.display = 'none';
    document.getElementById('mobile-timer-area').style.display = 'none';
    
    // PC 타이머 초기화 (없으면 에러 안 나게 방어 코드)
    const pcTimer = document.getElementById('timer-display');
    if(pcTimer) pcTimer.innerText = "";
    
    document.getElementById('header-title-text').innerText = "☁️ SC-900";
    
    // 다시 풀기 & 자동 채점 숨김
    document.getElementById('retry-btn').classList.add('hidden');
    document.getElementById('auto-grade-wrapper').classList.add('hidden');
    
    // 스크롤 초기화
    window.scrollTo(0,0);
}

// [기능 수정] 다시 풀기 기능 - 초기화 로직 강화 (버그 3번 해결)
function retryExam() {
    if (confirm("현재 상태를 초기화하고 처음부터 다시 시작하시겠습니까?")) {
        // 결과 모달 숨기기
        document.getElementById('result-modal').style.display = 'none';
        
        // 문제 풀이 상태 초기화
        isSubmitted = false;
        userAnswers = {};
        matchingState = {};
        questionStatus = [];
        mobileCurrentIdx = 0;
        
        // 모드에 따라 재시작
        if (currentMode === 'practice') {
            startPractice(examIdNum);
        } else {
            startExam();
        }
    }
}

// [기능 수정] 자동 채점 토글 기능 (버그 2번 해결)
function toggleAutoGrade(el) {
    isAutoGrade = el.checked;
    
    // 1. 이미 푼 문제들에 대해 즉시 피드백 적용
    if (isAutoGrade) {
        currentQuestions.forEach((_, idx) => {
            if (userAnswers[idx]) checkSingle(idx);
        });
    }
    
    // 2. 정답 확인 버튼 표시 여부 갱신 (ON이면 숨김, OFF면 보임)
    // [중요] 모의고사 모드에서만 동작해야 함
    if (currentMode === 'practice') {
        const checkBtns = document.querySelectorAll('.check-btn');
        checkBtns.forEach(btn => {
            btn.style.display = isAutoGrade ? 'none' : 'block';
        });
    }
}

// 1. Practice Mode (모의고사)
function startPractice(examNum) {
    examIdNum = examNum;
    clearInterval(timerInterval);
    currentMode = 'practice';
    document.body.classList.add('exam-active');
    
    // [버그 1, 3 해결] 상태 완전 초기화
    isSubmitted = false;
    userAnswers = {};
    matchingState = {};
    questionStatus = [];
    mobileCurrentIdx = 0;
    
    // 화면 전환
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('exam-area').classList.remove('hidden');
    
    // 타이틀 설정
    document.getElementById('exam-title-display').innerText = `📘 모의고사 ${examNum}회 (연습)`;
    document.getElementById('header-title-text').innerText = `📘 모의고사 ${examNum}회`;
    
    // [버그 2 해결] 자동 채점 옵션 초기화 (OFF 상태로 시작)
    const autoGradeWrapper = document.getElementById('auto-grade-wrapper');
    const autoGradeToggle = document.getElementById('auto-grade-toggle');
    autoGradeWrapper.classList.remove('hidden');
    autoGradeToggle.checked = false; // 체크 해제
    isAutoGrade = false;             // 상태 변수도 false로
    
    // 다시 풀기 버튼은 시작 시 숨김 (완료 후에만 보임)
    document.getElementById('retry-btn').classList.add('hidden');

    // 타이머 숨김 (연습 모드는 타이머 없음)
    document.getElementById('mobile-timer-area').style.display = 'none';
    const pcTimer = document.getElementById('timer-display');
    if(pcTimer) pcTimer.innerText = ""; 

    // 제출 버튼 설정
    const btn = document.getElementById('submit-btn');
    btn.innerText = "제출 및 채점";
    btn.className = "submit-btn";
    btn.onclick = () => finishExam();

    // [버그 1 해결] 문제 필터링 시 숫자를 문자로 변환하여 비교
    // examNum이 숫자일 수도 있고 문자일 수도 있어서 확실하게 처리
    const examQs = allQuestions.filter(q => q.id.startsWith(String(examNum) + "-"));
    
    if (examQs.length === 0) {
        alert("문제 데이터를 불러오지 못했습니다.");
        goHome();
        return;
    }

    currentQuestions = prepareQuestions(examQs);
    renderQuestions(); // 문제 렌더링
    initMobileView();  // 모바일 뷰 초기화
    
    window.scrollTo(0,0);
}

// 2. Exam Mode (실전 시험)
function startExam() {
    examIdNum = 0; 
    clearInterval(timerInterval);
    currentMode = 'exam';
    document.body.classList.add('exam-active');

    // 상태 초기화
    isSubmitted = false;
    userAnswers = {};
    matchingState = {};
    questionStatus = [];
    mobileCurrentIdx = 0;

    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('exam-area').classList.remove('hidden');
    
    document.getElementById('exam-title-display').innerText = `⏱️ 실전 모의고사 (40문제)`;
    document.getElementById('header-title-text').innerText = `⏱️ 실전 모의고사`;

    // 실전 모드에서는 자동 채점 숨김 & 강제 OFF
    document.getElementById('auto-grade-wrapper').classList.add('hidden');
    isAutoGrade = false;
    
    document.getElementById('retry-btn').classList.add('hidden');

    const btn = document.getElementById('submit-btn');
    btn.innerText = "제출 및 채점";
    btn.className = "submit-btn";
    btn.onclick = () => finishExam();

    let pool = [...allQuestions];
    pool = shuffle(pool);
    currentQuestions = prepareQuestions(pool.slice(0, 40));
    
    renderQuestions(); 
    startTimer(45 * 60); // [버그 4 해결] 타이머 시작
    initMobileView();
    
    window.scrollTo(0,0);
}

function prepareQuestions(qs) {
    // 원본 배열을 건드리지 않기 위해 깊은 복사는 아니지만 껍데기 복사 후 셔플
    let shuffledQs = shuffle([...qs]);
    
    // 옵션 셔플 (정답 추적을 위해 correctTexts 미리 계산)
    shuffledQs.forEach(q => {
        if(q.type === 'radio' || q.type === 'check') {
            const correctIndices = Array.isArray(q.ans) ? q.ans.map(a => a.charCodeAt(0)-65) : [q.ans.charCodeAt(0)-65];
            q.correctTexts = correctIndices.map(i => q.opts[i]); 
            q.shuffledOpts = shuffle([...q.opts]); 
        } else if (q.type === 'match') {
            q.shuffledDefs = shuffle(q.pairs.map(p => p.a));
            if (q.leftOptions) q.shuffledLeft = shuffle([...q.leftOptions]);
        }
    });
    return shuffledQs;
}

// [버그 4 해결] 타이머 로직 수정 - ID 매칭
function startTimer(seconds) {
    // HTML에서 id="timer-display"를 찾음
    const display = document.getElementById('timer-display');
    const mobileDisplay = document.getElementById('mobile-timer-area');
    
    // 모바일 타이머 보이기
    mobileDisplay.style.display = 'block';

    let remain = seconds;
    updateDisplay();
    
    timerInterval = setInterval(() => {
        remain--;
        if(remain <= 0) {
            clearInterval(timerInterval);
            finishExam(true);
        }
        updateDisplay();
    }, 1000);

    function updateDisplay() {
        const m = Math.floor(remain / 60);
        const s = remain % 60;
        const txt = `${m}:${s < 10 ? '0' : ''}${s}`;
        
        // PC 화면에 타이머 업데이트 (요소가 있을 때만)
        if(display) {
            display.innerText = txt;
            if(remain < 300) display.style.color = 'var(--error)';
            else display.style.color = '#333';
        }

        // 모바일 화면 업데이트
        mobileDisplay.innerText = txt;
        if(remain < 300) {
            mobileDisplay.style.color = 'var(--error)';
            mobileDisplay.style.background = '#ffe6e6';
        } else {
            mobileDisplay.style.color = 'var(--error)';
            mobileDisplay.style.background = '#fff0f0';
        }
    }
}

function renderQuestions() {
    const container = document.getElementById('question-list');
    container.innerHTML = ""; // 기존 내용 싹 비우기 (초기화 핵심)

    currentQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'q-card';
        div.id = `card-${idx}`;
        
        let html = `<div class="q-text">${idx+1}. ${q.q}</div>`;
        
        if (q.type === 'radio') {
            html += `<div class="options">`;
            q.shuffledOpts.forEach(opt => {
                html += `<label><input type="radio" name="q-${idx}" value="${opt}" onchange="saveAns(${idx}, '${opt}')"> <span>${opt}</span></label>`;
            });
            html += `</div>`;
        } else if (q.type === 'check') {
            html += `<div class="options">`;
            q.shuffledOpts.forEach(opt => {
                html += `<label><input type="checkbox" name="q-${idx}" value="${opt}" onchange="saveCheck(${idx}, this)"> <span>${opt}</span></label>`;
            });
            html += `</div>`;
        } else if (q.type === 'yn') {
            q.items.forEach((item, i) => {
                html += `
                <div class="yn-item">
                    <div class="yn-text">${item}</div>
                    <div class="yn-group">
                        <input type="radio" id="yn-${idx}-${i}-y" name="q-${idx}-${i}" value="Y" class="yn-input" onchange="saveYn(${idx}, ${i}, 'Y')">
                        <label for="yn-${idx}-${i}-y" class="yn-btn">Yes</label>
                        
                        <input type="radio" id="yn-${idx}-${i}-n" name="q-${idx}-${i}" value="N" class="yn-input" onchange="saveYn(${idx}, ${i}, 'N')">
                        <label for="yn-${idx}-${i}-n" class="yn-btn">No</label>
                    </div>
                </div>`;
            });
        } else if (q.type === 'match') {
            matchingState[idx] = { selectedKey: null, connections: {} };
            const leftItems = q.shuffledLeft || q.pairs.map(p => p.t);
            html += `<div class="match-wrapper">
                <div class="match-col match-keys" id="match-keys-${idx}">
                    <div class="match-header">항목 (선택)</div>
                    ${leftItems.map(key => `<div class="match-item" onclick="matchSelectKey(${idx}, '${key}', this)">${key}</div>`).join('')}
                </div>
                <div class="match-divider">➜</div>
                <div class="match-col match-vals" id="match-vals-${idx}">
                    <div class="match-header">설명 (연결 대상)</div>
                    ${q.shuffledDefs.map(def => `<div class="match-item" onclick="matchSelectVal(${idx}, '${def}', this)">${def}</div>`).join('')}
                </div>
            </div>`;
        }
        
        // 피드백 영역
        html += `<div id="feedback-${idx}" class="feedback hidden"></div>`;

        // [버그 2 해결] 정답 확인 버튼 표시 로직
        // 연습 모드이고, 자동 채점이 꺼져 있을 때만 보여야 함
        if (currentMode === 'practice') {
             const btnStyle = isAutoGrade ? 'display:none;' : 'display:block;';
             html += `<button class="check-btn" style="${btnStyle}" onclick="checkSingle(${idx})">✅ 정답 확인</button>`;
        }

        div.innerHTML = html;
        container.appendChild(div);
    });
}

function saveAns(idx, val) { 
    userAnswers[idx] = val; 
    if(isAutoGrade) checkSingle(idx); 
}
function saveCheck(idx, el) {
    if(!userAnswers[idx]) userAnswers[idx] = [];
    if(el.checked) userAnswers[idx].push(el.value);
    else userAnswers[idx] = userAnswers[idx].filter(x => x !== el.value);
    if(isAutoGrade) checkSingle(idx);
}
function saveYn(idx, subIdx, val) {
    if(!userAnswers[idx]) userAnswers[idx] = {};
    userAnswers[idx][subIdx] = val;
    const q = currentQuestions[idx];
    if(isAutoGrade && Object.keys(userAnswers[idx]).length === q.items.length) checkSingle(idx);
}
function matchSelectKey(idx, key, el) {
    if(isSubmitted) return;
    const state = matchingState[idx];
    if(el.classList.contains('matched')) {
        el.classList.remove('matched');
        el.innerHTML = key; 
        const val = state.connections[key];
        delete state.connections[key];
        const valCols = document.getElementById(`match-vals-${idx}`).children;
        for(let v of valCols) { if(v.innerText === val) v.classList.remove('matched'); }
        if(userAnswers[idx]) delete userAnswers[idx][key];
        return;
    }
    const keys = document.getElementById(`match-keys-${idx}`).children;
    for(let i=1; i<keys.length; i++) keys[i].classList.remove('selected');
    state.selectedKey = key;
    el.classList.add('selected');
}
function matchSelectVal(idx, val, el) {
    if(isSubmitted) return;
    const state = matchingState[idx];
    if(el.classList.contains('matched')) {
        el.classList.remove('matched');
        let ownerKey = null;
        for(let k in state.connections) { if(state.connections[k] === val) ownerKey = k; }
        if(ownerKey) {
            delete state.connections[ownerKey];
            const keys = document.getElementById(`match-keys-${idx}`).children;
            for(let i=1; i<keys.length; i++) {
                if(keys[i].innerText.includes(ownerKey)) {
                    keys[i].classList.remove('matched');
                    keys[i].innerHTML = ownerKey;
                }
            }
            if(userAnswers[idx]) delete userAnswers[idx][ownerKey];
        }
        return;
    }
    if(!state.selectedKey) return; 
    state.connections[state.selectedKey] = val;
    if(!userAnswers[idx]) userAnswers[idx] = {};
    userAnswers[idx][state.selectedKey] = val;
    el.classList.add('matched');
    const keys = document.getElementById(`match-keys-${idx}`).children;
    for(let i=1; i<keys.length; i++) {
        if(keys[i].innerText === state.selectedKey) {
            keys[i].classList.remove('selected'); keys[i].classList.add('matched');
            keys[i].innerHTML += ` <span class="match-badge">↔ ${val}</span>`;
        }
    }
    state.selectedKey = null;
    
    const q = currentQuestions[idx];
    if(isAutoGrade && Object.keys(userAnswers[idx]).length === q.pairs.length) checkSingle(idx);
}

function checkSingle(idx) {
    const q = currentQuestions[idx];
    const user = userAnswers[idx];
    const fbDiv = document.getElementById(`feedback-${idx}`);
    const card = document.getElementById(`card-${idx}`);
    let isCorrect = false;
    let ansText = "";

    if (q.type === 'radio') {
        isCorrect = (user === q.correctTexts[0]);
        ansText = q.correctTexts[0];
    } else if (q.type === 'check') {
        const correctSet = new Set(q.correctTexts);
        const userSet = new Set(user || []);
        isCorrect = (correctSet.size === userSet.size) && [...correctSet].every(x => userSet.has(x));
        ansText = q.correctTexts.join(", ");
    } else if (q.type === 'yn') {
        let allRight = true;
        q.ans.forEach((ans, i) => { if(!user || user[i] !== ans) allRight = false; });
        isCorrect = allRight;
        ansText = q.ans.join(", ");
    } else if (q.type === 'match') {
        let allRight = true;
        q.pairs.forEach(p => {
            const userVal = user ? user[p.t] : null;
            if(userVal !== p.a) allRight = false;
        });
        isCorrect = allRight;
        ansText = q.pairs.map(p => `${p.t} ➜ ${p.a}`).join(" / ");
    }

    fbDiv.classList.remove('hidden');
    if(isCorrect) {
        fbDiv.className = "feedback correct";
        fbDiv.innerText = "정답입니다! 🎉";
        card.classList.add('correct');
        card.classList.remove('wrong');
    } else {
        fbDiv.className = "feedback";
        fbDiv.innerText = `오답입니다. 정답: ${ansText}`;
        card.classList.add('wrong');
        card.classList.remove('correct');
    }
    
    // 자동 채점 모드가 아닐 때만 스크롤 (자동 채점 시에는 스크롤 튀는 현상 방지)
    if(!isAutoGrade && window.innerWidth <= 768) {
        fbDiv.scrollIntoView({behavior: "smooth", block: "center"});
    }
}

function finishExam(timeOut = false) {
    if(isSubmitted) return;
    isSubmitted = true;
    clearInterval(timerInterval);
    let score = 0;
    const totalQ = currentQuestions.length;
    const pointPerQ = 1000 / totalQ;
    
    currentQuestions.forEach((q, idx) => {
        const user = userAnswers[idx];
        let isCorrect = false;
        let ansText = "";

        if (q.type === 'radio') {
            isCorrect = (user === q.correctTexts[0]);
            ansText = q.correctTexts[0];
        } else if (q.type === 'check') {
            const correctSet = new Set(q.correctTexts);
            const userSet = new Set(user || []);
            isCorrect = (correctSet.size === userSet.size) && [...correctSet].every(x => userSet.has(x));
            ansText = q.correctTexts.join(", ");
        } else if (q.type === 'yn') {
            let allRight = true;
            q.ans.forEach((ans, i) => { if(!user || user[i] !== ans) allRight = false; });
            isCorrect = allRight;
            ansText = q.ans.join(", ");
        } else if (q.type === 'match') {
            let allRight = true;
            q.pairs.forEach(p => {
                const userVal = user ? user[p.t] : null;
                if(userVal !== p.a) allRight = false;
            });
            isCorrect = allRight;
            ansText = q.pairs.map(p => `${p.t} ➜ ${p.a}`).join(" / ");
        }

        const card = document.getElementById(`card-${idx}`);
        if(isCorrect) {
            score += pointPerQ;
            card.classList.add('correct');
            questionStatus[idx] = 'correct';
        } else {
            card.classList.add('wrong');
            questionStatus[idx] = 'wrong';
            // 이미 피드백이 있으면(자동채점 등) 중복 생성 방지
            if (!card.querySelector('.feedback') || card.querySelector('.feedback').innerText === "") {
                const fb = document.createElement('div');
                fb.className = 'feedback';
                fb.innerText = `오답입니다. 정답: ${ansText}`;
                card.appendChild(fb);
            }
        }
    });

    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const scoreDiv = document.getElementById('result-score');
    const msg = document.getElementById('result-msg');
    
    modal.style.display = 'flex';
    score = Math.round(score);
    scoreDiv.innerText = `${score}점`;
    
    if(timeOut) title.innerText = "시간 종료!";
    else title.innerText = "시험 결과";

    if(score >= 700) {
        scoreDiv.className = 'score-display pass';
        msg.innerText = "합격입니다! 🎉";
    } else {
        scoreDiv.className = 'score-display fail';
        msg.innerText = "불합격입니다. 다시 도전해보세요!";
    }
    
    // 완료 후 다시 풀기 버튼 표시
    document.getElementById('retry-btn').classList.remove('hidden');
    
    updateMobileDisplay();
}

function closeModalAndReview() {
    document.getElementById('result-modal').style.display = 'none';
}

function openMapModal() {
    const modal = document.getElementById('map-modal');
    const grid = document.getElementById('map-grid');
    grid.innerHTML = "";
    
    currentQuestions.forEach((_, idx) => {
        const div = document.createElement('div');
        div.className = 'map-item';
        div.innerText = idx + 1;
        
        if(idx === mobileCurrentIdx) div.classList.add('current');
        
        if(isSubmitted) {
            if(questionStatus[idx] === 'correct') div.classList.add('correct');
            else if(questionStatus[idx] === 'wrong') div.classList.add('wrong');
        } else {
            if(userAnswers[idx]) div.classList.add('done');
        }
        
        div.onclick = () => {
            mobileCurrentIdx = idx;
            updateMobileDisplay();
            closeMapModal();
        };
        grid.appendChild(div);
    });
    
    modal.style.display = 'flex';
}

function closeMapModal() {
    document.getElementById('map-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

// [추가 기능] 모바일 이전/다음 버튼 동작을 위한 함수 (필수)
// 이 함수가 없어서 버튼을 눌러도 반응이 없었던 거임.
function moveQuestion(step) {
    const newIdx = mobileCurrentIdx + step;
    // 인덱스 범위 체크 (0보다 작거나 전체 문제 수보다 크면 안됨)
    if (newIdx >= 0 && newIdx < currentQuestions.length) {
        mobileCurrentIdx = newIdx;
        updateMobileDisplay();
    }
}

function initMobileView() {
    mobileCurrentIdx = 0;
    updateMobileDisplay();
}

function updateMobileDisplay() {
    const cards = document.querySelectorAll('.q-card');
    cards.forEach((card, idx) => {
        if(idx === mobileCurrentIdx) {
            card.classList.add('active');
            card.style.display = 'block'; 
        } else {
            card.classList.remove('active');
            card.style.display = ''; 
        }
    });

    const total = currentQuestions.length;
    document.getElementById('mob-indicator').innerText = `${mobileCurrentIdx + 1} / ${total}`;

    const prevBtn = document.getElementById('mob-prev-btn');
    const nextBtn = document.getElementById('mob-next-btn');

    prevBtn.disabled = (mobileCurrentIdx === 0);

    if (mobileCurrentIdx === total - 1) {
        if(isSubmitted) {
            nextBtn.innerText = "홈으로";
            nextBtn.onclick = () => { 
                if(confirm("메인 화면으로 돌아가시겠습니까?")) goHome(); 
            };
        } else {
            nextBtn.innerText = "제출";
            nextBtn.style.background = "var(--success)";
            nextBtn.onclick = () => {
                 if(confirm("제출하시겠습니까?")) finishExam(); 
            };
        }
    } else {
        nextBtn.innerText = "다음 ▶";
        nextBtn.style.background = ""; 
        nextBtn.onclick = () => moveQuestion(1);
    }
    
    // 모바일 뷰 업데이트 시 스크롤 최상단으로 (사용성 개선)
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// --------------------------------------------------------------------------------
// [Part 2] 개념 사전 로직 (asd.html Script & Integration Logic)
// --------------------------------------------------------------------------------

// 1. 개념 검색 필터링 함수
function filterConcepts() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const items = document.getElementsByClassName('concept-item');
    const categories = document.getElementsByClassName('category-block');

    for (let i = 0; i < items.length; i++) {
        const term = items[i].getElementsByClassName('term')[0];
        const def = items[i].getElementsByClassName('definition')[0];
        const point = items[i].getElementsByClassName('exam-point')[0];
        
        const txtValue = (term.textContent || term.innerText) + " " + 
                         (def.textContent || def.innerText) + " " +
                         (point ? (point.textContent || point.innerText) : "");

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
    
    // Hide empty categories
    for (let cat of categories) {
        const visibleItems = cat.querySelectorAll('.concept-item:not([style*="display: none"])');
        cat.style.display = visibleItems.length > 0 ? "" : "none";
    }
}

// 2. 통합 뷰 전환 함수
function showConceptView() {
    document.getElementById('main-app-view').style.display = 'none';
    document.getElementById('concept-view').style.display = 'block';
    window.scrollTo(0,0);
}

function hideConceptView() {
    document.getElementById('concept-view').style.display = 'none';
    document.getElementById('main-app-view').style.display = 'block';
}
