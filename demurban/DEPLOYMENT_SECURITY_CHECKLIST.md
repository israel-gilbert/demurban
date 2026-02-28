# Pre-Deployment Security Checklist

## Before Pushing to Repository

### Git Configuration
- [ ] `.gitignore` includes all security audit files
- [ ] Run `git ls-files | grep -i security` - verify only safe docs tracked
- [ ] No `.env*` files in staging
- [ ] No API keys or secrets in any file

### File Verification
```bash
# Verify these files are TRACKED (safe to commit)
git ls-files | grep -E "(SECURITY\.md|MOTION_|IMPLEMENTATION_GUIDE)"

# Verify these files are IGNORED (gitignored)
ls -la | grep -E "SECURITY_AUDIT|VULNERABILITY|COMPLETION"
```

### Repository Settings (GitHub)
- [ ] Set repository to PRIVATE if you want to share detailed audits
- [ ] Enable branch protection rules
- [ ] Require code review before merge
- [ ] Enable secret scanning
- [ ] Add `CODEOWNERS` file for security review

### CI/CD Pipeline
- [ ] Add `npm audit` check to pre-commit hooks
- [ ] Enable dependency vulnerability scanning
- [ ] Scan for secrets with `git-secrets` or Truffles Hog

---

## Public vs Private Documentation

### Safe to Commit to Public Repo
✅ `SECURITY.md` - General security policy
✅ `SECURITY_QUICKSTART.md` - Developer setup
✅ `SECURITY_CHECKLIST.md` - Testing procedures
✅ `MOTION_*` - Animation implementation docs

### NEVER Commit to Public Repo
❌ `SECURITY_AUDIT.md` - Detailed vulnerabilities
❌ `VULNERABILITY_REPORT.md` - Technical findings
❌ `SECURITY_IMPLEMENTATION.md` - Exact code fixes
❌ `COMPLETION_REPORT.md` - Audit summary
❌ `.security/` folder contents

---

## Git Commands

### Check What Will Be Committed
```bash
git status
git diff --cached
```

### Remove Files from Staging (if accidentally added)
```bash
git rm --cached SECURITY_AUDIT.md
git rm --cached VULNERABILITY_REPORT.md
git rm --cached COMPLETION_REPORT.md
```

### Verify .gitignore is Working
```bash
git check-ignore -v SECURITY_AUDIT.md
# Should output: .gitignore:XX:SECURITY_AUDIT.md
```

---

## After First Commit

### Verify Repository Clean
```bash
# Only safe files should appear
git ls-files | grep -i security
# Output should ONLY show:
# - SECURITY.md
# - SECURITY_QUICKSTART.md
# - SECURITY_CHECKLIST.md
```

### Setup Local Security Docs
```bash
# Create local-only security folder
mkdir -p .security/
# Copy internal docs there (gitignored)
cp SECURITY_AUDIT.md .security/
cp VULNERABILITY_REPORT.md .security/
# etc...
```

---

## For Team Distribution

### Recommended: Use Notion/Confluence
1. Create private workspace
2. Copy security audit findings (without code locations)
3. Share link only with core team
4. Mark as "INTERNAL - DO NOT SHARE"

### Alternative: Encrypted File Sharing
1. Use Tresorit, Sync.com, or similar
2. Password-protect documents
3. Track who downloads
4. Set expiration dates

### NOT Recommended
❌ Email attachments (can be forwarded)
❌ Slack messages (searchable, retained)
❌ Unencrypted cloud storage
❌ Public repositories

---

## If You Accidentally Committed Sensitive Docs

1. **Immediate**: Don't push to GitHub
2. **Remove**: `git rm --cached [filename]`
3. **Commit**: `git commit -m "Remove sensitive files from tracking"`
4. **Update .gitignore**: Add the files
5. **Force push** (only if not yet on GitHub): `git push --force-with-lease`

---

## Questions?

If unsure whether a document is safe to commit, contact: security@demurban.com

Last Updated: March 1, 2026
