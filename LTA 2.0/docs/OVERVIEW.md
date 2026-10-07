# Overview — 資訊架構與資料說明

## 頁首摘要

Service availability、Account access、Licence capacity 三張卡片快速顯示異常與容量，點擊可前往對應區塊。它們是下方資訊的摘要，不是額外一組資料來源。

## System monitoring

七項服務依舊站分類呈現兩張卡片：

| 分類 | 項目 | 讀法 |
|---|---|---|
| Live Health Checks | ODC Singapore、Singpass、IGNITE | 服務健康狀態。ODC 可展開四個子服務。 |
| Audit Trail | WOG AD、VEBITS、RMWP to PLANET、File Scan | 最近交易／掃描結果；不等同即時可用性。VEBITS 可展開個別交易。 |

狀態文字沿用舊站用語，包括 Operational、Last Transaction Successful、Non-Operational、No Threat Found。服務說明以問號彈窗呈現；WOG 的不足紀錄提示與 PLANET 說明保留。

此 HTML 使用靜態快照，重新載入頁面不會呼叫真實健康檢查 API。說明中提及的正式系統檢查行為是舊站功能描述。時間、服務狀態與數字不可當作目前正式環境結果。

## Licences & accounts

- Licence availability：Internal／External 已用與總容量；面板標記 OutSystems Subscription API 是預期來源，demo 本身沒有串 API。
- Account distribution：Active、Suspended、Locked、Offboarded、Pending enrolment 的數量與顏色分布。
- Licence allocation by division：各 division 容量及帳號狀態。進度條包含 Locked，文字與數字沿用分布圖的語意色。
- Division、Role、User type 篩選會更新相關帳號與 allocation 顯示；Role 篩選不重新定義授權容量。角色分配包含示意資料，待正式資料校準。
- Allocation 在視窗至少 1440px 時一列三張，較窄畫面調整欄數。

## User login activity

按使用者最後登入日期分布呈現，不是登入事件總次數。此區篩選獨立於帳號分布；legend 僅說明顏色，沒有勾選功能。Daily view 是顯示粒度。預設日期範圍與日期區間含端點的計算仍待產品確認。

## 舊版來源

對照頁為 LTA dev 的 RMWP/Overview。保留服務分組、狀態名稱、可取得的問號說明與主要帳號／授權資料；新版將資訊改為摘要、分組卡片、比例條及日期圖表。細節來源信心與待確認項目見 [OPEN-QUESTIONS](OPEN-QUESTIONS.md)。
