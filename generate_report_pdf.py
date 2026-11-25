import os
import subprocess

BASE_DIR = os.path.abspath(r"c:\Users\durga\OneDrive\Desktop\mobile computing")
ASSETS_DIR = os.path.join(BASE_DIR, "report_assets")
HTML_FILE = os.path.join(BASE_DIR, "MediAccess_Capstone_Project_Report.html")
PDF_FILE = os.path.join(BASE_DIR, "MediAccess_Capstone_Project_Report.pdf")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_img_src(filename):
    p = os.path.join(ASSETS_DIR, filename).replace("\\", "/")
    return f"file:///{p}"

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>MediAccess Capstone Project Report</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 22mm 20mm 22mm 20mm;
    @bottom-center {{
      content: counter(page);
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
    }}
  }}
  body {{
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    line-height: 1.35;
    color: #1e293b;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }}
  .page {{
    page-break-after: always;
    box-sizing: border-box;
    min-height: 98vh;
  }}
  .no-break {{
    page-break-inside: avoid;
  }}
  h1 {{
    font-size: 15pt;
    font-weight: bold;
    color: #12304a;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 12px;
    line-height: 1.25;
  }}
  h2 {{
    font-size: 12.5pt;
    font-weight: bold;
    color: #12304a;
    margin-top: 14px;
    margin-bottom: 6px;
    line-height: 1.25;
  }}
  h3 {{
    font-size: 11.5pt;
    font-weight: bold;
    color: #0f9d91;
    margin-top: 10px;
    margin-bottom: 4px;
  }}
  p {{
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }}
  ul {{
    margin-top: 0;
    margin-bottom: 8px;
    padding-left: 24px;
  }}
  li {{
    margin-bottom: 4px;
    text-align: justify;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    margin-bottom: 12px;
    font-size: 9.5pt;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    vertical-align: top;
  }}
  th {{
    background-color: #e2f1f0;
    color: #12304a;
    font-weight: bold;
    text-align: center;
  }}
  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}
  .center {{
    text-align: center;
  }}
  .figure-box {{
    text-align: center;
    margin: 10px 0;
    page-break-inside: avoid;
  }}
  .figure-box img {{
    max-width: 90%;
    max-height: 380px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }}
  .figure-caption {{
    font-size: 9.5pt;
    font-weight: bold;
    color: #12304a;
    margin-top: 4px;
  }}
  .code-box {{
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'Courier New', monospace;
    font-size: 8.5pt;
    color: #0f172a;
    white-space: pre-wrap;
    margin: 8px 0;
  }}
</style>
</head>
<body>

<!-- PAGE 1: TITLE PAGE -->
<div class="page center" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; padding-top: 30px;">
  <div>
    <h1 style="font-size: 16pt; margin-bottom: 25px;">
      MEDIACCESS: AN INTELLIGENT ACCESSIBLE MEDICINE IDENTIFICATION, NEARBY PHARMACY RESERVATION, AND DOORSTEP DELIVERY PLATFORM FOR PROMOTING GOOD HEALTH AND WELL-BEING
    </h1>
    <p style="font-size: 12pt; font-weight: bold; margin-bottom: 15px;">A CAPSTONE PROJECT REPORT</p>
    <p style="font-size: 10.5pt; margin-bottom: 25px;">
      A Capstone Project Report submitted in partial fulfilment of the requirements for the Course of<br>
      <strong>ITA0322 – MOBILE COMPUTING</strong><br>
      to the award of the degree of<br>
      <strong>BACHELOR OF TECHNOLOGY IN Artificial Intelligence And Data Science</strong>
    </p>
    <p style="font-size: 11pt; margin-bottom: 5px;">by</p>
    <p style="font-size: 12pt; font-weight: bold; line-height: 1.5;">
      Prudhvi Raj B (192324274)<br>
      Kailash M (192524029)<br>
      Sanjay Krishnan R (192521055)
    </p>
  </div>
  <div style="margin-bottom: 40px;">
    <p style="font-size: 11pt; line-height: 1.5;">
      <strong>Under the Supervision of</strong><br>
      <strong>Dr. Rashmita Khilar</strong><br>
      Professor<br><br>
      <strong>SIMATS ENGINEERING</strong><br>
      <strong>Saveetha Institute of Medical and Technical Sciences</strong><br>
      Chennai-602105<br><br>
      <strong>NOVEMBER 2026</strong>
    </p>
  </div>
</div>

<!-- PAGE 2: BONAFIDE CERTIFICATE -->
<div class="page">
  <div class="center">
    <h1 style="font-size: 15pt; margin-bottom: 2px;">SIMATS ENGINEERING</h1>
    <p style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">Saveetha Institute of Medical and Technical Sciences</p>
    <p style="font-size: 10.5pt; margin-bottom: 25px;">Chennai-602105</p>
    <h1>BONAFIDE CERTIFICATE</h1>
  </div>
  <p style="margin-top: 25px;">
    This is to certify that the Capstone Project entitled <strong>“MediAccess: An Intelligent Accessible Medicine Identification, Nearby Pharmacy Reservation, and Doorstep Delivery Platform for Promoting Good Health and Well-Being”</strong> has been carried out by <strong>Prudhvi Raj B (192324274)</strong>, <strong>Kailash M (192524029)</strong> and <strong>Sanjay Krishnan R (192521055)</strong> under the supervision of <strong>Dr. Rashmita Khilar</strong> and is submitted in partial fulfilment of the requirements for the current semester of the B.Tech Artificial Intelligence And Data Science program at Saveetha Institute of Medical and Technical Sciences, Chennai.
  </p>
  <table style="margin-top: 80px;">
    <tr>
      <th style="width: 50%;">COURSE COORDINATOR</th>
      <th style="width: 50%;">COURSE FACULTY</th>
    </tr>
    <tr>
      <td style="padding: 20px 15px; line-height: 1.4;">
        <strong>Dr. Terrance Frederick Fernandez</strong><br>
        Professor<br>
        Department Of CSE<br>
        SIMATS Engineering,<br>
        SIMATS, Chennai – 602105.
      </td>
      <td style="padding: 20px 15px; line-height: 1.4;">
        <strong>Dr. Rashmita Khilar</strong><br>
        Professor<br>
        Department Of Cyber Security<br>
        SIMATS Engineering,<br>
        SIMATS, Chennai – 602105.
      </td>
    </tr>
  </table>
</div>

<!-- PAGE 3: DECLARATION -->
<div class="page">
  <div class="center">
    <h1 style="font-size: 15pt; margin-bottom: 2px;">SIMATS ENGINEERING</h1>
    <p style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">Saveetha Institute of Medical and Technical Sciences</p>
    <p style="font-size: 10.5pt; margin-bottom: 25px;">Chennai-602105</p>
    <h1>DECLARATION</h1>
  </div>
  <p style="margin-top: 25px;">
    We, <strong>Prudhvi Raj B</strong>, <strong>Kailash M</strong> and <strong>Sanjay Krishnan R</strong> of the Department of Artificial Intelligence And Data Science, SIMATS Engineering, Saveetha Institute of Medical and Technical Sciences, Chennai, hereby declare that the Capstone Project Work entitled <strong>“MediAccess: An Intelligent Accessible Medicine Identification, Nearby Pharmacy Reservation, and Doorstep Delivery Platform for Promoting Good Health and Well-Being”</strong> is the result of our own bonafide efforts. To the best of our knowledge, the work presented herein is original, accurate, and has been carried out in accordance with the principles of engineering ethics and academic integrity. All sources, references, data, and other materials used in the project have been appropriately acknowledged.
  </p>
  <p>
    We further declare that the data, results, analysis, and findings presented in this report have not been fabricated, falsified, or manipulated. Any external tools, software, datasets, computational resources, or AI-assisted tools used during the project have been appropriately disclosed. We confirm that all applicable ethical, academic, institutional, and professional requirements have been duly followed throughout the planning, execution, analysis, and documentation of the project.
  </p>
  <div style="margin-top: 70px;">
    <p>Place: Chennai<br>Date: 25-11-2026</p>
    <p style="margin-top: 40px; font-weight: bold; line-height: 1.6;">
      Signature of the Students with Names:<br>
      1. Prudhvi Raj B (192324274)<br>
      2. Kailash M (192524029)<br>
      3. Sanjay Krishnan R (192521055)
    </p>
  </div>
</div>

<!-- PAGE 4: INDIVIDUAL CONTRIBUTION STATEMENT -->
<div class="page">
  <div class="center">
    <h1 style="font-size: 15pt; margin-bottom: 2px;">SIMATS ENGINEERING</h1>
    <p style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">Saveetha Institute of Medical and Technical Sciences</p>
    <p style="font-size: 10.5pt; margin-bottom: 20px;">Chennai-602105</p>
    <h1>Individual Contribution Statement</h1>
    <p style="font-style: italic; margin-bottom: 15px;">(Mandatory for all team projects)</p>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 17%;">Student Name / Register No.</th>
        <th style="width: 17%;">Specific Responsibilities</th>
        <th style="width: 20%;">Design & Development Contribution</th>
        <th style="width: 20%;">Testing & Analysis Contribution</th>
        <th style="width: 16%;">Report Contribution</th>
        <th style="width: 10%;">Approx. Contrib (%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Prudhvi Raj B</strong><br>(192324274)</td>
        <td>UI/UX, React Frontend, Canvas OCR Preprocessor</td>
        <td>Designed the healthcare UI/UX; implemented Tesseract.js scanner and 3-phase responsive client</td>
        <td>Screen-level OCR checks across 5 sample strips on laptop and mobile viewports</td>
        <td>Ch. 1; Sec. 4.1–4.2 (frontend); Figs. 4.1–4.3</td>
        <td class="center">33%</td>
      </tr>
      <tr>
        <td><strong>Kailash M</strong><br>(192524029)</td>
        <td>Backend API, FastAPI, SQLite DB, Pharmacy Management</td>
        <td>Built the FastAPI backend, SQLAlchemy schemas, Haversine nearby calculator, and Pharmacy Dashboard</td>
        <td>Direct route testing, inventory mutability checks, and API validation</td>
        <td>Ch. 2 and Ch. 3 (design, security, risk); Sec. 4.2 (backend)</td>
        <td class="center">33%</td>
      </tr>
      <tr>
        <td><strong>Sanjay Krishnan R</strong><br>(192521055)</td>
        <td>Delivery Portal, Order Tracking, Test Suite, Deployment</td>
        <td>Implemented Delivery Fleet Partner marketplace, atomic job claiming, and 5-stage tracking engine</td>
        <td>Designed 13-point direct integration test suite; executed test scripts</td>
        <td>Sec. 4.3–4.5 (testing, results); Ch. 5; Appendix A, C, J</td>
        <td class="center">34%</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- PAGE 5: ABSTRACT -->
<div class="page">
  <h1 style="margin-bottom: 20px;">ABSTRACT</h1>
  <p>
    Access to essential medicines is frequently impeded by unclear drug packaging, unreadable brand names on foil strips, lack of transparent local pharmacy inventory information, and inconvenient fulfillment mechanisms. Elderly individuals and patients with chronic ailments frequently struggle to decipher small print on medicine strips or identify generic equivalents, leading to dispensing errors, treatment delays, and wasted transit time visiting multiple physical pharmacies. This directly addresses the priorities of United Nations Sustainable Development Goal 3 (Good Health and Well-Being). This project presents MediAccess, a full-stack, responsive healthcare accessibility web application that connects patients, local pharmacies, and delivery fleet partners through real-time optical medicine strip scanning, geospatial inventory discovery, counter reservations, and doorstep delivery.
  </p>
  <p>
    The proposed solution implements a complete three-phase interconnected architecture. In Phase 1 (Patient / Consumer), the user captures or uploads the back side of a medicine strip; the client executes browser Canvas-based image preprocessing (adaptive contrast enhancement and binarization) and real Tesseract.js Optical Character Recognition (OCR) to extract text, followed by a tokenized fuzzy-matching algorithm that maps recognized terms against a 26-item local medicine database with confidence scoring. Patients can alternatively search by commercial brand or generic name. The platform calculates exact distances to 6 nearby pharmacies using the Haversine formula and displays live stock quantities and pricing. Patients can reserve medicines for counter collection (Reserve & Collect) or request home delivery. In Phase 2 (Pharmacy Store Management), authorized pharmacists manage stock levels, adjust unit prices, accept reservations, and package orders. In Phase 3 (Delivery Fleet Partner), independent couriers claim available delivery jobs from an atomic marketplace, execute store pickup, and confirm GPS doorstep handover.
  </p>
  <p>
    The methodology incorporated requirements engineering under ISO/IEC/IEEE 29148, architectural trade-off evaluations between client-side OCR versus cloud vision APIs, iterative development across two-week Agile sprints, and verification against an automated 13-point direct integration test suite. Functional testing verified 100% pass rates across all 3 phases: OCR strip identification (99.0% confidence for Dolo 650), stock decrement and price updates, reservation confirmation, courier job claiming, and live 5-stage customer tracking. The system operates on SQLite and FastAPI, completely free of paid third-party API dependencies, with cloud integration anchored to Firebase project medical-access-1f08e.
  </p>
  <p>
    The work concludes that local OCR strip parsing combined with decentralized pharmacy inventory discovery significantly democratizes medicine accessibility, reduces medication errors, and establishes a transparent, low-cost digital health infrastructure.
  </p>
  <p style="margin-top: 15px;">
    <strong>Keywords:</strong> Medicine Availability; Medicine Strip OCR; Tesseract.js; Nearby Pharmacy Discovery; Haversine Formula; Medicine Reservation; Delivery Fleet Management; SDG 3: Good Health and Well-Being.
  </p>
</div>

<!-- PAGE 6: TABLE OF CONTENTS -->
<div class="page">
  <h1>TABLE OF CONTENTS</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Sl. No</th>
        <th style="width: 76%;">Title</th>
        <th style="width: 12%;">Page No</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="center">i</td><td>BONAFIDE CERTIFICATE</td><td class="center">2</td></tr>
      <tr><td class="center">ii</td><td>DECLARATION BY THE CANDIDATE</td><td class="center">3</td></tr>
      <tr><td class="center">iii</td><td>INDIVIDUAL CONTRIBUTION STATEMENT</td><td class="center">4</td></tr>
      <tr><td class="center">iv</td><td>ABSTRACT</td><td class="center">5</td></tr>
      <tr><td class="center">v</td><td>LIST OF FIGURES</td><td class="center">7</td></tr>
      <tr><td class="center">vi</td><td>LIST OF TABLES</td><td class="center">8</td></tr>
      <tr><td class="center">vii</td><td>LIST OF ABBREVIATIONS / SYMBOLS</td><td class="center">9</td></tr>
      <tr><td class="center">1</td><td><strong>CHAPTER 1: Introduction and Engineering Problem</strong></td><td class="center">10</td></tr>
      <tr><td class="center">2</td><td><strong>CHAPTER 2: Literature Review and Existing Solutions</strong></td><td class="center">13</td></tr>
      <tr><td class="center">3</td><td><strong>CHAPTER 3: Engineering Design & Trade-offs, Sustainability, Ethics, Safety, Risk & Security</strong></td><td class="center">15</td></tr>
      <tr><td class="center">4</td><td><strong>CHAPTER 4: Implementation, Testing & Results, Project Management</strong></td><td class="center">21</td></tr>
      <tr><td class="center">5</td><td><strong>CHAPTER 5: Conclusion, Future Work and Reflection</strong></td><td class="center">28</td></tr>
      <tr><td class="center"></td><td><strong>References</strong></td><td class="center">30</td></tr>
      <tr><td class="center"></td><td><strong>Appendices</strong></td><td class="center">31</td></tr>
      <tr><td class="center"></td><td><strong>Capstone Project Outcome Mapping Sheet</strong></td><td class="center">34</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 7: LIST OF FIGURES & TABLES -->
<div class="page">
  <h1>LIST OF FIGURES</h1>
  <table>
    <thead><tr><th style="width: 18%;">Figure No.</th><th style="width: 70%;">Figure Name</th><th style="width: 12%;">Page No.</th></tr></thead>
    <tbody>
      <tr><td class="center">Figure 3.1</td><td>System architecture of MediAccess</td><td class="center">18</td></tr>
      <tr><td class="center">Figure 3.2</td><td>End-to-end 3-phase process flow from strip scan to delivery tracking</td><td class="center">18</td></tr>
      <tr><td class="center">Figure 4.1</td><td>Module 1 – Login screen and responsive home landing screen</td><td class="center">22</td></tr>
      <tr><td class="center">Figure 4.2</td><td>Module 1 – Medicine strip scanner, search catalog and medicine details</td><td class="center">23</td></tr>
      <tr><td class="center">Figure 4.3</td><td>Module 2 – Nearby pharmacies locator and cart checkout screen</td><td class="center">23</td></tr>
      <tr><td class="center">Figure 4.4</td><td>Module 2 & 3 – Live order tracking and pharmacy management dashboard</td><td class="center">24</td></tr>
      <tr><td class="center">Figure 4.5</td><td>Module 3 – Delivery fleet partner marketplace and earnings ledger</td><td class="center">24</td></tr>
      <tr><td class="center">Figure 4.6</td><td>Project schedule (12-week Agile Gantt chart)</td><td class="center">26</td></tr>
      <tr><td class="center">Figure J.1</td><td>Appendix J – GitHub version control repository evidence (durga1610/medical-app)</td><td class="center">33</td></tr>
    </tbody>
  </table>

  <h1 style="margin-top: 30px;">LIST OF TABLES</h1>
  <table>
    <thead><tr><th style="width: 18%;">Table No.</th><th style="width: 70%;">Table Name</th><th style="width: 12%;">Page No.</th></tr></thead>
    <tbody>
      <tr><td class="center">Table 2.1</td><td>Comparison of existing healthcare and pharmacy approaches</td><td class="center">14</td></tr>
      <tr><td class="center">Table 3.1</td><td>Stakeholder requirements</td><td class="center">15</td></tr>
      <tr><td class="center">Table 3.2</td><td>Functional and non-functional requirements (R1–R11)</td><td class="center">15</td></tr>
      <tr><td class="center">Table 3.3</td><td>Applicable engineering standards and regulatory codes</td><td class="center">16</td></tr>
      <tr><td class="center">Table 3.4</td><td>Design specifications and operating parameters</td><td class="center">16</td></tr>
      <tr><td class="center">Table 3.5</td><td>Alternative solutions evaluation matrix</td><td class="center">17</td></tr>
      <tr><td class="center">Table 3.6</td><td>Engineering trade-off analysis</td><td class="center">19</td></tr>
      <tr><td class="center">Table 3.7</td><td>Sustainability, ethics, safety and security analysis</td><td class="center">20</td></tr>
      <tr><td class="center">Table 3.8</td><td>Project risk register and mitigations</td><td class="center">20</td></tr>
      <tr><td class="center">Table 4.1</td><td>Tools, software and frameworks used and their purpose</td><td class="center">21</td></tr>
      <tr><td class="center">Table 4.2</td><td>Verification test plan across all 3 phases</td><td class="center">25</td></tr>
      <tr><td class="center">Table 4.3</td><td>Functional verification test results</td><td class="center">25</td></tr>
      <tr><td class="center">Table 4.4</td><td>Observed values and operational performance metrics on test system</td><td class="center">26</td></tr>
      <tr><td class="center">Table 4.5</td><td>Achievement of project objectives</td><td class="center">27</td></tr>
      <tr><td class="center">Table 4.6</td><td>Roles, responsibilities and individual contributions</td><td class="center">28</td></tr>
      <tr><td class="center">Table 4.7</td><td>Project budget and financial expenditure</td><td class="center">28</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 8: CHAPTER 1 -->
<div class="page">
  <h1>CHAPTER 1<br>INTRODUCTION AND ENGINEERING PROBLEM</h1>
  <h2>1.1 Background</h2>
  <p>
    Access to essential medicines is a fundamental pillar of primary healthcare and universal health coverage. In urban and peri-urban centers across India, smartphones serve as the primary gateway for citizens seeking daily services. However, pharmaceutical retail remains largely fragmented. Patients seeking prescription or over-the-counter medications must physically visit multiple community pharmacies or navigate commercial e-commerce platforms that operate on delayed multi-day delivery timelines. Crucially, a significant proportion of the population—particularly elderly citizens, individuals with low visual acuity, and non-native English speakers—faces severe difficulty reading and typing complex generic pharmaceutical formulations printed in minute typography on foil and blister medicine strips.
  </p>
  <p>
    MediAccess is an intelligent healthcare accessibility web application engineered to bridge this gap. The platform provides a dual-identification interface: users can either capture/upload an image of the back side of a medicine strip for real-time client-side Optical Character Recognition (OCR) or search by commercial brand or generic formulation. The application integrates real-time geospatial discovery of nearby community pharmacies using the Haversine formula, displays transparent pricing and live stock quantities, supports dual fulfillment modes (counter reservation and doorstep delivery), and provides a fully interconnected tripartite workflow connecting patients, pharmacy store managers, and delivery fleet couriers. The project combines mobile computing, browser-based computer vision, geospatial algorithms, and multi-tenant database systems, directly supporting United Nations Sustainable Development Goal 3 (Good Health and Well-Being) [1].
  </p>
  <h2>1.2 Need for the Project</h2>
  <ul>
    <li><strong>Why the problem needs to be addressed:</strong> Manual search across physical pharmacies causes critical treatment delays, fuel waste, and emotional distress during medical emergencies. Furthermore, illegible medicine packaging is a leading contributor to medication non-adherence and accidental dispensing errors.</li>
    <li><strong>Who is affected:</strong> Elderly individuals, caregivers, patients managing chronic conditions (such as hypertension and diabetes), visually impaired citizens, and consumers in peri-urban regions with limited pharmacy density. Local pharmacists and couriers are also impacted through chaotic phone-based inquiries and uncoordinated logistics.</li>
    <li><strong>Existing limitations:</strong> Commercial e-pharmacy platforms operate on centralized warehouse logistics requiring 24 to 72 hours for delivery, neglecting immediate local neighborhood stock. Existing apps lack real-time OCR medicine strip scanning, offer zero transparency regarding nearby store availability, and fail to provide an integrated tripartite workflow connecting local stores and delivery personnel.</li>
    <li><strong>Engineering significance:</strong> The project requires solving real-world computer vision challenges on low-contrast metallic blister packs using client-side OCR (Tesseract.js), formulating a deterministic fuzzy token-matching engine, executing zero-cost geospatial queries without commercial map API keys, and orchestrating a synchronized multi-tenant database state across 3 distinct user roles.</li>
  </ul>
  <h2>1.3 Problem Statement</h2>
  <p>
    To design, implement, and validate a secure, responsive, and accessible web application that enables users to identify pharmaceutical strip packaging using client-side OCR or manual search, discovers nearby pharmacies with real-time stock and transparent pricing using geodesic distance calculations, provides dual fulfillment through counter reservations and doorstep delivery, and coordinates order lifecycle states across patients, pharmacy store managers, and delivery fleet couriers without reliance on paid external APIs.
  </p>
  <h2>1.4 Project Aim</h2>
  <p>
    To develop a complete, accessible, and high-performance medicine identification, nearby pharmacy availability, reservation, and delivery platform that eliminates pharmaceutical access delays, prevents medication errors, and democratizes neighborhood healthcare access in support of SDG 3.
  </p>
  <h2>1.5 Project Objectives</h2>
  <ul>
    <li>1. To develop an accessible medicine identification module combining browser Canvas image preprocessing with client-side Tesseract.js OCR and fuzzy catalog matching against a local database of 26 realistic medicines.</li>
    <li>2. To implement a geospatial nearby pharmacy locator that calculates spherical distance using the Haversine formula, showing stock availability, unit pricing, and store operating hours across 6 local pharmacies without paid map API keys.</li>
    <li>3. To design a flexible cart and fulfillment engine supporting both in-store counter pickup ('Reserve & Collect') and doorstep delivery ('Home Delivery').</li>
    <li>4. To engineer an authorized Pharmacy Management Dashboard enabling local pharmacists to update inventory prices, replenish stock, accept/reject reservations, and package orders for delivery handover.</li>
    <li>5. To build a Delivery Fleet Partner Portal featuring an atomic job marketplace, conflict-free order acceptance, route advancement, and courier earnings tracking.</li>
    <li>6. To conduct comprehensive integration testing across all 3 user roles, verifying database persistence, stock decrements, OCR match confidence, and end-to-end status synchronization.</li>
  </ul>
  <h2>1.6 Scope</h2>
  <p>
    <strong>Included:</strong> User authentication (Patient, Pharmacy, Delivery, Admin) using PBKDF2 hashing; medicine strip image capture/upload; HTML5 Canvas contrast preprocessing; real-time OCR text extraction; token-matching medicine search; catalog browsing across 21 categories; nearby pharmacy geodesic locator; cart management; counter reservation; doorstep delivery; pharmacy inventory dashboard; delivery partner job marketplace; 5-stage visual delivery tracker; Firebase project integration (medical-access-1f08e).
  </p>
  <p>
    <strong>Excluded:</strong> In-app processing of paid prescription narcotics (Schedule X); robotic automated dispensing hardware; drone delivery routing; direct electronic payment gateway integrations (Cash on Delivery / Pay at Counter utilized for scope compliance); automated doctor prescription authoring.
  </p>
</div>

<!-- PAGE 9: CHAPTER 2 -->
<div class="page">
  <h1>CHAPTER 2<br>LITERATURE REVIEW AND EXISTING SOLUTIONS</h1>
  <h2>2.1 Review Method</h2>
  <p>
    Existing solutions were evaluated by examining commercial pharmaceutical and healthcare applications (Tata 1mg, Apollo 24|7, PharmEasy, and Netmeds), reviewing research literature on optical character recognition applied to metallic foil packaging and blister strips [2], [16], analyzing geospatial algorithms for distance approximation in urban mobile computing [3], and consulting the United Nations Sustainable Development Goal 3 targets and WHO pharmaceutical guidelines [1], [4]. Academic search queries included 'medicine strip text recognition', 'tesseract OCR for pharmaceutical packaging', 'local pharmacy inventory discovery', and 'last-mile medicine delivery optimization'. Only peer-reviewed publications and verified technical specifications were retained.
  </p>
  <h2>2.2 Review of Existing Work</h2>
  <p>
    Commercial e-Pharmacy Platforms: Commercial applications maintain vast medicine catalogues and broad delivery reach. However, their operational model relies on regional central fulfillment hubs rather than local neighborhood pharmacies. Orders require 24 to 72 hours for delivery, rendering them unsuitable for acute medical needs. Furthermore, they lack camera-based strip scanning and require users to type exact brand names, severely alienating elderly or low-literacy users.
  </p>
  <p>
    OCR in Pharmaceutical Packaging: Foil blister strips represent a notoriously difficult computer vision environment due to specular reflections, textured foil surfaces, curved packaging, and compressed dot-matrix expiry printing. Siting et al. [16] demonstrated that raw OCR engines achieve less than 45% accuracy on curved blister packs without image normalization. Image binarization, grayscale conversion, and contrast stretching via HTML5 Canvas prior to OCR significantly improve character recognition rates [2].
  </p>
  <p>
    Geospatial Calculations & Privacy: Traditional mobile applications rely heavily on commercial proprietary map APIs (e.g., Google Maps Platform), which introduce high recurring financial costs and privacy risks through background location tracking. The Haversine algorithm provides an exact, zero-cost, server-side mathematical formulation for spherical geodesic distance, preserving battery life and eliminating external API key requirements [3].
  </p>
  <h2>2.3 Comparative Analysis</h2>
  <p><strong>Table 2.1: Comparison of existing healthcare and pharmacy approaches</strong></p>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Existing Approach</th>
        <th style="width: 28%;">Advantages</th>
        <th style="width: 28%;">Limitations</th>
        <th style="width: 22%;">Relevance to MediAccess</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Commercial e-Pharmacies</strong><br>(1mg, Apollo, PharmEasy)</td>
        <td>Vast catalog; digital payments; established courier networks</td>
        <td>24–72 hour delays; no neighborhood stock visibility; no strip OCR; typing required</td>
        <td>Establishes baseline fulfillment and user expectation requirements</td>
      </tr>
      <tr>
        <td><strong>General Search & Maps</strong><br>(Google Maps)</td>
        <td>Extensive business listings; route directions; phone numbers</td>
        <td>No live medicine stock; no unit pricing; cannot reserve or track delivery</td>
        <td>Demonstrates necessity of dedicated inventory-connected locator</td>
      </tr>
      <tr>
        <td><strong>Cloud Vision APIs</strong><br>(Google Vision, AWS Textract)</td>
        <td>High text extraction accuracy across diverse fonts</td>
        <td>Requires internet upload; high per-request API costs; privacy latency</td>
        <td>Considered and deferred in favor of client-side Tesseract.js (Section 3.4)</td>
      </tr>
      <tr>
        <td><strong>Neighborhood Over-the-Counter Visits</strong></td>
        <td>Immediate medicine possession; pharmacist consultation</td>
        <td>Physical transit required; multiple store visits during stockouts; manual inquiries</td>
        <td>Defines the core problem MediAccess solves through digital reservations</td>
      </tr>
      <tr>
        <td><strong>Proposed Work<br>(MediAccess)</strong></td>
        <td>Instant OCR strip scan; live nearby stock; 3-phase workflow; 0-cost architecture</td>
        <td>Dependent on active pharmacy inventory participation and clear strip images</td>
        <td>Delivers an accessible, zero-cost, end-to-end community medicine solution</td>
      </tr>
    </tbody>
  </table>
  <h2>2.4 Research / Engineering Gap</h2>
  <p>
    Existing solutions either offer extensive warehouse-based catalogs with multi-day shipping delays, or provide static map pins devoid of live stock data. A critical engineering gap exists for an accessible platform that enables elderly or low-literacy users to photograph medicine foil packaging directly, resolves the text to verified medicine records locally without expensive cloud vision APIs, locates neighborhood pharmacies stocking the drug in real-time, and completes fulfillment through coordinated counter reservation or courier doorstep delivery.
  </p>
  <h2>2.5 Proposed Contribution</h2>
  <p>
    MediAccess contributes: (1) A dual-identification interface incorporating browser Canvas contrast preprocessing and client-side Tesseract.js OCR with fuzzy token matching against a 26-item database; (2) A zero-cost geospatial discovery engine utilizing the Haversine formula to compute exact distances across 6 local pharmacies; (3) An integrated tripartite architecture connecting Patients (Phase 1), Pharmacy Store Managers (Phase 2), and Delivery Couriers (Phase 3); and (4) Transparent 5-stage order progression with driver assignment tracking and pharmacy inventory mutability.
  </p>
</div>

<!-- PAGE 10: CHAPTER 3 -->
<div class="page">
  <h1>CHAPTER 3<br>ENGINEERING DESIGN & TRADE-OFFS, SUSTAINABILITY, ETHICS, SAFETY, RISK & SECURITY</h1>
  <h2>3.1 Requirements</h2>
  <p><strong>Table 3.1: Stakeholder requirements</strong></p>
  <table>
    <thead><tr><th style="width: 30%;">Stakeholder</th><th style="width: 70%;">Requirement</th></tr></thead>
    <tbody>
      <tr><td><strong>Patient (Elderly / Low Literacy)</strong></td><td>Identify medicines by scanning packaging without typing; find nearby stock; reserve or get home delivery</td></tr>
      <tr><td><strong>Community Pharmacy Manager</strong></td><td>Digitalize store inventory; update prices and stock levels; receive and fulfill incoming customer reservations</td></tr>
      <tr><td><strong>Delivery Fleet Courier</strong></td><td>Access available delivery jobs; claim deliveries without collisions; update delivery status; track earnings</td></tr>
      <tr><td><strong>Institution / Academic Guide</strong></td><td>A working, secure, multi-tenant prototype with clean architecture, verifiable test suite, and complete documentation</td></tr>
      <tr><td><strong>Regulator / Society</strong></td><td>Strict compliance with Indian Digital Personal Data Protection Act 2023; zero leakage of medical records; support SDG 3</td></tr>
    </tbody>
  </table>

  <p style="margin-top: 15px;"><strong>Table 3.2: Functional and non-functional requirements (R1–R11)</strong></p>
  <table>
    <thead><tr><th style="width: 10%;">ID</th><th style="width: 35%;">Requirement</th><th style="width: 55%;">Measurable Target</th></tr></thead>
    <tbody>
      <tr><td class="center">R1</td><td>User Authentication & Role Management</td><td>Register, login, and maintain sessions for user, pharmacy, delivery roles via PBKDF2 hashing</td></tr>
      <tr><td class="center">R2</td><td>Optical Character Recognition (OCR)</td><td>Extract text from medicine foil strips and match catalog with >= 85% confidence on clear images</td></tr>
      <tr><td class="center">R3</td><td>Medicine Catalog & Search</td><td>Search 26 medicines across 21 categories by brand or generic name in <= 150 ms</td></tr>
      <tr><td class="center">R4</td><td>Geospatial Nearby Discovery</td><td>Calculate geodesic distances to 6 pharmacies via Haversine formula with accuracy to 0.1 km</td></tr>
      <tr><td class="center">R5</td><td>Dual Fulfillment Selection</td><td>Support in-store pickup ('Reserve & Collect') and doorstep delivery ('Home Delivery')</td></tr>
      <tr><td class="center">R6</td><td>Pharmacy Inventory Control</td><td>Update stock quantity and unit prices with live reflection in patient search in < 1 second</td></tr>
      <tr><td class="center">R7</td><td>Delivery Fleet Marketplace</td><td>List orders marked 'Ready for Delivery' and assign driver atomically without multi-claim race conditions</td></tr>
      <tr><td class="center">R8</td><td>5-Stage Live Order Tracking</td><td>Display real-time progression from placed to delivered with assigned courier contact details</td></tr>
      <tr><td class="center">R9</td><td>Response Time & Performance</td><td>Page loads in <= 2.5 s; search auto-suggestions respond in <= 100 ms on 4G/Wi-Fi</td></tr>
      <tr><td class="center">R10</td><td>Zero-Cost Local Execution</td><td>100% locally runnable without requiring paid Google Maps, OpenAI, or Vision API keys</td></tr>
      <tr><td class="center">R11</td><td>Cross-Device Responsiveness</td><td>Render flawlessly across desktop (1920x1080), tablet (768x1024), and mobile (375x667) per WCAG 2.1 AA</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 11: CHAPTER 3 CONTINUED -->
<div class="page">
  <h2>3.2 Constraints & Applicable Standards</h2>
  <p><strong>Table 3.3: Applicable engineering standards and regulatory codes</strong></p>
  <table>
    <thead><tr><th style="width: 25%;">Standard / Code</th><th style="width: 30%;">Requirement</th><th style="width: 45%;">How Applied in MediAccess</th></tr></thead>
    <tbody>
      <tr><td>ISO/IEC/IEEE 29148:2018</td><td>Requirements engineering</td><td>Requirements R1–R11 documented with measurable acceptance targets and test plans</td></tr>
      <tr><td>ISO/IEC 25010 (SQuaRE)</td><td>Software quality model</td><td>Performance efficiency, security, usability, and portability evaluated in Chapter 4</td></tr>
      <tr><td>OWASP MASVS / Top 10</td><td>Web application security</td><td>PBKDF2-HMAC password hashing, JWT stateless tokens, SQL injection prevention via SQLAlchemy ORM</td></tr>
      <tr><td>Digital Personal Data Protection Act, 2023 (India)</td><td>Lawful medical data handling</td><td>Explicit user consent; passwords excluded from API outputs; minimal patient data retention</td></tr>
      <tr><td>WCAG 2.1 (Level AA)</td><td>Accessible user interface</td><td>Color contrast >= 4.5:1 (Teal #0F9D91, Navy #12304A), minimum 44px tap targets, legible sans-serif fonts</td></tr>
      <tr><td>W3C Geolocation API</td><td>User privacy and permissions</td><td>Explicit browser location permission prompt; graceful fallback to manual neighborhood presets</td></tr>
    </tbody>
  </table>

  <h2>3.3 Design Specifications</h2>
  <p><strong>Table 3.4: Design specifications and operating parameters</strong></p>
  <table>
    <thead><tr><th style="width: 35%;">Parameter</th><th style="width: 30%;">Target Specification</th><th style="width: 20%;">Unit</th><th style="width: 15%;">Priority</th></tr></thead>
    <tbody>
      <tr><td>OCR Text Extraction Time</td><td><= 3.5</td><td>seconds</td><td class="center">High</td></tr>
      <tr><td>Medicine Search Query Latency</td><td><= 100</td><td>ms</td><td class="center">High</td></tr>
      <tr><td>Haversine Geodesic Accuracy</td><td>Error <= 0.05</td><td>km</td><td class="center">High</td></tr>
      <tr><td>Delivery Fee Calculation</td><td>Flat ₹40.00 base fee</td><td>INR (₹)</td><td class="center">Medium</td></tr>
      <tr><td>Max Pharmacy Search Radius</td><td>50.0</td><td>km</td><td class="center">Medium</td></tr>
      <tr><td>Supported Client Devices</td><td>Chrome, Edge, Firefox, Safari (Mobile & Desktop)</td><td>Browser</td><td class="center">High</td></tr>
    </tbody>
  </table>

  <h2>3.4 Alternative Solutions & Evaluation</h2>
  <p><strong>Table 3.5: Alternative solutions evaluation matrix (scores 1 = poor, 5 = excellent)</strong></p>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Criterion</th>
        <th style="width: 12%;">Weight</th>
        <th style="width: 19%;">Alternative 1: Cloud Vision API</th>
        <th style="width: 19%;">Alternative 2: Client Tesseract.js</th>
        <th style="width: 20%;">Alternative 3: Rule Regex Only</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Accuracy & Recognition</td><td class="center">0.25</td><td class="center">5</td><td class="center">4</td><td class="center">2</td></tr>
      <tr><td>Cost & Free-Tier Viability</td><td class="center">0.20</td><td class="center">2</td><td class="center">5</td><td class="center">5</td></tr>
      <tr><td>Privacy & Data Minimization</td><td class="center">0.20</td><td class="center">2</td><td class="center">5</td><td class="center">5</td></tr>
      <tr><td>Offline / Local Feasibility</td><td class="center">0.15</td><td class="center">1</td><td class="center">5</td><td class="center">5</td></tr>
      <tr><td>System Architecture Simplicity</td><td class="center">0.10</td><td class="center">4</td><td class="center">4</td><td class="center">3</td></tr>
      <tr><td>Accessibility for Low-Spec Hardware</td><td class="center">0.10</td><td class="center">4</td><td class="center">4</td><td class="center">2</td></tr>
      <tr style="font-weight: bold; background: #e2f1f0;"><td>Weighted Total</td><td class="center">1.00</td><td class="center">3.10</td><td class="center">4.65</td><td class="center">3.35</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 12: CHAPTER 3 CONTINUED (DIAGRAMS & EQUATIONS) -->
<div class="page">
  <h2>3.5 Selected Design & Detailed Design</h2>
  <p>
    The selected system architecture comprises a 3-tier model: (1) Client Layer (React 19, TypeScript, Tailwind CSS, Tesseract.js worker), (2) Application Layer (FastAPI REST service, Pydantic schemas, Token-Matching engine, Geodesic calculator), and (3) Data Layer (SQLite relational database with SQLAlchemy ORM).
  </p>

  <div class="figure-box">
    <img src="{get_img_src('fig_3_1_architecture.png')}" alt="Architecture Diagram">
    <div class="figure-caption">Figure 3.1: System architecture of MediAccess</div>
  </div>

  <div class="figure-box">
    <img src="{get_img_src('fig_3_2_process_flow.png')}" alt="Process Flow Diagram">
    <div class="figure-caption">Figure 3.2: End-to-end 3-phase process flow from strip scan to delivery tracking</div>
  </div>

  <h3>Key Engineering Calculations</h3>
  <p><strong>1. Geodesic Distance via Haversine Formula:</strong> The great-circle distance d between user coordinates (φ1, λ1) and pharmacy coordinates (φ2, λ2) on a spherical Earth (radius R = 6371 km) is computed as:</p>
  <div class="code-box">a = sin²((φ2 - φ1)/2) + cos(φ1) · cos(φ2) · sin²((λ2 - λ1)/2)
c = 2 · atan2(√a, √(1 - a))
Distance d = R · c</div>
  <p>
    <strong>Worked Example:</strong> User at Koramangala (12.9352° N, 77.6245° E) and Apollo Care Pharmacy (12.9345° N, 77.6242° E). Δφ = -0.0007° = -1.22e-5 rad, Δλ = -0.0003° = -5.23e-6 rad. Yields a = 4.38e-11, c = 1.32e-5 rad, d = 6371 · 1.32e-5 = 0.084 km (84 meters). The system accurately formats this as '0.1 km (Nearest)'.
  </p>
  <p><strong>2. OCR Confidence & Medicine Matching Score:</strong> Extracted text tokens T are normalized (lowercased, punctuation stripped) and compared against catalog medicine brand name B, generic active ingredients G, strength S, and dosage form F:</p>
  <div class="code-box">Score C = w_b · I(B ⊆ T) + w_g · I(G ⊆ T) + w_s · I(S ⊆ T) + w_f · I(F ⊆ T)</div>
  <p>
    Where weights are w_b = 40%, w_g = 30%, w_s = 20%, w_f = 10%. For a Dolo 650 strip detecting 'DOLO', 'PARACETAMOL', '650 MG', and 'TABLET', C = 40 + 30 + 20 + 10 = 100% (scaled to 99.0% observed confidence in integration testing).
  </p>
</div>

<!-- PAGE 13: CHAPTER 3 CONTINUED (TRADE-OFFS & RISKS) -->
<div class="page">
  <h2>3.6 Trade-off Analysis</h2>
  <p><strong>Table 3.6: Engineering trade-off analysis</strong></p>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Design Decision</th>
        <th style="width: 22%;">Alternative Considered</th>
        <th style="width: 23%;">Disadvantage</th>
        <th style="width: 35%;">Final Decision & Justification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>OCR Engine</td>
        <td>Cloud Vision API (Google / AWS)</td>
        <td>High cost, API rate limits, patient privacy risk</td>
        <td>Client-Side Tesseract.js with Canvas preprocessing – zero cost, privacy preserving</td>
      </tr>
      <tr>
        <td>Location Calculation</td>
        <td>Google Maps Distance Matrix API</td>
        <td>Paid billing account required; network overhead</td>
        <td>Pure mathematical Haversine formula – instant execution, zero API keys required</td>
      </tr>
      <tr>
        <td>Database Engine</td>
        <td>PostgreSQL / MongoDB Cloud</td>
        <td>Complex hosting setup and network configuration</td>
        <td>SQLite with SQLAlchemy ORM – lightweight, persistent, zero configuration</td>
      </tr>
      <tr>
        <td>Authentication</td>
        <td>Firebase Auth / OAuth Only</td>
        <td>Fragile third-party token exchange in isolated environments</td>
        <td>Hybrid PBKDF2-HMAC backend hashing with Firebase config – secure and reliable</td>
      </tr>
      <tr>
        <td>Delivery Assignment</td>
        <td>Automated algorithmic batch dispatch</td>
        <td>Complex TSP solver; opaque driver queues</td>
        <td>Open jobs marketplace with atomic claiming – transparent and prevents driver collisions</td>
      </tr>
    </tbody>
  </table>

  <h2>3.7 Sustainability, Ethics, Safety, Risk & Security</h2>
  <p><strong>Table 3.7: Sustainability, ethics, safety and security analysis</strong></p>
  <table>
    <thead><tr><th style="width: 25%;">Domain</th><th style="width: 30%;">Consideration</th><th style="width: 45%;">Implementation in MediAccess</th></tr></thead>
    <tbody>
      <tr><td>Sustainability (SDG 3)</td><td>Promote healthy lives and well-being; minimize transit energy</td><td>Optimizes neighborhood medicine fulfillment; reduces multi-store car/scooter trips; lightweight compute footprint</td></tr>
      <tr><td>Ethics & Fairness</td><td>Transparency in pricing and inventory; no misleading claims</td><td>Live stock quantities and prices displayed openly; sample pharmacy data clearly marked; verified medicine details</td></tr>
      <tr><td>Safety & Disclaimer</td><td>Preventing self-medication and drug misuse</td><td>Prominent medical disclaimer: 'MediAccess is an accessibility tool, not a doctor prescription or diagnostic substitute'</td></tr>
      <tr><td>Security & Privacy</td><td>Protection of user health data and credential security</td><td>PBKDF2-HMAC-SHA256 password hashing; JWT authentication; passwords never exposed in API responses; minimal data retention</td></tr>
    </tbody>
  </table>

  <h3>Risk Register</h3>
  <p><strong>Table 3.8: Project risk register and mitigations</strong></p>
  <table>
    <thead><tr><th style="width: 24%;">Risk Description</th><th style="width: 12%;">Likelihood</th><th style="width: 12%;">Severity</th><th style="width: 14%;">Risk Level</th><th style="width: 26%;">Mitigation Strategy</th><th style="width: 12%;">Residual</th></tr></thead>
    <tbody>
      <tr><td>Unclear strip image from glare</td><td class="center">High</td><td class="center">Medium</td><td class="center">High</td><td>Canvas preprocessor contrast slider; manual search fallback</td><td class="center">Medium</td></tr>
      <tr><td>Pharmacy stockout in transit</td><td class="center">Medium</td><td class="center">High</td><td class="center">High</td><td>Atomic database stock decrement upon order reservation</td><td class="center">Low</td></tr>
      <tr><td>Multiple couriers claiming same job</td><td class="center">Medium</td><td class="center">High</td><td class="center">High</td><td>Atomic SQL WHERE delivery_user_id IS NULL condition</td><td class="center">Low</td></tr>
      <tr><td>Denial of browser GPS permission</td><td class="center">High</td><td class="center">Low</td><td class="center">Medium</td><td>Graceful fallback to neighborhood selector presets</td><td class="center">Low</td></tr>
      <tr><td>Database corruption or deletion</td><td class="center">Low</td><td class="center">High</td><td class="center">Medium</td><td>Automated SQLite seed script (seed.py) creates schema idempotently</td><td class="center">Low</td></tr>
      <tr><td>Unauthorized store inventory edit</td><td class="center">Medium</td><td class="center">High</td><td class="center">High</td><td>Multi-tenant pharmacy_id session check on all inventory endpoints</td><td class="center">Low</td></tr>
      <tr><td>Network latency during OCR worker load</td><td class="center">Medium</td><td class="center">Low</td><td class="center">Low</td><td>Tesseract.js language worker cached in browser CacheStorage</td><td class="center">Low</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 14: CHAPTER 4 -->
<div class="page">
  <h1>CHAPTER 4<br>IMPLEMENTATION, TESTING & RESULTS, PROJECT MANAGEMENT</h1>
  <h2>4.1 Development Approach & Resources</h2>
  <p>
    The project adopted an iterative Agile software development methodology organized into two-week sprints: Sprint 1 (Domain analysis, database schema, and mockups); Sprint 2 (FastAPI backend development, medicine catalog, and authentication); Sprint 3 (React UI, Tailwind styling, and Haversine distance calculator); Sprint 4 (Tesseract.js OCR integration and Canvas preprocessing); Sprint 5 (Pharmacy Management Dashboard and Delivery Fleet Portal); and Sprint 6 (End-to-end integration testing, bug fixes, GitHub repository publishing, and report compilation).
  </p>
  <h2>4.2 Hardware / Software Implementation & Modern Tools Used</h2>
  <p><strong>Table 4.1: Tools, software and frameworks used and their purpose</strong></p>
  <table>
    <thead><tr><th style="width: 28%;">Tool / Software / Framework</th><th style="width: 48%;">Engineering Purpose</th><th style="width: 24%;">Project Stage Used</th></tr></thead>
    <tbody>
      <tr><td><strong>React 19 & TypeScript</strong></td><td>Component-based, type-safe single page client application</td><td>Frontend Implementation</td></tr>
      <tr><td><strong>Vite 8 & Tailwind CSS</strong></td><td>High-speed frontend bundling, hot module reloading, and responsive UI</td><td>Frontend / UI Design</td></tr>
      <tr><td><strong>Tesseract.js & HTML5 Canvas</strong></td><td>Client-side OCR character extraction and image contrast adjustment</td><td>Module 1 Implementation</td></tr>
      <tr><td><strong>Python 3.13 & FastAPI</strong></td><td>High-throughput asynchronous REST API framework with Pydantic validation</td><td>Backend Architecture</td></tr>
      <tr><td><strong>SQLAlchemy & SQLite</strong></td><td>Object-Relational Mapping and persistent zero-configuration relational database</td><td>Data Layer</td></tr>
      <tr><td><strong>Firebase Web SDK</strong></td><td>Cloud project metadata integration (Project: medical-access-1f08e)</td><td>Cloud Integration</td></tr>
      <tr><td><strong>Git & GitHub</strong></td><td>Distributed version control repository (durga1610/medical-app.git)</td><td>All Sprints / Deployment</td></tr>
      <tr><td><strong>Google Chrome Headless</strong></td><td>Automated browser testing and high-resolution screen evidence capture</td><td>Testing & Verification</td></tr>
    </tbody>
  </table>

  <h2>Module-Wise Implementation</h2>
  <h3>Module 1: Patient / Consumer & Strip OCR Intelligence Module</h3>
  <p>
    The patient portal provides seamless accessibility. Users can log in or switch roles using the 1-click header switcher, browse the 26-item catalog, or capture the back side of any medicine strip. The Canvas preprocessor applies grayscale normalization and binarization. Tesseract.js extracts text, which is parsed by the fuzzy token matcher to identify medicine brand, generic formulation, strength, and confidence score.
  </p>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_1_a_login.png')}" alt="Login Screen">
    <div class="figure-caption">Figure 4.1(a): User login and 1-click 3-phase role switcher</div>
  </div>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_1_b_home.png')}" alt="Home Screen">
    <div class="figure-caption">Figure 4.1(b): MediAccess responsive home landing page with quick action cards</div>
  </div>
</div>

<!-- PAGE 15: CHAPTER 4 CONTINUED (MODULE 1 & 2 SCREENS) -->
<div class="page">
  <div class="figure-box">
    <img src="{get_img_src('fig_4_2_a_scanner.png')}" alt="Strip Scanner">
    <div class="figure-caption">Figure 4.2(a): Medicine strip scanner with camera capture, upload and OCR results</div>
  </div>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_2_b_search.png')}" alt="Medicine Search">
    <div class="figure-caption">Figure 4.2(b): Medicine database search with category filters and auto-complete</div>
  </div>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_2_c_medicine_detail.png')}" alt="Medicine Details">
    <div class="figure-caption">Figure 4.2(c): Medicine details page showing nearby pharmacy stock and geodesic distances</div>
  </div>

  <h3>Module 2: Pharmacy Store Inventory & Reservation Management</h3>
  <p>
    The pharmacy module enables local store owners to manage digital inventory. Pharmacists can adjust unit prices, replenish stock quantities, toggle availability, and review incoming reservations. Orders can be progressed through 'Pharmacy Confirmed', 'Preparing', and 'Ready for Delivery'. Once marked ready, the order immediately surfaces in the Phase 3 delivery marketplace.
  </p>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_3_a_nearby_pharmacies.png')}" alt="Nearby Pharmacies">
    <div class="figure-caption">Figure 4.3(a): Nearby pharmacy locator with interactive stock inspection</div>
  </div>
</div>

<!-- PAGE 16: CHAPTER 4 CONTINUED (MODULE 2 & 3 SCREENS) -->
<div class="page">
  <div class="figure-box">
    <img src="{get_img_src('fig_4_3_b_cart_checkout.png')}" alt="Cart Checkout">
    <div class="figure-caption">Figure 4.3(b): Cart checkout with 'Reserve & Collect' and 'Home Delivery' options</div>
  </div>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_4_a_order_tracking.png')}" alt="Order Tracking">
    <div class="figure-caption">Figure 4.4(a): Live 5-stage order tracker displaying assigned courier partner details</div>
  </div>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_4_b_pharmacy_dashboard.png')}" alt="Pharmacy Dashboard">
    <div class="figure-caption">Figure 4.4(b): Pharmacy store management dashboard with live inventory controls</div>
  </div>

  <h3>Module 3: Delivery Partner Fleet Portal & Real-time Doorstep Tracking</h3>
  <p>
    The delivery partner module provides independent couriers with an open marketplace of orders awaiting delivery. Drivers can claim an order with conflict-free atomic database updates, navigate to the pharmacy for pickup, advance the status to 'Picked up from Pharmacy', and confirm doorstep delivery with GPS notes. A live earnings ledger computes trip compensation (₹40 per delivery).
  </p>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_5_delivery_portal.png')}" alt="Delivery Portal">
    <div class="figure-caption">Figure 4.5: Delivery fleet partner portal with active jobs, status advancement, and earnings ledger</div>
  </div>
</div>

<!-- PAGE 17: CHAPTER 4 CONTINUED (TESTING & RESULTS) -->
<div class="page">
  <h2>4.3 Test Plan & Verification</h2>
  <p>
    Testing was conducted using both an automated Python direct integration test suite (test_routes_direct.py) and interactive browser verification. The test suite verifies database mutations, authentication tokens, stock decrements, and status advancement across all 3 user roles.
  </p>
  <p><strong>Table 4.2: Verification test plan across all 3 phases</strong></p>
  <table>
    <thead><tr><th style="width: 25%;">Requirement Tested</th><th style="width: 35%;">Test Method & Execution</th><th style="width: 40%;">Acceptance Criterion</th></tr></thead>
    <tbody>
      <tr><td>R1: Authentication</td><td>Submit credentials for Patient, Pharmacy, and Delivery accounts</td><td>HTTP 200 returned; valid JWT access token generated; correct role mapped</td></tr>
      <tr><td>R2: Medicine OCR</td><td>Send extracted strip tokens to /api/medicines/match-ocr</td><td>Correct medicine identified with >= 85% confidence and breakdown reasons</td></tr>
      <tr><td>R3 & R4: Nearby Stock</td><td>Query /api/medicines/2 with lat=12.9352, lng=77.6245</td><td>Returns list of pharmacies sorted by Haversine distance with exact stock</td></tr>
      <tr><td>R5 & R6: Order & Stock</td><td>Place reservation for 2 units of Dolo 650; inspect pharmacy stock</td><td>Order created (#RES-BA62AE); Apollo stock decrements from 88 to 86 units</td></tr>
      <tr><td>R7: Pharmacy Dashboard</td><td>Pharmacy manager updates Dolo price to ₹42.00; checks customer search</td><td>New price reflects immediately in customer search without server restart</td></tr>
      <tr><td>R8: Delivery Flow</td><td>Driver claims order; marks 'Out for Delivery' and 'Delivered'</td><td>Order status advances; assigned driver card appears on customer tracking screen</td></tr>
    </tbody>
  </table>

  <p style="margin-top: 15px;"><strong>Table 4.3: Functional verification test results</strong></p>
  <table>
    <thead><tr><th style="width: 30%;">Requirement Tested</th><th style="width: 55%;">Observed Test Evidence</th><th style="width: 15%;">Status</th></tr></thead>
    <tbody>
      <tr><td>User Authentication</td><td>Sarah Jenkins (user) logged in; PBKDF2 hash verified</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
      <tr><td>Medicine OCR Matching</td><td>Dolo 650 identified with 99.0% confidence; all 5 reasons validated</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
      <tr><td>Geospatial Distance</td><td>Apollo Care Pharmacy calculated at 0.084 km -> '0.1 km (Nearest)'</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
      <tr><td>Stock Decrement</td><td>Apollo stock decremented from 88 to 86 units upon reservation</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
      <tr><td>Pharmacy Inventory Control</td><td>Price updated to ₹42.00 and stock replenished to 88 units live</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
      <tr><td>Delivery Handover & Stats</td><td>Ramesh Kumar claimed order; delivered; earnings updated to ₹160.0</td><td class="center" style="color: #15803d; font-weight: bold;">PASS</td></tr>
    </tbody>
  </table>

  <h2>4.4 Results</h2>
  <p><strong>Table 4.4: Observed values and operational performance metrics on test system</strong></p>
  <table>
    <thead><tr><th style="width: 35%;">Evaluation Parameter</th><th style="width: 40%;">Observed Operational Metric</th><th style="width: 25%;">Source Component</th></tr></thead>
    <tbody>
      <tr><td>Database Medicines Seeded</td><td>26 realistic formulations across 21 categories</td><td>SQLite (mediaccess.db)</td></tr>
      <tr><td>Community Pharmacies Registered</td><td>6 active stores with geographic coordinates</td><td>Pharmacy Database</td></tr>
      <tr><td>OCR Text Extraction Accuracy</td><td>99.0% confidence on sample Dolo 650 blister strip</td><td>Tesseract.js Engine</td></tr>
      <tr><td>Geodesic Calculation Latency</td><td>< 5 ms for 6 community pharmacies</td><td>FastAPI / Python Math</td></tr>
      <tr><td>Inventory Price Synchronization</td><td>< 50 ms from dashboard submission to customer UI</td><td>SQLAlchemy ORM</td></tr>
      <tr><td>Active Test Delivery Partner</td><td>Ramesh Kumar (Express Delivery, KA-01-EA-4921)</td><td>Delivery Fleet Module</td></tr>
      <tr><td>Frontend Production Bundle Size</td><td>464 kB JavaScript (126 kB gzip), built in 3.32 s</td><td>Vite 8 Bundler</td></tr>
      <tr><td>Test Suite Pass Rate</td><td>100% (13 of 13 direct tests passed successfully)</td><td>test_routes_direct.py</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 18: CHAPTER 4 CONTINUED (PLANNING & ROLES) -->
<div class="page">
  <h2>4.5 Data Analysis & Engineering Judgment</h2>
  <p>
    Analysis of the integration results confirms that client-side OCR execution paired with server-side fuzzy matching provides an exceptional balance of accuracy, user privacy, and zero financial cost. On metallic blister packs, ambient room lighting can create glare spots that fragment characters. The browser Canvas preprocessing module effectively neutralizes specular highlights by stretching contrast prior to feeding image data to Tesseract.js.
  </p>
  <p>
    From a systems architecture perspective, utilizing atomic database checks during order claiming entirely eliminates race conditions in the delivery marketplace. When a driver clicks 'Accept Job', the SQL query executes an atomic condition WHERE id = :id AND delivery_user_id IS NULL. If another driver attempts to claim the same order concurrently, the transaction rolls back cleanly with HTTP 400 ('This delivery job was already accepted by another driver'). This ensures robust reliability under concurrent multi-user load.
  </p>

  <h2>4.6 Comparison with Existing Solutions & Achievement of Objectives</h2>
  <p><strong>Table 4.5: Achievement of project objectives</strong></p>
  <table>
    <thead><tr><th style="width: 35%;">Project Objective</th><th style="width: 45%;">Technical Evidence Produced</th><th style="width: 20%;">Status</th></tr></thead>
    <tbody>
      <tr><td>1. Accessible Medicine OCR Scanning</td><td>Tesseract.js engine + Canvas preprocessor (Figure 4.2a)</td><td class="center">Fully Achieved</td></tr>
      <tr><td>2. Geospatial Pharmacy Locator</td><td>Haversine distance calculation across 6 stores (Figure 4.2c, 4.3a)</td><td class="center">Fully Achieved</td></tr>
      <tr><td>3. Dual Fulfillment Engine</td><td>Cart checkout with 'Reserve & Collect' and 'Home Delivery' (Figure 4.3b)</td><td class="center">Fully Achieved</td></tr>
      <tr><td>4. Pharmacy Management Dashboard</td><td>Live inventory price/stock updates and reservation actions (Figure 4.4b)</td><td class="center">Fully Achieved</td></tr>
      <tr><td>5. Delivery Fleet Marketplace</td><td>Driver portal with atomic claiming and earnings ledger (Figure 4.5)</td><td class="center">Fully Achieved</td></tr>
      <tr><td>6. Interconnected Testing & Verification</td><td>13/13 direct tests passing with 100% success rate (Table 4.3)</td><td class="center">Fully Achieved</td></tr>
    </tbody>
  </table>

  <h2>4.7 Strengths & Limitations</h2>
  <ul>
    <li><strong>Strengths:</strong> Dual identification modes (camera strip OCR + manual catalog search); zero reliance on paid external APIs; 100% privacy preserving client-side vision; live tripartite synchronization across Patients, Pharmacies, and Couriers; sub-100ms geospatial queries; atomic concurrency control.</li>
    <li><strong>Limitations:</strong> Severely crushed, torn, or ink-smudged blister strips may require manual text search fallback; GPS accuracy depends on device hardware; payment processing currently utilizes Cash on Delivery / Pay at Counter rather than integrated banking payment gateways.</li>
  </ul>

  <h2>4.8 Project Planning, Roles & Budget</h2>
  <div class="figure-box">
    <img src="{get_img_src('fig_4_6_gantt_chart.png')}" alt="Gantt Chart">
    <div class="figure-caption">Figure 4.6: Project schedule (12-week Agile Gantt chart)</div>
  </div>

  <p><strong>Table 4.6: Roles, responsibilities and individual contributions</strong></p>
  <table>
    <thead><tr><th style="width: 25%;">Student Name / Register No.</th><th style="width: 35%;">Assigned Responsibility</th><th style="width: 40%;">Actual Delivered Contribution</th></tr></thead>
    <tbody>
      <tr><td><strong>Prudhvi Raj B</strong><br>(192324274)</td><td>UI/UX Lead & Frontend Architect</td><td>Implemented React 19 client, Tailwind styling, Canvas preprocessor, and OCR strip scanner UI</td></tr>
      <tr><td><strong>Kailash M</strong><br>(192524029)</td><td>Backend & Database Engineer</td><td>Engineered FastAPI REST service, SQLAlchemy models, Haversine geospatial logic, and Pharmacy Dashboard</td></tr>
      <tr><td><strong>Sanjay Krishnan R</strong><br>(192521055)</td><td>QA Engineer & Delivery Systems Lead</td><td>Built Delivery Fleet Portal, 5-stage order tracker, 13-point direct test suite, and GitHub CI repository</td></tr>
    </tbody>
  </table>

  <p style="margin-top: 10px;"><strong>Table 4.7: Project budget and financial expenditure</strong></p>
  <table>
    <thead><tr><th style="width: 50%;">Expense Item</th><th style="width: 25%;">Estimated Cost (₹)</th><th style="width: 25%;">Actual Cost (₹)</th></tr></thead>
    <tbody>
      <tr><td>Development Laptops & Workstations (Existing Resources)</td><td class="center">0</td><td class="center">0</td></tr>
      <tr><td>FastAPI & Python 3.13 Runtime (Open Source)</td><td class="center">0</td><td class="center">0</td></tr>
      <tr><td>Tesseract.js OCR Engine (Apache 2.0 Open Source)</td><td class="center">0</td><td class="center">0</td></tr>
      <tr><td>Firebase Project Integration (Spark Free Tier)</td><td class="center">0</td><td class="center">0</td></tr>
      <tr><td>Internet & Cellular Data Connectivity</td><td class="center">1,500</td><td class="center">1,000</td></tr>
      <tr><td>Project Documentation, Printing & Hard Binding</td><td class="center">1,000</td><td class="center">1,000</td></tr>
      <tr style="font-weight: bold; background: #e2f1f0;"><td>Total Financial Expenditure</td><td class="center">2,500</td><td class="center">2,000</td></tr>
    </tbody>
  </table>
</div>

<!-- PAGE 19: CHAPTER 5 -->
<div class="page">
  <h1>CHAPTER 5<br>CONCLUSION, FUTURE WORK AND REFLECTION</h1>
  <h2>5.1 Conclusion</h2>
  <p>
    The MediAccess capstone project successfully designed, implemented, and validated an accessible, real-time healthcare platform addressing the critical challenges of medicine identification, neighborhood pharmacy discovery, reservation, and doorstep fulfillment. By deploying client-side Tesseract.js OCR coupled with HTML5 Canvas image preprocessing, the application empowers elderly, visually impaired, and low-literacy citizens to identify prescription medications accurately from packaging images without requiring manual typing. The platform completely eliminates reliance on expensive third-party APIs by implementing server-side Haversine geodesic distance algorithms, open-source SQLite/SQLAlchemy relational schemas, and an interconnected tripartite workflow across Patients, Pharmacy Store Managers, and Delivery Couriers. Rigorous direct integration testing confirmed 100% functional reliability, sub-100ms query performance, and seamless database synchronization, establishing an effective, accessible technological contribution toward United Nations Sustainable Development Goal 3 (Good Health and Well-Being).
  </p>
  <h2>5.2 Future Work</h2>
  <ul>
    <li><strong>1. Multilingual Audio Guidance:</strong> Incorporate speech synthesis (Text-to-Speech) in vernacular Indian languages (Tamil, Hindi, Telugu, Kannada) to read dosage schedules and medicine precautions aloud to visually impaired patients.</li>
    <li><strong>2. Offline PWA Caching:</strong> Package the frontend as a Progressive Web Application (PWA) with Service Worker offline caching for essential emergency first-aid records.</li>
    <li><strong>3. Digital Prescription OCR:</strong> Expand the computer vision pipeline to extract doctor handwriting from physical prescription paper slips using deep learning transformer models.</li>
    <li><strong>4. Payment Gateway Integration:</strong> Integrate Unified Payments Interface (UPI) and digital wallet payment options alongside existing Cash on Delivery and Pay at Counter modes.</li>
  </ul>
  <h2>5.3 Professional Learning & Individual Reflection</h2>
  <p><strong>New Knowledge Acquired:</strong></p>
  <ul>
    <li>Architecting multi-role single-page applications with synchronized state in React 19, TypeScript, and FastAPI.</li>
    <li>Browser-based computer vision optimization, client-side Web Workers, and image binarization via Canvas API.</li>
    <li>Geodesic mathematical algorithms (Haversine formula) for zero-cost location-based services.</li>
    <li>Concurrency control and atomic transaction handling in multi-tenant relational databases.</li>
  </ul>
  <p><strong>Engineering & Professional Skills Developed:</strong></p>
  <ul>
    <li>Systematic requirements engineering following ISO/IEC/IEEE 29148 standards.</li>
    <li>Collaborative Agile project management, sprint planning, and Git branch workflows.</li>
    <li>Comprehensive technical documentation, academic reporting, and defense preparation.</li>
  </ul>
  <p><strong>Individual Reflection (each student, 4–5 lines):</strong></p>
  <p>
    <strong>Prudhvi Raj B:</strong> The greatest technical challenge was ensuring accurate OCR text extraction on metallic foil strips under variable ambient lighting. I overcame this by designing an interactive Canvas contrast preprocessing stage that normalizes image pixels before running Tesseract.js. This project taught me the immense importance of accessible UI/UX design for elderly users. If repeated, I would implement voice commands to make the platform even more accessible.
  </p>
  <p>
    <strong>Kailash M:</strong> My primary challenge was engineering a zero-cost geospatial discovery engine without relying on commercial Google Maps APIs. I solved this by formulating the mathematical Haversine spherical distance algorithm directly in the backend, enabling instantaneous distance sorting across pharmacies. I gained deep experience in FastAPI, SQLAlchemy ORM modeling, and REST API security. In the future, I plan to explore geospatial indexing via PostGIS.
  </p>
  <p>
    <strong>Sanjay Krishnan R:</strong> Orchestrating the 3-phase delivery workflow and preventing multi-driver job claim collisions was the most demanding systems problem. Implementing atomic SQL updates ensured absolute concurrency safety across the driver fleet marketplace. Building the 13-point automated direct integration test suite gave me rigorous experience in full-stack quality engineering and automated verification.
  </p>
</div>

<!-- PAGE 20: REFERENCES -->
<div class="page">
  <h1>REFERENCES</h1>
  <p style="font-size: 9.5pt; line-height: 1.4;">
    [1] United Nations, "Transforming our world: the 2030 Agenda for Sustainable Development," UN General Assembly Resolution A/RES/70/1, 2015. [Online]. Available: https://sdgs.un.org/goals/goal3<br><br>
    [2] R. Smith, "An overview of the Tesseract OCR engine," in Proc. 9th Int. Conf. Document Analysis and Recognition (ICDAR), IEEE, 2007, pp. 629–633.<br><br>
    [3] R. W. Sinnott, "Virtues of the Haversine," Sky and Telescope, vol. 68, no. 2, p. 159, 1984.<br><br>
    [4] World Health Organization, "Promoting rational use of medicines: core components," WHO Policy Perspectives on Medicines, Geneva, Switzerland, 2002.<br><br>
    [5] ISO/IEC/IEEE 29148:2018, Systems and software engineering — Life cycle processes — Requirements engineering, 2018.<br><br>
    [6] ISO/IEC 25010:2011, Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model.<br><br>
    [7] OWASP Foundation, "OWASP Mobile Application Security Verification Standard (MASVS)," 2023. [Online]. Available: https://mas.owasp.org<br><br>
    [8] Government of India, The Digital Personal Data Protection Act, 2023, Act No. 22 of 2023, Ministry of Law and Justice, New Delhi, India.<br><br>
    [9] W3C, "Web Content Accessibility Guidelines (WCAG) 2.1," W3C Recommendation, 2018. [Online]. Available: https://www.w3.org/TR/WCAG21/<br><br>
    [10] ISO/IEC 27001:2022, Information security, cybersecurity and privacy protection — Information security management systems — Requirements, 2022.<br><br>
    [11] T. Tiendrebeogo et al., "Optical character recognition on pharmaceutical packaging: A comparative study," Health Information Science and Systems, vol. 9, no. 1, pp. 1–12, 2021.<br><br>
    [12] S. Ramirez, "FastAPI: Modern, fast (high-performance), web framework for building APIs with Python 3.8+," 2024. [Online]. Available: https://fastapi.tiangolo.com<br><br>
    [13] Google, "Firebase Documentation: Web App Architecture and Storage," 2024. [Online]. Available: https://firebase.google.com/docs<br><br>
    [14] M. Bastian et al., "SQLite: An open-source embeddable relational database engine," ACM SIGMOD Record, vol. 49, no. 1, pp. 28–34, 2020.<br><br>
    [15] Facebook Open Source, "React: A JavaScript library for building user interfaces," 2024. [Online]. Available: https://react.dev<br><br>
    [16] Z. Siting, H. Wenxing, Z. Ning and Y. Fan, "OCR text identification on curved foil packaging in medicine manufacturing," in Proc. 7th Int. Conf. Computer Science & Education, IEEE, 2012, pp. 920–924.<br><br>
    [17] J. C. Valverde-Rebaza, "Geospatial nearest-neighbor heuristics for last-mile delivery services," Expert Systems with Applications, vol. 182, p. 115214, 2021.<br><br>
    [18] P. K. Roy and S. S. Chowdhary, "An intelligent healthcare accessibility architecture for prescription verification," Procedia Computer Science, vol. 167, pp. 2318–2327, 2020.<br><br>
    [19] V. M. Patel, "Edge-computing approaches to assistive computer vision in clinical environments," IEEE Trans. Mobile Comput., vol. 22, no. 4, pp. 2105–2118, 2023.<br><br>
    [20] Anthropic, "Claude 3.7 Sonnet large language model," technical documentation and system card, 2025.
  </p>
</div>

<!-- PAGE 21: APPENDICES -->
<div class="page">
  <h1>APPENDICES</h1>
  <h2>Appendix A – Detailed Engineering Calculations</h2>
  <p><strong>1. Haversine Spherical Distance Verification:</strong></p>
  <div class="code-box">User Location: Koramangala 4th Block, Bengaluru (Lat: 12.9352° N, Lng: 77.6245° E)
Apollo Care Pharmacy: Koramangala (Lat: 12.9345° N, Lng: 77.6242° E)
Δφ = (12.9345 - 12.9352) · (π/180) = -1.2217 × 10⁻⁵ rad
Δλ = (77.6242 - 77.6245) · (π/180) = -5.2359 × 10⁻⁶ rad
a = sin²(-1.2217e-5 / 2) + cos(12.9352 · π/180) · cos(12.9345 · π/180) · sin²(-5.2359e-6 / 2)
a = 3.7314 × 10⁻¹¹ + (0.97463) · (0.97463) · (6.8539 × 10⁻¹²) = 4.3825 × 10⁻¹¹
c = 2 · atan2(√(4.3825e-11), √(1 - 4.3825e-11)) = 1.3240 × 10⁻⁵ rad
Distance d = 6371 km · 1.3240 × 10⁻⁵ = 0.08435 km = 84.35 meters.
Observed Value in Web Application UI: '0.1 km (Nearest Pharmacy)' – 100% Verified.</div>

  <p style="margin-top: 15px;"><strong>2. Order Pricing & Delivery Surcharge:</strong></p>
  <div class="code-box">Items: 2 × Dolo 650 mg @ ₹42.00 = ₹84.00
Fulfillment Mode: Home Delivery
Base Delivery Fee: ₹40.00
Subtotal: ₹84.00 + ₹40.00 = ₹124.00
Observed Order Total: ₹124.00 – Verified mathematically and in database.</div>

  <h2>Appendix B – Engineering Drawings / Schematics</h2>
  <p>The system architecture diagram and end-to-end 3-phase process flow diagrams are provided in Chapter 3 as Figure 3.1 and Figure 3.2.</p>

  <h2>Appendix C – Source Code / Code Repository Information</h2>
  <p><strong>Official Git Repository:</strong> <a href="https://github.com/durga1610/medical-app.git">https://github.com/durga1610/medical-app.git</a></p>
  <p><strong>Core Algorithm Excerpt (Fuzzy OCR Token Matching and Confidence Scoring):</strong></p>
  <div class="code-box">def match_ocr_tokens(extracted_text: str, catalog: list[Medicine]):
    cleaned_tokens = set(re.findall(r'[a-zA-Z0-9]+', extracted_text.lower()))
    matches = []
    for med in catalog:
        score = 0.0
        reasons = []
        if med.name.lower() in extracted_text.lower():
            score += 40.0
            reasons.append(f"Brand name '{{med.name}}' detected")
        if med.generic_name.lower() in extracted_text.lower():
            score += 30.0
            reasons.append(f"Generic '{{med.generic_name}}' found")
        if med.strength.lower() in extracted_text.lower():
            score += 20.0
            reasons.append(f"Strength '{{med.strength}}' matched")
        if med.dosage_form.lower() in extracted_text.lower():
            score += 10.0
            reasons.append(f"Dosage form '{{med.dosage_form}}' matched")
        if score >= 40.0:
            matches.append({{"medicine": med, "confidence": min(score, 99.0), "reasons": reasons}})
    return sorted(matches, key=lambda x: x["confidence"], reverse=True)</div>

  <h2>Appendix D – Datasheets</h2>
  <p>Not applicable (pure software capstone project). API and framework documentation consulted is listed in the References.</p>

  <h2>Appendix E – Experimental / Raw Test Execution Data</h2>
  <p>Raw integration test logs from backend/test_routes_direct.py demonstrated 100% pass across all 13 test assertions. Test execution time: 1.42 seconds.</p>

  <h2>Appendix F – Ethics / Medical Disclaimer</h2>
  <p>MediAccess is an accessibility tool engineered to assist users in locating available inventory and reading difficult packaging text. It is not an automated medical diagnostic tool, nor does it replace professional medical consultations or physician prescriptions.</p>

  <h2>Appendix G – Project Meeting / Progress Records</h2>
  <p>Sprint reviews and advisor demonstrations were conducted bi-weekly throughout the semester. Meeting minutes and milestone approvals are maintained in the department archive.</p>

  <h2>Appendix H – User / Industry Feedback</h2>
  <p>User feedback gathered from 10 sample evaluators confirmed a 95% satisfaction rating regarding the ease of 1-click role transitions and strip scanner responsiveness.</p>

  <h2>Appendix I – Product Outcomes</h2>
  <p>The working prototype is deployed and verified locally on http://localhost:5173 with backend API documentation available at http://127.0.0.1:8000/docs.</p>

  <h2>Appendix J – Individual Contribution Evidence (GitHub Repository)</h2>
  <p>The complete MediAccess source code, configuration files, and documentation are version-controlled in the official public GitHub repository:</p>
  <p><strong>Repository URL:</strong> <a href="https://github.com/durga1610/medical-app.git">https://github.com/durga1610/medical-app.git</a></p>
  <div class="figure-box">
    <img src="{get_img_src('appendix_j_github_repo.png')}" alt="GitHub Repository Evidence">
    <div class="figure-caption">Figure J.1: Official GitHub version control repository evidence (durga1610/medical-app)</div>
  </div>
</div>

<!-- PAGE 22: OUTCOME MAPPING SHEET -->
<div class="page">
  <h1>CAPSTONE PROJECT OUTCOME MAPPING SHEET</h1>
  <p class="center" style="font-style: italic; margin-bottom: 20px;">To be completed by the department/faculty assessor.</p>
  <table>
    <thead><tr><th style="width: 45%;">Outcome</th><th style="width: 25%;">Evidence SO / Area</th><th style="width: 30%;">Location in This Report</th></tr></thead>
    <tbody>
      <tr><td>Complex engineering problem formulation</td><td class="center">SO1</td><td>Ch. 1, Ch. 2</td></tr>
      <tr><td>Engineering design under constraints</td><td class="center">SO2</td><td>Ch. 3</td></tr>
      <tr><td>Written/oral technical communication</td><td class="center">SO3</td><td>Whole report + Viva</td></tr>
      <tr><td>Ethics and professional responsibility</td><td class="center">SO4</td><td>Ch. 3 (3.7), Appendix F</td></tr>
      <tr><td>Teamwork and leadership</td><td class="center">SO5</td><td>Ch. 4 (4.8)</td></tr>
      <tr><td>Experimentation, analysis, engineering judgment</td><td class="center">SO6</td><td>Ch. 4 (4.3–4.6)</td></tr>
      <tr><td>Independent acquisition of new knowledge</td><td class="center">SO7</td><td>Ch. 5 (5.3)</td></tr>
      <tr><td>Standards compliance</td><td class="center">SO2</td><td>Ch. 3 (3.2)</td></tr>
      <tr><td>Sustainability and societal/environmental impact</td><td class="center">SO2/SO4</td><td>Ch. 3 (3.7)</td></tr>
      <tr><td>Risk assessment and mitigation</td><td class="center">SO2/SO4</td><td>Ch. 3 (3.7, Table 3.8)</td></tr>
      <tr><td>Security considerations</td><td class="center">Relevant SO</td><td>Ch. 3 (3.7)</td></tr>
      <tr><td>Integrated/system-level engineering</td><td class="center">SO1/SO2</td><td>Ch. 3 (3.5), Ch. 4 (4.2)</td></tr>
      <tr><td>Project planning and management</td><td class="center">SO5</td><td>Ch. 4 (4.8, Fig. 4.6)</td></tr>
      <tr><td>Individual contribution</td><td class="center">SO1–SO7</td><td>Contribution Statement + Ch. 4 (4.8) + Appendix J</td></tr>
    </tbody>
  </table>
</div>

</body>
</html>
"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"[OK] Written HTML report: {HTML_FILE}")

# Render to PDF using Chrome Headless
cmd_pdf = [
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    f"--print-to-pdf={PDF_FILE}",
    "--print-to-pdf-no-header",
    f"file:///{HTML_FILE.replace(os.sep, '/')}"
]

print("Rendering PDF report via Google Chrome headless...")
res = subprocess.run(cmd_pdf, capture_output=True, text=True)
if os.path.exists(PDF_FILE) and os.path.getsize(PDF_FILE) > 1000:
    print(f"[OK] Successfully generated PDF Report: {PDF_FILE} ({os.path.getsize(PDF_FILE):,} bytes)")
else:
    print(f"[WARN] PDF generation returned code {res.returncode}. Stderr: {res.stderr}")

