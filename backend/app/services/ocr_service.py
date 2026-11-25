import re
from typing import List, Tuple
from sqlalchemy.orm import Session
from ..models import Medicine
from ..schemas import OcrMatchCandidate, MedicineResponse

def clean_ocr_text(text: str) -> Tuple[str, List[str]]:
    """Clean raw OCR text, extract meaningful alphanumeric tokens."""
    if not text:
        return "", []
    
    # Replace line breaks and multiple whitespaces
    normalized = re.sub(r"[\r\n\t]+", " ", text)
    # Strip excessive symbols but keep digits, letters, and mg / ml / g
    cleaned = re.sub(r"[^a-zA-Z0-9\.\-\s]", " ", normalized)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    # Split into words of length >= 2
    raw_tokens = cleaned.split()
    tokens = [t.lower() for t in raw_tokens if len(t) >= 2]
    return cleaned, tokens

def calculate_match_score(medicine: Medicine, text_lower: str, tokens: List[str]) -> Tuple[float, List[str], List[str]]:
    score = 0.0
    reasons = []
    matched_tokens = []

    med_name_clean = medicine.name.lower()
    generic_name_clean = medicine.generic_name.lower()
    strength_clean = medicine.strength.lower().replace(" ", "")
    category_clean = medicine.category.lower()

    # Check for direct full brand name in text
    if med_name_clean in text_lower:
        score += 55.0
        reasons.append(f"Full brand name '{medicine.name}' detected in image text")
        matched_tokens.append(medicine.name)
    else:
        # Check individual words of brand name
        brand_words = [w for w in re.split(r"\s+", med_name_clean) if len(w) > 2]
        matched_brand_words = [w for w in brand_words if w in tokens or any(w in t for t in tokens)]
        if matched_brand_words:
            word_score = (len(matched_brand_words) / max(len(brand_words), 1)) * 40.0
            score += word_score
            reasons.append(f"Brand keyword '{', '.join(matched_brand_words)}' matched")
            matched_tokens.extend(matched_brand_words)

    # Check generic name / active ingredients
    if generic_name_clean in text_lower:
        score += 35.0
        reasons.append(f"Active generic compound '{medicine.generic_name}' identified")
        matched_tokens.append(medicine.generic_name)
    else:
        generic_words = [w for w in re.split(r"[\s\+\,\-]+", generic_name_clean) if len(w) > 3]
        matched_gen_words = [w for w in generic_words if w in tokens or any(w in t for t in tokens)]
        if matched_gen_words:
            score += (len(matched_gen_words) / max(len(generic_words), 1)) * 25.0
            reasons.append(f"Active ingredient component '{', '.join(matched_gen_words)}' found")
            matched_tokens.extend(matched_gen_words)

    # Check strength (e.g. "650mg", "500mg", "10mg", "40mg", "650", "500")
    strength_nums = re.findall(r"\d+", medicine.strength)
    if strength_clean in text_lower.replace(" ", ""):
        score += 15.0
        reasons.append(f"Strength specification '{medicine.strength}' matched exactly")
        matched_tokens.append(medicine.strength)
    elif strength_nums and any(num in tokens for num in strength_nums):
        score += 8.0
        reasons.append(f"Dosage numerical value '{strength_nums[0]}' identified")
        matched_tokens.append(strength_nums[0])

    # Check dosage form (e.g. tablet, capsule, syrup)
    dosage_clean = medicine.dosage_form.lower()
    if dosage_clean in text_lower:
        score += 5.0
        reasons.append(f"Dosage form '{medicine.dosage_form}' found")
        matched_tokens.append(medicine.dosage_form)

    # Check OCR keywords
    if medicine.ocr_keywords:
        kw_list = [k.strip().lower() for k in medicine.ocr_keywords.split(",") if k.strip()]
        matched_kw = [k for k in kw_list if k in text_lower or k in tokens]
        if matched_kw:
            score += min(len(matched_kw) * 6.0, 15.0)
            reasons.append(f"Strip pattern keywords: {', '.join(matched_kw)}")
            matched_tokens.extend(matched_kw)

    # Cap score at 99.0% (genuine confidence indicator)
    confidence = min(round(score, 1), 99.0)
    return confidence, reasons, list(set(matched_tokens))

def match_medicines_from_text(db: Session, raw_text: str, min_confidence: float = 25.0) -> Tuple[List[OcrMatchCandidate], List[str]]:
    cleaned_text, tokens = clean_ocr_text(raw_text)
    if not tokens:
        return [], []

    all_medicines = db.query(Medicine).all()
    candidates: List[OcrMatchCandidate] = []

    for med in all_medicines:
        confidence, reasons, matched_tokens = calculate_match_score(med, cleaned_text.lower(), tokens)
        if confidence >= min_confidence:
            candidate = OcrMatchCandidate(
                medicine=MedicineResponse.model_validate(med),
                confidence=confidence,
                match_reasons=reasons,
                matched_tokens=matched_tokens
            )
            candidates.append(candidate)

    # Sort descending by confidence
    candidates.sort(key=lambda c: c.confidence, reverse=True)
    return candidates, tokens
