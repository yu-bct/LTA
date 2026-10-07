> LTA 2.0 規格參考，整理於 2026-10-07。以下保留原始調查與信心標記；歷史頁名及「已實作」紀錄不代表本次五頁已逐項驗收。新版入口與實際範圍以 [頁面說明](SPEC_pages.md) 為準。

# SPEC — WI 資料模型與盤點

實機逐支檢視 dev 環境全部 41 支 Maintenance WI（5 頁全查完），view-only sysadmin 帳號。此文件記錄真實資料形態，供設計判斷與 developer 對照。

---

## ⚠️ 最重要：dev 測試資料 vs Arjun 描述的真實情境（設計以 Arjun 為準）

- **dev 41 支盤點**：每支都只有 **1 個 asset、0～2 個 task**。
- **會議上 Arjun 明確說**：實務上一個 WI 有 **3 個 asset、每個 asset 3 個 task**（＝最多 **9 個 task**），而「一直往下滑」正是**整個系統最大的痛點**、是他要我們解決的核心。
- **兩者不矛盾**：dev 是隨手建的稀疏測試資料；Arjun 講的是正式上線的真實使用量。**設計以 Arjun 為準**，不能照 dev 資料把規模縮小。

→ **mockup 定案**：同一套設計要能吃下整個範圍 ——
**0 task（empty state）／1 task（乾淨）／2 task（清單，M-29/M-30 已證實）／3 asset × 3 task = 9 task（Arjun 最壞情境）**。
少時不空洞、多時不迷路 —— 這正是 Go-to 跳轉、asset/task 摺疊、狀態標示存在的理由。

---

## 全 41 支 asset:task 統計（dev 現況）
| Asset : Task | 支數 | WI |
|---|---|---|
| 1 asset : 1 task | 37 | 絕大多數 |
| 1 asset : **0 task** | 2 | RRFM-M-24、RRFM-M-1 |
| 1 asset : **2 task** | 2 | **RRFM-M-29、RRFM-M-30**（證實一 asset 可掛多 task） |

系統本身**支援多 asset**（有「Add another asset」），dev 現況雖全單 asset，但不可據此認定「只會有一個 asset」。

## 第 1 頁 10 支細節（含資料完整度）
| WI | 狀態 | Asset 類型 | Asset Tag | Task | Element·Defect | 完整度 |
|---|---|---|---|---|---|---|
| RRFM-M-17 | Draft | BOLLARD | REX-BRR-BOLL-07896 | 1 | BOLLARD·HOLE | 精簡 |
| RRFM-M-7 | Draft | BOLLARD | REX-BRR-BOLL-14468 | 1 | BOLLARD·HOLE | 精簡 |
| RRFM-M-13 | Draft | TRAFFIC SIGN | REX-SNG-TRSG-N0009 | 1 | SIGNAGE·OTHER FADED… | **選 OTHER→多 Others* 欄** |
| RRFM-M-12 | Draft | RAILING | REX-BRR-RAIL-33285 | 1 | RAILING·DAMAGED | 精簡 |
| RRFM-M-24 | Draft | CARRIAGEWAY | REX-RDS-CARR-18297 | **0** | — | 有 asset 無 task |
| RRFM-M-27 | Draft | CARRIAGEWAY | REX-RDS-CARR-18297 | 1 | FLEXIBLE PAVEMENT·DEPRESSION | 精簡 |
| RRFM-M-8 | WIP | BOLLARD | REX-BRR-BOLL-07896 | 1 | BOLLARD·HOLE | **全滿**（進度 88%） |
| RRFM-M-14 | WIP | BOLLARD | 空 | 1 | BOLLARD·HOLE | WIP 但半空 |
| PATH-M-4 | WIP | 空 | REX-SNG-FTP-F2026 | 1 | 空·空 | 幾乎全空 |
| PATH-M-1 | WIP | 空 | REX-SNG-FTP-F2026 | 1 | 空·空 | 幾乎全空 |

