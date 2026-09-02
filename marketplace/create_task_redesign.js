/** 预设任务模板 */
const TASK_TEMPLATES = [
  {
    id: 'product-showcase',
    icon: '📦',
    title: 'Giới thiệu sản phẩm',
    titleVi: 'Giới thiệu sản phẩm mới',
    desc: 'Tạo video giới thiệu sản phẩm, tập trung vào tính năng và lợi ích',
    platform: 'tiktok',
    priceRange: '50,000 - 80,000 VNĐ',
    defaultPrice: 65000,
  },
  {
    id: 'restaurant-review',
    icon: '🍜',
    title: 'Review quán ăn/quán cafe',
    titleVi: 'Trải nghiệm quán ăn ngon tại Hà Nội',
    desc: 'Đến quán và quay video review chất lượng món ăn, không gian và dịch vụ',
    platform: 'tiktok',
    priceRange: '80,000 - 120,000 VNĐ',
    defaultPrice: 100000,
  },
  {
    id: 'unboxing',
    icon: '📱',
    title: 'Unboxing sản phẩm',
    titleVi: 'Mở hộp và đánh giá sản phẩm mới',
    desc: 'Quay video unboxing sản phẩm, đánh giá nhanh các tính năng nổi bật',
    platform: 'youtube',
    priceRange: '100,000 - 200,000 VNĐ',
    defaultPrice: 150000,
  },
  {
    id: 'brand-story',
    icon: '🏪',
    title: 'Giới thiệu thương hiệu',
    titleVi: 'Câu chuyện thương hiệu của chúng tôi',
    desc: 'Tạo video về câu chuyện thương hiệu, văn hóa công ty và giá trị cốt lõi',
    platform: 'youtube',
    priceRange: '150,000 - 300,000 VNĐ',
    defaultPrice: 200000,
  },
  {
    id: 'product-tutorial',
    icon: '🎯',
    title: 'Hướng dẫn sử dụng',
    titleVi: 'Cách sử dụng sản phẩm hiệu quả',
    desc: 'Video hướng dẫn chi tiết cách sử dụng sản phẩm/dịch vụ',
    platform: 'tiktok',
    priceRange: '60,000 - 100,000 VNĐ',
    defaultPrice: 80000,
  },
  {
    id: 'event-promo',
    icon: '🎉',
    title: 'Quảng bá sự kiện',
    titleVi: 'Sự kiện khuyến mãi đặc biệt!',
    desc: 'Video quảng bá cho sự kiện khuyến mãi, giảm giá hoặc ra mắt',
    platform: 'facebook',
    priceRange: '50,000 - 80,000 VNĐ',
    defaultPrice: 65000,
  },
  {
    id: 'testimonial',
    icon: '💬',
    title: 'Cảm nhận khách hàng',
    titleVi: 'Khách hàng nói gì về chúng tôi',
    desc: 'Thu thập và dựng video cảm nhận từ khách hàng thực tế',
    platform: 'tiktok',
    priceRange: '80,000 - 150,000 VNĐ',
    defaultPrice: 100000,
  },
  {
    id: 'interaction',
    icon: '❤️',
    title: 'Tương tác bài viết',
    titleVi: 'Tương tác bài đăng mới nhất',
    desc: 'Like, comment và chia sẻ bài viết để tăng tương tác',
    platform: 'instagram',
    priceRange: '10,000 - 30,000 VNĐ',
    defaultPrice: 20000,
  },
];

// 替换旧的创建任务弹窗内容
document.querySelector('#createModal .modal-body').innerHTML = `
  <!-- Bước 1: Chọn mẫu -->
  <div id="stepSelectTemplate">
    <div class="field-label" style="margin-bottom:12px;font-size:14px">Chọn loại nhiệm vụ:</div>
    <div id="templateGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;max-height:400px;overflow-y:auto">
    </div>
    <div style="border-top:1px solid var(--border);padding-top:12px">
      <button class="btn btn-outline btn-sm" onclick="useCustomTemplate()" style="width:100%">
        ✏️ Tự nhập yêu cầu của tôi
      </button>
    </div>
  </div>

  <!-- Bước 2: Điều chỉnh chi tiết (ẩn ban đầu) -->
  <div id="stepDetail" style="display:none">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <button class="btn btn-outline btn-sm" onclick="backToTemplateSelect()">← Quay lại</button>
      <span id="selectedTemplateBadge" style="font-size:14px;font-weight:600"></span>
    </div>
    <div class="field">
      <div class="field-label">Tiêu Đề</div>
      <input type="text" id="createTitle" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px">
    </div>
    <div class="field">
      <div class="field-label">Mô Tả Chi Tiết</div>
      <textarea id="createDesc" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;min-height:80px" placeholder="Bạn có thể thêm yêu cầu riêng..."></textarea>
    </div>
    <div class="field">
      <div class="field-label">Nền Tảng</div>
      <select id="createPlatform" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px">
        <option value="tiktok">TikTok</option>
        <option value="youtube">YouTube</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
      </select>
    </div>
    <div class="field">
      <div class="field-label">Giá Mỗi Bài (VNĐ)</div>
      <input type="number" id="createPrice" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px" min="10000">
    </div>
    <div class="field">
      <div class="field-label">Số Lượng Bài</div>
      <input type="number" id="createQuantity" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px" value="5" min="1">
    </div>
    <div class="field" style="padding:12px;background:#f1f5f9;border-radius:8px;text-align:center;font-size:16px;font-weight:600">
      Tổng Chi Phí: <span id="totalCostPreview" style="color:var(--primary)">0 VNĐ</span>
    </div>
    <div class="modal-footer" style="border:none;padding:0;margin-top:8px">
      <button class="btn btn-outline" onclick="closeModal('createModal')">Hủy</button>
      <button class="btn btn-primary" onclick="submitTask()">Đăng Nhiệm Vụ</button>
    </div>
  </div>

  <!-- Bước Custom: Tự nhập (ẩn ban đầu) -->
  <div id="stepCustom" style="display:none">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <button class="btn btn-outline btn-sm" onclick="backToTemplateSelect()">← Quay lại</button>
      <span style="font-size:14px;font-weight:600">✏️ Tự nhập yêu cầu</span>
    </div>
    <div class="field">
      <div class="field-label">Tiêu Đề</div>
      <input type="text" id="customTitle" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px" placeholder="VD: Quảng bá sản phẩm mới trên TikTok">
    </div>
    <div class="field">
      <div class="field-label">Mô Tả</div>
      <textarea id="customDesc" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;min-height:80px" placeholder="Mô tả yêu cầu nội dung..."></textarea>
    </div>
    <div class="field">
      <div class="field-label">Nền Tảng</div>
      <select id="customPlatform" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px">
        <option value="tiktok">TikTok</option>
        <option value="youtube">YouTube</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
      </select>
    </div>
    <div class="field">
      <div class="field-label">Giá Mỗi Bài (VNĐ)</div>
      <input type="number" id="customPrice" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px" placeholder="50000" value="50000">
    </div>
    <div class="field">
      <div class="field-label">Số Lượng Bài</div>
      <input type="number" id="customQuantity" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px" value="5" min="1">
    </div>
    <div class="modal-footer" style="border:none;padding:0;margin-top:8px">
      <button class="btn btn-outline" onclick="closeModal('createModal')">Hủy</button>
      <button class="btn btn-primary" onclick="submitCustomTask()">Đăng Nhiệm Vụ</button>
    </div>
  </div>
`;

