# Security Policy

## Overview

DEM Urban takes security very seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Measures

Our ecommerce platform implements industry-standard security practices:

### Payment Security
- **PCI-DSS Alignment**: No credit card data is stored or processed on our servers
- **Payment Gateway**: Secured via [Paystack](https://paystack.com) with webhook signature verification
- **Server-Side Validation**: All payment amounts and transactions are verified server-side
- **HTTPS Only**: All payment communications are encrypted

### API Security
- **Rate Limiting**: Endpoints are protected with IP-based rate limiting
- **Input Validation**: All inputs are validated with Zod schemas
- **Authentication**: Session-based auth with secure HTTP-only cookies
- **CORS**: Properly configured Cross-Origin Resource Sharing

### Data Protection
- **Database**: PostgreSQL with encryption at rest
- **Environment Variables**: Sensitive keys never committed to git
- **Logging**: Security events logged without exposing PII
- **HTTPS**: All traffic encrypted in transit

### Infrastructure
- **Managed Hosting**: Deployed on Vercel with automatic security updates
- **Content Security Policy**: CSP headers prevent XSS attacks
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options enforced

## Vulnerability Reporting

If you discover a security vulnerability, please email **security@demurban.com** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your name and contact info (optional)

**Do not** create a public GitHub issue for security vulnerabilities.

## Security Best Practices for Developers

### Environment Variables
Always set these in your deployment environment:
- `PAYSTACK_SECRET_KEY` - Paystack API secret
- `DATABASE_URL` - Database connection string
- `APP_URL` - Application URL for redirects

### Git Practices
- Never commit `.env` files
- Never commit API keys or secrets
- Use `git-secrets` to prevent accidental commits

### Code Review
- Security issues are reviewed before merge
- Dependencies are audited for vulnerabilities
- OWASP Top 10 principles followed

## Compliance

We comply with:
- **OWASP Top 10 (2023)** - Web application security standards
- **GDPR** - EU data protection regulation
- **Nigeria Data Protection Regulation (NDPR)** - Local privacy laws
- **PCI-DSS** - Payment card industry standards

## Dependency Security

Dependencies are regularly audited:
```bash
npm audit
npx snyk test
```

Run these locally before committing code.

## Support

For security-related questions:
- Email: **security@demurban.com**
- Do NOT use public GitHub issues

## Updates

This policy is updated regularly. Last updated: March 1, 2026
