# LTA 2.0 — 頁面與導覽

整理日期：2026-10-07。這份文件取代上層混合多個試版的頁面清單。

| 頁面 | 功能與入口 |
|---|---|
| [Overview](../index.html) | 平台狀態摘要、System monitoring、Licences & accounts、User login activity；側欄進 WI。 |
| [Maintenance WI](../mwi-list.html) | 狀態分頁、搜尋、篩選、排序、桌機表格／手機卡片；Create WI 開啟建立頁，Draft 開草稿頁，其餘開工作流詳情。 |
| [Create WI](../mwi-create.html) | 新增 WI 的表單展示，保留既有基本資料、asset/task 與 Fund 區塊。 |
| [Draft WI](../mwi-draft.html) | 草稿資料與編輯展示。 |
| [WI workflow](../mwi-workflow.html) | 工作流詳情、分區導覽、檢視／編輯展示。 |

`index.html` 直接呈現 Overview，支援原有 query 與 hash。所有五頁只使用資料夾內頁面；本機圖片只有 `logo_color.png`。Overview 另載入 Tailwind browser v4 CDN。

## 角色

Overview 支援 `?role=sa|co|ss|eng`；WI 支援 `?role=co|ss|eng`，預設 CO。共用 navigation.js 讓 WI 角色在返回 Overview、列表及詳情時保留，保留既有角色切換顯示。SA 進 WI 會使用 CO demo，不表示取得正式 CO 權限。

列表已有角色相關顯示；Create／Draft／workflow 的角色選單主要是視覺展示。歷史角色規格記錄的是預期工作流，不能据此宣稱這四頁已完成所有角色權限。

## 維護時檢查

1. Overview → WI → Overview 可以互相前往。
2. WI 建立、Draft、一般列與返回列表連結正確。
3. CO／SS／Engineer 參數跨頁保留，角色選單可開關。
4. Overview 的監控展開、服務問號、帳號篩選與登入篩選仍可操作。
5. 不重新加入舊版本選單，不引用上層檔案。

表單、送出及資料保存延續原型行為，未串接正式系統。