## 第 2–5 頁盤點
- 第2頁：CFM-M-3、BDG-M-3、RRFM-M-11、BDG-M-1、CFM-M-4、CFM-M-2、**RRFM-M-1(1:0)**、BDG-M-2、RRFM-M-20、RRFM-M-22 —— 除 M-1 外皆 1:1。
- 第3頁：CFM-M-1、RRFM-M-23、PATH-M-2、BDG-M-4、RRFM-M-28、RRFM-M-15、RRFM-M-16、RRFM-M-34、PATH-M-3、RRFM-M-4 —— 全 1:1。
- 第4頁：M-5、M-19、M-21、M-9、**M-30(1:2)**、**M-29(1:2)**、M-10、M-31、M-32、M-26。
- 第5頁：RRFM-M-2(1:1)。
- **M-30 實測結構**：Asset 1（CARRIAGEWAY）→ Task 1 ＋ Task 2（都 FLEXIBLE PAVEMENT·DEPRESSION、Cause=AGEING、Action=PATCH (CONVENTIONAL)）。
- 合約/部門代碼：**TR388、TR3889**；部門 **RRFM / CFM / BDG / PATH**。

---

## 對設計最關鍵的發現
1. **規模範圍：1 asset × 0–2 task（dev）～ 3 asset × 3 task（Arjun 真實）** → 設計必須在整個範圍成立。
2. **0-task 的 WI 存在** → 需「尚無 task」empty state。
3. **多-task／多-asset** → 保留 asset/task 清單與跳轉導覽（Arjun 痛點核心）。
4. **Draft vs WIP 欄位密度差很大**：Draft task ~4 欄；WIP task ~16 欄 → 依狀態漸進揭露。
5. **同狀態完整度天差地遠**：M-8 全滿 vs M-14／PATH 幾乎全空 → **View 必須優雅呈現空值**，不能像現況把空欄顯示成可點的「Select…」下拉、「Select date」佔位（最強 before 證據）。
6. **條件式欄位**：Defect 選「OTHER…」多出「Others*」自由輸入欄。
7. **欄位各自稀疏**：asset type 空但 tag 有值 / tag 空但 type 有值都出現。
8. **Asset type ≠ Element type**（CARRIAGEWAY→FLEXIBLE PAVEMENT、TRAFFIC SIGN→SIGNAGE）。
9. **明顯測試資料**：tag 跨 WI 重複、垃圾值（vhjjkhjkhnjk、fdgfhfgh）、bollard hole 卻標 Cause=RETROREFLECTIVE MICROPRISMATIC → **照型態/狀態設計，不照特定值**。

---

## 觀察到的值域（供友善顯示名對照，正式名待 LTA 確認）
- **Asset type**：BOLLARD、TRAFFIC SIGN、RAILING、CARRIAGEWAY、FOOTPATH、CONVEX MIRROR、CYCLEPATH
- **Element type**：BOLLARD、SIGNAGE、RAILING、FLEXIBLE PAVEMENT、PAVEMENT SURFACE、CYCLE LANE SURFACE
- **Defect type**：HOLE、DAMAGED、DEPRESSION、CRACKED SURFACE、NO STOPPING SIGN、OTHER FADED TRAFFIC SIGNAGE
- **Defect cause**：RETROREFLECTIVE MICROPRISMATIC、AGEING；**Action**：REPAIR、PATCH (CONVENTIONAL)；**Unit**：M
- **Work type**：SIMPLIFIED ITEM、WORKS ORDER - ACCIDENT、OUTCOME BASED DEFECT、PLANNED WORKS、WORKS ORDER - ADHOC
- **合約**：TR388、TR3889；**部門**：RRFM、CFM、BDG、PATH
- **Road**（例）：Adis Road、EBER ROAD
- **Funding Source**：`EXT.ETRO.ASM(RD).E-TR388.000.3MINDE7115.TR388`（極長代碼，友善顯示是痛點）

## 待辦
- 請 Arjun/Salini 確認：asset:task 一對多上限（Arjun 說 3×3；dev 實測最多 1×2）；多 asset 實際上限。
- 縮寫與代碼正式友善名稱清單（RRFM/CFM/BDG、REX-… 等）需 LTA 提供。
