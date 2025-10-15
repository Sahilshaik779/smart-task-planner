import os
import json
import logging
import google.generativeai as genai
from datetime import datetime
from typing import List, Dict, Optional

logging.basicConfig(level=logging.INFO)

class LLMService:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
        else:
            logging.error("GEMINI_API_KEY not found in environment variables.")

    async def generate_tasks(self, goal: str, deadline: str) -> Optional[List[Dict]]:
        """Generate tasks using the Google Gemini API."""
        if not self.gemini_key:
            return None

        prompt = self._create_prompt(goal, deadline)

        generation_config = {
            "response_mime_type": "application/json",
        }

        try:
            model = genai.GenerativeModel("models/gemini-pro-latest")

            response = await model.generate_content_async(
                prompt,
                generation_config=generation_config
            )

            result_data = json.loads(response.text)

            if isinstance(result_data, dict):
                return result_data.get("tasks", [])

            elif isinstance(result_data, list):
                return result_data

            else:
                logging.error(f"Gemini returned an unexpected JSON format: {type(result_data)}")
                return None

        except Exception as e:
            logging.error(f"Gemini API Error: {e}")
        
            logging.error(f"Gemini response content: {getattr(e, 'response', 'N/A')}")
            return None

    def _create_prompt(self, goal: str, deadline: str) -> str:
        """Creates a prompt optimized for Gemini's JSON mode."""
        return f"""
        You are a world-class project planning AI. Your sole purpose is to generate a structured JSON object that breaks down a goal into actionable tasks. Do not include any explanatory text or markdown formatting around the JSON object.

        Break down the following goal into 8-15 actionable tasks. Today's date is {datetime.now().strftime('%Y-%m-%d')}.

        Goal: {goal}
        Final Deadline: {deadline}

        Each task in the JSON array must include:
        1. id: A CRITICAL string identifier for the task, formatted as "T" followed by a number (e.g., "T1", "T2"). DO NOT use plain integers for the id.
        2. name: A clear, actionable description of the task.
        3. phase: The project phase (e.g., "Planning", "Design", "Development", "Testing", "Launch").
        4. priority: One of ["Critical", "High", "Medium", "Low"].
        5. estimatedHours: A realistic integer estimate for the hours this task will take.
        6. dependencies: An array of `id` strings that this task depends on. Use an empty array [] for tasks with no dependencies.

        CRITICAL RULES:
        - The 'id' field MUST be a string and must be unique (e.g., "T1", "T2").
        - The sequence of tasks must be logical.
        - Dependencies must only reference the `id` of a task that appears earlier in the list.
        - The total timeline must be realistic for the given deadline.
        - The output must be a single, valid JSON object that is an array of tasks.
        """