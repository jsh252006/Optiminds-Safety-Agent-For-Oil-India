import { SafetyDocument, ReportAnalysisResult, IncidentReport } from './types';

export const mockDocuments: SafetyDocument[] = [];

export const mockIncidentReports: IncidentReport[] = [
  {
    id: 'inc-001',
    title: 'High Pressure Flange Hiss & Minor Hydrocarbon Seep at Duliajan GCS',
    description: 'During scheduled hydrotesting and pressurization of the Stage-2 discharge line, operators observed hissing sounds from blind flange BF-104 and minor liquid droplet formation before depressurization.',
    createdAt: '2026-09-08T10:30:00.000Z',
    date: '2026-09-08',
    site: 'Duliajan Gas Compressor Station',
    location: 'Compressor Bay 2 - Stage 2 Discharge Header',
    asset: 'Discharge Header Line HP-402',
    activity: 'Gas Compression & Hydrotesting',
    eventCategory: 'Process Safety',
    reportType: 'Near Miss / LOPC',
    incidentSeverity: 'Critical',
    contractor: 'Apex Heavy Engineering Ltd',
    sourceOfReport: 'Field Safety Audit',
    userId: 'user-lead-hse-01',
    userName: 'Rahul Sharma (Lead HSE)',
    userEmail: 'r.sharma@oilindia.in',
    analysis: {
      rulesChecked: 18,
      potentialIssues: 3,
      highPriorityIssues: 2,
      insufficientEvidence: 1,
      riskScore: 85,
      trendCategory: 'Process Safety & Containment',
      sifPotential: 'High',
      sifClassification: 'Potential SIF',
      sifConfidence: 92,
      sifExplanation: {
        reasoning: 'Loss of primary containment on high-pressure hydrocarbon manifold with nearby ignition potential during hot turnaround operations.',
        evidence: ['Hissing sound at blind flange BF-104', 'Pressure above 45 bar during test sequence', 'Delayed depressurization notice']
      },
      barrierConcerns: [
        { id: 'b-1', barrier: 'Pressure Containment & Flange Gasket Integrity', concern: 'Torque specification verification missing in pre-test log', riskLevel: 'HIGH', evidence: 'Flange bolt tightening log lacked dual-witness signature' },
        { id: 'b-2', barrier: 'Emergency Isolation Valve Response', concern: 'Isolation distance exceeded minimum standard boundary', riskLevel: 'MEDIUM', evidence: 'Temporary line barricade set at 15m instead of standard 25m' }
      ],
      precursors: [
        { id: 'p-1', category: 'Mechanical Integrity', signal: 'Vibration-induced bolt loosening on high-frequency discharge header', evidence: 'Vibration monitoring showed 4.2 mm/s amplitude prior to test' }
      ],
      findings: [
        {
          id: 'f-1',
          finding: 'Flange bolt torquing procedure not signed off prior to pressurization.',
          requirement: 'OISD-STD-118 Section 6.4: All high-pressure flange assemblies must have documented torque verification by certified inspector.',
          source: 'OISD-STD-118 (Pressure Piping Systems)',
          severity: 'HIGH',
          confidenceLevel: 'HIGH',
          evidence: 'Shift handover sheet showed incomplete torque audit for Flange BF-104.',
          recommendedAction: 'Immediate re-torque with calibrated hydraulic wrench and mandatory sign-off.',
          explainableMatch: {
            reportEvidence: 'Incomplete torque audit for Flange BF-104',
            matchedConcepts: ['flange torque', 'high pressure', 'OISD-STD-118', 'pressure test'],
            applicableTopic: 'Pressure Containment Verification',
            source: 'OISD-STD-118'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'High Pressure Gas Release & Jet Fire',
          precautions: [
            'Depressurize manifold to zero before inspecting or re-torquing flange.',
            'Maintain continuous LEL gas monitoring with calibrated portable detectors.',
            'Enforce exclusion zone of minimum 25 meters with physical red perimeter tape.'
          ],
          source: 'OISD-GDN-169 / OIL HSE Standard 12'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-1', text: 'Conduct hydraulic torque re-verification on all Stage-2 manifold flanges', status: 'COMPLETED', dateCompleted: '2026-09-09T14:00:00.000Z' },
      { id: 'act-2', text: 'Issue contractor procedural warning regarding pre-test sign-offs', status: 'PENDING' },
      { id: 'act-3', text: 'Update vibration acoustic monitoring sensor on header HP-402', status: 'PENDING' }
    ]
  },
  {
    id: 'inc-002',
    title: 'Scaffold Toe-Board Failure near Cat-Cracker Column at Digboi Refinery',
    description: 'During replacement of insulation cladding at elevated tower platform (Level 4, 18m height), an unanchored steel clamp fell through a 40mm scaffold gap between deck and kickplate, impacting empty ground safety net.',
    createdAt: '2026-09-10T14:15:00.000Z',
    date: '2026-09-10',
    site: 'Digboi Refinery Unit 2',
    location: 'FCCU Reactor Column Platform Level 4',
    asset: 'FCCU Main Column C-201',
    activity: 'Working at Height Maintenance',
    eventCategory: 'Fall Hazard & Dropped Objects',
    reportType: 'Dropped Object Near-Miss',
    incidentSeverity: 'High',
    contractor: 'Brahmaputra Industrial Services',
    sourceOfReport: 'HSE Safety Walk',
    userId: 'user-lead-hse-02',
    userName: 'Priya Patel (Refinery Tech)',
    userEmail: 'p.patel@oilindia.in',
    analysis: {
      rulesChecked: 15,
      potentialIssues: 2,
      highPriorityIssues: 1,
      insufficientEvidence: 2,
      riskScore: 78,
      trendCategory: 'Working at Heights & DROPS',
      sifPotential: 'High',
      sifClassification: 'Potential SIF',
      sifConfidence: 88,
      sifExplanation: {
        reasoning: 'Dropped 2.4 kg clamp from 18 meters possesses fatal kinetic impact energy (>150 Joules) without barricaded exclusion floor below.',
        evidence: ['Fall height of 18 meters', 'Clamp weight 2.4 kg', 'Pedestrian walkway adjacent to net drop zone']
      },
      barrierConcerns: [
        { id: 'b-3', barrier: 'Drops Prevention & Gap Enclosures', concern: 'Toe-board gap exceeded 15mm maximum allowable threshold', riskLevel: 'HIGH', evidence: '40mm gap observed along northern perimeter of scaffold deck' }
      ],
      precursors: [
        { id: 'p-2', category: 'Physical Housekeeping', signal: 'Loose un-tethered hand tools stored directly on platform decking', evidence: 'Three un-tethered ratchet wrenches found near scaffold edge' }
      ],
      findings: [
        {
          id: 'f-3',
          finding: 'Scaffolding toe-board gap exceeded standard tolerance of 15mm.',
          requirement: 'OISD-STD-192: Working platforms must be fully boarded with kickplates fitted snug to prevent object slippage.',
          source: 'OISD-STD-192 (Safety in Scaffoldings)',
          severity: 'HIGH',
          confidenceLevel: 'HIGH',
          evidence: 'Measurement confirmed 40mm gap along platform perimeter.',
          recommendedAction: 'Install secondary mesh netting beneath platform and replace defective kickboards.',
          explainableMatch: {
            reportEvidence: '40mm scaffold gap between deck and kickplate',
            matchedConcepts: ['scaffold', 'toe-board', 'gap', 'dropped object', 'OISD-STD-192'],
            applicableTopic: 'Scaffold Integrity & Drops Prevention',
            source: 'OISD-STD-192'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'Dropped Objects from Elevated Structures',
          precautions: [
            'Enforce 100% tool tethering protocol above 2 meters height.',
            'Install debris containment containment mesh (catch nets) along platform edges.',
            'Establish hard barricades with warning signs on lower grade walkway.'
          ],
          source: 'OISD-STD-192 / DROPS Best Practice Manual'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-4', text: 'Fit wire-mesh secondary skirts along all FCCU platform decks', status: 'COMPLETED', dateCompleted: '2026-09-11T16:30:00.000Z' },
      { id: 'act-5', text: 'Mandate certified tool lanyards for all insulation contractors', status: 'COMPLETED', dateCompleted: '2026-09-12T09:00:00.000Z' }
    ]
  },
  {
    id: 'inc-003',
    title: 'H2S Portable Gas Detector Bump-Test Lapsed on Rig Floor at Naharkatiya Rig #7',
    description: 'During a surprise HSE spot check on drill floor, 3 out of 6 roughneck four-gas personal detectors were found with calibration / bump-test expiry exceeding 48 hours while tripping pipe in sour gas stratum.',
    createdAt: '2026-09-11T08:45:00.000Z',
    date: '2026-09-11',
    site: 'Naharkatiya Well Rig #7',
    location: 'Drill Floor / Doghouse Entry',
    asset: 'Deep Drilling Rig NHK-07',
    activity: 'Drilling Operations',
    eventCategory: 'Toxic Gas Exposure',
    reportType: 'Safety Non-Conformance',
    incidentSeverity: 'High',
    contractor: 'OIL In-house Rig Crew',
    sourceOfReport: 'Routine Shift Handover Audit',
    userId: 'user-lead-hse-03',
    userName: 'Anand Baruah (Drilling Supv)',
    userEmail: 'a.baruah@oilindia.in',
    analysis: {
      rulesChecked: 14,
      potentialIssues: 2,
      highPriorityIssues: 1,
      insufficientEvidence: 1,
      riskScore: 72,
      trendCategory: 'Toxic Gas & Atmospheric Monitoring',
      sifPotential: 'High',
      sifClassification: 'Potential SIF',
      sifConfidence: 90,
      sifExplanation: {
        reasoning: 'Drilling into sour horizon with unverified H2S detection devices creates immediate fatality hazard upon unexpected gas kick or swabbing.',
        evidence: ['Sour reservoir anticipated H2S > 120 ppm', 'Detectors overdue calibration', 'Tripping out in progress']
      },
      barrierConcerns: [
        { id: 'b-4', barrier: 'Personal Gas Detection & Warning', concern: 'Stationary dock station calibration gas cylinder was depleted', riskLevel: 'HIGH', evidence: 'Docking test station bottle read 0 PSI pressure' }
      ],
      precursors: [
        { id: 'p-3', category: 'Equipment Maintenance', signal: 'Supply chain delay in replacement calibration gas cylinders for remote rig sites', evidence: 'Store requisition pending since 5 days' }
      ],
      findings: [
        {
          id: 'f-4',
          finding: 'Personal multi-gas monitors utilized without mandatory daily bump test.',
          requirement: 'OISD-STD-114 Section 8.3: Atmospheric testing instruments must be bump-tested before each shift in known hazardous or sour environments.',
          source: 'OISD-STD-114 (Hazardous Area Safety)',
          severity: 'HIGH',
          confidenceLevel: 'HIGH',
          evidence: 'Unit display timestamps indicated last valid bump test was 76 hours prior.',
          recommendedAction: 'Suspend tripping pipe until all crew detectors are fresh-docked and validated.',
          explainableMatch: {
            reportEvidence: 'Bump-test expiry exceeding 48 hours in sour gas stratum',
            matchedConcepts: ['H2S detector', 'bump test', 'calibration', 'sour gas', 'OISD-STD-114'],
            applicableTopic: 'Atmospheric Safety & Gas Monitoring',
            source: 'OISD-STD-114'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'H2S Poisoning & Asphyxiation',
          precautions: [
            'Test detectors daily against certified bump gas canister.',
            'Ensure auto-alarm is set at 10 ppm warning and 15 ppm high siren.',
            'Keep emergency 30-minute escape packs accessible on monkey board and drill floor.'
          ],
          source: 'OIL Drilling HSE Manual / OISD-STD-114'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-6', text: 'Re-supply rig dock station with fresh certified H2S test gas bottles', status: 'COMPLETED', dateCompleted: '2026-09-11T12:00:00.000Z' },
      { id: 'act-7', text: 'Institute morning shift electronic badge bump check gate at rig doghouse', status: 'COMPLETED', dateCompleted: '2026-09-12T07:00:00.000Z' }
    ]
  },
  {
    id: 'inc-004',
    title: 'Contractor Hot Work Permit Clearance Discrepancy on Moran Trunkline',
    description: 'Hot work permit for sleeve welding on Crude Trunkline Section 4 lacked formal gas-free certificate attachment; welding was initiated 15 minutes before HSE officer co-signature on site.',
    createdAt: '2026-09-12T11:20:00.000Z',
    date: '2026-09-12',
    site: 'Moran Oil Gathering Station',
    location: 'Trunkline Milepost 18.2 Right-of-Way',
    asset: 'Moran-Duliajan 14-inch Crude Main',
    activity: 'Pipeline Welding',
    eventCategory: 'Permit to Work',
    reportType: 'Procedural Violation',
    incidentSeverity: 'Moderate',
    contractor: 'Eastern Pipeline Constructors',
    sourceOfReport: 'Area Authority Spot Audit',
    userId: 'user-lead-hse-04',
    userName: 'Vikram Gogoi (Pipeline Inspector)',
    userEmail: 'v.gogoi@oilindia.in',
    analysis: {
      rulesChecked: 16,
      potentialIssues: 2,
      highPriorityIssues: 1,
      insufficientEvidence: 2,
      riskScore: 58,
      trendCategory: 'Permit to Work & Isolation Procedures',
      sifPotential: 'Medium',
      sifClassification: 'Requires Review',
      sifConfidence: 82,
      sifExplanation: {
        reasoning: 'Initiating hot work without verified gas clearance exposes pipeline weld zone to potential residual flammable vapors.',
        evidence: ['Absence of signed gas test certificate', 'Welding arc struck before HSE sign-off']
      },
      barrierConcerns: [
        { id: 'b-5', barrier: 'Permit to Work Compliance', concern: 'Contractor foreman bypassed co-signature step under time pressure', riskLevel: 'MEDIUM', evidence: 'Permit issuer signature box was blank during initial arc strike' }
      ],
      precursors: [
        { id: 'p-4', category: 'Human Factors', signal: 'Schedule pressure to conclude welding prior to afternoon seasonal monsoon rains', evidence: 'Foreman statement noted rain clouds approaching' }
      ],
      findings: [
        {
          id: 'f-5',
          finding: 'Hot work initiated without complete dual authorization and recorded combustible gas test.',
          requirement: 'OISD-STD-105: Work permit is invalid until all mandatory pre-requisites including atmospheric testing are signed by both Area Custodian and Safety Inspector.',
          source: 'OISD-STD-105 (Work Permit System)',
          severity: 'HIGH',
          confidenceLevel: 'HIGH',
          evidence: 'Permit form copy lacked HSE endorsement stamp at 11:05 AM inspection.',
          recommendedAction: 'Immediate stop-work order issued. Full tool-box talk and re-issue of permit after verification.',
          explainableMatch: {
            reportEvidence: 'Welding initiated 15 minutes before HSE officer co-signature',
            matchedConcepts: ['hot work permit', 'gas certificate', 'OISD-STD-105', 'Stop Work Authority'],
            applicableTopic: 'Permit-to-Work Compliance',
            source: 'OISD-STD-105'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'Hydrocarbon Vapor Flash Fire',
          precautions: [
            'Enforce Stop Work Authority immediately whenever permit conditions are unmet.',
            'Continuously run 0% LEL sniff check within 10 meters of weld zone.',
            'Position charged 50 kg DCP fire extinguisher with dedicated fire-watcher.'
          ],
          source: 'OISD-STD-105 / OIL Pipeline Safety Code'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-8', text: 'Issue Stop Work Authority notice and conduct contractor stand-down', status: 'COMPLETED', dateCompleted: '2026-09-12T11:45:00.000Z' },
      { id: 'act-9', text: 'Implement digital QR-code permit verification system for pipeline crews', status: 'PENDING' }
    ]
  },
  {
    id: 'inc-005',
    title: 'Unsecured Electrical Junction Box in Hazardous Zone 1 at CTF Substation 4',
    description: 'During a thermographic scan of Central Tank Farm electrical feeders, flameproof junction box JB-12 in Zone 1 crude storage bund was found with 2 missing enclosure bolts and cracked neoprene weather seal.',
    createdAt: '2026-09-13T09:10:00.000Z',
    date: '2026-09-13',
    site: 'CTF Substation #4',
    location: 'Crude Storage Tank T-104 Dike Perimeter',
    asset: 'Junction Box JB-12 (Pump P-401 Feeder)',
    activity: 'Electrical Inspection',
    eventCategory: 'Electrical Hazard',
    reportType: 'Condition Monitoring Defect',
    incidentSeverity: 'Moderate',
    contractor: 'Internal Maintenance',
    sourceOfReport: 'Routine Thermographic Survey',
    userId: 'user-lead-hse-05',
    userName: 'Sunita Phukan (Electrical Engineer)',
    userEmail: 's.phukan@oilindia.in',
    analysis: {
      rulesChecked: 12,
      potentialIssues: 1,
      highPriorityIssues: 1,
      insufficientEvidence: 0,
      riskScore: 48,
      trendCategory: 'Electrical & Hazardous Area Classification',
      sifPotential: 'Low',
      sifClassification: 'Non-SIF',
      sifConfidence: 85,
      barrierConcerns: [
        { id: 'b-6', barrier: 'Ex-d Flameproof Enclosure Integrity', concern: 'Missing bolts compromise certified explosion flame gap tolerance', riskLevel: 'MEDIUM', evidence: 'Two out of eight M8 hex bolts absent' }
      ],
      findings: [
        {
          id: 'f-6',
          finding: 'Flameproof (Ex-d) electrical enclosure integrity compromised by missing fasteners.',
          requirement: 'OISD-STD-113: All certified flameproof enclosures in Zone 1 hazardous areas must maintain all manufacturer specified bolts properly torqued.',
          source: 'OISD-STD-113 (Classification of Hazardous Areas for Electrical Installations)',
          severity: 'HIGH',
          confidenceLevel: 'HIGH',
          evidence: 'Visual photo confirmed two open bolt holes on flange face.',
          recommendedAction: 'De-energize feeder, replace flameproof bolts with certified stainless grade fasteners, and test flame gap.',
          explainableMatch: {
            reportEvidence: 'Missing enclosure bolts and cracked neoprene weather seal',
            matchedConcepts: ['flameproof', 'Zone 1', 'Ex-d', 'OISD-STD-113'],
            applicableTopic: 'Hazardous Area Electrical Safety',
            source: 'OISD-STD-113'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'Arc Flash / Explosive Atmosphere Ignition',
          precautions: [
            'Isolate and lock out / tag out (LOTO) breaker before opening junction box.',
            'Clean machined flame path flanges with approved non-abrasive solvent.',
            'Apply non-hardening grease to flamepath and torque bolts in diagonal sequence.'
          ],
          source: 'OISD-STD-113 / IEC 60079-14'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-10', text: 'Replace missing Ex-d bolts and replace neoprene seal with certified spare', status: 'COMPLETED', dateCompleted: '2026-09-13T15:30:00.000Z' }
    ]
  },
  {
    id: 'inc-006',
    title: 'Near-Miss Chemical Wash Splash During Filter Changeout at Water Injection Plant',
    description: 'While unbolting cartridge filter housing at Duliajan Effluent Water Injection Station, slight residual backpressure sprayed treated biocide water onto operator visor and chemical suit.',
    createdAt: '2026-09-14T15:25:00.000Z',
    date: '2026-09-14',
    site: 'Duliajan Water Injection Station',
    location: 'Filtration Skid Bank B',
    asset: 'Duplex Water Filter F-201B',
    activity: 'Filter Replacement',
    eventCategory: 'Chemical Handling',
    reportType: 'Near Miss',
    incidentSeverity: 'Low',
    contractor: 'Internal Operations',
    sourceOfReport: 'Operator Self-Report',
    userId: 'user-lead-hse-01',
    userName: 'Rahul Sharma (Lead HSE)',
    userEmail: 'r.sharma@oilindia.in',
    analysis: {
      rulesChecked: 10,
      potentialIssues: 1,
      highPriorityIssues: 0,
      insufficientEvidence: 1,
      riskScore: 28,
      trendCategory: 'Chemical Safety & Depressurization',
      sifPotential: 'Low',
      sifClassification: 'Non-SIF',
      sifConfidence: 94,
      barrierConcerns: [
        { id: 'b-7', barrier: 'Filter Bleed Vent Line', concern: 'Bleed valve was partially clogged with scale sediment showing zero pressure false reading', riskLevel: 'LOW', evidence: 'Needle valve orifice obstructed by ferric oxide particles' }
      ],
      findings: [
        {
          id: 'f-7',
          finding: 'Vessel bleed valve gave false impression of depressurization due to scale obstruction.',
          requirement: 'OISD-RP-126: Positive verification of zero energy and clear bleed vents must be established prior to unbolting pressurized liquid filter pots.',
          source: 'OISD-RP-126 (Specific Safety Practices in Production Operations)',
          severity: 'MEDIUM',
          confidenceLevel: 'HIGH',
          evidence: 'Filter pot still retained 0.8 bar hydrostatic head behind clogged vent needle.',
          recommendedAction: 'Install secondary drain valve port on bottom of pot and revise standard operating procedure.',
          explainableMatch: {
            reportEvidence: 'Residual backpressure sprayed treated biocide water',
            matchedConcepts: ['depressurization', 'filter pot', 'clogged vent', 'chemical splash'],
            applicableTopic: 'Hazardous Energy Depressurization',
            source: 'OISD-RP-126'
          }
        }
      ],
      ruleBasedPrecautions: [
        {
          hazard: 'Chemical Splash / Contact Dermatitis',
          precautions: [
            'Wear full face shield, nitrile gloves, and chemical apron during filter maintenance.',
            'Confirm zero pressure through both top vent and bottom drain before loosening clamps.',
            'Ensure emergency eye-wash station within 10 seconds unimpeded travel path.'
          ],
          source: 'OISD-RP-126 / Material Safety Data Sheet (Biocide GL-40)'
        }
      ]
    },
    preventiveActions: [
      { id: 'act-11', text: 'Clean and ream out vent needle valve orifice on all filtration skids', status: 'COMPLETED', dateCompleted: '2026-09-14T17:00:00.000Z' }
    ]
  }
];

export const mockReportAnalysis: ReportAnalysisResult = {
  rulesChecked: 18,
  potentialIssues: 3,
  highPriorityIssues: 2,
  insufficientEvidence: 1,
  riskScore: 85,
  trendCategory: 'Process Safety & Containment',
  sifPotential: 'High',
  sifClassification: 'Potential SIF',
  sifConfidence: 92,
  ruleBasedPrecautions: [
    {
      hazard: 'Gas leak / H2S exposure',
      precautions: [
        'Immediately stop all hot work in the vicinity.',
        'Evacuate personnel to the designated muster point upwind.',
        'Don appropriate breathing apparatus (SCBA) before attempting isolation.',
      ],
      source: 'OISD-STD-114 (Hot Work) / OIL HSE Manual Section 8',
    },
  ],
  findings: [
    {
      id: 'f-1',
      finding: 'Work continued despite abnormal equipment condition (hissing sound near valve).',
      requirement: 'Stop Work Authority must be exercised whenever an abnormal or unsafe condition is detected that poses an immediate threat to life, property, or environment.',
      source: 'OIL HSE Policy - Stop Work Authority (Sec 4.2)',
      severity: 'HIGH',
      confidenceLevel: 'HIGH',
      evidence: '"Operators reported hearing a hissing sound near the main flange but proceeded with the welding activity to meet the deadline."',
      recommendedAction: 'Mandatory retraining of the crew on Stop Work Authority. Implement strict supervisory sign-off for abnormal conditions.',
      explainableMatch: {
        reportEvidence: 'Operators reported hearing a hissing sound near the main flange but proceeded with the welding activity...',
        matchedConcepts: ['hissing sound', 'continued work', 'welding/hot work', 'abnormal condition'],
        applicableTopic: 'Stop Work Authority / Hot Work near potential leaks',
        source: 'OIL HSE Policy (Stop Work) & OISD-STD-105',
      },
    }
  ]
};

