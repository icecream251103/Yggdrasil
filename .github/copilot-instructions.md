Luôn phản hồi bằng tiếng Việt.
Mục đích
- Đây là hướng dẫn repo-level cho GitHub Copilot/Copilot Chat khi làm việc trong dự án Yggdrasil.
- Tập trung tạo ra code có thể chạy ngay cho MVP WebAR + ESG scoring + on-chain chứng thực testnet.

Ngữ cảnh & Phạm vi
- Mục tiêu MVP: Scan QR -> hiển thị mô hình 3D + hotspots lifecycle -> GreenScore/Carbon -> claims/evidence -> (testnet) NFT GreenCert + thưởng GreenLeaf.
- Kiến trúc: monorepo gồm apps/web (Next.js 14, TS, Tailwind, model-viewer, jsQR), services/api (FastAPI, Pydantic v2), contracts (Hardhat + OpenZeppelin, Solidity 0.8.24), data/, schemas/, .github/.

Chuẩn code & cấu trúc
- TypeScript strict, React 18, Next.js App Router. Ưu tiên server components khi phù hợp.
- CSS: Tailwind; thiết kế tối (dark) mặc định.
- WebAR: @google/model-viewer, hotspots slot="hotspot" với data-position từ lifecycle_stages.hotspot_position [x,y,z].
- QR: jsQR từ canvas frame; camera facingMode=environment.
- API:
  - Next.js route demo: /pages/api/products/by-qr/[code].ts dùng sample data khi chưa có backend.
  - FastAPI endpoints (sau): 
    - GET /products/by-qr/{code}
    - POST /score/recompute/{product_id}
    - POST /scan-events
    - POST /blockchain/mint-cert
    - POST /blockchain/reward
- Dữ liệu & Schema:
  - data/sample-product.json phù hợp schemas/product.schema.json.
  - Thêm trường scoring_version: "v1.0" trong response khi có.
- Blockchain:
  - contracts/GreenCertNFT.sol (ERC721URIStorage + AccessControl), MINTER_ROLE.
  - contracts/GreenLeafToken.sol (ERC20 + AccessControl, MINTER_ROLE).
  - scripts/deploy.ts xuất deployments.json.
  - testnet: ưu tiên Base Sepolia hoặc Polygon Amoy; yêu cầu biến môi trường RPC_URL, PRIVATE_KEY.
- Bảo mật:
  - Không bao giờ leak PRIVATE_KEY.
  - Tất cả hành vi mint/reward chỉ qua backend signer (role hạn chế).
  - Thêm rate limiting (sau) và input validation.
- Tuân thủ & minh bạch:
  - Hiển thị rõ nguồn evidence_url, verifier, verified.
  - Có disclaimer: đây là ước tính (v1.0), không thay thế kiểm toán độc lập.

Quy tắc phản hồi của Copilot Chat
- Khi sinh code, luôn dùng “file block” với name=đường_dẫn_tệp. Markdown file dùng 4 dấu backticks.
- Nếu update file, in toàn bộ nội dung file sau update.
- Gợi ý lệnh chạy ngắn (setup, dev, deploy).
- Đề xuất test thủ công nhanh (các bước validate UI/AR/QR).
- Khi mơ hồ, hỏi rõ 2–4 câu, sau đó chọn default an toàn và tiếp tục.

Phong cách
- Rõ ràng, tối giản phụ thuộc.
- Ưu tiên component/utility tái sử dụng.
- Thêm comment ở đoạn logic quan trọng (scoring, blockchain interaction).

Biến môi trường (chuẩn)
- FRONTEND: không chứa secrets. 
- BACKEND/API: 
  - RPC_URL=…
  - PRIVATE_KEY=… (chỉ trên server)
  - DATABASE_URL=… (sau)
- Hướng dẫn cấu hình .env.example khi thêm biến mới.

Commit, PR, Issues
- Conventional Commits: feat:, fix:, chore:, refactor:, docs:, test:, perf:, ci:
- Mỗi PR: mô tả tóm tắt, ảnh/chụp màn hình nếu có, “How to test”.
- Tạo issues theo tính năng/bug; link đến file/scope; gắn milestone MVP.

Kiểm thử nhanh (QA checklist)
- /scan: camera hoạt động -> QR detect -> fetch product -> render model-viewer + hotspots click -> hiển thị GreenScore/Carbon.
- /api score recompute: trả numeric hợp lệ, có scoring_version.
- Không lỗi console nghiêm trọng; không network call bị 4xx/5xx trừ các case 404 expected.
- contracts compile + deploy testnet ok; deployments.json sinh đúng.

Macro gợi ý (dành cho Copilot Chat)
- “gen:web:scan” -> tạo/hoàn thiện trang /scan với jsQR, fetch product, model-viewer hotspots.
- “gen:api:score” -> tạo endpoint FastAPI recompute score (rule-based, v1.0).
- “gen:contracts” -> tạo ERC-721 GreenCertNFT + ERC-20 GreenLeafToken + scripts/deploy.
- “gen:landing” -> tạo landing nêu 3 trụ cột + CTA.
- “wire:blockchain” -> tạo backend stub endpoints gọi ethers signer (chỉ testnet).

Không làm
- Không tích hợp chain mainnet trong MVP.
- Không tạo claims giả mạo; nếu thiếu evidence thì hiển thị Pending.
- Không đưa private key vào client, logs, hay repository.

Khi nghi ngờ, ưu tiên trải nghiệm demo ổn định và minh bạch dữ liệu.