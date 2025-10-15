import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

print("--- Checking available Gemini models for your API key ---")

try:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("ERROR: GEMINI_API_KEY not found in .env file.")
    else:
        genai.configure(api_key=gemini_key)

        print("\nFound the following models that can generate content:")
        print("----------------------------------------------------")

        found_usable_model = False
        for m in genai.list_models():
          if 'generateContent' in m.supported_generation_methods:
            found_usable_model = True
            print(f"* {m.name}")

        if not found_usable_model:
            print("\nWARNING: No models supporting 'generateContent' were found.")
            print("Please check your Google Cloud project to ensure the 'Generative Language API' is enabled.")

except Exception as e:
    print(f"\nAn error occurred: {e}")

print("\n--- Check complete ---")