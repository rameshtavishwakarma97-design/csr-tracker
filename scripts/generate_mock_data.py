import json
import random
import uuid
from typing import List, Dict, Any
import numpy as np
from scipy import stats

def generate_beneficiaries(n: int, wave: str, start_id: int) -> List[Dict[str, Any]]:
    beneficiaries = []
    
    first_names_female = ["Sunita", "Meena", "Renu", "Priya", "Anita", "Sita", "Kavita", "Lata", "Pooja", "Asha"]
    first_names_male = ["Ramesh", "Suresh", "Arjun", "Rakesh", "Vikas", "Vijay", "Rahul", "Dinesh", "Sanjay", "Amit"]
    last_names = ["Patil", "Sharma", "Pawar", "Shinde", "Deshmukh", "Jadhav", "Kulkarni", "Chavan", "Gaekwad", "More"]

    districts = ["Pune", "Aurangabad", "Nashik", "Nagpur"]
    cities_by_district = {
        "Pune": ["Pimpri-Chinchwad", "Baramati", "Shirur"],
        "Aurangabad": ["Sillod", "Paithan", "Vaijapur"],
        "Nashik": ["Malegaon", "Igatpuri", "Sinnar"],
        "Nagpur": ["Kamptee", "Umred", "Katol"]
    }
    
    ngos = ["Pratham", "SEWA", "Goonj", "Magic Bus"]
    centers = ["Pune-North", "Aurangabad-Central", "Nashik-East", "Nagpur-West"]
    archetypes = [
        ("Standard Positive", 0.40),
        ("Suresh (Bookkeeping+Credit)", 0.15),
        ("Meena (Invisible Improver)", 0.15),
        ("Renu (False Positive)", 0.10),
        ("Arjun (Road Construction Shock)", 0.08),
        ("Priya (Non-converter)", 0.07),
        ("Rakesh (Gaming Flag)", 0.05)
    ]

    for i in range(n):
        ben_id = f"BEN-{start_id + i:04d}"
        district = random.choice(districts)
        city = random.choice(cities_by_district[district])
        ngo = random.choice(ngos)
        center = random.choice(centers)
        
        arch_names, arch_weights = zip(*archetypes)
        archetype = random.choices(arch_names, weights=arch_weights)[0]
        
        gender = random.choices(["Female", "Male"], weights=[0.60, 0.40])[0]
        if gender == "Female":
            first_name = random.choice(first_names_female)
        else:
            first_name = random.choice(first_names_male)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"

        phone_type = random.choices(["Smartphone", "Feature Phone", "None"], weights=[0.55, 0.30, 0.15])[0]
        
        if phone_type == "Smartphone":
            confidence_tier = random.choices(["High", "Medium", "Low"], weights=[0.70, 0.20, 0.10])[0]
        elif phone_type == "Feature Phone":
            confidence_tier = random.choices(["Medium", "Low"], weights=[0.30, 0.70])[0]
        else:
            confidence_tier = "Low"

        modules_pool = ["Bookkeeping", "Credit Facilitation", "Digital Marketing", "Market Access"]
        if wave == "Wave 1":
            completion_pct = min(100, max(15, int(np.random.normal(78, 18))))
            num_modules = max(1, int(round((completion_pct / 100) * 4)))
            completed_modules = random.sample(modules_pool, num_modules)
        else:
            completion_pct = 0
            completed_modules = []

        b = {
            "beneficiary_id": ben_id,
            "name": full_name,
            "wave": wave,
            "cohort_id": f"COHORT-{random.randint(2601, 2604)}",
            "age": random.randint(20, 55),
            "gender": gender,
            "district": district,
            "city": city,
            "ngo_partner": ngo,
            "training_center": center,
            "survey_status": random.choices(["Completed", "Pending", "Overdue"], weights=[0.70, 0.20, 0.10])[0] if wave == "Wave 1" else "Completed",
            "phone_type": phone_type,
            "data_confidence_tier": confidence_tier,
            "scenario_archetype": archetype,
            "occupation_type": random.choices(["Trader", "Service", "Home-based", "Aspirant"], weights=[0.30, 0.25, 0.25, 0.20])[0],
            "training_completion_pct": completion_pct,
            "completed_modules": completed_modules,
            
            "has_upi_baseline": random.random() < 0.28,
            "has_bank_baseline": random.random() < 0.52,
            "has_bookkeeping_baseline": random.random() < 0.12,
            "has_credit_baseline": random.random() < 0.14,
        }
        
        baseline_income = int(np.random.lognormal(mean=8.3, sigma=0.45))
        baseline_income = max(1800, min(15000, baseline_income))
        b["baseline_income"] = round(baseline_income / 100) * 100
        
        beneficiaries.append(b)
    return beneficiaries

