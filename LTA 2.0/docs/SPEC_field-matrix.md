> LTA 2.0 規格參考，整理於 2026-10-07。以下保留原始調查與信心標記；歷史頁名及「已實作」紀錄不代表本次五頁已逐項驗收。新版入口與實際範圍以 [頁面說明](SPEC_pages.md) 為準。

# SPEC — 角色 × 階段 欄位矩陣（WI 表單）

這份是 MWI 表單所有欄位的單一事實來源:每個欄位的**必填**、**所屬步驟**、**哪個角色/階段看得到、能不能編輯**。改任何一頁的欄位都以這份為準,不刪、不亂加、不亂改必填星號。

## 信心標記(重要)
- ✅ **截圖確認**:有實機截圖逐欄核對過(dev 環境 RMWP-TR388-RRFM-M-17,SA01 View)。
- 🎥 **錄影推得,待核**:來自 walkthrough 錄影(2026-07-08)描述,尚未用對應角色帳號逐一實機核對。
- ➕ **我方設計加值**:原系統沒有、是重設計為了體驗加的(非欄位,多為版面/導覽)。

> ⚠️ dev 是稀疏測試資料;真實使用量以 Arjun 描述為準(1 WI 可到 3 asset、每 asset 3 task)。詳見 `SPEC_data-model.md`。

---

## Step 1 — Work / Task / Site Detail

### 1a. WI 抬頭 / 分類 / 位置欄位 ✅
原系統呈現為一個密集 3 欄 grid(row-major),欄位與必填如下(順序即原設計順序):

| # | 欄位 | 必填 | 型態 | 備註 |
|---|---|---|---|---|
| 1 | Contract No. | ✅ ＊ | 下拉 | **前置**:篩選下面的 Road / Sector / Asset |
| 2 | Work Instruction No. | ✅ ＊ | 系統產生(鎖) | 建單時自動給號,使用者不填 |
| 3 | LTA CCS Work Order No. | — | 文字 | |
| 4 | Department | ✅ ＊ | 下拉 | RRFM / CFM / BDG / PATH… |
| 5 | Feedback Date | ✅ ＊ | 日期 | |
| 6 | Instruction Date | ✅ ＊ | 日期 | |
| 7 | Work Type | ✅ ＊ | 下拉 | SIMPLIFIED ITEM / WORKS ORDER-ACCIDENT / OUTCOME BASED DEFECT / PLANNED WORKS / WORKS ORDER-ADHOC |
| 8 | Work / Defect Description | **—(無星)** | 文字 | ⚠️ 我方原型誤標必填,已知需改回選填 |
| 9 | Defect Reported By | — | 下拉 | INSPECTION / Public feedback… |
| 10 | Road Name | ✅ ＊ | 可搜尋下拉 | 受 Contract 篩選 |
| 11 | Location Tag | — | 下拉 | REX-…；受 Contract/Road 篩選 |
| 12 | Defect Reference No. | — | 文字 | |
| 13 | Sector | ✅ ＊ | 下拉 | 受 Contract 篩選 |
| 14 | Sub-Sector | ✅ ＊ | 下拉 | 受 Sector 篩選 |
| 15 | WI Remarks | — | 文字區 | |
| 16 | Is Recurring | — | checkbox | |

**必填共 8 個使用者要填的**(WI No. 系統產生不算):Contract、Department、Feedback Date、Instruction Date、Work Type、Road Name、Sector、Sub-Sector。
**依賴鏈**:Contract → Road / Location Tag / Sector → Sub-Sector / Asset。故「必填優先」須在依賴允許範圍內排(Contract 一定最前)。

### 1b. Site & assets ✅(Draft 階段)

**Asset Availability**
| 欄位 | 必填 | 型態 |
|---|---|---|
| Asset Not Found | — | checkbox |

**Asset N**(可摺疊面板;可多個,「Add another asset」)
| 欄位 | 必填 | 型態 | 備註 |
|---|---|---|---|
| Asset Type Name (Code) | ✅ ＊ | 下拉 | |
| Asset Tag | — | 下拉 | 有 **Map** 按鈕 |
| Asset Id | — | 文字 | |

