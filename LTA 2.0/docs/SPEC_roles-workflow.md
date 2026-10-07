> LTA 2.0 規格參考，整理於 2026-10-07。以下保留原始調查與信心標記；歷史頁名及「已實作」紀錄不代表本次五頁已逐項驗收。新版入口與實際範圍以 [頁面說明](SPEC_pages.md) 為準。

# SPEC — 角色權限與工作流

來源：RMWP Walkthrough 錄影（2026-07-08，Salini Gupta 講解），補上 view-only sysadmin 帳號看不到的部分。錄影中實際切換 Contract Officer / Site Supervisor / Engineer 三種角色操作。
⚠️ 細節依錄影推得，**尚未**用三種角色測試帳號實機逐一核對（見 `OPEN-QUESTIONS.md`）。

---

## 1. 角色（已知 5 種 + 2 個可被指派角色）
| 角色 | 帳號範例 | 側邊選單 | 職責 |
|---|---|---|---|
| System Administrator（LTA） | DEV SA01 | 全部但**唯讀** | 看，不能動 |
| Contract Officer / LTA Officer | DEV CO01 / CO02(OICManager) | 全部 | 建單、指派、最後 Approve & Close |
| Site Supervisor（Contractor） | DEV TR388SS01 | 精簡（無 Reports / Contract / Configuration） | 現場填 task：照片、cause、action、progress |
| Engineer（Contractor） | DEV TR388ENG01 | 有 Reports / Contract（無 Configuration） | 填 **Price Schedule**（BOQ 計價）＋承包商聲明 |
| QS（Quantity Surveyor） | — | — | 可被 Reassign / Return 的角色（計量） |
| DRC | — | — | 可被 Reassign / Return 的角色 |

原型 `mwi-wi-workflow.html` **只做 CO / Site Supervisor / Engineer 三種**（Candace 指定範圍）。

---

## 2. ⭐ 最大發現：Wizard 隨工作流「長出」更多步驟

不是固定步數！步驟數依 WI 所在 stage 遞增，每個角色負責填自己那一步：

| 步驟 | 誰填 | 內容 |
|---|---|---|
| 1. Work / Task / Site Detail | CO 建單 ＋ **Site Supervisor** 執行 | WI 基本資料 + asset/task（Before/During/After 照片、Defect Cause、Action、Unit、Length、Measurement、Work Progress %、Remarks） |
| 2. Fund Detail | — | Funding Source 多列表格（Funding Source｜Fund Owner｜Section｜Estimated Amount｜Delete，＋加列）+ Estimated Amount、Supervision(division)、ECD、Fund Remarks、Attachment |
| 3. **Price Schedule** | **Engineer** | Payment Type、Final Amount、Actual Completion Date；Funding Source Details；**Section BOQ 表格**（Item｜Description 1/2/3｜Unit｜Rate S$｜Quantity｜Amount S$｜Total）＋加列；Attachment、Remarks；**Contractor Declaration**（勾選 Certificate of Supervision） |
| 4. **Approval** | **Contract Officer** | Payment Type、Final Amount、Approval Remarks、Instruction/Estimated/Actual Completion/Feedback Date、**JM Submission Date (First/Latest)**、Days Taken to Submit JM、Payment Status |

→ 同一張 WI 隨流程前進，上方 stepper 從 2 步 → 3 步 → 4 步展開。**對重設計關鍵**：View/Edit 要能呈現「目前到第幾步、哪些已完成、哪一步該我填」。

---

## 3. ⭐ 端到端流程
1. **Contract Officer 建單**（Draft）→ Submit to Site Supervisor（Common Queue 或特定人 + Remarks）→ Work-in-Progress。
2. **Site Supervisor**：In Progress → **Assign to Self**（藍色 toast）→ 填 step 1 現場 task 資料 → **Submit to Engineer** → Verification-in-Progress。
3. **Engineer**：填 step 3 Price Schedule + 承包商聲明 → **Submit to LTA Officer**（選 CO + Remarks）→ Approval-in-Progress。
4. **Contract Officer**：填 step 4 Approval → **Approve and Close** → Approved-and-Closed。

任何 stage 都能往回 **Return to X**，或 **Reassign to X**（換同角色的人）。

---

## 4. ⭐ 底部動作列＝角色/stage 相關（實測）
| 角色/stage | 動作 |
|---|---|
| Site Supervisor | Return to LTA Officer｜Return to Engineer｜Return to DRC｜Reassign to Site Supervisor｜**Submit to Engineer**｜Back｜Save（＋Delete Asset / Delete Task） |
| Engineer | Return to Site Supervisor｜Reassign to Engineer｜Reassign to **QS**｜**Submit to LTA Officer**｜Back｜Next/Save |
| Contract Officer（初期） | Reassign to DRC｜Reassign to Engineer｜Submit to Site Supervisor｜Withdraw｜Back｜Save |
| Contract Officer（審批） | Return to Site Supervisor｜Return to QS｜Return to Engineer｜Reassign to LTA Officer｜**Approve and Close**｜Back｜Save |
| sysadmin | 只有 Back/Next |

→ 動作三類：**Submit to X（前進）／Return to X（退回）／Reassign to X（換人）**，＋ Withdraw、Assign to Self、Approve and Close。

---

## 5. ⭐ 「送出並指派」彈窗（每個 forward 動作共用同一模式）
例：Submit to LTA Officer → modal **「Select Contract Officer and Submit」**：可搜尋單選（**...Common Queue（預設）** / DEV CO02(OICManager) / DEV CO01）+ Remarks + Submit。
- Common Queue = 未指派 → 對方角色的 **In Progress** 分頁（可 Assign to Self）。
- 特定人 = 對方 **To Do** 分頁。
- 送出後也進 **Submitted**。

## 6. ⭐ 列表「狀態分頁」＋Action 欄（每個角色都有）
上方 tab：**To Do｜In Progress｜Submitted**。
- **To Do**＝指派給我、等我處理（點進去＝該 WI 的 Edit/View）。
- **In Progress**＝共用佇列未指派（Action 欄有 **Assign to Self**）。命名建議：正名為「未指派/共用佇列」較不混淆。
- **Submitted**＝我送出過的，不分狀態。

## 7. 狀態生命週期
Draft → Work-in-Progress → Verification-in-Progress → Approval-in-Progress → Approved-and-Closed
→ 現況全用同一顆黃 pill（問題）；重設計給 **5 種語意色**（見 design-system spec）。

## 8. 原型如何實作角色
- URL param `?role=co|ss|eng`，預設 `co`；切換時 `history.replaceState` 並改寫所有 `mwi-*.html` 連結，讓角色跨頁保留。
- `ROLES` 物件驅動：`nav`（顯示哪些側欄項）、`status`（狀態 chip）、`steps`（2/3/4）、`owner`（我負責的 active step）、`actions`（底部動作列）。
- `SHOW` 表控制側欄可見性：Reports = CO/Engineer；Contract = CO/Engineer；Configuration = CO only。

## 9. 其他觀察
- Asset Tag 為可搜尋下拉；頭像選單 Profile｜User Guide｜Logout。
- Funding Source 值很長，如 `EXT.ETRO.ASM(RD).E-TR388.000.3MINDE7115.TR388` → 友善顯示是痛點。
- 兩大類：Maintenance WI / Inspection WI。