// 渲染模板
function renderTemplates() {
  const grid = document.getElementById('templateGrid');
  grid.innerHTML = TASK_TEMPLATES.map(t => `
    <div class="template-card" onclick="selectTemplate('${t.id}')" style="
      background:var(--card);
      border:1px solid var(--border);
      border-radius:10px;
      padding:14px;
      cursor:pointer;
      transition:all 0.2s;
      display:flex;
      flex-direction:column;
      gap:6px;
    " onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="font-size:24px">${t.icon}</div>
      <div style="font-weight:600;font-size:13px">${t.title}</div>
      <div style="font-size:11px;color:var(--text-muted);line-height:1.4">${t.desc}</div>
      <div style="font-size:11px;color:var(--primary);font-weight:500;margin-top:auto">${t.priceRange}</div>
    </div>
  `).join('');
}

// 选择模板
function selectTemplate(templateId) {
  const tmpl = TASK_TEMPLATES.find(t => t.id === templateId);
  if (!tmpl) return;

  document.getElementById('stepSelectTemplate').style.display = 'none';
  document.getElementById('stepDetail').style.display = 'block';
  document.getElementById('selectedTemplateBadge').textContent = `${tmpl.icon} ${tmpl.title}`;
  document.getElementById('createTitle').value = tmpl.titleVi;
  document.getElementById('createDesc').value = tmpl.desc;
  document.getElementById('createPlatform').value = tmpl.platform;
  document.getElementById('createPrice').value = tmpl.defaultPrice;
  updateCostPreview('create');
}

function backToTemplateSelect() {
  document.getElementById('stepSelectTemplate').style.display = 'block';
  document.getElementById('stepDetail').style.display = 'none';
  document.getElementById('stepCustom').style.display = 'none';
}

function useCustomTemplate() {
  document.getElementById('stepSelectTemplate').style.display = 'none';
  document.getElementById('stepCustom').style.display = 'block';
}

function submitTask() {
  const title = document.getElementById('createTitle').value;
  if (!title) { alert('Vui lòng nhập tiêu đề'); return; }
  closeModal('createModal');
  alert('✅ Đã đăng nhiệm vụ thành công!\nNgười sáng tạo sẽ sớm nhận nhiệm vụ của bạn.');
}

function submitCustomTask() {
  const title = document.getElementById('customTitle').value;
  if (!title) { alert('Vui lòng nhập tiêu đề'); return; }
  closeModal('createModal');
  alert('✅ Đã đăng nhiệm vụ thành công!\nNgười sáng tạo sẽ sớm nhận nhiệm vụ của bạn.');
}

// 更新预览价格
function updateCostPreview(prefix) {
  const p = document.getElementById(prefix + 'Price');
  const q = document.getElementById(prefix + 'Quantity');
  if (!p || !q) return;
  const price = parseInt(p.value) || 0;
  const qty = parseInt(q.value) || 0;
  const total = price * qty;
  const preview = document.getElementById('totalCostPreview');
  if (preview) preview.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
}

// 事件监听
['createPrice','createQuantity'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => updateCostPreview('create'));
});

// 初始化渲染模板
renderTemplates();

// 覆盖原来的showCreateTask
const originalShowCreateTask = window.showCreateTask;
window.showCreateTask = function() {
  document.getElementById('stepSelectTemplate').style.display = 'block';
  document.getElementById('stepDetail').style.display = 'none';
  document.getElementById('stepCustom').style.display = 'none';
  document.getElementById('createModal').classList.add('show');
};