**Task N**(巢狀在 Asset 底下,可摺疊;可多個)
| 欄位 | 必填 | 型態 | 備註 |
|---|---|---|---|
| Element Type | ✅ ＊ | 下拉 | |
| Defect Type | ✅ ＊ | 下拉 | 選 OTHER→多出 Others＊ 自由輸入欄 |
| Default X Y Coordinates | — | 文字 | 有 **Map** 按鈕 |
| Landmark | — | 文字 | |

> 以上 Task 4 欄是 **CO 建單 / Draft** 階段的最小集(截圖確認)。

### 1c. ⭐ Task 欄位隨階段/角色成長 🎥
同一個 Task,WI 前進到 **Site Supervisor(Work-in-Progress)** 階段會長出現場執行欄位(錄影所見,約 16 欄,待實機核):
- Before / During / After 照片(三槽)
- Defect Cause
- Action
- Unit
- Length
- Measurement
- Work Progress %
- (Task-level) Remarks

→ 這就是「不同角色不同欄位」的來源:**抬頭欄位固定,Task 欄位依階段遞增**(Draft 4 欄 → WIP ~16 欄)。

---

## 1d. ⭐ WI 列表欄位（Maintenance Work Instructions 清單頁）✅

> 這節是 **2026-08-04 補記**。在此之前,這份矩陣只涵蓋「表單」欄位,列表頁的 table columns
> 從來沒有被記錄下來 —— 所以原型把 17 欄縮成 6 欄時,防漂移原則沒有擋住,也沒有留下取捨理由。
> 現以 dev 環境 `MaintenanceWorkInstructions` 清單截圖(2026-08-04)逐欄核對後補齊。

**原系統共 17 欄**(順序即原設計順序):

| # | 原系統欄位 | 原型處理 | 呈現位置 |
|---|---|---|---|
| 1 | WI Number | ✅ 保留 | 獨立欄 `WI number` |
| 2 | Sector | ⤵️ 併入 | `Road` 欄第二行 `Sector NW3 · CS4` |
| 3 | Sub-Sector | ⤵️ 併入 | 同上(`· CS4`) |
| 4 | Road Name | ✅ 保留 | 獨立欄 `Road`(第一行) |
| 5 | Asset Type | ✅ 保留 | 獨立欄 `Asset`(第一行) |
| 6 | Element Type | ⤵️ 併入 | `Asset` 欄第二行 |
| 7 | Estimated Completion Date | ✅ 保留 | 獨立欄 `Est. completion` |
| 8 | Status | ✅ 保留(改 5 色) | 獨立欄 `Status`,見下方說明 |
| 9 | CCS WO NO. | ❌ **未呈現** | — 待確認是否需要 |
| 10 | Work Type | ✅ 保留 | 獨立欄 `Work type` |
| 11 | Instruction Date | ❌ **未呈現** | — 待確認是否需要 |
| 12 | Defect Type | ✅ 保留 | 獨立欄 `Defect type`(2026-08-04 補回) |
| 13 | Defect Reference No. | ❌ **未呈現** | — 待確認是否需要 |
| 14 | Last Updated By | ❌ **未呈現** | — 待確認是否需要 |
| 15 | Assign To | ✅ 保留 | 獨立欄 `Assign to`(2026-08-04 補回);未指派顯示 `Common Queue` |
| 16 | Last Updated On | ✅ 保留 | 獨立欄 `Last updated`(2026-08-04 補回) |
| 17 | WI Remarks | ❌ **未呈現** | — 待確認是否需要 |

**➕ 我方設計加值(原系統沒有的)**
- `Action` 欄:In Progress 分頁才出現,放 **Assign to self**(按下即寫入 `Assign To` 並移入 To Do)。
  欄位多時會超出視窗,故此欄 `position:sticky; right:0` 釘在右緣,確保主要動作永遠點得到。
