import random
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User, Medicine, Pharmacy, PharmacyInventory, Reservation, ReservationItem, Order, OrderItem
from .auth import hash_password

SAMPLE_MEDICINES = [
    {
        "name": "Dolo 650",
        "generic_name": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Micro Labs Ltd",
        "category": "Analgesic & Antipyretic",
        "description": "Fast-acting relief from fever, mild to moderate body ache, headache, and post-vaccination fever.",
        "usage_instructions": "Take 1 tablet every 4-6 hours as advised by a doctor. Do not exceed 4 tablets in 24 hours.",
        "side_effects": "Rare: Nausea, allergic skin rashes in hypersensitive individuals.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        "ocr_keywords": "dolo, 650, paracetamol, micro labs, antipyretic, tablet"
    },
    {
        "name": "Paracetamol 500",
        "generic_name": "Paracetamol",
        "strength": "500 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Cipla Ltd",
        "category": "Analgesic & Antipyretic",
        "description": "Standard fever reducer and analgesic for general pain relief, headache, and toothache.",
        "usage_instructions": "Take with water after food as recommended by your physician.",
        "side_effects": "Well tolerated; excessive dose may cause liver strain.",
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300",
        "ocr_keywords": "paracetamol, 500, cipla, crocin, pacimol, antipyretic"
    },
    {
        "name": "Cetirizine 10",
        "generic_name": "Cetirizine Hydrochloride",
        "strength": "10 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Dr. Reddy's Laboratories",
        "category": "Antihistamine / Allergy",
        "description": "Second-generation antihistamine relieving allergy symptoms like runny nose, sneezing, itchy eyes, and hives.",
        "usage_instructions": "Take 1 tablet once daily, preferably in the evening.",
        "side_effects": "Mild drowsiness, dry mouth, tiredness.",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300",
        "ocr_keywords": "cetirizine, ctz, aldrine, zyrtec, allergy, dr reddy"
    },
    {
        "name": "Azithromycin 500",
        "generic_name": "Azithromycin",
        "strength": "500 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Lupin Pharmaceuticals",
        "category": "Antibiotic (Macrolide)",
        "description": "Broad-spectrum macrolide antibiotic treating respiratory tract infections, tonsillitis, and skin infections.",
        "usage_instructions": "Complete full 3 to 5 day course exactly as prescribed by physician. Take 1 hour before or 2 hours after meals.",
        "side_effects": "Stomach upset, diarrhea, mild abdominal pain.",
        "image_url": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300",
        "ocr_keywords": "azithromycin, azithral, azee, lupin, 500mg, macrolide"
    },
    {
        "name": "Amoxicillin 500",
        "generic_name": "Amoxicillin Trihydrate",
        "strength": "500 mg",
        "dosage_form": "Capsule",
        "manufacturer": "Alkem Laboratories",
        "category": "Antibiotic (Penicillin)",
        "description": "Penicillin antibiotic for bacterial ear, nose, throat, urinary tract, and dental infections.",
        "usage_instructions": "Take every 8 hours with full glass of water. Finish entire course.",
        "side_effects": "Nausea, skin rash, loose stools.",
        "image_url": "https://images.unsplash.com/photo-1550572017-ed21f66c2538?w=300",
        "ocr_keywords": "amoxicillin, mox, novamox, alkem, 500 mg, capsule"
    },
    {
        "name": "Pantoprazole 40",
        "generic_name": "Pantoprazole Sodium",
        "strength": "40 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Sun Pharma",
        "category": "Antacid / Proton Pump Inhibitor",
        "description": "Reduces stomach acid production to treat acid reflux, GERD, heartburn, and peptic ulcers.",
        "usage_instructions": "Swallow whole 30 to 60 minutes before morning breakfast. Do not chew or crush.",
        "side_effects": "Headache, diarrhea, dizziness, gas.",
        "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300",
        "ocr_keywords": "pantoprazole, pan 40, pantocid, sun pharma, gastro-resistant, 40mg"
    },
    {
        "name": "ORS Electral Sachet",
        "generic_name": "Oral Rehydration Salts (WHO Formula)",
        "strength": "21.8 g",
        "dosage_form": "Sachet Powder",
        "manufacturer": "FDC Limited",
        "category": "Rehydration / Electrolytes",
        "description": "WHO-recommended oral electrolyte formula to restore vital salts and fluids lost during dehydration, vomiting, or diarrhea.",
        "usage_instructions": "Dissolve the entire contents of 1 sachet in exactly 1 liter of clean drinking water.",
        "side_effects": "Safe when dissolved in recommended water proportion.",
        "image_url": "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300",
        "ocr_keywords": "electral, ors, oral rehydration salts, fdc, sodium chloride, dextrose"
    },
    {
        "name": "Ibuprofen 200",
        "generic_name": "Ibuprofen",
        "strength": "200 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Abbott Healthcare",
        "category": "NSAID / Anti-inflammatory",
        "description": "Non-steroidal anti-inflammatory drug providing rapid relief from toothaches, joint pain, menstrual cramps, and muscular strains.",
        "usage_instructions": "Take with or right after food or milk to prevent gastric irritation.",
        "side_effects": "Heartburn, dyspepsia, mild dizziness.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        "ocr_keywords": "ibuprofen, brufen, abbott, nsaid, 200mg, anti-inflammatory"
    },
    {
        "name": "Metformin 500",
        "generic_name": "Metformin Hydrochloride",
        "strength": "500 mg",
        "dosage_form": "Tablet",
        "manufacturer": "USV Pvt Ltd",
        "category": "Antidiabetic",
        "description": "First-line oral blood glucose-lowering medication for managing Type 2 diabetes mellitus.",
        "usage_instructions": "Take with meals to minimize gastrointestinal discomfort.",
        "side_effects": "Metallic taste, stomach fullness, loose stools.",
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300",
        "ocr_keywords": "metformin, glycomet, usv, 500mg, hydrochloride, diabetes"
    },
    {
        "name": "Vitamin C Limcee 500",
        "generic_name": "Ascorbic Acid (Vitamin C)",
        "strength": "500 mg",
        "dosage_form": "Chewable Tablet",
        "manufacturer": "Abbott India",
        "category": "Vitamins & Supplements",
        "description": "Essential antioxidant supplement supporting immune defenses, wound healing, collagen synthesis, and iron absorption.",
        "usage_instructions": "Chew 1 tablet daily or as directed by healthcare provider.",
        "side_effects": "High doses may cause mild stomach cramp or diarrhea.",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300",
        "ocr_keywords": "limcee, vitamin c, ascorbic acid, abbott, chewable, orange"
    },
    {
        "name": "Montair-LC",
        "generic_name": "Montelukast 10mg + Levocetirizine 5mg",
        "strength": "10 mg + 5 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Cipla Ltd",
        "category": "Respiratory / Antiallergic",
        "description": "Dual action relief for allergic rhinitis, seasonal asthma symptoms, and chronic nighttime cough.",
        "usage_instructions": "Take 1 tablet at night before bedtime.",
        "side_effects": "Drowsiness, fatigue, dry mouth.",
        "image_url": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300",
        "ocr_keywords": "montair-lc, montair, montelukast, levocetirizine, cipla"
    },
    {
        "name": "Omeprazole 20",
        "generic_name": "Omeprazole",
        "strength": "20 mg",
        "dosage_form": "Capsule",
        "manufacturer": "Zydus Cadila",
        "category": "Antacid / PPI",
        "description": "Proton pump inhibitor effectively treating heartburn, gastric irritation, and reflux esophagitis.",
        "usage_instructions": "Take on an empty stomach in the morning.",
        "side_effects": "Flatulence, headache, stomach discomfort.",
        "image_url": "https://images.unsplash.com/photo-1550572017-ed21f66c2538?w=300",
        "ocr_keywords": "omeprazole, omez, zydus, 20mg, capsule, enteric coated"
    },
    {
        "name": "Augmentin 625 Duo",
        "generic_name": "Amoxicillin 500mg + Potassium Clavulanate 125mg",
        "strength": "625 mg",
        "dosage_form": "Tablet",
        "manufacturer": "GlaxoSmithKline (GSK)",
        "category": "Antibiotic (Broad Spectrum)",
        "description": "Potent beta-lactamase protected antibiotic for resistant respiratory, skin, urinary, and dental bacterial infections.",
        "usage_instructions": "Take at the start of a meal to enhance absorption and lessen gastrointestinal intolerance.",
        "side_effects": "Mild diarrhea, nausea, abdominal discomfort.",
        "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300",
        "ocr_keywords": "augmentin, 625 duo, amoxicillin, clavulanate, gsk, potassium"
    },
    {
        "name": "Amlodipine 5",
        "generic_name": "Amlodipine Besylate",
        "strength": "5 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Torrent Pharmaceuticals",
        "category": "Cardiovascular / Antihypertensive",
        "description": "Calcium channel blocker lowering high blood pressure and preventing angina episodes.",
        "usage_instructions": "Take once daily with or without food at the same time each day.",
        "side_effects": "Ankle swelling (peripheral edema), flushing, fatigue.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        "ocr_keywords": "amlodipine, amlong, stamlo, torrent, 5mg, besylate"
    },
    {
        "name": "Telmisartan 40",
        "generic_name": "Telmisartan",
        "strength": "40 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Glenmark Pharmaceuticals",
        "category": "Cardiovascular / Antihypertensive",
        "description": "Angiotensin II receptor blocker (ARB) for blood pressure management and cardiovascular risk reduction.",
        "usage_instructions": "Take once a day regularly with water.",
        "side_effects": "Dizziness, back pain, sinus congestion.",
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300",
        "ocr_keywords": "telmisartan, telma 40, glenmark, arb, blood pressure, 40mg"
    },
    {
        "name": "Atorvastatin 10",
        "generic_name": "Atorvastatin Calcium",
        "strength": "10 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Sun Pharma",
        "category": "Cholesterol / Statin",
        "description": "Statin medication lowering bad LDL cholesterol and triglycerides while elevating protective HDL cholesterol.",
        "usage_instructions": "Take once daily in the evening or bedtime.",
        "side_effects": "Muscle ache, elevated liver enzymes (rare), digestive discomfort.",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300",
        "ocr_keywords": "atorvastatin, atorva, lipitor, sun pharma, 10mg, statin"
    },
    {
        "name": "Zincovit Multivitamin",
        "generic_name": "Multivitamins with Zinc & Minerals",
        "strength": "Nutritional Formula",
        "dosage_form": "Tablet",
        "manufacturer": "Apex Laboratories",
        "category": "Vitamins & Supplements",
        "description": "Comprehensive daily multivitamin with elemental Zinc to boost vitality, cellular recovery, and immunity.",
        "usage_instructions": "1 tablet once daily after main lunch or breakfast.",
        "side_effects": "Generally well tolerated; mild stomach fullness if taken empty stomach.",
        "image_url": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300",
        "ocr_keywords": "zincovit, zinc, apex, multivitamin, minerals, grape seed extract"
    },
    {
        "name": "Digene Gel Antacid",
        "generic_name": "Magnesium Hydroxide + Aluminium Hydroxide + Simethicone",
        "strength": "200 ml",
        "dosage_form": "Syrup / Suspension",
        "manufacturer": "Abbott Healthcare",
        "category": "Antacid & Antiflatulent",
        "description": "Fast-acting soothing suspension neutralizing stomach hyperacidity and relieving bloating and gas pressure.",
        "usage_instructions": "Shake well before use. Take 2 teaspoons (10 ml) 30 minutes after meals and before bedtime.",
        "side_effects": "Mild bowel irregularity if overused.",
        "image_url": "https://images.unsplash.com/photo-1550572017-ed21f66c2538?w=300",
        "ocr_keywords": "digene, antacid, abbott, mint, simethicone, suspension, gel"
    },
    {
        "name": "Cough Syrup Benadryl",
        "generic_name": "Diphenhydramine + Ammonium Chloride + Sodium Citrate",
        "strength": "100 ml",
        "dosage_form": "Syrup",
        "manufacturer": "Johnson & Johnson",
        "category": "Cough & Cold",
        "description": "Relieves irritating dry and allergic cough, chest congestion, throat irritation, and sneezing.",
        "usage_instructions": "5 ml to 10 ml every 4-6 hours. Avoid driving after taking as it causes drowsiness.",
        "side_effects": "Drowsiness, dry mouth, blurred vision.",
        "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300",
        "ocr_keywords": "benadryl, cough syrup, diphenhydramine, johnson, 100ml"
    },
    {
        "name": "Volini Pain Relief Gel",
        "generic_name": "Diclofenac Diethylamine + Methyl Salicylate + Menthol",
        "strength": "30 g",
        "dosage_form": "Gel / Ointment",
        "manufacturer": "Sun Pharma",
        "category": "Topical Analgesic",
        "description": "Deep-penetrating topical pain formula for rapid relief of joint, back, neck, and sports muscle aches.",
        "usage_instructions": "Gently massage 3 to 4 times a day over the painful area. Do not apply on broken skin.",
        "side_effects": "Local skin redness or warming sensation.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        "ocr_keywords": "volini, diclofenac, pain relief gel, sun pharma, menthol, 30g"
    },
    {
        "name": "Becosules Z Capsules",
        "generic_name": "B-Complex Forte with Vitamin C and Zinc",
        "strength": "Fortified B-Complex",
        "dosage_form": "Capsule",
        "manufacturer": "Pfizer Ltd",
        "category": "Vitamins & Supplements",
        "description": "Treats mouth ulcers, Vitamin B deficiency, general debility, and improves skin and hair vitality.",
        "usage_instructions": "Take 1 capsule daily after a meal.",
        "side_effects": "Harmless bright yellow coloration of urine (due to riboflavin).",
        "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300",
        "ocr_keywords": "becosules, b-complex, pfizer, becosules-z, vitamin b, zinc"
    },
    {
        "name": "Levothyroxine 50 mcg",
        "generic_name": "Thyroxine Sodium",
        "strength": "50 mcg",
        "dosage_form": "Tablet",
        "manufacturer": "Abbott Healthcare",
        "category": "Hormones / Thyroid",
        "description": "Synthetic thyroid hormone replacement for managing hypothyroidism (underactive thyroid gland).",
        "usage_instructions": "Take strictly first thing in the morning with water on empty stomach, 30-60 mins before breakfast.",
        "side_effects": "Rare when correctly dosed; palpitations or weight loss if over-replaced.",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300",
        "ocr_keywords": "thyronorm, eltroxin, levothyroxine, abbott, 50 mcg, thyroid"
    },
    {
        "name": "Candid Mouth Paint",
        "generic_name": "Clotrimazole 1%",
        "strength": "15 ml",
        "dosage_form": "Topical Drops",
        "manufacturer": "Glenmark Pharmaceuticals",
        "category": "Antifungal",
        "description": "Antifungal solution for oral candidiasis (oral thrush) and fungal lesions of the mouth.",
        "usage_instructions": "Apply 10-20 drops over affected oral regions with dropper 3-4 times daily.",
        "side_effects": "Mild burning or stinging at application site.",
        "image_url": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300",
        "ocr_keywords": "candid, clotrimazole, glenmark, mouth paint, antifungal, 15ml"
    },
    {
        "name": "Erythromycin 250",
        "generic_name": "Erythromycin Stearate",
        "strength": "250 mg",
        "dosage_form": "Tablet",
        "manufacturer": "Alembic Pharmaceuticals",
        "category": "Antibiotic (Macrolide)",
        "description": "Macrolide antibiotic used for respiratory tract and severe skin acne conditions.",
        "usage_instructions": "Swallow with water on an empty stomach or with light food if nausea occurs.",
        "side_effects": "Abdominal cramping, nausea, mild diarrhea.",
        "image_url": "https://images.unsplash.com/photo-1550572017-ed21f66c2538?w=300",
        "ocr_keywords": "erythromycin, althrocin, alembic, 250mg, antibiotic"
    },
    {
        "name": "Otrivin Nasal Spray",
        "generic_name": "Xylometazoline Hydrochloride 0.1%",
        "strength": "10 ml",
        "dosage_form": "Nasal Spray",
        "manufacturer": "GSK Consumer Healthcare",
        "category": "Nasal Decongestant",
        "description": "Fast-acting nasal decongestant spray relieving blocked nose in colds, sinusitis, and allergies within 2 minutes.",
        "usage_instructions": "1 spray in each nostril up to 3 times daily. Do not use continuously for more than 7 days.",
        "side_effects": "Transient nasal dryness or mild stinging.",
        "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300",
        "ocr_keywords": "otrivin, xylometazoline, gsk, nasal spray, 0.1%, decongestant"
    },
    {
        "name": "Betadine 10% Ointment",
        "generic_name": "Povidone-Iodine 10% w/w",
        "strength": "20 g",
        "dosage_form": "Ointment",
        "manufacturer": "Win-Medicare Pvt Ltd",
        "category": "Antiseptic & Disinfectant",
        "description": "Broad-spectrum antiseptic for immediate first-aid disinfection of cuts, abrasions, burns, and minor surgical wounds.",
        "usage_instructions": "Clean affected wound area gently and apply thin film. Bandage if needed.",
        "side_effects": "Local skin irritation in iodine-sensitive individuals.",
        "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        "ocr_keywords": "betadine, povidone iodine, win-medicare, 10%, antiseptic, ointment"
    }
]

