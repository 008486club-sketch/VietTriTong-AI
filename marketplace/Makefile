IMAGE ?= yzt-marketplace:verify
PORT  ?= 8098
PY    ?= python3

.PHONY: test build clean

## 镜像验收门：能构建 + 非 root + 页面真在镜像里
test: build
	@$(PY) scripts/verify_image.py --image $(IMAGE) --port $(PORT)

build:
	@docker build -q -t $(IMAGE) . >/dev/null && echo "PASS 镜像构建成功 $(IMAGE)"

clean:
	@docker rmi -f $(IMAGE) >/dev/null 2>&1 || true