- **To Do / In Progress / Submitted 狀態分頁**:由 `Assign To` ＋ 角色 ＋ stage 推導,不是原系統的欄位。
- **Filter & sort 抽屜**:取代原本的 3-pane Advanced Filter,facet 順序對齊表格欄位 —— 見 §1e。
- **手機卡片流**(≤860px):同一組欄位改成卡片,`Assign to` 與 `Last updated` 放卡片底部一行。

**⚠️ 已知落差與注意事項**
1. **`Status` 顏色是刻意改的,不是漏做。** 原系統 5 種狀態共用同一顆黃 pill;重設計給 5 種語意色,
   見 `SPEC_design-system.md`、`SPEC_roles-workflow.md` §7。**此為待與 LTA 對齊項**。
2. **原型的 status 分佈是 demo 用的。** 原系統這 10 筆只有 Draft / Work-in-Progress 兩種;
   原型刻意攤成 5 種狀態,好展示語意色與分頁。**資料值本身忠於 dev,狀態分佈是示意**。
3. **「Newest first」排序**先前沒有欄位支撐(只是 DOM 原始順序);補回 `Last Updated On` 後
   已改為依該欄位由新到舊排序。
4. ~~表頭的排序箭頭目前是死的~~ —— **2026-08-04 已接上排序**,9 個欄位都可點、可反向,見 §1e。
5. `Sector NW2 · NW1` 這個 sub-label 前綴只有一個「Sector」,讀起來像兩個都是 sector,
   實際上第二個是 **Sub-Sector**。待確認正式縮寫寫法。

**⭐ 防漂移**:列表欄位的增減/改名/改順序,一律先改這節,再同步套到
**`mwi-list-redesign.html`(原版)＋ `mwi-list.html`(Green)＋ `mwi-list-redesign-navy.html`(Navy)三頁**,
且桌機表格、手機卡片、filter facet、排序邏輯要一起改。只改一頁 = spec 跑掉。

---

## 1e. ⭐ WI 列表的 Advanced Filter ✅

> 2026-08-04 補記,依 dev 環境 Advanced Filter 截圖逐項核對。
> `SPEC_pages.md` 原本只記了「抽屜取代原本雜亂的 3-pane Advanced Filter」,
> **但沒有記原本有哪 11 種 filter type** —— 於是縮成 7 種時沒人擋得住。

原系統 Advanced Filter 為 3-pane modal(Filter Type 清單 → 值＋搜尋 → Filters Selected 摘要),
共 **11 種 filter type**:

| # | 原系統 Filter Type | 原型抽屜 | 備註 |
|---|---|---|---|
| 1 | Sector | ✅ | |
| 2 | Sub-Sector | ✅(2026-08-04 補) | **連動 Sector**:選了 sector 才列出其下的 sub-sector |
| 3 | Work Type | ✅ | |
| 4 | Road Name | ✅ | 值最多,必須有搜尋 |
| 5 | Department | ✅(2026-08-04 補) | RRFM / CFM / BDG / PATH |
| 6 | Work Status | ✅ | 原型原本叫 `Status`,2026-08-04 正名對齊 |
| 7 | Asset Type | ✅ | |
| 8 | Element Type | ✅(2026-08-04 補) | **連動 Asset Type** |
| 9 | Defect Type | ✅ | |
| 10 | Instruction Date | ✅(2026-08-04 補) | 改為區間:Last 7 / 30 / 90 days ＋自訂 |
| 11 | Estimated Completion Date | ✅(2026-08-04 補) | 改為區間:Overdue / Next 7 / Next 30 days ＋自訂 |
| — | (原系統沒有) | ➕ `Assign to` | 對應列表的 Assign To 欄與 To Do／In Progress 分頁 |