SAMPLE_PHARMACIES = [
    {
        "name": "Apollo Care Pharmacy",
        "address": "Shop 4, Ground Floor, Central Healthcare Plaza, 12th Main",
        "city": "Bengaluru",
        "phone": "+91 98450 11223",
        "email": "apollo@mediaccess.com",
        "latitude": 12.9352,
        "longitude": 77.6245,
        "opening_hours": "7:00 AM - 11:30 PM",
        "home_delivery_available": True,
        "delivery_fee": 25.0,
        "rating": 4.8
    },
    {
        "name": "MedPlus Health Store",
        "address": "Plot 88, 5th Cross Road, Near Green Park Metro, Indiranagar",
        "city": "Bengaluru",
        "phone": "+91 98450 22334",
        "email": "medplus@mediaccess.com",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "opening_hours": "8:00 AM - 10:30 PM",
        "home_delivery_available": True,
        "delivery_fee": 30.0,
        "rating": 4.6
    },
    {
        "name": "Wellness Forever Chemist",
        "address": "24/7 Junction, Koramangala Ring Road, 4th Block",
        "city": "Bengaluru",
        "phone": "+91 98450 33445",
        "email": "wellness@mediaccess.com",
        "latitude": 12.9341,
        "longitude": 77.6190,
        "opening_hours": "24 Hours Open (Day & Night)",
        "home_delivery_available": True,
        "delivery_fee": 35.0,
        "rating": 4.9
    },
    {
        "name": "City Life Medicos",
        "address": "Opposite Civil Hospital Gate 2, Commercial Street",
        "city": "Bengaluru",
        "phone": "+91 98450 44556",
        "email": "citylife@mediaccess.com",
        "latitude": 12.9822,
        "longitude": 77.6083,
        "opening_hours": "9:00 AM - 9:00 PM",
        "home_delivery_available": False,
        "delivery_fee": 0.0,
        "rating": 4.3
    },
    {
        "name": "Sanjeevani Trust Pharmacy",
        "address": "Community Health Center Campus, Jayanagar 4th Block",
        "city": "Bengaluru",
        "phone": "+91 98450 55667",
        "email": "sanjeevani@mediaccess.com",
        "latitude": 12.9250,
        "longitude": 77.5938,
        "opening_hours": "8:30 AM - 8:30 PM",
        "home_delivery_available": True,
        "delivery_fee": 20.0,
        "rating": 4.7
    },
    {
        "name": "PrimeCare 24x7 Pharmacy",
        "address": "Near Aster MedCity Hospital, Bellandur Outer Ring Road",
        "city": "Bengaluru",
        "phone": "+91 98450 66778",
        "email": "primecare@mediaccess.com",
        "latitude": 12.9260,
        "longitude": 77.6762,
        "opening_hours": "24 Hours Open (Day & Night)",
        "home_delivery_available": True,
        "delivery_fee": 40.0,
        "rating": 4.5
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        med_count = db.query(Medicine).count()
        if med_count >= len(SAMPLE_MEDICINES):
            print(f"Database already populated with {med_count} medicines.")
            return

        print("Seeding sample medicines...")
        created_medicines = []
        for m_data in SAMPLE_MEDICINES:
            existing = db.query(Medicine).filter(Medicine.name == m_data["name"]).first()
            if not existing:
                med = Medicine(**m_data)
                db.add(med)
                db.flush()
                created_medicines.append(med)
            else:
                created_medicines.append(existing)

        print("Seeding sample pharmacies...")
        created_pharmacies = []
        for p_data in SAMPLE_PHARMACIES:
            existing = db.query(Pharmacy).filter(Pharmacy.name == p_data["name"]).first()
            if not existing:
                pharm = Pharmacy(**p_data)
                db.add(pharm)
                db.flush()
                created_pharmacies.append(pharm)
            else:
                created_pharmacies.append(existing)

        # Seed sample demo users
        print("Seeding demo user and pharmacy manager accounts...")
        default_pwd = hash_password("Password123!")

        # 1. Regular patient user
        demo_user = db.query(User).filter(User.email == "user@mediaccess.com").first()
        if not demo_user:
            demo_user = User(
                email="user@mediaccess.com",
                password_hash=default_pwd,
                full_name="Sarah Jenkins",
                phone="+91 98765 43210",
                address="Flat 402, Sunshine Apartments, 8th Main, Bengaluru",
                role="user"
            )
            db.add(demo_user)
            db.flush()

        # 2. Demo delivery courier agent
        demo_delivery = db.query(User).filter(User.email == "delivery@mediaccess.com").first()
        if not demo_delivery:
            demo_delivery = User(
                email="delivery@mediaccess.com",
                password_hash=default_pwd,
                full_name="Ramesh Kumar (Express Delivery)",
                phone="+91 98888 77777",
                address="Hub 12, Koramangala Logistics Center",
                role="delivery"
            )
            db.add(demo_delivery)
            db.flush()

        # 3. Pharmacy managers

        pharmacy_users = [
            ("apollo@mediaccess.com", "Apollo Pharmacy Manager", created_pharmacies[0].id),
            ("medplus@mediaccess.com", "MedPlus Store Admin", created_pharmacies[1].id),
            ("wellness@mediaccess.com", "Wellness Forever Manager", created_pharmacies[2].id),
        ]

        for p_email, p_fullname, pharm_id in pharmacy_users:
            p_user = db.query(User).filter(User.email == p_email).first()
            if not p_user:
                p_user = User(
                    email=p_email,
                    password_hash=default_pwd,
                    full_name=p_fullname,
                    phone="+91 98450 00000",
                    address="Pharmacy Management Office",
                    role="pharmacy",
                    pharmacy_id=pharm_id
                )
                db.add(p_user)

        # Seed Inventory items for each pharmacy
        print("Seeding realistic pharmacy inventories...")
        base_prices = {
            "Dolo 650": 34.0,
            "Paracetamol 500": 20.0,
            "Cetirizine 10": 38.0,
            "Azithromycin 500": 120.0,
            "Amoxicillin 500": 85.0,
            "Pantoprazole 40": 95.0,
            "ORS Electral Sachet": 22.0,
            "Ibuprofen 200": 28.0,
            "Metformin 500": 42.0,
            "Vitamin C Limcee 500": 26.0,
            "Montair-LC": 180.0,
            "Omeprazole 20": 60.0,
            "Augmentin 625 Duo": 210.0,
            "Amlodipine 5": 30.0,
            "Telmisartan 40": 78.0,
            "Atorvastatin 10": 115.0,
            "Zincovit Multivitamin": 110.0,
            "Digene Gel Antacid": 135.0,
            "Cough Syrup Benadryl": 115.0,
            "Volini Pain Relief Gel": 90.0,
            "Becosules Z Capsules": 45.0,
            "Levothyroxine 50 mcg": 140.0,
            "Candid Mouth Paint": 125.0,
            "Erythromycin 250": 98.0,
            "Otrivin Nasal Spray": 95.0,
            "Betadine 10% Ointment": 82.0
        }

        for pharmacy in created_pharmacies:
            for medicine in created_medicines:
                existing_inv = db.query(PharmacyInventory).filter(
                    PharmacyInventory.pharmacy_id == pharmacy.id,
                    PharmacyInventory.medicine_id == medicine.id
                ).first()

                if not existing_inv:
                    base_price = base_prices.get(medicine.name, 50.0)
                    # Add minor realistic variance (-5% to +10%) across pharmacies
                    variance = random.choice([0.95, 0.98, 1.0, 1.05, 1.08])
                    price = round(base_price * variance, 2)
                    
                    # Some pharmacies may have high stock, some low, some out of stock for demo variety
                    stock = random.choice([45, 80, 120, 25, 0, 15, 60])
                    # City Life Medicos has lower stock overall for demo comparison
                    if pharmacy.name == "City Life Medicos":
                        stock = random.choice([0, 5, 12, 0, 8])

                    inv = PharmacyInventory(
                        pharmacy_id=pharmacy.id,
                        medicine_id=medicine.id,
                        price=price,
                        stock_quantity=stock,
                        is_available=(stock > 0)
                    )
                    db.add(inv)

        db.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
