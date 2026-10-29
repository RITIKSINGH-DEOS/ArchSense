import os
import json
import logging
from typing import Optional, List
import httpx
from app.models import Violation

logger = logging.getLogger("archsense.baseten")

BASETEN_ENDPOINT = "https://inference.baseten.co/v1/chat/completions"
DEFAULT_MODEL = "meta-models/muse-spark-open-1026"

class BasetenReasoningClient:
    """
    Client for Baseten Cloud hosting Meta's Muse Spark Open model for the Meta Global AI Hackathon.
    Enriches deterministic boundary audits with deep semantic architectural reasoning.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("BASETEN_API_KEY", "").strip()
        self.model = os.getenv("BASETEN_MODEL", DEFAULT_MODEL)

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def generate_architectural_assessment(
        self,
        pr_title: str,
        git_diff: str,
        violations: List[Violation]
    ) -> Optional[str]:
        if not self.is_configured():
            return None

        # Build prompt
        violation_summary = "\n".join(
            [f"- [{v.severity}] {v.title} at {v.file}:{v.line}: {v.breach_description}" for v in violations]
        ) if violations else "No structural violations detected. Code conforms to declared topology boundaries."

        prompt = f"""You are ArchSense AI, the architectural governance reasoning engine.
PR Title: {pr_title}

Detected Architectural Violations:
{violation_summary}

Git Code Delta:
```diff
{git_diff[:1500]}
```

Provide a concise, 2-3 sentence executive architectural assessment explaining the security and boundary risk of this pull request on production and whether it is safe to merge."""

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are ArchSense AI, an autonomous architecture governance agent built for the Meta Global AI Developer Hackathon. Keep internal reasoning concise and deliver the final assessment."
                },
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1200,
            "temperature": 0.2
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            with httpx.Client(timeout=15.0) as client:
                response = client.post(BASETEN_ENDPOINT, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        message = choices[0].get("message", {})
                        content = message.get("content")
                        if content and content.strip():
                            return content.strip()
                        # Fallback to reasoning content if completion was truncated
                        reasoning = message.get("reasoning_content")
                        if reasoning and reasoning.strip():
                            lines = [l.strip() for l in reasoning.strip().split("\n") if l.strip()]
                            return lines[-1] if lines else None
                else:
                    logger.warning(f"Baseten API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.warning(f"Baseten reasoning inference skipped due to: {e}")

        return None
