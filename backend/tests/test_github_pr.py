import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_github_pr_invalid_url():
    response = client.post("/api/github/pr", json={"url": "not-a-valid-url"})
    assert response.status_code == 400
    assert "Invalid GitHub PR URL" in response.json()["detail"]

def test_github_pr_live_fetch():
    # Test fetching a real public PR from facebook/react
    response = client.post("/api/github/pr", json={"url": "https://github.com/facebook/react/pull/28000"})
    if response.status_code == 200:
        data = response.json()
        assert data["repo"] == "facebook/react"
        assert data["pr_number"] == 28000
        assert "createRoot" in data["title"]
        assert len(data["diff"]) > 0
        assert data["author"] == "eps1lon"
