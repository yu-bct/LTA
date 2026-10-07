# LTA 2.0 — 視覺與維護原則

本文件描述本次保留的五頁；不再列出未採用的配色與版型比較。

## 目前樣式

所有五頁以 Overview 為視覺基準，使用 teal 主色、白色側欄與頁首、淺灰內容底色、14px panel 圓角與一致的桌機 32px／手機 16px 側邊距。WI 的列表與表單保留各自必要的導覽和工作流結構。

`lta-theme.css` 是五頁共用的樣式入口，涵蓋品牌色、側欄、帳號選單、列表、表單、步驟導覽和操作列。後續共用樣式優先修改此檔，避免頁面再次分岔。各 HTML 仍保留原本的元件樣式與互動腳本；Overview 使用 Tailwind browser CDN。

`navigation.js` 負責 WI 跨頁角色連結。WI 頁面依功能命名，不再使用版型後綴。

## Overview

- 摘要 grid padding 為 16px 32px；sticky nav 為 12px 32px。
- Monitoring 外卡與其他 panel 一致；內層服務以 border 區隔，標題下不加分隔線。
- 狀態 tag 不斷行，line-height 為 1.5。服務說明 icon 靠右。
- ODC 與 VEBITS 展開內容使用一致狀態圓點。
- Account access 進度條 8px，Account distribution 16px。
- 帳號文字、數字與 allocation 進度條維持同一組狀態顏色。
- 面板右上角來源與粒度用一般說明文字，不使用灰底標籤。
- 不在產品畫面放入測試網站解釋；資料限制寫入文件。

## 修改界線

WI 欄位與必填以 [欄位矩陣](SPEC_field-matrix.md) 為依據。不要因精簡版面而自行刪除欄位、改變必填或假定角色權限。原規格的截圖確認、錄影推得及待確認標記需保留。

介面維持英式英文（Licence、Colour 等）；交接文件使用中文。資訊不可只用顏色區分，仍需狀態文字或數字。新版相關文件與程式都維護在 LTA 2.0 內。

## WI 上下排列

Create、Draft 與 Workflow 參考上層 mwi-wi-create.html 的上下結構：頁首 → 橫向流程步驟 → 分區快捷導覽 → 全寬表單卡片。不再使用左側 workflow rail；原有步驟切換與表單資料保留，配色仍依 Overview。

表單已直接採用原始 Create／Draft／Workflow 的上下排列實作，包含原生輸入元件、卡片標題列與分階段固定操作列，再套用 LTA 2.0 共用側欄與配色。

WI 側欄與 Overview 使用相同的單層選單、teal 選取底色、中性 icon、帳號膠囊與摺疊箭頭。上下表單維持原結構及固定操作列；卡片無陰影、標題無分隔線，按鈕與分區導覽採圓角膠囊，欄位沿用 Overview 的 10px 圓角。
