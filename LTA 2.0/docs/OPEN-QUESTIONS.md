# LTA 2.0 — 待確認事項

整理日期：2026-10-07。僅保留會影響目前 Overview／WI 的問題；上層舊文件的工具路徑、已修技術備忘與舊交接安排不作為本版操作指引。

## Overview

- PLANET 原說明中的交易時間門檻 `[X]` 尚未有實際值，需要服務負責人確認。
- 健康檢查、交易稽核與 File Scan 各自的更新頻率、異常判定及 API 欄位需由後端確認。
- 帳號 Role／Division 的正式對應與授權容量計算需校準；目前角色切分含示意資料。
- Login 日期區間是否包含兩端，以及「最近 7 日」與目前範例日期筆數的定義需一致。

## Work Instruction

- asset／task 實際上限：調查資料有 1 asset × 0–2 task，需求訪談描述 3 asset × 3 task；不可把後者當硬性系統上限。
- CO、SS、Engineer、QS、DRC 各 stage 的欄位編輯與 Submit／Return／Reassign 權限，需對應角色帳號核對。
- Create／Draft／workflow 現有角色切換以視覺展示為主；完整權限聯動屬後續工作。
- 原列表 17 欄與新版取捨需確認；完整欄位與篩選對照保留於 [欄位矩陣](SPEC_field-matrix.md)。
- Sector／Sub-sector、Asset／Element、Defect、Road、Department 正式值域與連動關係需提供。
- 超長 Funding Source 與部門、asset 代碼的友善名稱需核准。
- OutSystems 實作需確認分區導覽、彈出式下拉／日曆與角色工作流的限制。

規格參考中既有「待核」與欄位差異仍有效。本次檔案整理未把它們標記為已解決。