> ⚠️ 上表的 `Department`(#5)與 `Instruction Date`(#10)**已實作但目前隱藏**,原因見下方「facet ＝ 表格欄位」。

**➕ 我方設計加值**
- **右側抽屜取代 3-pane modal**:modal 會整片蓋住列表(沒法邊篩邊看結果),手機幾乎不能用。
- **每個 facet 超過 8 個值就長出搜尋框**;預設只顯示 6 個,其餘收在「Show all (N)」後面;已選的值置頂。
- **父子連動**(Sub-Sector ← Sector、Element Type ← Asset Type),對應 1a 的依賴鏈,避免選出必然為空的組合。
- 工具列 **Search** 打通(WI 號、road、sector、asset、element、defect、work type),與 filter 疊加。

**⭐ facet ＝ 表格欄位,同名同序**(2026-08-04 定案)
抽屜一區對一個表格欄位,**名稱與欄位表頭完全一致、順序照表格由左至右**:

| 表格欄位 | 抽屜 facet |
|---|---|
| Status | `Status` |
| Road | `Road`　→ 底下縮排 `Sector`、`Sub-sector` |
| Asset | `Asset`　→ 底下縮排 `Element type` |
| Defect type | `Defect type` |
| Work type | `Work type` |
| Est. completion | `Est. completion`（日期區間） |
| Assign to | `Assign to` |

- **縮排的三個不是獨立欄位**,而是 `Road` / `Asset` 兩格的**副標內容**(`Sector NW3 · CS4`、`Bollard / Bollard`),
  所以用一條垂直連接線縮排在父欄位底下,視覺上表示從屬。
- 🚫 `Department` 與 `Instruction date` **目前隱藏中**(2026-08-04)。線上 Advanced Filter 有這兩種 filter type,
  但我們的表格沒有對應欄位,篩了之後畫面上看不到依據,故先不顯示。**程式碼保留**,把
  `'__other','fdept','finst'` 加回 `ORDER` 陣列即可還原(`ORDER` 是唯一事實來源,不在其中的一律不建、不篩、不計數)。
  待 §1d 的待確認事項回覆後再決定要顯示 filter、還是連欄位一起補。
- `WI number` 與 `Last updated` **刻意沒有 facet**:前者用工具列 Search,後者線上也沒有這個 filter type。兩者都能點表頭排序。
- 順序由每頁的 `ORDER` 陣列決定,縮排由 cat 的 `child:true` 決定 —— 改順序/階層只改那兩處。

**⭐ 排序改由表頭控制**(2026-08-04)
- **桌機**:排序完全在表格表頭 —— 9 個欄位都可點,點一次套用、再點一次反向;
  作用中的欄位標主色並以單向箭頭顯示方向,同時寫入 `aria-sort`。預設 `Last updated ↓`。
  (此前表頭箭頭是**死的**,排序藏在抽屜裡 —— 已修正。)
- **手機(≤860px)**:表格換成卡片、沒有表頭,故抽屜頂端**保留 Sort by pill**作為唯一入口
  (仍是 Candace 選的 option B)。pill 由表頭按鈕即時生成,兩邊永遠同一組排序鍵、同一組標籤。
- 排序不隨 Apply/Clear 走 —— 它是檢視狀態不是篩選條件,套用 filter 後仍保持。
- 空值(`Not set` / `—`)不論升冪降冪一律沉底。

**⚠️ 已知落差**
1. **值域是 placeholder。** Sector 15 個、Sub-Sector 16 個、Road Name 40 條、Asset/Element/Defect Type
   的清單目前是依截圖與常見道路名補的**示意值**,**不是 LTA 正式字典檔**。正式值域待 Arjun 提供後整批換掉。
2. **選項清單刻意大於畫面上的資料。** 跟線上一致 —— filter 列的是該合約的完整值域,不是當前 24 筆用到的值。
   所以選到沒有 WI 的值會得到空結果,這是正確行為。
3. **列表 demo 資料已擴充到 24 筆**(原 10 筆),才撐得出「要搜尋才找得到」的情境;分頁(每頁 10 筆)同步做成真的會換頁。
4. 原系統 Filter Type 沒有 `Assign to`,是原型為了配合狀態分頁加的。

---

**⭐ 防漂移**:filter type 的增減/改名、值域的更換,一律先改這節,再同步套到三頁列表。
facet 定義集中在每頁的 `CATS` / `DATES` / `VOCAB`(三頁內容相同),改一處要三頁一起改。

---

## Step 2 — Fund Detail 🎥
（依錄影,待核）
- Funding Source 多列表格:`Funding Source | Fund Owner | Section | Estimated Amount | Delete`（＋加列）
- Estimated Amount
- Supervision (division)
- ECD（Estimated Completion Date）
- Fund Remarks
- Attachment

> 原型 create 頁「Funding」區目前是這步的簡化版。備註寫「completed by the LTA project team」。

## Step 3 — Price Schedule（Engineer）🎥
（依錄影,待核）
- Payment Type
- Final Amount
- Actual Completion Date
- Funding Source Details
- **Section BOQ 表格**:`Item | Description 1/2/3 | Unit | Rate S$ | Quantity | Amount S$ | Total`（＋加列）
- Attachment
- Price Schedule Remarks
- **Contractor Declaration**：Certificate of Supervision（勾選聲明）

## Step 4 — Approval（Contract Officer）🎥
（依錄影,待核）
- Payment Type
- Final Amount
- Approval Remarks
- Instruction / Estimated / Actual Completion / Feedback Date
- JM Submission Date（First / Latest）
- Days Taken to Submit JM (to LTA)
- Payment Status

---

## 角色 × 步驟 可見 / 可編輯矩陣

Wizard 步數依 WI 所在 stage 從 2 → 4 展開;每個角色負責填自己那一步(🎥 依錄影,待核)。

| 步驟 | Contract Officer | Site Supervisor | Engineer |
|---|---|---|---|
| 1. Work/Task/Site（抬頭欄位） | **建單填寫** | 唯讀（除 Task 現場欄位） | 唯讀 |
| 1. Task 現場執行欄位（照片/進度…） | 唯讀 | **填寫** | 唯讀 |
| 2. Fund Detail | 可見 | 依權限 | 依權限 |
| 3. Price Schedule（BOQ＋聲明） | 唯讀/可見 | — | **填寫** |
| 4. Approval | **填寫＋Approve & Close** | — | — |
| 側邊選單 | 全部 | 精簡（無 Reports/Contract/Config） | 有 Reports/Contract（無 Config） |
| 狀態(示範用) | Approval in progress | Work in progress | Verification in progress |

（角色動作列、指派彈窗、列表分頁詳見 `SPEC_roles-workflow.md`。）

---

## 原型對齊進度
- ✅ **create 頁（`mwi-wi-create.html`）已對齊 Draft 確認集**(2026-07-22):
  - Work/Defect Description 星號移除、改回選填(對齊 1a #8)。
  - 補上 Draft 階段 Task 子面板:Element Type＊、Defect Type＊、Default X Y Coordinates(＋Map)、Landmark;可 Add / Remove task(單一時 Remove 隱藏)。
  - 補上 `Asset Not Found` checkbox、Asset Tag 的 **Map** 按鈕。
  - **Defect Type 選「Other…」→ 顯示條件式 `Others＊` 欄**(切回其他選項自動收起,複製 task 也正確重置)。
  - 必填重排(Contract 最前、相關欄位不拆),＋手機區塊跳轉 chips。
- ✅ **view 頁（`mwi-view-redesign.html`）asset/task 已對齊**(2026-07-22):
  - `Default X Y coordinates` 正名(原「Coordinates (SVY21)」)並補齊到全部 9 個 task;空值以「Not set」呈現。
  - WIP 欄位名稱對齊矩陣:`Action`(原「Action taken on site」)、`Remarks`(原「Task remarks」)。
  - 每個 task 一致呈現確認的 Draft 4 欄(Element type／Defect type／Default X Y coordinates／Landmark)＋ WIP 欄位(照片、進度、Defect cause、Action、Remarks…)。
- ✅ **edit 頁（`mwi-wi-edit.html`）＝ create 的欄位母版**(2026-07-22):
  - edit 由 create **同一套欄位結構**建成(References／Classification／Location & description／Site & assets 的欄位順序、位置、asset/task 面板 100% 一致),只換成 RMWP-TR388-RRFM-M-17 的既有值。
  - 唯一刻意差異:**Funding 不在 edit**,留在 workflow 頁(edit 底部有一句說明導向)。
- ⭐ **防漂移原則**:**create 頁 = Step 1 欄位的「單一母版」**。edit 與 create 的欄位必須逐欄一致;任何欄位增減/改名/改順序,一律先改此矩陣(1a/1b),再同步套到 **create ＋ edit 兩頁**。不要只改其中一頁。
- ⏳ **待對齊**:
  1. **Task 成長(WIP)**:SS 手機端(`mwi-task-edit.html`)/ workflow 頁需呈現 WIP 的 ~16 欄現場執行欄位,精確欄位/必填/順序仍 🎥 待核。
  2. view 頁保留的 `Start work date`／`End work date`／`Quantity` 等為 🎥 WIP 示意,尚未實機核對;WIP 欄位正式清單待 Arjun 確認後回填。
- ✅ **列表頁欄位補記＋部分補回**(2026-08-04),新增 §1d:
  - 比對 dev 清單截圖後發現原系統 **17 欄**、原型只做了 **6 欄**,且此落差**從未被任何 spec 記錄**
    (本矩陣原本只涵蓋表單欄位,列表欄位不在防漂移範圍內)。§1d 現已補上完整 17 欄對照。
  - 補回 3 欄到三頁列表:**`Defect type`**、**`Assign to`**(未指派＝`Common Queue`,
    按 Assign to self 會即時寫入)、**`Last updated`**;filter facet 與手機卡片同步補齊。
  - 修掉「Newest first」排序沒有欄位支撐的問題(改依 `Last Updated On`)。
  - 移除列尾裝飾用的 row-chevron 欄;`Action` 欄改為 sticky 釘右緣。
  - 仍未呈現:`CCS WO NO.`／`Instruction Date`／`Defect Reference No.`／`Last Updated By`／`WI Remarks`(5 欄,待確認)。
- ✅ **Advanced Filter 補記＋補齊**(2026-08-04),新增 §1e:
  - 線上 11 種 filter type、原型只有 7 種,同樣**沒有任何 spec 記過原本有哪些** —— §1e 補上完整對照。
  - 補齊 `Sub-Sector`／`Department`／`Element Type`／`Instruction Date`／`Estimated Completion Date`;
    `Status` 正名為 **`Work Status`**;兩組日期改成區間 ＋ 快捷 pill。
  - 抽屜升級成撐得住真實值域:facet 內搜尋、Show all (N)、已選置頂、父子連動(Sub-Sector ← Sector、Element Type ← Asset Type)。
  - **facet 順序改為對齊表格欄位由左至右**;`Department`／`Instruction date` 無對應欄位,置於分隔線之下。
  - **排序移出抽屜、改由表頭控制**(桌機);手機無表頭,抽屜保留 Sort by pill 作為唯一入口,兩邊共用同一組排序鍵。
  - 工具列 Search 原本是死的,已打通並與 filter 疊加。
  - demo 資料由 10 筆擴到 **24 筆**(14 個 sector、24 條路、4 個 department、5 種狀態),分頁改成真的會換頁。
  - ⚠️ 所有新值域皆為 **placeholder**,待 Arjun 提供正式字典檔後整批換掉。

## 待確認(問 Arjun/Salini)
- **列表頁未呈現的 5 欄**(`CCS WO NO.`／`Instruction Date`／`Defect Reference No.`／`Last Updated By`／`WI Remarks`):是否需要出現在清單、或放進 filter／詳情頁即可?見 §1d。
- ⭐ **filter 各欄位的正式值域字典檔**(Sector / Sub-Sector / Department / Asset Type / Element Type / Defect Type / Road Name):目前全是 placeholder,見 §1e。
- Step 2/3/4 與 WIP Task 16 欄的**精確欄位、必填、順序**(目前 🎥 錄影推得)。
- Asset / Task 的**多重數量上限**(Arjun 說 3×3)。
- 各角色對每一步、每個欄位的**可見 / 可編輯**精確權限。
- Element Type / Defect Type 等下拉的**正式值域與友善名**。
