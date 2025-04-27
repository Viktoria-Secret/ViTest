import pytest
from fastapi.testclient import TestClient
from app.api import app

client = TestClient(app)

def test_validate_pin_invalid():
    """Test validating an invalid PIN"""
    response = client.post(
        "/validate-pin",
        json={"pin": "999999", "mac_address": "00:11:22:33:44:55"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == False
    assert "Invalid or expired PIN" in data["message"]

def test_health_endpoint():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy" 