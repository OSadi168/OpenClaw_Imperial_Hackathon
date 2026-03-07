import pandas as pd
import hashlib
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

RAW_FILE = ROOT / "Data" / "esg" / "allprojects.csv"
CLEAN_FILE = ROOT / "Data" / "esg" / "allprojects_cleaned.csv"
ORG_FILE = ROOT / "Data" / "esg" / "companies_dataset.csv"
HASH_FILE = ROOT / "Data" / "esg" / "dataset_hash.txt"


def clean_projects():

    df = pd.read_csv(RAW_FILE, dtype=str)

    df.columns = df.columns.str.strip()

    # Remove rows with ANY missing value
    df_clean = df.dropna(axis=0, how="any")

    # Force geographic scope
    if "Region" in df_clean.columns:
        df_clean["Region"] = "Europe"

    if "Country/Area" in df_clean.columns:
        df_clean["Country/Area"] = "United Kingdom"

    # --- redistribute project types ---
    if "Project Type" in df_clean.columns:

        original_types = [
            "Agriculture Forestry and Other Land Use",
            "Renewable Energy",
            "Energy Demand",
            "Transport",
            "Waste Handling and Disposal",
            "Chemical Industry",
            "Carbon Capture and Storage",
            "Manufacturing Industries"
        ]

        df_clean["Project Type"] = [
            random.choice(original_types)
            for _ in range(len(df_clean))
        ]

    df_clean.to_csv(CLEAN_FILE, index=False)

    print("Cleaned dataset saved:", CLEAN_FILE)
    print("Rows remaining:", len(df_clean))

    return df_clean


def extract_companies(df):

    companies = df[["Proponent", "Country/Area", "Region"]].drop_duplicates()

    companies = companies.rename(columns={
        "Proponent": "company_name",
        "Country/Area": "country",
        "Region": "region"
    })

    companies.to_csv(ORG_FILE, index=False)

    print("Company dataset saved:", ORG_FILE)
    print("Unique companies:", len(companies))

    return companies


def generate_hash():

    sha = hashlib.sha256()

    with open(ORG_FILE, "rb") as f:
        while chunk := f.read(8192):
            sha.update(chunk)

    hash_value = sha.hexdigest()

    with open(HASH_FILE, "w") as f:
        f.write(hash_value)

    print("\nSHA256:", hash_value)
    print("Hash saved:", HASH_FILE)


def main():

    df_clean = clean_projects()

    extract_companies(df_clean)

    generate_hash()


if __name__ == "__main__":
    main()