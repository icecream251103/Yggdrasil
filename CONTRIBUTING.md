# Contributing to Yggdrasil

Cảm ơn bạn quan tâm đóng góp cho Yggdrasil! 🌳

## Code of Conduct

- Tôn trọng, hỗ trợ lẫn nhau
- Không spam, toxic, hoặc off-topic
- Xây dựng môi trường học tập tích cực

## How to Contribute

### Reporting Bugs

1. Check existing issues: https://github.com/yourusername/yggdrasil_ar/issues
2. Nếu chưa có, tạo issue mới với:
   - **Title**: Mô tả ngắn gọn bug
   - **Description**: Steps to reproduce, expected vs actual behavior
   - **Environment**: OS, browser, Node/Python version
   - **Screenshots**: Nếu có lỗi UI

### Suggesting Features

1. Mở issue với tag `enhancement`
2. Mô tả use case, expected behavior
3. Nếu có, đính kèm mockups/wireframes

### Submitting Code

#### 1. Fork & Clone

```powershell
# Fork trên GitHub, sau đó:
git clone https://github.com/yourusername/yggdrasil_ar.git
cd yggdrasil_ar
git remote add upstream https://github.com/original/yggdrasil_ar.git
```

#### 2. Create Branch

```powershell
git checkout -b feat/your-feature-name
# hoặc
git checkout -b fix/bug-description
```

#### 3. Make Changes

- Follow coding standards (xem dưới)
- Test locally
- Commit với convention:
  ```
  feat: Add hotspot animation
  fix: QR scanner camera permission issue
  refactor: Simplify scoring logic
  docs: Update README with new API endpoints
  ```

#### 4. Push & Pull Request

```powershell
git add .
git commit -m "feat: Your feature description"
git push origin feat/your-feature-name
```

Mở Pull Request trên GitHub:
- **Title**: Same as commit message
- **Description**: 
  - What changed
  - Why (link to issue if applicable)
  - How to test
  - Screenshots/videos (UI changes)

#### 5. Code Review

- Maintainers sẽ review trong 2-3 ngày
- Address feedback nếu có
- Merge sau khi approved

## Coding Standards

### TypeScript/JavaScript (Frontend)

- **Formatting**: Prettier default
- **Linting**: ESLint (Next.js config)
- **Types**: Strict mode, no `any` unless necessary
- **Components**: Functional components, hooks
- **Naming**: 
  - Components: `PascalCase`
  - Functions: `camelCase`
  - Files: `kebab-case.tsx` hoặc `PascalCase.tsx` cho components

### Python (Backend)

- **Formatting**: Black (default)
- **Linting**: Ruff hoặc Pylint
- **Types**: Pydantic models cho validation
- **Naming**: 
  - Functions: `snake_case`
  - Classes: `PascalCase`
  - Files: `snake_case.py`

### Solidity (Contracts)

- **Style**: OpenZeppelin guidelines
- **Naming**: 
  - Contracts: `PascalCase`
  - Functions: `camelCase`
  - Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Comments**: NatSpec format
- **Testing**: Hardhat tests required for new functions

## Testing

### Frontend

```powershell
cd apps\web
npm run type-check
npm run lint
npm run build  # should succeed
```

### Backend

```powershell
cd services\api
.\venv\Scripts\Activate.ps1
python -m pytest  # nếu có tests
python -m py_compile main.py  # syntax check
```

### Contracts

```powershell
cd contracts
npm run compile
npm test  # nếu có tests
```

## Documentation

Khi thêm tính năng mới:
- Update README.md trong folder tương ứng
- Thêm JSDoc/docstring cho functions
- Nếu API endpoint mới, update API docs section
- Nếu env var mới, update `.env.example`

## Project Structure Rules

- **Don't**: Mix frontend/backend code
- **Do**: Keep separation of concerns
- **Don't**: Hardcode secrets, API keys
- **Do**: Use environment variables
- **Don't**: Commit large binary files
- **Do**: Use Git LFS nếu cần (models, images)

## First-Time Contributors

Good first issues:
- UI improvements (CSS, animations)
- Documentation fixes
- Sample data additions
- Test coverage
- Error handling improvements

Tag: `good first issue` trên GitHub Issues.

## Questions?

- Open a Discussion: https://github.com/yourusername/yggdrasil_ar/discussions
- Discord/Slack: (nếu có community)
- Email: your-email@example.com

---

**Thank you for helping make Yggdrasil better!** 🌱
