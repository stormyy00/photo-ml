FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    UV_SYSTEM_PYTHON=1

# OS libs for numpy / opencv / onnxruntime
# plus build-essential so a source build won't fail if a wheel isn't found
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libstdc++6 \
    ca-certificates curl wget \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
 && echo 'export PATH="/root/.local/bin:$PATH"' >> /root/.bashrc
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app/server/api

COPY server/api/pyproject.toml ./pyproject.toml

# Pin Python 3.12 and install everything from pyproject
# Prefer wheels; if insightface still tries to build, we can handle it (build-essential installed)
# UV_PIP_FLAGS applies to uv's pip calls (env var)
ENV UV_PIP_FLAGS="--prefer-binary --no-cache-dir"
RUN uv python pin 3.12 \
 && uv sync --frozen || uv sync

RUN python - <<'PY'
import platform, sys
print("Arch:", platform.machine(), "| Python:", sys.version.split()[0])
PY


COPY server/api/ ./

EXPOSE 5050

HEALTHCHECK --interval=45s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5050/api/health || exit 1

# Dev (auto-reload). If you use Flask:
CMD ["uv", "run", "flask", "--app", "start", "run", "--host", "0.0.0.0", "--port", "5050", "--debug"]


# Prod (comment dev, uncomment one of the below):
# CMD ["uv", "run", "gunicorn", "-b", "0.0.0.0:5050", "start:app", "--workers", "2", "--threads", "4", "--timeout", "120"]