def apply_outcomes(beneficiaries: List[Dict[str, Any]]) -> None:
    for b in beneficiaries:
        base_income = b["baseline_income"]
        wave = b["wave"]
        arch = b["scenario_archetype"]
        
        ngo_bonus = 0.05 if b["ngo_partner"] == "SEWA" else (0.08 if b["ngo_partner"] == "Pratham" else 0.02)
        
        if wave == "Wave 1":
            if arch == "Suresh (Bookkeeping+Credit)":
                growth_pct = random.uniform(0.35, 0.65)
                b["business_survival_flag"] = True
            elif arch == "Meena (Invisible Improver)":
                growth_pct = random.uniform(0.25, 0.45)
                b["business_survival_flag"] = True
                b["data_confidence_tier"] = "Low"
            elif arch == "Renu (False Positive)":
                growth_pct = random.uniform(0.02, 0.08)
                b["business_survival_flag"] = True
            elif arch == "Arjun (Road Construction Shock)":
                growth_pct = random.uniform(-0.25, -0.05)
                b["business_survival_flag"] = False
            elif arch == "Priya (Non-converter)":
                growth_pct = random.uniform(-0.02, 0.05)
                b["business_survival_flag"] = True
            elif arch == "Rakesh (Gaming Flag)":
                growth_pct = random.uniform(0.15, 0.30)
                b["business_survival_flag"] = True
            else:
                growth_pct = random.uniform(0.12, 0.38) + ngo_bonus
                b["business_survival_flag"] = random.random() < 0.88
        else:
            growth_pct = random.uniform(0.01, 0.09)
            b["business_survival_flag"] = random.random() < 0.68

        m3_income = base_income * (1 + (growth_pct * 0.45))
        m6_income = base_income * (1 + growth_pct)
        
        b["month3_income"] = round(m3_income / 100) * 100
        b["current_income"] = round(m6_income / 100) * 100
        b["income_growth_abs"] = b["current_income"] - base_income
        b["income_growth_pct"] = round((b["current_income"] - base_income) / base_income * 100, 1)

        if wave == "Wave 1" and growth_pct > 0.10:
            b["has_upi_month6"] = True
            b["has_bank_month6"] = True
            b["has_bookkeeping_month6"] = "Bookkeeping" in b["completed_modules"] or random.random() < 0.45
            b["has_credit_month6"] = "Credit Facilitation" in b["completed_modules"] or random.random() < 0.38
        else:
            b["has_upi_month6"] = b["has_upi_baseline"] or (random.random() < 0.10)
            b["has_bank_month6"] = b["has_bank_baseline"] or (random.random() < 0.15)
            b["has_bookkeeping_month6"] = b["has_bookkeeping_baseline"]
            b["has_credit_month6"] = b["has_credit_baseline"] or (random.random() < 0.08)

def calculate_statistics(beneficiaries: List[Dict[str, Any]]) -> Dict[str, Any]:
    wave1 = [b for b in beneficiaries if b["wave"] == "Wave 1"]
    wave2 = [b for b in beneficiaries if b["wave"] == "Wave 2"]
    
    w1_baseline = [b["baseline_income"] for b in wave1]
    w1_current = [b["current_income"] for b in wave1]
    
    paired_t_stat, paired_p_val = stats.ttest_rel(w1_current, w1_baseline)
    mean_diff = np.mean(w1_current) - np.mean(w1_baseline)
    std_diff = np.std(np.array(w1_current) - np.array(w1_baseline))
    cohens_d = mean_diff / std_diff if std_diff > 0 else 0

    w1_growth = [b["income_growth_pct"] for b in wave1]
    w2_growth = [b["income_growth_pct"] for b in wave2]
    
    ind_t_stat, ind_p_val = stats.ttest_ind(w1_growth, w2_growth)
    did_estimate = np.median(w1_growth) - np.median(w2_growth)

    return {
        "paired_t_test": {
            "t_statistic": round(paired_t_stat, 3),
            "p_value": round(paired_p_val, 6),
            "cohens_d": round(cohens_d, 3),
            "df": len(wave1) - 1
        },
        "independent_t_test": {
            "t_statistic": round(ind_t_stat, 3),
            "p_value": round(ind_p_val, 6),
            "did_estimate_median": round(did_estimate, 1),
            "df": len(wave1) + len(wave2) - 2
        }
    }

def main():
    np.random.seed(42)
    random.seed(42)
    
    trained = generate_beneficiaries(150, "Wave 1", 1001)
    comparison = generate_beneficiaries(100, "Wave 2", 2001)
    
    all_beneficiaries = trained + comparison
    apply_outcomes(all_beneficiaries)
    
    stats_data = calculate_statistics(all_beneficiaries)
    
    output = {
        "beneficiaries": all_beneficiaries,
        "statistics": stats_data
    }
    
    with open("dashboard/src/data/mock_data.json", "w") as f:
        json.dump(output, f, indent=2)
    print("Generated mock_data.json with guaranteed unique IDs!")

if __name__ == "__main__":
    main()
