# ============================================================================
# gemini-computer-use-chrome-designer — Headless Cloud Runner
# ============================================================================
# Playwright and Chrome headless environment with Gemini GenAI SDK.
# ============================================================================

FROM python:3.10-slim-bookworm

LABEL maintainer="Bluejaypro Visual Automation Architect"
LABEL skill.name="gemini-computer-use-chrome-designer"
LABEL skill.version="1.4.1"

# ── System dependencies ───────────────────────────────────────────────────
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    wget \
    curl \
    gnupg \
    ca-certificates \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libcomposite1 \
    libasound2 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# ── Install Playwright & Browsers ─────────────────────────────────────────
WORKDIR /app
COPY requirements.txt .
# Fallback requirements if requirements.txt doesn't exist
RUN pip install --no-cache-dir playwright google-genai pillow
RUN playwright install chromium
RUN playwright install-deps chromium

# ── Copy Skill Files ──────────────────────────────────────────────────────
COPY . /app/
RUN chmod +x /app/scripts/visual_designer_cli.py

# ── Entrypoint ────────────────────────────────────────────────────────────
ENTRYPOINT ["python3", "/app/scripts/visual_designer_cli.py"]
CMD ["--help"]
