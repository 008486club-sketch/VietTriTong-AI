FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY marketplace_api.py .
# 前端单页：marketplace.html 作为 /marketplace 的 index.html
COPY marketplace.html frontend/index.html

# 以非 root 用户运行
RUN useradd --create-home --uid 10001 app && chown -R app /app
USER app

EXPOSE 8010

CMD ["uvicorn", "marketplace_api:app", "--host", "0.0.0.0", "--port", "8010"]
